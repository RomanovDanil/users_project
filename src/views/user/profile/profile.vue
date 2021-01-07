<template>
  <v-app>
    <v-container fluid>
      <v-row class="ma-0 pa-0" justify="center">
        <v-col cols="12" sm="12" md="5">
          <v-row class="mx-0">
            <v-col cols="12" md="4" sm="12" xl="12">
              <v-img
                height="200"
                contain
                color="black"
                aspect-ratio="1"
                v-if="
                  currentUser.userData.image == null ||
                    currentUser.userData.image == ''
                "
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
                height="200"
                v-else
                contain
                :src="
                  `http://localhost:5000/user_images/` +
                    currentUser.userData.image
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
              <v-row class="space-between mt-3">
                <v-col class="mx-0 pa-0" cols="12" md="6" xl="12" sm="12"
                  ><v-btn color="success" text @click="$refs.file.click()"
                    >upload</v-btn
                  ></v-col
                >
                <v-col class="mx-0 pa-0" cols="12" md="6" xl="12" sm="12"
                  ><v-btn
                    color="error"
                    text
                    @click.native="deleteImage()"
                    v-if="
                      !(
                        currentUser.userData.image == null &&
                        currentUser.userData.image == ''
                      )
                    "
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
            <v-col cols="12" md="8" xl="12" sm="12" class="text-left">
              <v-row class="flex-column">
                <v-card tile outlined flat elevation="1">
                  <v-app-bar flat>
                    <v-toolbar-title class="title grey--text pl-0">
                      Login information
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click.native="changePassword()">
                      <v-icon>edit</v-icon>
                    </v-btn>
                  </v-app-bar>
                  <v-col class="px-5">
                    <strong>Email: </strong>{{ currentUser.email }}
                  </v-col>
                  <v-col class="px-5">
                    <strong>Password: </strong>********
                  </v-col>
                </v-card>
                <v-card class="mt-3" elevation="1" tile outlined flat>
                  <v-app-bar flat>
                    <v-toolbar-title class="title grey--text">
                      Profile information
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click.native="changeProfileInformation()">
                      <v-icon>edit</v-icon>
                    </v-btn>
                  </v-app-bar>
                  <v-col class="px-5">
                    <strong>First name: </strong
                    >{{ currentUser.userData.firstName }}
                  </v-col>
                  <v-col class="px-5">
                    <strong>Second name: </strong
                    >{{ currentUser.userData.secondName }}
                  </v-col>
                  <v-col class="px-5">
                    <strong>Third name: </strong
                    >{{ currentUser.userData.thirdName }}
                  </v-col>
                  <v-col class="px-5">
                    <strong>Country: </strong
                    >{{ currentUser.userData.country.name }}
                  </v-col>
                </v-card>
                <v-card
                  class="mt-3"
                  elevation="1"
                  tile
                  outlined
                  flat
                  v-if="!isAdmin"
                >
                  <v-app-bar flat>
                    <v-toolbar-title class="title black--text">
                      Personal identification number
                    </v-toolbar-title>
                  </v-app-bar>
                  <v-col class="pl-5">
                    <v-row
                      v-if="
                        !currentUser.userData.pin ||
                          currentUser.userData.pin != ''
                      "
                    >
                      <v-col>
                        <strong>PIN: **** </strong>
                      </v-col>
                      <v-col cols="auto">
                        <v-btn
                          depressed
                          small
                          text
                          color="success"
                          @click.native="setPin()"
                          >Reset pin</v-btn
                        >
                      </v-col>
                    </v-row>
                    <v-row v-else>
                      <v-col>
                        <strong>PIN: </strong>
                      </v-col>
                      <v-col cols="auto">
                        <v-btn
                          depressed
                          small
                          text
                          color="success"
                          @click.native="setPin()"
                          >Set pin</v-btn
                        >
                      </v-col>
                    </v-row>
                  </v-col>
                </v-card>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "Profile",
  data: () => ({
    imageBase64: null,
    isAdmin: false,
  }),
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  created() {
    this.$store.dispatch("pages/setPageName", "Profile");
    this.isAdmin = this.$store.getters["auth/isAdmin"];
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    console.log(this.currentUser);
  },
  methods: {
    submitExit() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/login");
    },
    changeProfileInformation() {
      this.$router.push("/profile/updateProfileInformation");
    },
    changePassword() {
      this.$router.push("/profile/updatePassword");
    },
    setPin() {
      this.$router.push("/profile/setPin");
    },
    deleteImage() {
      this.$store.dispatch("user/deleteImage", { user: this.currentUser });
    },
    handleUploadImage(event) {
      if (event.target.files[0]) {
        const selectedImage = event.target.files[0];
        const selectedImageName = event.target.files[0].name;

        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageBase64 = {
            image: e.target.result,
            name: selectedImageName,
          };
          this.uploadImage();
        };
        reader.readAsDataURL(selectedImage);
      } else {
        console.log("File not selected");
      }
    },
    uploadImage() {
      this.$store
        .dispatch("user/uploadImage", {
          currentUser: this.currentUser,
          imageBase64: this.imageBase64,
        })
        .then((data) => {
          console.log({ data: data, status: true });
        })
        .catch((data) => {
          console.log({ data: data, status: false });
        });
    },
  },
};
</script>
