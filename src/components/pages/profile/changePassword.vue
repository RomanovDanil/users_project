<template>
  <v-app>
    <v-container fluid class="pa-0 ma-0">
      <v-row class="ma-0 pa-0">
        <v-col cols="12" sm="12" md="12" class="ma-0 pa-0">
          <v-card>
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Change password</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-row class="mx-0" justify="center">
              <v-col cols="12" class="text-left">
                <v-form v-model="isValid" align="center">
                  <v-text-field
                    label="Current password"
                    v-model="currentPassword"
                    prepend-icon="account_box"
                    :rules="[(v) => !!v || 'First name is required']"
                    color="light-blue lighten-1"
                    required
                  >
                  </v-text-field>

                  <v-text-field
                    label="New password"
                    v-model="newPassword"
                    prepend-icon="account_box"
                    :rules="[(v) => !!v || 'Second name is required']"
                    color="light-blue lighten-1"
                    required
                  >
                  </v-text-field>

                  <v-text-field
                    label="Repeat new password"
                    v-model="repeat_newPassword"
                    prepend-icon="account_box"
                    :rules="[(v) => !!v || 'Third name is required']"
                    color="light-blue lighten-1"
                    required
                  >
                  </v-text-field>

                  <v-btn
                    color="light-blue lighten-2"
                    @click.native="ChangePassword()"
                    :disabled="!isValid"
                    :loading="loading"
                  >
                    Change
                  </v-btn>
                </v-form>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "ChangePassword",
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  data: () => ({
    selectedItem: 0,
    isValid: true,
    loading: false,
    currentPassword: "",
    newPassword: "",
    repeat_newPassword: "",
  }),
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    console.log(this.currentUser);
  },
  methods: {
    async ChangePassword({
      currentPassword,
      newPassword,
      repeat_newPassword,
    }) {},
  },
};
</script>
