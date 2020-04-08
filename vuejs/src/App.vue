<template>
  <v-app>
    <v-app-bar app color="#00B887" dark>
      <div class="d-flex align-center">
        <v-toolbar-title class="headline text-uppercase">
          <v-btn text :to="{name: 'tasks'}">PizzaAPP</v-btn>
        </v-toolbar-title>
      </div>

      <v-spacer></v-spacer>

      <div class="text-center" v-if="user && user.token">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn color="#00B887" dark v-on="on">Account Settings</v-btn>
          </template>
          <v-list>
            <v-list-item key="account_settings">
              <v-btn :to="{name:'profile'}" text>
                <span class="mr-2">Settings</span>
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
            </v-list-item>
            <v-list-item @click="logout" key="logout" :v-if="user">
              <v-btn text>
                <span class="mr-2">Logout</span>
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    <v-snackbar
      v-model="showBar"
      :timeout="2000"
      :color="type"
    >
      {{ message }}
      <v-btn
        color="#00B887"
        text
        @click="clear"
      >
        Close
      </v-btn>
    </v-snackbar>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      showBar: false,
    }
  },
  name: "App",
  methods: {
    ...mapActions("authentication", ["logout", "login"]),
    ...mapActions("alert", ["clear"])
  },
  computed: {
    ...mapState("authentication", ["user", "status"]),
    ...mapState("alert", ["type", "message"]),
  },
  watch: {
    $route() {
      // clear alert on location change
      this.clear();
    },
    message: function(data) {
      if (data) {
       this.showBar = true;
       setTimeout(() => {
          this.clear();
       }, 2000)

      }
      else
        this.showBar = false
    }
  }
};
</script>
