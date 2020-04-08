<template>
  <div>
    <download-excel
      class="v-btn__content"
      worksheet="PizzaResults"
      name="pizza_sales_predict.xlsx"
      :fields="jsonFields"
      :data="jsonData"
    >
    <v-btn
        text
       >
      <v-icon>mdi-file-excel-outline</v-icon>
      Export to Excel
    </v-btn>
    </download-excel>
    <download-excel
      class="v-btn__content"
      type="csv"
      name="pizza_sales_predict.csv"
      :fields="jsonFields"
      :data="jsonData"
    >
    <v-btn
        text
       >
      <v-icon>mdi-file-document</v-icon>
      Export to CSV
    </v-btn>
    </download-excel>
  </div>
</template>

<script>
import moment from "moment"
export default {
  name: "DownloadResults",
  props: ["taskResult"],
  data() {
      return {
          jsonFields: {
            'CATEGORY': 'category',
            'YEAR': 'year',
            'ACTUAL': 'sales_actual',
            'PREDICTED': 'sales_predicted',
        },
      }

  },
  computed: {
      jsonData() {
          if(!this.taskResult) return [];
          let newData = [];
          Object.keys(this.taskResult).forEach(category => {
              let data = this.taskResult[category]
              data.index.forEach((index, k) => {
                  newData.push({
                      category,
                      sales_actual: data.actual.length > k ? data.actual[k] : null,
                      sales_predicted: data.predicted[k],
                      year: moment(index).format('DD-MM-YYYY'),
                  })
              })

          })
          return newData;
      }

  }
};
</script>
