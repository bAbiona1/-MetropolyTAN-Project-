<template>
  <v-container>
    <v-data-table
        :headers="headers"
        :items="this.$store.state.data.locations"
        class="elevation-1"
        density="compact"
        item-key="id">

      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Locations</v-toolbar-title>
          <v-divider
              class="mx-4"
              inset
              vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
              >Add Location</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ isEdit ? 'Edit Location' : 'Add Location' }}</span>
              </v-card-title>


              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.adresse" label="Adresse"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.latitude" label="Latitude"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.longitude" label="Longitude"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text :disabled="!isValidForm"  @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template slot="item.actions" slot-scope="{ item, index }">
        <v-btn small color="info" @click="editItem(item, index)">Edit</v-btn>
        <v-btn small @click="goTo(item)">Details</v-btn>
        <v-icon small @click="deleteLoc(item)"> mdi-delete </v-icon>
      </template>

    </v-data-table>
  </v-container>

</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "LocationList",
  computed: {
    isValidForm() {
      return (
          this.editedItem.adresse.trim() &&
          !isNaN(parseFloat(this.editedItem.latitude)) &&
          !isNaN(parseFloat(this.editedItem.longitude))
      );
    }
  },
  data: () => ({
    dialog: false,
    headers: [{
      text: 'id',
      align: 'start',
      sortable: true,
      value: 'id',
    },
      {text: 'adresse', value: 'adresse'},
      {text: 'latitude', value: 'latitude', sortable: false},
      {text: 'longitude', value: 'longitude', sortable: false},
      {text: 'actions', value: 'actions', sortable: false},
    ],
    editedItem: {
      adresse: '',
      latitude: '',
      longitude: ''
    },
    defaultItem: {
      adresse: '',
      latitude: '',
      longitude: ''
    },
    editedIndex: -1,
    isEdit: false,
  }),
  watch: {
    dialog (val) {
      val || this.close()
    },
  },
  methods: {
    ...mapActions('data', ['getLocationsFromAPI', 'createLocationFromAPI', 'updateCurrentLocationToAPI', 'deleteLocationFromAPI']),
    goTo(item) {
      this.$router.push("/locations/" + item.id);
    },
    close () {
      this.dialog = false;
      this.isEdit = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save () {
      const item = {
        adresse: this.editedItem.adresse.trim(),
        latitude: parseFloat(this.editedItem.latitude),
        longitude: parseFloat(this.editedItem.longitude)
      };

      if (this.isEdit) {
        const edit = {
          id :this.editedItem.id,
          ...item
        }
        await this.updateCurrentLocationToAPI(edit);
      } else {
        await this.createLocationFromAPI(item);
      }

      await this.getLocationsFromAPI();
      this.close();
    },
    editItem(item, index) {
      this.editedIndex = index;
      this.isEdit = true;
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    async deleteLoc(loc) {
      if (confirm("Are you sure you want to delete this location?")) {
        await this.deleteLocationFromAPI(loc.id);
        await this.getLocationsFromAPI();
      }
    },


  },
  async mounted() {
    await this.getLocationsFromAPI();
  }
}
</script>

<style scoped>

</style>