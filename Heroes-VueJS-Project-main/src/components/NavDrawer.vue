<template>
  <div>
    <v-app-bar app color="success" dark>
      <v-app-bar-nav-icon v-if="$store.state.authenticate.token" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-btn color="blue" @click="navigateTo('/')">
        Home
      </v-btn>
      <v-btn color="red" @click="navigateTo('/authenticate')">
        Authenticate
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item v-for="(link, index) in titles" :key="index" @click="navigateTo(link.path)">
          <v-list-item-content>
            <v-list-item-title>
              <slot name="link-to" :link="link"> {{link.text}} </slot>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>

export default {
  name: 'App',
  props: {
    titles: Array
  },
  data () {
    return {
      drawer: false
    }
  },
  methods: {
    goToAuthenticate() {
      this.$router.push('/authenticate')
    },
    navigateTo(path) {
      const resolvedPath = typeof path === "function" ? path() : path;
      this.$router.push(resolvedPath);
    },
  }
}
</script>

<style scoped>

</style>