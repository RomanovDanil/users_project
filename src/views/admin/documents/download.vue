<template>
  <v-app>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" sm="12" md="6" class="ma-0">
          <v-row class="mx-0">
            <v-col cols="12">
              <v-app id="inspire">
                <v-data-table
                  :headers="headers"
                  :items="documents"
                  item-key="_id"
                  group-by="event._id"
                >
                  <template v-slot:[`group.header`]="{ items, isOpen, toggle }">
                    <th colspan="3" class="ma-0 pa-0">
                      <v-app-bar flat class="pa-0">
                        <v-icon @click="toggle" class="mr-2"
                          >{{ isOpen ? "mdi-minus" : "mdi-plus" }}
                        </v-icon>
                        {{ items[0].event.title }}
                        <v-spacer></v-spacer>
                        <v-btn text small @click.native="downloadAll(items)">
                          Download All
                        </v-btn>
                      </v-app-bar>
                    </th>
                  </template>

                  <template v-slot:[`item.event`]="{ item }">
                    {{ item.event.title }}
                  </template>
                  <template v-slot:[`item.action`]="{ item }">
                    <v-btn icon @click.native="download(item)">
                      <v-icon>
                        {{ "mdi-download" }}
                      </v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-app>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import jsPDF from "jspdf";
export default {
  name: "DownlaodDocuments",
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    headers() {
      return [
        {
          text: "Title",
          align: "start",
          value: "title",
          sortable: false,
          //groupable: false,
        },
        {
          text: "Event",
          value: "event",
          sortable: false,
        },
        {
          value: "action",
          align: "end",
          sortable: false,
          groupable: false,
        },
      ];
    },
  },
  created() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    this.setPageName();
    this.loadDocuments();
  },
  data: () => ({
    loadedSuccess: true,
    documents: [],
    snackbar: false,
    snackbar_message: "",
    snackbar_color: "red lighten-1",
    groupBy: ["event"],
  }),
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
  },
  methods: {
    async setPageName() {
      this.$store.dispatch("pages/setPageName", "Documents");
    },
    async loadDocuments() {
      this.$store
        .dispatch("document/getAll", { currentUser: this.currentUser })
        .then((data) => {
          this.documents = data.documents;
        })
        .catch((error) => {
          this.snackbar_message = error.message;
          this.snackbar_color = "red lighten-1";
          this.snackbar = true;
        });
    },

    download(item) {
      let today = new Date();
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter",
      });
      var pageHeight =
        doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
      var pageWidth =
        doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

      doc.setFontSize(16).text(`Event: ${item.event.title}`, 0.5, 1.0);
      doc.setFontSize(16).text(`For role: ${item.for_role.name}`, 0.5, 1.3);
      doc
        .setFontSize(16)
        .text(`Day: ${item.day} (${item.stage} stage)`, 0.5, 1.6);
      doc
        .setFontSize(16)
        .text(
          `${today.getDate()}/${today.getMonth()}/${today.getFullYear()}`,
          7,
          1.0
        );
      doc.setLineWidth(0.01).line(0.5, 2.0, 8.0, 2.0);
      doc.setFontSize(16).text(`${item.title}`, pageWidth / 2, 2.5, {
        align: "center",
        maxWidth: "7.5",
      });
      doc
        .setFont("helvetica")
        .setFontSize(12)
        .text(item.content, 0.5, 3.5, { align: "left", maxWidth: "7.5" });
      doc.save(`${item.event.title}/${item.title}/${item.day}.pdf`);
    },

    downloadAll(items) {
      for (let i = 0; i < items.length; i++) {
        this.download(items[i]);
      }
    },
  },
};
</script>
