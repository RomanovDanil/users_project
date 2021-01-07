<template>
  <v-app>
    <v-progress-linear
      :indeterminate="loadEventProgress"
      :active="show"
    ></v-progress-linear>
    <v-container fluid v-if="!loadEventProgress">
      <v-row class="ma-0 pa-0" justify="center">
        <v-col cols="12" sm="12" md="5">
          <v-row class="mx-0" v-if="event != null && event != undefined">
            <v-col cols="12" md="4" sm="12" xl="12">
              <v-img
                height="250"
                contain
                aspect-ratio="1"
                v-if="event.image == null || event.image == ''"
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
                :src="`http://localhost:5000/event_images/` + event.image"
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
                <v-col cols="12" md="6" sm="12" xl="12"
                  ><v-btn
                    color="success"
                    text
                    @click="$refs.file.click()"
                    :loading="uploadImageLoading"
                    :disabled="imageDisabled"
                    >upload</v-btn
                  >
                </v-col>
                <v-col cols="12" md="6" sm="12" xl="12"
                  ><v-btn
                    color="error"
                    text
                    @click.native="deleteImage()"
                    :loading="deleteImageLoading"
                    :disabled="imageDisabled"
                    v-if="event.image != null && event.image != ''"
                    >delete</v-btn
                  ></v-col
                >
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
            <v-col cols="12" md="8" xl="12" sm="12" class="text-left pa-3">
              <v-row class="flex-column">
                <v-card tile outlined flat elevation="1">
                  <v-app-bar flat>
                    <v-toolbar-title class="title black--text pl-0">
                      Event information
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <UpdateEventTitle
                      v-bind:event_title.sync="event.title"
                      v-bind:event_id="event._id"
                    />
                  </v-app-bar>
                  <v-col class="px-5">
                    <strong>Title: </strong>{{ event.title }}
                  </v-col>
                </v-card>
                <v-card class="mt-3" elevation="1" tile outlined flat>
                  <v-app-bar flat>
                    <v-toolbar-title class="title black--text">
                      Dates information
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <UpdateEventDates
                      v-bind:event_id="event._id"
                      v-bind:event_start_date.sync="event.start_date"
                      v-bind:event_c_1_date="event.c_1_date"
                      v-bind:event_c_plus_1_date.sync="event.c_plus_1_date"
                      v-bind:event_finish_date.sync="event.finish_date"
                    />
                  </v-app-bar>
                  <v-col class="px-5">
                    <strong>Start Date: </strong>{{ StartDate_Formatted }}
                  </v-col>
                  <v-col class="px-5">
                    <strong>C1 Date: </strong>{{ C1Date_Formatted }}
                  </v-col>
                  <v-col class="px-5">
                    <strong>C+1 Date: </strong>{{ CPlus1Date_Formatted }}
                  </v-col>
                  <v-col class="px-5">
                    <strong>Finish Date: </strong>{{ FinishDate_Formatted }}
                  </v-col>
                </v-card>
                <v-card class="mt-3" elevation="1" tile outlined flat>
                  <v-app-bar flat>
                    <v-toolbar-title class="title black--text">
                      Participants
                    </v-toolbar-title>
                  </v-app-bar>
                  <v-col class="pl-5">
                    <v-row no-gutters>
                      <v-col>
                        <strong>Participants: </strong>
                        {{ event.participants.length }}
                      </v-col>
                      <v-col cols="auto">
                        <v-btn
                          depressed
                          small
                          text
                          color="success"
                          @click="assign"
                          >Assign</v-btn
                        >
                      </v-col>
                    </v-row>
                  </v-col>
                </v-card>
              </v-row>
            </v-col>
          </v-row>

          <v-row class="mx-0" v-else>
            Current event not found
          </v-row>
        </v-col>
      </v-row>

      <v-snackbar
        timeout="6000"
        bottom="bottom"
        :color="color"
        v-model="snackbar"
      >
        {{ message }}
      </v-snackbar>
    </v-container>
  </v-app>
</template>

<script>
import EventService from "@/services/event_service";
import UpdateEventTitle from "@/components/UpdateEventTitle";
import UpdateEventDates from "@/components/UpdateEventDates";
export default {
  components: { UpdateEventTitle, UpdateEventDates },
  name: "CurrentEvent",
  props: ["eventId"],
  data: () => ({
    snackbar: false,
    message: "",
    event: null,
    color: "red lighten-1",
    loadEventProgress: true,
    show: true,
    uploadImageLoading: false,
    deleteImageLoading: false,
    imageDisabled: false,
  }),
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    StartDate_Formatted() {
      return this.formatDate(this.event.start_date);
    },
    C1Date_Formatted() {
      return this.formatDate(this.event.c_1_date);
    },
    CPlus1Date_Formatted() {
      return this.formatDate(this.event.c_plus_1_date);
    },
    FinishDate_Formatted() {
      return this.formatDate(this.event.finish_date);
    },
  },
  created() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    this.$store.dispatch("pages/setPageName", "CURRENT EVENT");
    this.loadCurrentEvent();
  },
  methods: {
    formatDate(date) {
      if (!date) return "";

      const [year, month, day] = date.split("T")[0].split("-");
      return `${day}/${month}/${year}`;
    },
    async loadCurrentEvent() {
      await this.$store
        .dispatch("event/getCurrentEvent", {
          eventId: this.eventId,
          currentUser: this.currentUser,
        })
        .then((data) => {
          this.event = data.event;
        })
        .catch((error) => {
          if (error.response) this.message = error.response.data.message;
          else this.message = error.message;
          this.color = "red lighten-1";
          this.snackbar = true;
        });
      this.loadEventProgress = false;
      this.show = false;
    },
    assign() {
      this.$router.push({ name: "Events.Assign" });
    },
    async deleteImage() {
      this.deleteImageLoading = true;
      this.imageDisabled = true;
      await this.$store
        .dispatch("event/deleteImage", {
          eventId: this.eventId,
          currentUser: this.currentUser,
        })
        .then(() => {
          this.event.image = "";
        })
        .catch((error) => {
          if (error.response) this.message = error.response.data.message;
          else this.message = error.message;
          this.color = "red lighten-1";
          this.snackbar = true;
        });
      this.deleteImageLoading = false;
      this.imageDisabled = false;
    },
    handleUploadImage(event) {
      if (event.target.files[0]) {
        const selectedImage = event.target.files[0];
        const selectedImageName = event.target.files[0].name;

        const reader = new FileReader();
        reader.onload = (e) => {
          const imageBase64 = {
            image: e.target.result,
            name: selectedImageName,
          };
          this.uploadImage(imageBase64);
        };
        reader.readAsDataURL(selectedImage);
      } else {
        this.message = "Image not selected";
        this.color = "red lighten-1";
        this.snackbar = true;
      }
    },
    async uploadImage(imageBase64) {
      this.uploadImageLoading = true;
      this.imageDisabled = true;
      await this.$store
        .dispatch("event/uploadImage", {
          currentUser: this.currentUser,
          eventId: this.eventId,
          imageBase64: imageBase64,
        })
        .then((data) => {
          this.event.image = data.image;
          this.color = "success";
          this.message = "Image uploaded success";
          this.snackbar = true;
        })
        .catch((data) => {
          if (error.response) this.message = error.response.data.message;
          else this.message = error.message;
          this.color = "red lighten-1";
          this.snackbar = true;
        });
      this.uploadImageLoading = false;
      this.imageDisabled = false;
    },
  },
};
</script>
