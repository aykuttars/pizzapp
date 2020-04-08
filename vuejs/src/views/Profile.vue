<template>
    <v-container fluid style="width: 25%" >
        <v-layout column>
            <v-card>
                <v-card-text>
                    <v-text-field                        
                        id="username"
                        color="#00B887"
                        label="Username"
                        type="text"
                        :value="user.username"
                        @input="setUsername"
                        prepend-icon="mdi-account"
                    />
                    <v-text-field
                        id="email"
                        color="#00B887"
                        label="Email Address"
                        type="text"
                        :value="user.email"
                        @input="setEmail"
                        prepend-icon="mdi-email"
                    />
                    <v-text-field
                        v-model="oldPassword"
                        id="old_password"
                        color="#00B887"
                        label="Old Password"
                        name="oldPassword"
                        prepend-icon="mdi-lock"
                        type="password"
                        :value="oldPassword"
                        @input="setOldPasswd"
                        :rules="[rules.required]"
                    />
                    <v-text-field
                        v-model="newPassword"
                        id="new_password"
                        color="#00B887"
                        label="New Password"
                        name="password"
                        prepend-icon="mdi-lock"
                        type="password"
                        hint="At least 8 characters"
                        :value="password"
                        @input="setPassword"
                        :rules="[rules.required, rules.min]"
                    />
                    <v-text-field
                        v-model="newPasswordAgain"
                        id="new_password_again"
                        color="#00B887"
                        label="New Password Again"
                        name="passwordAgain"
                        prepend-icon="mdi-lock"
                        type="password"
                        hint="At least 8 characters"
                        :value="passwordAgain"
                        @input="setPasswordAgain"
                        :rules="[rules.required, rules.min, passwordConfirmationRule]"
                    />
                </v-card-text>
                <v-card-actions>
                    <v-btn color="#00B887" class="ma-2 white--text" :loading="loading" @click.native="update">
                        <v-icon left dark>mdi-check</v-icon>
                        Save Changes
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-layout>
    </v-container>
</template>

<script>
import { mapState,mapMutations,mapActions } from "vuex";
export default {
    name: 'Profile',
    data: () => {
        return {
        loading: false,
        oldPassword: '',
        newPassword: '',
        newPasswordAgain: '',
        valid: true,
        rules: {
        required: value => !!value || "Required.",
        min: v => v.length >= 8 || "Min 8 characters"
      }
    };
    },
    computed: {
    ...mapState("authentication", ["user","status","username","email","password", "passwordAgain"])
  },
  methods: {
    ...mapMutations("authentication", [
      "setUsername",
      "setPassword",
      "setPasswordAgain",
      "setEmail",
      "setOldPasswd"
    ]),
    ...mapActions("authentication", ["update"]),
    validate() {
      this.$refs.form.validate();
    },
    passwordConfirmationRule() {
      return this.password === this.passwordAgain || "Password must match";
    }
  }
}
</script>