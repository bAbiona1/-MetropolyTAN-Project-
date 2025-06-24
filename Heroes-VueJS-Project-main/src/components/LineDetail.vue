<template>
  <div>
    <v-container v-if="this.$store.state.data.currentLine">
      <h1>Line Detail</h1>
      <p>ID : {{ this.$store.state.data.currentLine.id }}</p>
      <p>Nom : {{ this.$store.state.data.currentLine.name }}</p>
      <p>Mode ID : {{ this.$store.state.data.currentLine.mode_id }}</p>
      <p>Mode : {{ this.$store.state.data.currentLine.mode_libelle }}</p>
    </v-container>

    <v-container v-else>
      <v-dialog v-model="dialogVisible">
        <v-card>
          <v-card-title>
            <span class="headline">Nothing to show</span>
          </v-card-title>
          <v-card-text>
            No line selected.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="redirectToLines">
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
  name: 'LineDetail',
  data: () => ({
    dialogVisible: false
  }),
  methods: {
    ...mapActions('data', ['getCurrentLineFromAPI']),
    ...mapMutations('data', ['setCurrentLine']),
    ...mapMutations('errors', ['pushError', 'popError']),

    async redirectToLines() {
      this.popError();
      await this.$router.push('/lines');
    }
  },
  async mounted() {
    try {
      await this.getCurrentLineFromAPI(this.$route.params.id);
    } catch (e) {
      this.dialogVisible = true;
      this.setCurrentLine(null);
      this.pushError(e);
    }
  }
};
</script>

<style scoped>
</style>
