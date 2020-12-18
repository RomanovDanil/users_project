<template>
  <v-app>
    <v-container fluid class="pa-0 ma-0">
      <v-row class="ma-0 pa-0">
        <v-col cols="12" sm="12" md="12" class="ma-0 pa-0">
          <v-card>
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Profile</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                depressed
                color="primary"
                fab
                small
                @click.native="submitExit()"
              >
                <v-icon>
                  exit_to_app
                </v-icon>
              </v-btn>
            </v-toolbar>
            <v-row class="mx-0">
              <v-col cols="5">
                <v-img
                  :src="
                    `http://localhost:5000/user_images/` + `873-536x354.jpg`
                  "
                >
                </v-img>
                <v-row class="space-between">
                  <v-col class="mx-0" cols="6"
                    ><v-btn color="success" text @click.native="uploadImage()"
                      >upload</v-btn
                    ></v-col
                  >
                  <v-col class="mx-0" cols="6"
                    ><v-btn color="error" text @click.native="deleteImage()"
                      >delete</v-btn
                    ></v-col
                  >
                </v-row>
              </v-col>
              <v-col cols="7" class="text-left">
                <v-row class="flex-column mr-0">
                  <v-card tile outlined flat elevation="1">
                    <v-app-bar flat>
                      <v-toolbar-title class="title black--text pl-0">
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
                      <v-toolbar-title class="title black--text">
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
                  <v-card class="mt-3" elevation="1" tile outlined flat>
                    <v-app-bar flat>
                      <v-toolbar-title class="title black--text">
                        Personal identification number
                      </v-toolbar-title>
                    </v-app-bar>
                    <v-row class="px-5">
                      <v-col>
                        <strong>PIN: {{ currentUser.userData.pin }} </strong>
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
                  </v-card>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "Profile",
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
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
      this.$router.push("/profile/changeProfileInformation");
    },
    changePassword() {
      this.$router.push("/profile/changePassword");
    },
    setPin() {
      this.$router.push("/profile/setPin");
    },
  },
};
</script>
