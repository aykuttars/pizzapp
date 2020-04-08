#!/bin/bash

echo "Running migrations"
python manage.py migrate

echo "Loading initial data"
python manage.py loaddata user

echo "Starting pizza-app server"
python manage.py runserver 0.0.0.0:8000
