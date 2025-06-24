<template>
  <div>
    <v-container v-if="this.$store.state.data.currentLocation">
      <h1>Location Detail</h1>
      <p>Id : {{this.$store.state.data.currentLocation.id}}</p>
      <p>Adresse : {{this.$store.state.data.currentLocation.adresse}}</p>
      <p>Latitude : {{this.$store.state.data.currentLocation.latitude}}</p>
      <p>Longitude : {{this.$store.state.data.currentLocation.longitude}}</p>
      <!--v-dialog v-model="editNameDialog" max-width="500px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" v-bind="attrs" v-on="on" @click="editLocation">
            Edit Names
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Edit Hero Name</span>
          </v-card-title>
          <v-card-text>
            <v-text-field label="Public Name" v-model="newPublicName"></v-text-field>
            <v-text-field label="Real Name" v-model="newRealName"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeEditNameDialog">
              Cancel
            </v-btn>
            <v-btn color="blue darken-1" text :disabled="!(newPublicName.trim() && newRealName.trim())"  @click="saveLocationAdresse">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog-->

      <!--v-data-table
          :headers="headersPowers"
          :items="this.$store.state.data.currentHero.powers"
          class="elevation-1"
          density="compact"
          item-key="id"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Powers</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="powerDialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                  Add Power
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Add Power</span>
                </v-card-title>
                <v-card-text>
                  <v-text-field
                      label="Power Name"
                      v-model="newPower.name"
                  ></v-text-field>
                  <v-select
                      :items="powerTypes"
                      label="Power Type"
                      v-model="newPower.type"
                  ></v-select>
                  <v-text-field
                      label="Power Level"
                      type="number"
                      min="0"
                      max="100"
                      v-model="newPower.level"
                  ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closePowerDialog">
                    Cancel
                  </v-btn>
                  <v-btn
                      color="blue darken-1"
                      text
                      :disabled="!(newPower.name.trim() && newPower.type.trim() && newPower.level.trim() && newPower.level >= 0 && newPower.level <= 100)"
                      @click="addPower"
                  >
                    Validate
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template slot="item.type" slot-scope="{ item }">
          {{ getPowerType(item.type) }}
        </template>
        <template slot="item.actions" slot-scope="{ item }">
          <v-icon
              small
              @click="deletePower(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table-->

    </v-container>

    <v-container v-else>
      <v-dialog v-model="dialogVisible">
        <v-card>
          <v-card-title>
            <span class="headline">Nothing to show</span>
          </v-card-title>
          <v-card-text>
            No location selected.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="redirectToLocations()">
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import {mapActions, mapMutations} from "vuex";
export default {
  name: "LocationDetail",
  data: () => ({
    dialogVisible: false,
    editNameDialog: false,
    newAdresse: '',
    powerDialog: false,
    newPower: {
      name: '',
      type: '',
      level: '',
    }
  }),
  methods: {
    ...mapActions('data',['getCurrentLocationFromAPI', 'updateCurrentLocationToAPI']),
    ...mapMutations('data',['setCurrentLocation']),
    ...mapMutations('errors',['pushError', 'popError']),
    async editLocation() {
      this.newAdresse = this.$store.state.data.currentLocation.adresse;
    },
    async redirectToLocations() {
      this.popError()
      await this.$router.push("/locations");
    },

    async saveLocationAdresse() {
      const updatedLoc = {
        ...this.$store.state.data.currentLocation,
        adresse: this.newAdresse,
      };
      await this.updateCurrentLocationToAPI(updatedLoc);
      await this.getCurrentLocationFromAPI(this.$route.params.id);
      this.editNameDialog = false;
    },
    closeEditNameDialog() {
      this.editNameDialog = false;
      this.newAdresse = '';
    }
  },
  async mounted() {
    try {
      await this.getCurrentLocationFromAPI(this.$route.params.id);
    } catch (e) {
      this.dialogVisible = true;
      this.setCurrentLocation(null)
      this.pushError(e);
    }
  },
}
</script>