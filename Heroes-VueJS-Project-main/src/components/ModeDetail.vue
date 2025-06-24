<template>
  <div>
    <v-container v-if="this.$store.state.data.currentMode">
      <h1>Mode Detail</h1>
      <p>ID : {{ this.$store.state.data.currentMode.id }}</p>
      <p>Libellé : {{ this.$store.state.data.currentMode.libelle }}</p>
    </v-container>

    <v-container v-else>
      <v-dialog v-model="dialogVisible">
        <v-card>
          <v-card-title>
            <span class="headline">Nothing to show</span>
          </v-card-title>
          <v-card-text>
            No mode selected.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="redirectToModes">
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
  name: 'ModeDetail',
  data: () => ({
    dialogVisible: false
  }),
  methods: {
    ...mapActions('data', ['getCurrentModeFromAPI']),
    ...mapMutations('data', ['setCurrentMode']),
    ...mapMutations('errors', ['pushError', 'popError']),

    async redirectToModes() {
      this.popError();
      await this.$router.push('/modes');
    }
  },
  async mounted() {
    try {
      await this.getCurrentModeFromAPI(this.$route.params.id);
    } catch (e) {
      this.dialogVisible = true;
      this.setCurrentMode(null);
      this.pushError(e);
    }
  }
};
</script>

<style scoped>
</style>
