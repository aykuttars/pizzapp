<template>
  <v-app id="inspire">
    <v-content>
      <v-container>
        <v-card class="elevation-12">
          <v-toolbar color="#00B887" dark flat>
            <v-toolbar-title>Register</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="register" v-model="valid">
              <v-text-field
                label="Username"
                color="#00B887"
                type="text"
                :value="username"
                @input="setUsername"
                prepend-icon="mdi-account"
              />
              <v-text-field
                label="Email Address"
                color="#00B887"
                type="mail"
                :value="email"
                @input="setEmail"
                prepend-icon="mdi-email"
                :rules="[rules.email]"
              />

              <v-text-field
                id="password"
                label="Password"
                color="#00B887"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
                hint="At least 8 characters"
                :value="password"
                @input="setPassword"
                :rules="[rules.required, rules.min]"
              />
              <v-text-field
                id="password_again"
                color="#00B887"
                label="Password Again"
                name="passwordAgain"
                prepend-icon="mdi-lock"
                type="password"
                hint="At least 8 characters"
                :value="passwordAgain"
                @input="setPasswordAgain"
                :rules="[rules.required, rules.min, passwordConfirmationRule]"
              />
              <v-card-actions>
                <v-spacer />
                <v-btn color="#00B887" class="ma-2 white--text" type="submit" :disabled="!valid">Register</v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "Register",
  data() {
    return {
      valid: true,
      rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 8 || "Min 8 characters",
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
      }
    };
  },
  computed: {
    ...mapState("authentication", ["username","email", "password", "passwordAgain"])
  },
  methods: {
    ...mapMutations("authentication", [
      "setUsername",
      "setPassword",
      "setPasswordAgain",
      "setEmail"
    ]),
    ...mapActions("authentication", ["register"]),
    validate() {
      this.$refs.form.validate();
    },
    passwordConfirmationRule() {
      return this.password === this.passwordAgain || "Password must match";
    }
    
  }
};
</script>