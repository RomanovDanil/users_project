<template>
  <v-app>
    <v-progress-linear
      :indeterminate="userLoading"
      :active="userLoading"
    ></v-progress-linear>
    <v-container fluid>
      <v-row class="ma-0 pa-0" justify="center" v-if="!userLoading">
        <v-col
          cols="12"
          sm="12"
          md="5"
          v-if="user != null && user != undefined"
        >
          <v-row class="mx-0">
            <v-col cols="4">
              <v-img
                height="250"
                contain
                aspect-ratio="1"
                v-if="user.userData.image == null || user.userData.image == ''"
                :src="`http://localhost:5000/user_images/` + `default.jpg`"
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
                :src="
                  `http://localhost:5000/user_images/` + user.userData.image
                "
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
            </v-col>
            <v-col cols="8" class="text-left">
              <v-row class="flex-column mr-0">
                <v-card tile outlined flat elevation="1" class="mt-3">
                  <v-app-bar flat>
                    <v-toolbar-title class="title black--text pl-0">
                      Login information
                    </v-toolbar-title>
                  </v-app-bar>
                  <v-col class="px-5">
                    <strong>Email: </strong>{{ user.email }}
                  </v-col>
                </v-card>
                <v-card class="mt-3" elevation="1" tile outlined flat>
                  <v-app-bar flat>
                    <v-toolbar-title class="title black--text">
                      Profile information
                    </v-toolbar-title>
                  </v-app-bar>
                  <v-col class="px-5">
                    <strong>First name: </strong>{{ user.userData.firstName }}
                  </v-col>
                  <v-col class="px-5">
                    <strong>Second name: </strong>{{ user.userData.secondName }}
                  </v-col>
                  <v-col class="px-5">
                    <strong>Third name: </strong>{{ user.userData.thirdName }}
                  </v-col>
                  <v-col class="px-5">
                    <strong>Country: </strong>{{ user.userData.country.name }}
                  </v-col>
                </v-card>
                <v-card class="mt-3 mb-3" elevation="1" tile outlined flat>
                  <v-app-bar flat>
                    <v-toolbar-title class="title black--text">
                      Personal identification number
                    </v-toolbar-title>
                  </v-app-bar>
                  <v-col class="pl-5">
                    <v-row>
                      <v-col>
                        <strong>PIN: </strong>{{ user.userData.pin }}
                      </v-col>
                    </v-row>
                  </v-col>
                </v-card>
              </v-row>
            </v-col>
          </v-row>
          <v-row justify="center" class="pa-5 mt-5">
            <v-col cols="auto">
              <v-btn text color="error" @click="openDialogRemove">
                Delete user
              </v-btn>
            </v-col>
            <template>
              <v-dialog v-model="dialogRemove" persistent max-width="600px">
                <v-card class="pa-3">
                  <v-card-title>
                    <v-spacer> </v-spacer>
                    <v-btn
                      @click="closeDialogRemove"
                      :disabled="loadingRemove"
                      icon
                    >
                      <v-icon>close</v-icon>
                    </v-btn>
                  </v-card-title>
                  <v-col cols="12" md="12" xl="12" sm="12">
                    <v-card-title class="justify-center">
                      Do you really want to delete the user?
                    </v-card-title>
                    <v-col cols="12" md="12" sm="12" xl="12">
                      <v-btn
                        text
                        :loading="loadingRemove"
                        color="error"
                        @click="remove"
                      >
                        Delete
                      </v-btn>
                    </v-col>
                  </v-col>
                </v-card>
              </v-dialog>
            </template>
          </v-row>
        </v-col>
        <v-col cols="12" sm="12" md="5" v-else>
          <v-card-title>
            User not found
          </v-card-title>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar
      timeout="6000"
      bottom="bottom"
      :color="snackbar_color"
      v-model="snackbar"
    >
      {{ snackbar_message }}
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  name: "UserProfile",
  props: ["userId"],
  data: () => ({
    user: null,
    loadedSuccess: true,
    userLoading: true,
    loadingRemove: false,
    dialogRemove: false,
    showProgress: true,
    snackbar_color: "red lighten-1",
    snackbar_message: "",
    snackbar: false,
  }),
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  created() {
    this.$store.dispatch("pages/setPageName", "User Profile");
    this.isAdmin = this.$store.getters["auth/isAdmin"];
    this.loadUser();
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
  },
  methods: {
    async loadUser() {
      await this.$store
        .dispatch("user/getById", {
          currentUser: this.currentUser,
          userId: this.userId,
        })
        .then((data) => {
          this.user = data.user;
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.data.message) {
              this.snackbar_message = error.response.data.message;
            }
          } else {
            if (error.message) {
              this.snackbar_message = error.message;
            } else {
              this.snackbar_message = error;
            }
          }
          this.snackbar_color = "red lighten-1";
          this.snackbar = true;
          this.loadedSuccess = false;
        });
      this.userLoading = false;
    },
    closeDialogRemove() {
      this.dialogRemove = false;
    },
    openDialogRemove() {
      this.dialogRemove = true;
    },
    async remove() {
      console.log(this.userId);
      this.loadingRemove = true;
      await this.$store
        .dispatch("user/delete", {
          currentUser: this.currentUser,
          userId: this.userId,
        })
        .then((data) => {
          this.user = null;
          this.snackbar_color = "success";
          this.snackbar_message = "Event successfully deleted";
          this.snackbar = true;
        })
        .catch((error) => {
          if (error.response)
            this.snackbar_message = error.response.data.message;
          else this.snackbar_message = error.message;
          this.snackbar_color = "red lighten-1";
          this.snackbar = true;
        });
      this.loadingRemove = false;
    },
  },
};
</script>
