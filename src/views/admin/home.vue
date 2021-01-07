<template>
  <v-app>
    <v-container fluid>
      <v-row class="ma-0 pa-0" justify="center">
        <v-col cols="12" sm="12" md="5">
          <v-row class="mx-0">
            <v-col cols="12" sm="12" md="4">
              <v-card>
                <v-app-bar flat>
                  <v-toolbar-title class="title grey--text">
                    Users
                  </v-toolbar-title>
                </v-app-bar>
                <v-list nav dense class="text-left">
                  <v-list-item-group
                    active-class="deep-purple--text text--accent-4"
                  >
                    <v-list-item router to="/users">
                      <v-list-item-title>Browse</v-list-item-title>
                    </v-list-item>
                    <v-list-item router to="/users/create">
                      <v-list-item-title>Create</v-list-item-title>
                    </v-list-item>
                    <v-list-item router to="/events/assign">
                      <v-list-item-title>Assign</v-list-item-title>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </v-col>
            <v-col cols="12" sm="12" md="4">
              <v-card
                ><v-app-bar flat>
                  <v-toolbar-title class="title grey--text">
                    Events
                  </v-toolbar-title>
                </v-app-bar>

                <v-list nav dense class="text-left">
                  <v-list-item-group
                    active-class="deep-purple--text text--accent-4"
                  >
                    <v-list-item router :to="{ name: 'Events' }">
                      <v-list-item-title>Browse</v-list-item-title>
                    </v-list-item>
                    <v-list-item router :to="{ name: 'Events.Create' }">
                      <v-list-item-title>Create</v-list-item-title>
                    </v-list-item>
                    <v-list-item router :to="{ name: 'Events.Assign' }">
                      <v-list-item-title>Assign</v-list-item-title>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </v-col>
            <v-col cols="12" sm="12" md="4"
              ><v-card
                ><v-app-bar flat>
                  <v-toolbar-title class="title grey--text">
                    Documents
                  </v-toolbar-title>
                </v-app-bar>
                <v-list nav dense class="text-left">
                  <v-list-item-group
                    active-class="deep-purple--text text--accent-4"
                  >
                    <v-list-item router to="/documents">
                      <v-list-item-title>Browse</v-list-item-title>
                    </v-list-item>
                    <v-list-item router to="/documents/create">
                      <v-list-item-title>Create</v-list-item-title>
                    </v-list-item>
                    <v-list-item router to="/documents/download">
                      <v-list-item-title>Download</v-list-item-title>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "Home",
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
    this.$store.dispatch("pages/setPageName", "Home");
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }

    const isAdmin = this.$store.getters["auth/isAdmin"];
    if (!isAdmin) {
      this.$router.push("/event");
    }
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
