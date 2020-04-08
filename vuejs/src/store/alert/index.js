const state = {
    type: null,
    message: null
};

const actions = {
    success({ commit }, message) {
        commit('success', message);
    },
    error({ commit }, message) {
        commit('error', message);
    },
    clear({ commit }) {
        commit('clear');
    }
};


const getters = {

};

const mutations = {
    success(state, message) {
        state.type = 'primary';
        state.message = message;
    },
    error(state, message) {
        state.type = 'danger';
        state.message = message;
    },
    clear(state) {
        state.type = null;
        state.message = null;
    }
};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters,
};