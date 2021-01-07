<template>
  <v-app>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" sm="12" md="6" class="ma-0">
          <v-row class="mx-0">
            <v-col cols="12" class="text-left">
              <UsersEventsTable />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import UsersEventsTable from "@/components/UsersEventsTable";
export default {
  name: "UsersEvents",
  components: { UsersEventsTable },
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
  },
  data: () => ({}),
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
  },
  methods: {
    async setPageName() {
      this.$store.dispatch("pages/setPageName", "Assign");
    },
  },
};
</script>
