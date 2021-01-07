<template>
  <v-dialog v-model="dialogRemove" persistent max-width="600px">
    <v-card class="px-3 pt-3 text-left" v-if="dialogRemove">
      <v-row class="ma-0">
        <v-col cols="12" md="12" xs="12" sm="12" class="">
          <v-card-title>
            Do you confirm the user's removal from the event?
          </v-card-title>
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
          @click="remove"
          :disabled="loading"
          :loading="loading"
        >
          Remove
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "RemoveUserFromEvent",
  props: [
    "selectedItem",
    "dialogRemove",
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
      this.$emit("update:dialogRemove", false);
    },
    async remove() {
      this.loading = true;
      console.log(this.selectedItem);
      await this.$store
        .dispatch("event/remove", {
          currentUser: this.currentUser,
          userId: this.selectedItem._id,
          eventId: this.selectedItem.currentEvent._id,
        })
        .then(() => {
          try {
            let event = this.events.find(
              (event) => event._id === this.selectedItem.currentEvent._id
            );
            let assignedUserIndex = event.participants.findIndex(
              (assignedUser) => assignedUser.user === this.selectedItem._id
            );
            event.participants.splice(assignedUserIndex, 1);
            this.selectedItem.currentEvent = undefined;
            this.$emit("update:events", this.events);
            this.$emit("update:snackbar", true);
            this.$emit("update:snackbar_color", "success");
            this.$emit(
              "update:snackbar_message",
              "User is successfully removed from the event"
            );
            this.$emit("update:selectedItem", this.selectedItem);
            this.$emit("update:dialogRemove", false);
          } catch (e) {
            console.log(e.message);
            throw new SyntaxError("Error. Please, refresh page");
          }
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
