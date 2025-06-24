<template>
  <v-container>
    <v-data-table
        :headers="headersStop"
        :items="this.$store.state.data.stops"
        class="elevation-1"
        density="compact"
        item-key="id"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Stops</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Add Stop</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ isEdit ? 'Edit Stop' : 'Add Stop' }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="editedItem.name" label="Stop Name"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="editedItem.heure_passage" label="Heure de Passage (HH:MM:SS)"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="editedItem.parent_stop_id" label="Parent Stop ID" type="number"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="editedItem.line_id" label="Line ID" type="number"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field v-model="editedItem.location_id" label="Location ID" type="number"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="close">Cancel</v-btn>
                <v-btn text color="blue darken-1" :disabled="!isValidForm" @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template slot="item.actions" slot-scope="{ item, index }">
        <v-btn small color="info" @click="editItem(item, index)">Edit</v-btn>
        <v-btn small @click="goTo(item)">Details</v-btn>
        <v-icon small @click="deleteStop(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: "StopList",
  computed: {
    isValidForm() {
      return (
          this.editedItem.name.trim() &&
          this.editedItem.heure_passage &&
          this.editedItem.line_id &&
          this.editedItem.location_id
      );
    }
  },
  data: () => ({
    dialog: false,
    headersStop: [
      { text: 'ID', value: 'id' },
      { text: 'Stop Name', value: 'stop_name' },
      { text: 'Heure Passage', value: 'heure_passage' },
      { text: 'Parent Stop', value: 'parent_stop_name' },
      { text: 'Line', value: 'line_name' },
      { text: 'Mode', value: 'mode_libelle' },
      { text: 'Location', value: 'location_adresse' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    editedItem: {
      name: '',
      heure_passage: '',
      parent_stop_id: null,
      line_id: null,
      location_id: null
    },
    defaultItem: {
      name: '',
      heure_passage: '',
      parent_stop_id: null,
      line_id: null,
      location_id: null
    },
    editedIndex: -1,
    isEdit: false
  }),
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  methods: {
    ...mapActions('data', ['getStopsFromAPI', 'createStopFromAPI', 'updateCurrentStopToAPI', 'deleteStopFromAPI']),
    goTo(item) {
      this.$router.push("/stops/" + item.id);
    },
    close() {
      this.dialog = false;
      this.isEdit = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    async save() {
      const item = {
        name: this.editedItem.name.trim(),
        heure_passage: this.editedItem.heure_passage,
        parent_stop_id: this.editedItem.parent_stop_id,
        line_id: this.editedItem.line_id,
        location_id: this.editedItem.location_id
      };

      if (this.isEdit) {
        await this.updateCurrentStopToAPI({ id: this.editedItem.id, ...item });
      } else {
        await this.createStopFromAPI(item);
      }

      await this.getStopsFromAPI();
      this.close();
    },
    editItem(item, index) {
      this.editedIndex = index;
      this.isEdit = true;
      this.editedItem = {
        id: item.id,
        name: item.stop_name,
        heure_passage: item.heure_passage,
        parent_stop_id: item.parent_stop_id,
        line_id: item.line_id,
        location_id: item.location_id
      };
      this.dialog = true;
    },
    async deleteStop(item) {
      if (confirm("Are you sure you want to delete this stop?")) {
        await this.deleteStopFromAPI(item.id);
        await this.getStopsFromAPI();
      }
    }
  },
  async mounted() {
    await this.getStopsFromAPI();
  }
};
</script>

<style scoped>
</style>
