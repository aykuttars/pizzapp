<template>
  <v-app id="inspire">
    <v-content>
      <v-container>
        <v-card class="elevation-12">
          <v-toolbar color="#00B887" dark flat>
            <v-toolbar-title>Login form</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="login" v-model="valid">
              <v-text-field
                label="Login"
                color="#00B887"
                name="login"
                type="text"
                prepend-icon="mdi-account"
                :value="username"
                @input="setUsername"
                :rules="[rules.required]"
              />

              <v-text-field
                id="password"
                label="Password"
                color="#00B887"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                :value="password"
                @input="setPassword"
                :rules="[rules.required, rules.min]"

              />
              <v-card-actions>
                <v-spacer />
                <v-btn color="#00B887" class="ma-2 white--text" :to="{name: 'register'}">Register</v-btn>
                <v-btn color="#00B887" class="ma-2 white--text" :disabled="!valid" type="submit">Login</v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
// import { userHelper } from "@/misc/user_helper";
export default {
  data() {
    return {
      valid: true,
      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 8 || "Min 8 characters"
      }
    };
  },
  watch: {
    user: {
      handler(user) {
        if (user) {
          this.$router.push("/");
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapState("authentication", ["user", "status", "username", "password"])
  },
  methods: {
    ...mapActions("authentication", ["login"]),
    ...mapMutations("authentication", [
      "setUsername",
      "setPassword",
      "setPasswordAgain"
    ])
  }
};
</script>
