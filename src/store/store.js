import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    authenticated: false,
    user: {}
  },
  mutations: {
    setAuthenticated(state, status) {
      state.authenticated = status;
    },
    setUser(state, user) {
      state.user = user;
    }
  },
  getters: {
    authenticated: state => state.authenticated,
    user: state => state.user
  }
});
