<template>
  <div>
    <v-container v-if="this.$store.state.data.currentStop">
      <h1>Stop Detail</h1>
      <p>ID : {{ this.$store.state.data.currentStop.id }}</p>
      <p>Nom de l'arrêt : {{ this.$store.state.data.currentStop.stop_name }}</p>
      <p>Heure de passage : {{ this.$store.state.data.currentStop.heure_passage }}</p>
      <p>Parent Stop ID : {{ this.$store.state.data.currentStop.parent_stop_id }}</p>
      <p>Parent Stop Name : {{ this.$store.state.data.currentStop.parent_stop_name }}</p>
      <p>Line ID : {{ this.$store.state.data.currentStop.line_id }}</p>
      <p>Line Name : {{ this.$store.state.data.currentStop.line_name }}</p>
      <p>Mode ID : {{ this.$store.state.data.currentStop.mode_id }}</p>
      <p>Mode : {{ this.$store.state.data.currentStop.mode_libelle }}</p>
      <p>Location ID : {{ this.$store.state.data.currentStop.location_id }}</p>
      <p>Adresse : {{ this.$store.state.data.currentStop.location_adresse }}</p>
      <p>Latitude : {{ this.$store.state.data.currentStop.location_latitude }}</p>
      <p>Longitude : {{ this.$store.state.data.currentStop.location_longitude }}</p>
    </v-container>

    <v-container v-else>
      <v-dialog v-model="dialogVisible">
        <v-card>
          <v-card-title>
            <span class="headline">Nothing to show</span>
          </v-card-title>
          <v-card-text>
            No stop selected.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="redirectToStops">
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

export default {
  name: 'StopDetail',
  data: () => ({
    dialogVisible: false
  }),
  methods: {
    ...mapActions('data', ['getCurrentStopFromAPI']),
    ...mapMutations('data', ['setCurrentStop']),
    ...mapMutations('errors', ['pushError', 'popError']),

    async redirectToStops() {
      this.popError();
      await this.$router.push('/stops');
    }
  },
  async mounted() {
    try {
      await this.getCurrentStopFromAPI(this.$route.params.id);
    } catch (e) {
      this.dialogVisible = true;
      this.setCurrentStop(null);
      this.pushError(e);
    }
  }
};
</script>

<style scoped>
</style>
