<template>
  <v-app>
    <v-container fluid>
      <v-row class="ma-0 pa-0" justify="center">
        <v-col cols="12" sm="12" md="5">
          <v-card>
            <v-row class="mx-0" justify="center">
              <v-col cols="12" class="text-left">
                <v-form v-model="isValid" align="center">
                  <v-text-field
                    label="PIN"
                    v-model="pin"
                    prepend-icon="lock"
                    :rules="pin_rules"
                    :type="'password'"
                    :maxlength="4"
                    color="light-blue lighten-1"
                    required
                  >
                  </v-text-field>

                  <v-btn
                    color="light-blue lighten-1"
                    @click.native="setPIN()"
                    :disabled="!isValid"
                    :loading="loading"
                  >
                    Set
                  </v-btn>
                </v-form>
              </v-col>
            </v-row>
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
import { mapGetters, mapActions } from "vuex";
export default {
  name: "SetPin",
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  created() {
    this.$store.dispatch(
      "pages/setPageName",
      "Set personal identification number"
    );
  },
  data: () => ({
    selectedItem: 0,
    isValid: true,
    loading: false,
    message: "",
    color: "",
    snackbar: false,
    pin: "",
    pin_rules: [
      (v) => !!v || "PIN is required",
      (v) => (v && v.length == 4) || "PIN must have 4 numbers",
      (v) => /([0-9])/.test(v) || "PIN must have only numbers",
    ],
  }),
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    console.log(this.currentUser);
  },
  methods: {
    async setPIN() {
      this.loading = true;
      await this.$store
        .dispatch("user/setPIN", {
          user: this.currentUser,
          pin: this.pin,
        })
        .then(() => {
          this.message = "PIN has been updated";
          this.color = "success";
          this.snackbar = true;
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.message) {
            this.message = error.response.data.message;
          } else {
            this.message = error.message;
          }
          this.color = "red lighten-1";
          this.snackbar = true;
        });
      this.loading = false;
    },
  },
};
</script>
