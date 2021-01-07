import Vue from "vue";
import Vuex from "vuex";
import user from "@/store/modules/user";
import { event } from "@/store/modules/event";
import { document } from "@/store/modules/document";
import country from "@/store/modules/country";
import role from "@/store/modules/role";
import pages from "@/store/modules/pages";
import { auth } from "@/store/modules/auth";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    event,
    country,
    auth,
    pages,
    role,
    document,
  },
});
