<template>
  <v-dialog v-model="dialogAssign" persistent max-width="600px">
    <v-card class="px-3 pt-3 text-left" v-if="dialogAssign">
      <v-row class="ma-0">
        <v-col cols="12" md="12" xs="12" sm="12" class="">
          <div class="caption grey--text">User</div>
          <div>
            {{ selectedItem.userData.firstName }}
            {{ selectedItem.userData.secondName }}
            {{ selectedItem.userData.thirdName }}
          </div>
        </v-col>
        <v-col cols="12" md="12" xs="12" sm="12" class="">
          <div class="caption grey--text">Event</div>
          <div>{{ selectedItem.selectedEvent.title }}</div>
        </v-col>
        <v-col cols="12" md="12" xs="12" sm="12" class="">
          <div class="caption grey--text">Role</div>
          <div>{{ selectedItem.selectedRole.name }}</div>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close" :disabled="loading">
          Cancel
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="assign"
          :disabled="loading"
          :loading="loading"
        >
          Assign
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "AssignUserToEvent",
  props: [
    "selectedItem",
    "dialogAssign",
    "snackbar",
    "snackbar_message",
    "snackbar_color",
    "currentUser",
    "events",
  ],
  data: () => ({
    dialog: false,
    loading: false,
    isValid: false,
  }),
  methods: {
    formatDate(date) {
      if (!date) return "";

      const [year, month, day] = date.split("T")[0].split("-");
      return `${day}/${month}/${year}`;
    },
    close() {
      this.$emit("update:dialogAssign", false);
    },
    async assign() {
      this.loading = true;
      await this.$store
        .dispatch("event/assign", {
          currentUser: this.currentUser,
          userId: this.selectedItem._id,
          eventId: this.selectedItem.selectedEvent._id,
          roleId: this.selectedItem.selectedRole._id,
        })
        .then(() => {
          this.selectedItem.selectedEvent.participants.push({
            user: this.selectedItem._id,
            role: this.selectedItem.selectedRole,
          });
          this.selectedItem.currentEvent = this.selectedItem.selectedEvent;
          this.selectedItem.selectedRole = undefined;
          this.selectedItem.selectedEvent = undefined;
          this.$emit("update:snackbar", true);
          this.$emit("update:snackbar_color", "success");
          this.$emit(
            "update:snackbar_message",
            "User is successfully assigned to the event"
          );
          this.$emit("update:selectedItem", this.selectedItem);
          this.$emit("update:dialogAssign", false);
        })
        .catch((error) => {
          this.$emit("update:snackbar_color", "error");
          this.$emit("update:snackbar_message", error.message);
          this.$emit("update:snackbar", true);
        });
      this.loading = false;
    },
  },
};
</script>

<style>
.assign {
  border-left: 4px solid greenyellow;
}
</style>
