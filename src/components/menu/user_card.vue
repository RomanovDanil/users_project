<template>
  <v-card class="mx-auto" tile outlined flat elevation="1" v-if="currentUser">
    <v-navigation-drawer permanent>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-img
              :src="`http://localhost:5000/user_images/` + `873-536x354.jpg`"
            ></v-img>
          </v-list-item-avatar>
          <v-list-item-content class="text-left">
            <v-list-item-title class="title">
              {{ currentUser.userData.firstName }}<br />
              {{ currentUser.userData.thirdName }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ currentUser.email }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item-group color="primary" class="text-left">
          <v-list-item router to="/event">
            <v-list-item-content>
              <v-list-item-title>Event</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item router to="/profile">
            <v-list-item-content>
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
export default {
  name: "UserCard",
  props: ["currentUser"],
  data: () => ({
    selectedItem: 0,
  }),
  created() {},
  mounted() {
    console.log(this.currentUser);
  },
  methods: {},
};
</script>
