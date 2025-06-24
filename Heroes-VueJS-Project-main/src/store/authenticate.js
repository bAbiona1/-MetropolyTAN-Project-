import {authenticate} from "@/services/auth.service";

export default {
    namespaced: true,
    state: {
        token: null
    },
    mutations: {
        setToken(state, token) {
            console.log(token)
            state.token = token;
        },
    },
    actions: {
        async authenticateTry({ commit }, data) {
            try {
                const result = await authenticate(data);
                commit("setToken", result.data.token);
            } catch (error) {
                console.error("Authentication error:", error);
                throw error;
            }
        },
    },
};