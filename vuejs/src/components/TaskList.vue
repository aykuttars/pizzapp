<template>
  <v-data-table
    :headers="headers"
    :items="tasks"
    sort-by="created"
    :sort-desc="true"
    class="elevation-1"
  >
    <template v-slot:item.started="{ item }">
      {{ getDate(item.started) }}
    </template>
    <template v-slot:item.finished="{ item }">
      {{ getDate(item.finished) }}
    </template>
    <template v-slot:item.status="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <span v-on="on">{{ item.status }}</span>
        </template>
        <span>{{ item.failure_reason }}</span>
      </v-tooltip>
    </template>

    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Task List</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="#00B887"  dark class="mb-2 text--white" v-on="on"
              >New Task
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline"> Create Task </span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-text-field
                    color="#00B887"
                    label="Name"
                    :value="taskName"
                    @input="setTaskName"
                  ></v-text-field>
                </v-row>
                <v-row>
                  <v-file-input
                    color="#00B887"
                    accept="application/vnd.ms-excel"
                    show-size
                    :value="taskFile"
                    @change="setTaskFile"
                    label="Data File"
                  ></v-file-input>
                </v-row>
                <v-row>
                  <v-text-field
                    color="#00B887"
                    :value="taskStep"
                    @input="setTaskStep"
                    label="Prediction Step"
                    type="number"
                  ></v-text-field>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="#00B887"
                text
                @click="close"
                :loading="taskCreationPending"
                >Cancel</v-btn
              >
              <v-btn
                color="#00B887"
                text
                @click="save"
                :disabled="disableSave"
                :loading="taskCreationPending"
                >Save</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <div
        style="display: flex;
    justify-content: center;"
      >
        <v-btn
          depressed
          target="_blank"
          color="#00B887"
          class="ma-2 white--text"
          :disabled="item.status === 'continue'"
          :loading="item.status === 'continue'"
          @click="startTask(item)"
        >
          Start
        </v-btn>
        <v-btn
          depressed
          color="#00B887"
          class="ma-2"
          outlined
          :to="{ name: 'result', params: { id: item.id } }"
        >
          <span class="mr-2">Result</span>
        </v-btn>
      </div>
    </template>
    <template v-slot:no-data>
      <v-btn color="#00B887" @click="getTasks">Refetch</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import moment from "moment";
import { taskHelper } from "@/misc/task_helper";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "TaskList",
  data: () => ({
    dialog: false,
    pollingList: [],
    headers: [
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name"
      },
      { text: "Started", value: "started" },
      { text: "Finished", value: "finished" },
      { text: "Status", value: "status" },
      { text: "Actions", value: "action", sortable: false }
    ]
  }),

  computed: {
    ...mapState("authentication", ["user", "status"]),
    ...mapState("tasks", [
      "tasks",
      "taskName",
      "taskFile",
      "taskStep",
      "taskCreationPending"
    ]),
    disableSave: function() {
      return (
        this.taskName === "" || this.taskFile == null || this.taskStep === ""
      );
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    tasks: function(newData) {
      if (!newData) this.logout();
    }
  },

  created() {
    setTimeout(() => {
      this.getTasks();
    }, 500);
  },

  methods: {
    ...mapMutations("tasks", ["setTaskName", "setTaskFile", "setTaskStep"]),
    ...mapActions("tasks", ["getTasks", "triggerAddTaskAction", "updateTask"]),
    ...mapActions("authentication", ["logout"]),

    close() {
      this.dialog = false;
    },

    save() {
      this.triggerAddTaskAction();
      this.close();
    },

    getDate(taskDate) {
      if (!taskDate) return "NULL";
      return moment(taskDate).format("lll");
    },
    startTask(task) {
      taskHelper.startTask(task, this.user.token).then(
        taskData => {
          this.updateTask(taskData);
          if (taskData.status === "continue") {
            this.startPolling(taskData.id);
          }
        },
        error => {
          console.log("error while running task", error);
        }
      );
    },
    startPolling(taskId) {
      if (!taskId) return;
      const timerId = setInterval(() => {
        taskHelper.getTask(taskId, this.user.token).then(
          taskData => {
            if (
              taskData.status === "success" ||
              taskData.status === "failure"
            ) {
              // if the task finished or failed stop the polling and update the table
              this.updateTask(taskData);
              this.stop(taskId);
              return;
            }
          },
          error => {
            // stop polling on error
            console.log("error on polling", error);
            this.stop(taskId);
          }
        );
      }, 1500);
      this.pollingList.push({ taskId, timerId });
    },
    stop(taskId) {
      // stop polling for taskId
      this.$store.dispatch("alert/success", "Task done check result!");
      const itemIndex = this.pollingList.findIndex(
        poll => poll.taskId === taskId
      );
      const timerId = this.pollingList[itemIndex].timerId;
      clearInterval(timerId);
      this.pollingList = this.pollingList.filter(
        poll => poll.taskId !== taskId
      );
    }
  }
};
</script>
