import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import data from "@/store/data";
import errors from "@/store/errors";
import authenticate from "@/store/authenticate";
export default new Vuex.Store({
    modules: {
        data,
        errors,
        authenticate,
    },
});