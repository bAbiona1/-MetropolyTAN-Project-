<template>
  <v-app>

      <NavDrawer :titles="dynamicTitles">
        <template v-slot:link-to={link}>
          <span>
          {{link.text}}
          </span>
        </template>
      </NavDrawer>

    <v-main>
      <router-view name="central"/>
    </v-main>
  </v-app>
</template>

<script>

import NavDrawer from "@/components/NavDrawer.vue";

export default {
  name: 'App',
  components: {NavDrawer},
  computed: {
    currentLocation() {
      return this.$store.state.data.currentLocation;
    },
    currentMode() {
      return this.$store.state.data.currentMode;
    },
    currentLine() {
      return this.$store.state.data.currentLine;
    },
    currentStop() {
      return this.$store.state.data.currentStop;
    },
    dynamicTitles() {
      return [
        { text: "Locations", path: "/locations" },
        { text: "Modes", path: "/modes" },
        { text: "Lines", path: "/lines" },
        { text: "Stops", path: "/stops"},
          /**
        {
          text: "Last checked location",
          path: this.currentLocation ? `/locations/${this.currentLocation.id}` : "/locations/none",
        },
        {
          text: "Last checked mode",
          path: this.currentMode ? `/modes/${this.currentMode.id}` : "/modes/none"
        },
        {
          text: "Last checked line",
          path: this.currentLine ? `/lines/${this.currentLine.id}` : "/lines/none"
        },
        {
          text: "Last checked stop",
          path: this.currentStop ? `/stops/${this.currentStop.id}` : "/stops/none"
        }
            **/
      ];
    },
  },
};
</script>
