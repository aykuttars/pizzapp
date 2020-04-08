<template>
  <v-container fluid>
    <div v-if="resultExists">
      <v-row>
        <v-col cols="12" md="8">
          <v-select
            v-model="pizzaLocation"
            :items="pizzaLocations"
            label="Category"
          ></v-select>
        </v-col>
        <v-col cols="12" md="4">
          <v-expansion-panels popout>
            <v-expansion-panel>
              <v-expansion-panel-header>Export</v-expansion-panel-header>
              <v-expansion-panel-content>
                <DownloadResults :taskResult="taskResult" />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <LineChart :currentData="currentData" />
      <PieChart :counts="counts" />
    </div>
    <div v-else>
        <NoResult />
    </div>
  </v-container>
</template>

<script>
import LineChart from "@/components/LineChart.vue";
import PieChart from "@/components/PieChart.vue";
import DownloadResults from "@/components/DownloadResults";
import NoResult from "@/components/NoResult";
import { findMatches } from "@/misc/helpers";
import { mapGetters } from "vuex";
export default {
  name: "TaskResult",
  data: () => ({
    pizzaLocation: "",
    resultExists: true,
  }),
  components: {
    LineChart,
    PieChart,
    DownloadResults,
    NoResult,
  },
  created() {
    if (Object.keys(this.taskResult).length === 0) {
      this.resultExists = false;
    }
  },
  computed: {
    ...mapGetters("tasks", ["getTaskById"]),
    taskId() {
      return this.$route.params.id;
    },
    taskData() {
      const task = this.getTaskById(this.taskId);
      if (!task) return {};
      return task;
    },
    pizzaLocations() {
      return Object.keys(this.taskResult);
    },
    currentPizzaLocation: {
      get: function() {
        return this.pizzaLocations[0];
      },
      set: function(newValue) {
        this.pizzaLocation = newValue;
      }
    },
    taskResult() {
      const task = this.taskData;
      if (!task.result) return {};
      return JSON.parse(task.result);
    },
    currentData() {
      if (!this.pizzaLocation) return;
      const results = this.taskResult[this.pizzaLocation];
      return results;
    },
    counts() {
      if (!this.currentData) return { correctCount: 0, falseCount: 0 };
      const totalData = this.currentData.actual.length;
      const matches = findMatches(
        this.currentData.actual,
        this.currentData.predicted
      );
      return {
        correctCount: matches.length,
        falseCount: totalData - matches.length
      };
    }
  }
};
</script>
