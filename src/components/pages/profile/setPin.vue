<template>
  <v-app>
    <v-container fluid class="pa-0 ma-0">
      <v-row class="ma-0 pa-0">
        <v-col cols="12" sm="12" md="12" class="ma-0 pa-0">
          <v-card>
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title
                >Set personal identification number</v-toolbar-title
              >
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-row class="mx-0" justify="center">
              <v-col cols="12" class="text-left">
                <v-form v-model="isValid" align="center">
                  <v-text-field
                    label="PIN"
                    v-model="newPIN"
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
  data: () => ({
    selectedItem: 0,
    isValid: true,
    loading: false,
    newPIN: "",
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
    setPIN(newPIN) {},
  },
};
</script>
