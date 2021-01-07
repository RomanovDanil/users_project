<template>
  <v-app>
    <v-container fluid>
      <v-row class="ma-0 pa-0" justify="center">
        <v-col cols="12" sm="12" md="5">
          <v-card class="elevator-1 pb-3">
            <v-row class="mx-0">
              <v-col cols="4">
                <v-img
                  height="250"
                  contain
                  aspect-ratio="1"
                  v-if="imageBase64 == null"
                  :src="`http://localhost:5000/event_images/` + `default.png`"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
                <v-img
                  height="250"
                  v-else
                  contain
                  aspect-ratio="1"
                  :src="imageBase64.image"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
                <v-row class="space-between">
                  <v-col class="mx-0" cols="12" md="6" sm="12">
                    <v-btn color="success" text @click="$refs.file.click()"
                      >upload</v-btn
                    >
                  </v-col>
                  <v-col class="mx-0" cols="12" md="6" sm="12">
                    <v-btn
                      color="error"
                      text
                      @click.native="deleteImage()"
                      v-if="imageBase64 != null"
                      >delete</v-btn
                    >
                  </v-col>
                  <input
                    style="display: none"
                    type="file"
                    id="file"
                    ref="file"
                    name="file"
                    accept="image/jpeg, image/gif, image/png"
                    @change="handleUploadImage"
                  />
                </v-row>
              </v-col>
              <v-col cols="8">
                <v-row class="flex-column mr-0">
                  <v-form v-model="isValid">
                    <v-text-field
                      label="Title"
                      v-model="title"
                      prepend-icon="account_box"
                      :rules="[(v) => !!v || 'Title is required']"
                      required
                      color="light-blue lighten-1"
                    >
                    </v-text-field>

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
                          @click="
                            $refs.dialog_c_plus_1_date.save(c_plus_1_date)
                          "
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
                </v-row>
              </v-col>
            </v-row>

            <v-btn
              color="primary"
              @click.native="EventCreate()"
              :disabled="!isValid"
              :loading="loading"
              >Create</v-btn
            >
          </v-card>

          <v-snackbar
            timeout="6000"
            bottom="bottom"
            :color="color"
            v-model="snackbar"
          >
            {{ message }}
          </v-snackbar>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import EventService from "@/services/event_service";
export default {
  name: "CreateEvent",
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
  },
  created() {
    this.$store.dispatch("pages/setPageName", "CREATE EVENT");
  },
  data: () => ({
    snackbar: false,
    color: "",
    message: "",
    isValid: true,
    loading: false,
    dialog_start_date: false,
    dialog_c_1_date: false,
    dialog_c_plus_1_date: false,
    dialog_finish_date: false,
    imageBase64: null,
    title: "",
    start_date: "",
    c_1_date: "",
    c_plus_1_date: "",
    finish_date: "",
  }),
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
  },
  methods: {
    async deleteImage() {
      this.imageBase64 = null;
    },
    formatDate(date) {
      if (!date) return "";

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    async handleUploadImage(event) {
      if (event.target.files[0]) {
        const reader = new FileReader();
        const image = event.target.files[0];
        const imageName = event.target.files[0].name;
        reader.onload = (e) => {
          this.imageBase64 = {
            image: e.target.result,
            name: imageName,
          };
        };
        reader.readAsDataURL(image);
        this.$refs.file.value = null;
      }
    },
    async EventCreate() {
      console.log(this.start_date);
      // this.loading = true;
      // await EventService.create(
      //   this.currentUser,
      //   this.title,
      //   this.start_date,
      //   this.c_1_date,
      //   this.c_plus_1_date,
      //   this.finish_date,
      //   this.imageBase64
      // )
      //   .then(() => {
      //     this.message = "Event was created success";
      //     this.color = "success";
      //     this.snackbar = true;
      //   })
      //   .catch((error) => {
      //     let errorMessage = "";
      //     if (error.response) {
      //       errorMessage = error.response.data.message;
      //       if (error.response.data.errors) {
      //         errorMessage += ": ";
      //         const errors = error.response.data.errors;
      //         for (let i = 0; i < errors.length; i++) {
      //           errorMessage += errors[i].msg + "; ";
      //         }
      //       }
      //     } else {
      //       if (error.message) errorMessage = error.message;
      //       else errorMessage = error;
      //     }
      //     this.message = errorMessage;
      //     this.color = "red lighten-1";
      //     this.snackbar = true;
      //   });
      // this.loading = false;
    },
  },
};
</script>
