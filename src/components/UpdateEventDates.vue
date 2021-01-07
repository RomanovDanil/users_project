<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon>edit</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Update event's dates</span>
      </v-card-title>
      <v-card-text>
        <v-container fluid>
          <v-row class="ma-0 pa-0" justify="center">
            <v-col cols="12" sm="12" md="12">
              <v-sheet>
                <v-slide-group show-arrows>
                  <v-slide-item v-for="(date, index) in dates" :key="index">
                    <v-card
                      :class="`align-center pa-3 ma-1 date ${date.stage}`"
                      :elevation="2"
                    >
                      <div class="caption grey--text">{{ date.name }}</div>
                      <div class="black--text">{{ date.value }}</div>
                    </v-card>
                  </v-slide-item>
                </v-slide-group>
              </v-sheet>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-form v-model="isValid">
                <v-dialog
                  ref="dialog_start_date"
                  v-model="dialog_start_date"
                  :return-value.sync="start_date"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="StartDate_Formatted"
                      label="Start Date"
                      prepend-icon="calendar_today"
                      :rules="[(v) => !!v || 'Start Date is required']"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="start_date" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="dialog_start_date = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.dialog_start_date.save(start_date)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-dialog>

                <v-dialog
                  ref="dialog_c_1_date"
                  v-model="dialog_c_1_date"
                  :return-value.sync="c_1_date"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="C1Date_Formatted"
                      label="C1 Date"
                      :rules="[(v) => !!v || 'C1 Date is required']"
                      prepend-icon="calendar_today"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="c_1_date" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="dialog_c_1_date = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.dialog_c_1_date.save(c_1_date)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-dialog>

                <v-dialog
                  ref="dialog_c_plus_1_date"
                  v-model="dialog_c_plus_1_date"
                  :return-value.sync="c_plus_1_date"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="CPlus1Date_Formatted"
                      label="C+1 Date"
                      :rules="[(v) => !!v || 'C+1 Date is required']"
                      prepend-icon="calendar_today"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="c_plus_1_date" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="dialog_c_plus_1_date = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.dialog_c_plus_1_date.save(c_plus_1_date)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-dialog>

                <v-dialog
                  ref="dialog_finish_date"
                  v-model="dialog_finish_date"
                  :return-value.sync="finish_date"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="FinishDate_Formatted"
                      label="Finish Date"
                      :rules="[(v) => !!v || 'Finish Date is required']"
                      prepend-icon="calendar_today"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="finish_date" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="dialog_finish_date = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.dialog_finish_date.save(finish_date)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-form>
              <v-snackbar
                timeout="6000"
                bottom="bottom"
                color="red lighten-1"
                v-model="snackbar"
              >
                {{ message }}
              </v-snackbar>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click.native="close()"
          :disabled="loading"
        >
          Close
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click.native="update()"
          :disabled="loading"
          :loading="loading"
        >
          Update
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "updateEventDates",
  props: [
    "event_start_date",
    "event_c_1_date",
    "event_c_plus_1_date",
    "event_finish_date",
    "event_id",
  ],
  data: () => ({
    dialog: false,
    loading: false,
    start_date: "",
    c_1_date: "",
    c_plus_1_date: "",
    finish_date: "",
    message: "",
    snackbar: false,
    isValid: false,
    dialog_start_date: false,
    dialog_c_1_date: false,
    dialog_c_plus_1_date: false,
    dialog_finish_date: false,
  }),
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    StartDate_Formatted() {
      return this.formatDate(this.start_date);
    },
    C1Date_Formatted() {
      return this.formatDate(this.c_1_date);
    },
    CPlus1Date_Formatted() {
      return this.formatDate(this.c_plus_1_date);
    },
    FinishDate_Formatted() {
      return this.formatDate(this.finish_date);
    },
    dates() {
      let date_start = new Date(this.start_date);
      let date_c_1 = new Date(this.c_1_date);
      let date_c_plus_1 = new Date(this.c_plus_1_date);
      let date_finish = new Date(this.finish_date);

      const initial_stage = (date_c_1 - date_start) / 1000 / 86400;
      const main_stage = (date_c_plus_1 - date_c_1) / 1000 / 86400;
      const final_stage = (date_finish - date_c_plus_1) / 1000 / 86400;

      let arr_dates = [];
      //start stage
      for (let d = 0; d < initial_stage; d++) {
        let date = new Date(date_start);
        date.setDate(date_start.getDate() + d);
        arr_dates.push({
          value: this.formatDate(date.toISOString()),
          stage: "initial",
          name: `C-${initial_stage - d}`,
        });
      }
      //main stage
      for (let d = 0; d < main_stage; d++) {
        let date = new Date(date_c_1);
        date.setDate(date_c_1.getDate() + d);
        arr_dates.push({
          value: this.formatDate(date.toISOString()),
          stage: "main",
          name: `C${d + 1}`,
        });
      }
      //final stage
      for (let d = 0; d <= final_stage; d++) {
        let date = new Date(date_c_plus_1);
        date.setDate(date_c_plus_1.getDate() + d);
        arr_dates.push({
          value: this.formatDate(date.toISOString()),
          stage: "final",
          name: `C+${d + 1}`,
        });
      }
      return arr_dates;
    },
  },
  created() {
    this.start_date = this.event_start_date.split("T")[0];
    this.c_1_date = this.event_c_1_date.split("T")[0];
    this.c_plus_1_date = this.event_c_plus_1_date.split("T")[0];
    this.finish_date = this.event_finish_date.split("T")[0];
  },
  mounted() {},
  beforeUpdate() {},
  updated() {},
  methods: {
    formatDate(date) {
      if (!date) return "";

      const [year, month, day] = date.split("T")[0].split("-");
      return `${day}/${month}/${year}`;
    },
    close() {
      this.dialog = false;
    },
    async update() {
      this.loading = true;
      await this.$store
        .dispatch("event/updateDates", {
          currentUser: this.currentUser,
          start_date: this.start_date,
          c_1_date: this.c_1_date,
          c_plus_1_date: this.c_plus_1_date,
          finish_date: this.finish_date,
          eventId: this.event_id,
        })
        .then(() => {
          this.$emit("update:event_start_date", this.start_date);
          this.$emit("update:event_c_1_date", this.c_1_date);
          this.$emit("update:event_c_plus_1_date", this.c_plus_1_date);
          this.$emit("update:event_finish_date", this.finish_date);
          this.dialog = false;
        })
        .catch((error) => {
          if (error.response) this.message = error.response.data.message;
          else this.message = error.message;
          this.snackbar = true;
        });
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.date.initial {
  border: 2px solid orange;
}

.date.main {
  border: 2px solid yellowgreen;
}

.date.final {
  border: 2px solid #3cd1c2;
}
</style>
