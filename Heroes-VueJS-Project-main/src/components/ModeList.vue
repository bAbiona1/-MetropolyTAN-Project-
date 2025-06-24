<template>
  <v-container>
    <v-data-table
        :headers="headersMode"
        :items="this.$store.state.data.modes"
        class="elevation-1"
        density="compact"
        item-key="id">

      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Modes</v-toolbar-title>
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
              >Add Mode</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ isEdit ? 'Edit Mode' : 'Add Mode' }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.libelle" label="Libellé"></v-text-field>
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
        <v-icon small @click="deleteMode(item)"> mdi-delete </v-icon>
      </template>

    </v-data-table>
  </v-container>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "ModeList",
  computed: {
    isValidForm() {
      return this.editedItem.libelle.trim();
    }
  },
  data: () => ({
    dialog: false,
    headersMode: [{
      text: 'id',
      align: 'start',
      sortable: true,
      value: 'id',
    },
      {text: 'libellé', value: 'libelle'},
      {text: 'actions', value: 'actions', sortable: false},
    ],
    editedItem: {
      libelle: ''
    },
    defaultItem: {
      libelle: ''
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
    ...mapActions('data', ['getModesFromAPI', 'createModeFromAPI', 'updateCurrentModeToAPI', 'deleteModeFromAPI']),
    goTo(item) {
      this.$router.push("/modes/" + item.id);
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
        libelle: this.editedItem.libelle.trim()
      };

      if (this.isEdit) {
        const edit = {
          id :this.editedItem.id,
          ...item
        }
        await this.updateCurrentModeToAPI(edit);
      } else {
        await this.createModeFromAPI(item);
      }

      await this.getModesFromAPI();
      this.close();
    },
    editItem(item, index) {
      this.editedIndex = index;
      this.isEdit = true;
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    async deleteMode(mode) {
      if (confirm("Are you sure you want to delete this mode?")) {
        await this.deleteModeFromAPI(mode.id);
        await this.getModesFromAPI();
      }
    },
  },
  async mounted() {
    await this.getModesFromAPI();
  }
}
</script>

<style scoped>

</style>
