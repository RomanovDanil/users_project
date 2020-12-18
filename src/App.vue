<template>
  <v-app>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="2" md="2" sm="12">
          <UserCard v-bind:currentUser="currentUser" />
        </v-col>
        <v-col cols="6" md="6" sm="12">
          <v-main>
            <router-view />
          </v-main>
        </v-col>
        <v-col cols="2" md="2" sm="12"> </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import UserCard from "@/components/menu/user_card";
export default {
  name: "app",
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  components: {
    UserCard,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
