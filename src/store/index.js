import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    authToken: '',
    projects: [],
    currentProject: {},
    sequences: [],
    editorCurrentTab: 0
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload;
      window.localStorage.setItem('user', JSON.stringify(payload));
    },
    setAuthToken(state, payload) {
      state.authToken = payload;
      window.localStorage.setItem('authToken', payload);
    },
    setEditorCurrentTab(state, payload) {
      state.editorCurrentTab = payload;
    },
    setSequences(state, payload) {
      state.sequences = payload;
    },
    setSequence(state, payload) {
      state.sequences[payload.idx] = payload.sequence;
    },
    setCurrentProject(state, payload) {
      state.currentProject = payload;
    }
  },
  actions: {
  },
  modules: {
  }
})
