<template>
  <v-card>
    <v-data-table
      dense
      :headers="headers"
      :items="sortedUsersEvents"
      :loading="usersLoading"
      loading-text="Loading... Please wait"
      item-key="_id"
      class="elevation-1"
      :hide-default-footer="false"
      v-if="loadedSuccess"
    >
      <template v-slot:[`item.user`]="{ item }">
        {{ item.userData.firstName }} {{ item.userData.secondName }}
        {{ item.userData.thirdName }}
      </template>
      <template v-slot:[`item.event`]="{ item }">
        <v-select
          v-if="!item.currentEvent"
          :items="events"
          v-model="item.selectedEvent"
          placeholder="Event"
          item-text="title"
          return-object
          flat
          clearable
          :ref="item._id"
          :error="item.errorEvent"
          :rules="event_rules"
          @change="handleChangeEvent(item)"
        ></v-select>
        <v-chip v-else>
          {{
            events.find((event) => event._id === item.currentEvent._id).title
          }}
        </v-chip>
      </template>
      <template v-slot:[`item.role`]="{ item }">
        <v-select
          v-if="!item.currentEvent"
          v-model="item.selectedRole"
          :items="roles"
          placeholder="Role"
          item-text="name"
          return-object
          flat
          clearable
          :rules="role_rules"
          :error="item.errorRole"
          @change="handleChangeRole(item)"
        ></v-select>
        <v-chip v-else>
          {{
            events
              .find((event) => event._id === item.currentEvent._id)
              .participants.find(
                (assignedUser) => assignedUser.user === item._id
              ).role.name
          }}
        </v-chip>
      </template>
      <template v-slot:[`item.assign`]="{ item }">
        <v-btn
          text
          color="success"
          v-if="item.currentEvent == null || item.currentEvent == undefined"
          @click="assign(item)"
        >
          Assign
        </v-btn>
        <v-btn text color="error" v-else @click="remove(item)">
          Remove
        </v-btn>
      </template>
      <template v-slot:top>
        <AssignUserToEvent
          v-bind:dialogAssign.sync="dialogAssign"
          v-bind:currentUser="currentUser"
          v-bind:snackbar.sync="snackbar"
          v-bind:snackbar_message.sync="snackbar_message"
          v-bind:snackbar_color.sync="snackbar_color"
          v-bind:selectedItem.sync="selectedItem"
        />
        <RemoveUserFromEvent
          v-bind:dialogRemove.sync="dialogRemove"
          v-bind:currentUser="currentUser"
          v-bind:snackbar.sync="snackbar"
          v-bind:snackbar_message.sync="snackbar_message"
          v-bind:snackbar_color.sync="snackbar_color"
          v-bind:selectedItem.sync="selectedItem"
          v-bind:events.sync="events"
        />
      </template>
    </v-data-table>
    <v-card-text v-else>
      Events not found
    </v-card-text>
    <v-snackbar
      timeout="6000"
      bottom="bottom"
      :color="snackbar_color"
      v-model="snackbar"
    >
      {{ snackbar_message }}
    </v-snackbar>
  </v-card>
</template>

<script>
import AssignUserToEvent from "@/components/AssignUserToEvent";
import RemoveUserFromEvent from "@/components/RemoveUserFromEvent";
import EventService from "@/services/event_service";
export default {
  name: "UsersEvents",
  //props: ["users", "events", "roles"],
  components: { AssignUserToEvent, RemoveUserFromEvent },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    sortedUsersEvents() {
      return this.users.slice().sort((a, b) => {
        if (this.isEmpty(a.currentEvent) !== this.isEmpty(b.currentEvent)) {
          return this.isEmpty(a.currentEvent) ? -1 : 1;
        } else {
          return a.created_at > b.created_at ? 1 : -1;
        }
      });
    },
    headers() {
      return [
        {
          text: "User",
          align: "start",
          value: "user",
          class: "title",
          sortable: false,
        },
        {
          text: "Event",
          value: "event",
          class: "title",
          sortable: false,
        },
        {
          text: "Role",
          value: "role",
          class: "title",
          sortable: false,
        },
        {
          text: "Assign",
          value: "assign",
          class: "title",
          sortable: false,
        },
      ];
    },
  },
  created() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    this.loadUsersEvents();
  },
  data: () => ({
    errors: {},
    dialogAssign: false,
    dialogRemove: false,
    usersLoading: false,
    snackbar: false,
    snackbar_message: "",
    snackbar_color: "",
    selectedItem: null,
    event_rules: [(v) => !!v || "Event is required"],
    role_rules: [(v) => !!v || "Role is required"],
    loadedSuccess: true,
    users: [],
    roles: [],
    events: [],
  }),
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return "";
      const [year, month, day] = date.split("T")[0].split("-");
      return `${day}/${month}/${year}`;
    },
    async loadUsersEvents() {
      this.usersLoading = true;
      await EventService.getAssignedUsers(this.currentUser)
        .then((response) => {
          this.users = response.data.users;
          this.events = response.data.events;
          this.roles = response.data.roles;
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.data.message)
              this.snackbar_message = error.response.data.message;
          } else {
            this.snackbar_color = "red lighten-1";
            this.snackbar_message = error.message;
          }
          this.snackbar = true;
          this.loadedSuccess = false;
        });
      this.usersLoading = false;
    },
    assign(item) {
      let error = false;
      if (this.isEmpty(item.selectedEvent)) {
        item.errorEvent = true;
        error = true;
      }

      if (this.isEmpty(item.selectedRole)) {
        item.errorRole = true;
        error = true;
      }

      this.selectedItem = item;
      if (!error) {
        this.dialogAssign = true;
      }
    },
    remove(item) {
      if (item && item.currentEvent) {
        this.selectedItem = item;
        this.dialogRemove = true;
      }
    },
    handleChangeEvent(item) {
      if (item) {
        item.errorEvent = false;
      }
    },
    handleChangeRole(item) {
      if (item) {
        item.errorRole = false;
      }
    },
    isEmpty(value) {
      return value === null || value === undefined || value === "";
    },
  },
};
</script>
