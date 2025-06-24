<template>
  <v-container>
    <v-data-table
        :headers="headersLine"
        :items="this.$store.state.data.lines"
        class="elevation-1"
        density="compact"
        item-key="id"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Lines</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Add Line</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ isEdit ? 'Edit Line' : 'Add Line' }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field v-model="editedItem.mode_id" label="Mode ID" type="number"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text :disabled="!isValidForm" @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template slot="item.actions" slot-scope="{ item, index }">
        <v-btn small color="info" @click="editItem(item, index)">Edit</v-btn>
        <v-btn small @click="goTo(item)">Details</v-btn>
        <v-icon small @click="deleteLine(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: "LineList",
  computed: {
    isValidForm() {
      return this.editedItem.name.trim() && this.editedItem.mode_id;
    }
  },
  data: () => ({
    dialog: false,
    headersLine: [
      { text: 'ID', value: 'id' },
      { text: 'Name', value: 'name' },
      { text: 'Mode', value: 'mode_libelle' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    editedItem: {
      name: '',
      mode_id: null
    },
    defaultItem: {
      name: '',
      mode_id: null
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
    ...mapActions('data', ['getLinesFromAPI', 'createLineFromAPI', 'updateCurrentLineToAPI', 'deleteLineFromAPI']),
    goTo(item) {
      this.$router.push("/lines/" + item.id);
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
        mode_id: this.editedItem.mode_id
      };

      if (this.isEdit) {
        await this.updateCurrentLineToAPI({ id: this.editedItem.id, ...item });
      } else {
        await this.createLineFromAPI(item);
      }

      await this.getLinesFromAPI();
      this.close();
    },
    editItem(item, index) {
      this.editedIndex = index;
      this.isEdit = true;
      this.editedItem = {
        id: item.id,
        name: item.name,
        mode_id: item.mode_id
      };
      this.dialog = true;
    },
    async deleteLine(item) {
      if (confirm("Are you sure you want to delete this line?")) {
        await this.deleteLineFromAPI(item.id);
        await this.getLinesFromAPI();
      }
    }
  },
  async mounted() {
    await this.getLinesFromAPI();
  }
};
</script>

<style scoped>
</style>
