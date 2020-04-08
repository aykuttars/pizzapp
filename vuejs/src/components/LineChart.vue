<script>
import { Line, mixins } from "vue-chartjs";
import moment from "moment";
export default {
  data() {
    return {
      data: {
        datasets: [
          {
            borderColor: "#ffbd24",
            borderWidth: 2,
            xValueType: "dateTime",
            label: "Actual Pizza Sales",
            fill: false,
            backgroundColor: "#8dd1e1",
            pointBackgroundColor: "#ffbd24",
            pointBorderColor: "#ffbd24",
            data: []
          },

          {
            borderColor: "#886db3",
            borderWidth: 2,
            xValueType: "dateTime",
            label: "Predicted Pizza Sales",
            fill: false,
            backgroundColor: "#8dd1e1",
            pointBackgroundColor: "#886db3",
            pointBorderColor: "#886db3",
            data: []
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: "Pizza Sales Task"
        },
        tooltips: {
          mode: "index",
          intersect: false
        },
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                displayFormats: {
                  quarter: "MMM YYYY"
                }
              },
              distribution: "series",
              offset: true,
              ticks: {
                major: {
                  enabled: true,
                  fontStyle: "bold"
                },
                source: "data",
                maxRotation: 0,
                autoSkip: true,
                autoSkipPadding: 75,
                sampleSize: 10
              }
            }
          ]
        }
      }
    };
  },
  props: ["currentData"],
  extends: Line,
  mixins: [mixins.reactiveData],
  watch: {
    currentData: function(newData) {

      const dates = newData.index.map(ind => {
        if (ind) {
          return moment(ind).format("YYYY-MM-DD");
        } else {
          return null;
        }
      });

      this.data.datasets[0].data = newData.actual;
      this.data.datasets[1].data = newData.predicted;
      this.data.labels = dates;
      // const s= newData.index.map(ind => moment(ind).format('YYYY-MM'))
      this.renderChart(this.data, this.options);
    }
  },
  mounted() {
    this.renderChart(this.data, this.options);
  }
};
</script>
