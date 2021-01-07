<template>
  <nav v-if="currentUser">
    <v-app-bar flat color="accent-4">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"
        ><v-icon>menu</v-icon></v-app-bar-nav-icon
      >
      <v-toolbar-title class="text-uppercase grey--text">
        <span class="font-weight-light">{{ pageName }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text color="grey" @click="signOut">
        <span>Sign Out</span>
        <v-icon right>exit_to_app</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      bottom
      temporary
      class="text-left"
    >
      <v-list>
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-img
              aspect-ratio="1"
              v-if="
                currentUser.userData.image == null ||
                  currentUser.userData.image == ''
              "
              :src="`http://localhost:5000/user_images/` + `default.jpg`"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
            <v-img
              v-else
              aspect-ratio="1"
              :src="
                `http://localhost:5000/user_images/` +
                  currentUser.userData.image
              "
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-list-item-avatar>
        </v-list-item>

        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="title">
              {{ currentUser.userData.firstName }}
              {{ currentUser.userData.secondName }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ currentUser.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item-group active-class="deep-purple--text text--accent-4">
          <v-list-item
            v-for="link in links"
            :key="link.text"
            router
            :to="link.route"
          >
            <v-list-item-icon>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  props: ["currentUser"],
  data: () => ({
    drawer: false,
    links: [],
  }),
  computed: {
    pageName() {
      return this.$store.state.pages.page_name;
    },
  },
  created() {
    if (this.currentUser) {
      if (this.currentUser.isAdmin) {
        this.links = [
          {
            text: "Profile",
            icon: "perm_identity",
            route: "/profile",
            sublinks: null,
          },
          {
            text: "Home",
            icon: "home",
            route: "/home",
            sublinks: null,
          },
        ];
      } else {
        this.links = [
          {
            text: "Profile",
            icon: "perm_identity",
            route: "/profile",
            sublinks: null,
          },
          {
            text: "Event",
            icon: "event",
            route: "/user_event",
            sublinks: null,
          },
        ];
      }
    }
  },
  mounted() {},
  beforeUpdate() {},
  updated() {},
  methods: {
    signOut() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/login");
    },
  },
};
</script>
