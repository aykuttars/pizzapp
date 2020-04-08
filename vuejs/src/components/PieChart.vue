<script>
import { Pie, mixins } from "vue-chartjs";

export default {
  extends: Pie,
  props: ["counts"],
  mixins: [mixins.reactiveData],
  data() {
    return {
      data: {
        labels: ["Correct", "Not Correct"],
        datasets: [
          {
            backgroundColor: ["#ffbd24", "#886db3"],
            data: [0,0]
          }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false }
    };
  },
  watch: {
    counts: function(newData) {
      const {correctCount, falseCount } = newData;
      this.data.datasets[0].data[0] = correctCount;
      this.data.datasets[0].data[1] = falseCount;
      this.renderChart(this.data, this.options);
    }
  },
  mounted() {
    this.renderChart(this.data, this.options);
  }
};
</script>
