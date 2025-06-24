<template>
  <v-container>

    <v-text-field v-model="username"></v-text-field>

    <v-text-field type="password" v-model="password"></v-text-field>

    <v-btn @click="auth(username, password)">
      Authenticate
    </v-btn>

  </v-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "AuthenticateView",
  data: () => ({
    username: "",
    password: "",
  }),
  methods: {
    ...mapActions('authenticate', ['authenticateTry']),
    auth(username, password) {
      const data = {
        username: username,
        password: password,
      };

      this.authenticateTry(data)
        .then(() => {
          alert("Authentication successful!");
        })
        .catch((error) => {
          alert("Authentication failed: " + (error.response?.data?.message || error.message));
        });

    },
  },
};
</script>

<style scoped></style>