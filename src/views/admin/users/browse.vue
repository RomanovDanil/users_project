<template>
  <v-app>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" sm="12" md="6" class="ma-0 pa-0" v-if="loadedSuccess">
          <v-row class="mx-0">
            <v-col cols="12" class="text-left">
              <v-card-title>
                User's list
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="create">Create</v-btn>
              </v-card-title>
              <v-data-table
                dense
                :headers="headers"
                :items="users"
                :loading="usersLoading"
                loading-text="Loading... Please wait"
                item-key="email"
                class="elevation-1"
                :hide-default-footer="false"
                @click:row="handleRowClick"
              >
              </v-data-table>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" sm="12" md="6" class="ma-0 pa-0" v-else>
          <v-card-title>Users not found</v-card-title>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar
      timeout="6000"
      bottom="bottom"
      color="red lighten-1"
      v-model="snackbar"
    >
      {{ message }}
    </v-snackbar>
  </v-app>
</template>

<script>
import UserService from "@/services/user_service";
export default {
  name: "BrowseUsers",
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  created() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }

    this.setPageName();
    this.loadUsers();
  },
  data: () => ({
    headers: [
      { text: "Email", align: "start", sortable: true, value: "email" },
      { text: "First name", value: "userData.firstName", sortable: true },
      { text: "Second name", value: "userData.secondName", sortable: true },
      { text: "Third name", value: "userData.thirdName", sortable: true },
      { text: "Country", value: "userData.country.name", sortable: true },
      { text: "Is admin", value: "isAdmin", sortable: true },
    ],
    users: [],
    usersLoading: false,
    snackbar: false,
    message: "",
    loadedSuccess: true,
  }),
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
  },
  methods: {
    async loadUsers() {
      this.usersLoading = true;
      await UserService.getAll(this.currentUser)
        .then((response) => {
          this.users = response.data.users;
        })
        .catch((error) => {
          if (error.response.data.message) {
            this.message = error.response.data.message;
          } else {
            this.message = error.message;
          }
          this.loadedSuccess = false;
          this.snackbar = true;
        });
      this.usersLoading = false;
    },
    async setPageName() {
      this.$store.dispatch("pages/setPageName", "Users");
    },
    async create() {
      this.$router.push({
        name: "Users.Create",
      });
    },
    handleRowClick(value) {
      //console.log(value._id);
      this.$router.push({
        name: "Users.User",
        params: { userId: value._id },
      });
    },
  },
};
</script>
