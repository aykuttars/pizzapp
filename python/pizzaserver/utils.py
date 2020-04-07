#import time
import json
import logging
import pandas as pd
import statsmodels.api as sm
from django.utils import timezone
#from rest_framework import serializers
from datetime import (datetime,
timedelta
)
from .serializers import UserSerializer
#from .models import Tasks

logger = logging.getLogger(__name__)

def my_jwt_response_handler(token, user=None, request=None):
    """
        Returns token with user data. Used by rest framework
    """
    user_dict = {
        'token': token,
    }
    user_dict.update(UserSerializer(user, context={'request': request}).data)
    return user_dict

def start_task_prediction_worker(task):
    """
        Fits a SARIMAX model to given data. Updates task object
        with results.

        Parameters:
        task (model): Task model object
    """
    # TODO check if the excel has the desired data
    try:
        filepath = task.data_filepath.path
        step = task.step

        task.started = datetime.now(tz=timezone.utc)

        df = pd.read_excel(filepath, index_col=0, parse_dates=True);
        columns = list(df.columns)
        desired_columns = ["YEAR", "CATEGORY", "SALES"]

        if len(columns) != 2:
            raise Exception('You must provide 3 columns(YEAR, CATEGORY, SALES)')

        if len(set(columns) - set(desired_columns)) > 0:
            raise Exception('You must provide 3 columns(YEAR, CATEGORY, SALES)')

        result = {}

        for category in df["CATEGORY"].unique():
            cat_df = df.loc[df["CATEGORY"] == category]
            ts = cat_df["SALES"]
            # TODO find a better model
            sarimax = sm.tsa.statespace.SARIMAX(ts, order=(1, 1, 1), seasonal_order=(1, 1, 0, 52),
                    enforce_stationarity=False, enforce_invertibility=False).fit(disp=False)

            # forecast
            fcast_step = sarimax.get_forecast(steps=step)
            fcast_data = fcast_step.predicted_mean
            # create date index for forecast data
            fcast_idx  = pd.date_range(max(ts.index) + timedelta(1), periods=len(fcast_data), freq='M')
            # create new series with date index
            fcast = pd.Series(fcast_data.values, index=fcast_idx)

            predicted_values = sarimax.predict(min(ts.index), max(ts.index))
            # append forecasted values
            predicted_values = predicted_values.append(fcast)

            # save results as json
            df_json = json.loads(ts.to_json(orient='split'))
            predicted_json = json.loads(predicted_values.to_json(orient='split'))

            result[category] = {
                'actual': df_json['data'],
                'predicted': predicted_json['data'],
                'index': predicted_json['index'],
            }

        task.finished = datetime.now(tz=timezone.utc)
        task.status = 'success'
        task.result = json.dumps(result)
        task.save()
    except Exception as e:
        logger.error("Error while running analysis %s", str(e))
        task.status = 'failure'
        task.failure_reason = str(e)
        task.save()

    return True

