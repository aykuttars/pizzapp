<template>
    <v-card
    class="mx-auto"
    max-width="444"
  >
    <v-card-text>
      <p class="display-1 text--#00B887">
        Error
      </p>
      <div>
        No result found for given task</div>
    </v-card-text>
    <v-card-actions>
      <v-btn
        text
        color="deep-purple accent-4"
        @click="taskPage"
      >
        Return the task list
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
    name: 'NoResult',
    methods: {
      taskPage() {
        this.$router.push('/')
      }
    }
}
</script>