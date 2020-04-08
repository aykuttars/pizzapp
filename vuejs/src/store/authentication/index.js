import { userHelper } from '@/misc/user_helper';
import router from '@/router';

function isNil(value) {
    return value == null;
}

const state = {
    user: undefined,
    username: "",
    password: "",
    passwordAgain: "",
}


const getters = {
  isUserLoggedIn: state => !isNil(state.user)
}

const actions = {
    login: async ({commit, dispatch, state}) => {
        userHelper.login(state.username, state.password)
            .then(
                user => {
                    commit('loginSuccess', user);
                    // router.push('/');
                },
                error => {
                    commit('clear');
                    dispatch('alert/error', error, { root: true });
                }
            );
    },
    logout: async ({ commit }) => {
        userHelper.logout();
        commit('clear');
        router.push('/login');
    },
    register: async ({ dispatch, commit, state }) => {
        
        const newUser = {
            username: state.username,
            email: state.email,
            password: state.password,
            passwordAgain: state.passwordAgain,
        }
        userHelper.register(newUser)
            .then(
                result => {
                    if (Object.keys(result).length > 0) {
                        dispatch('alert/error', result, { root: true });

                    }
                    commit('clear');
                    router.push('/login');
                    setTimeout(() => {
                        // display success message after route change completes
                        dispatch('alert/success', 'Registration successful', { root: true });
                    })
                },
                error => {
                    commit('clear');
                    dispatch('alert/error', error, { root: true });
                }
            );
    }
}

const mutations = {
    setUsername: (state, username) =>
        (state.username = username),
    setPassword: (state, password) =>
        (state.password = password),
    setPasswordAgain: (state, passwordAgain) =>
        (state.passwordAgain = passwordAgain),
    loginSuccess(state, user) {
        state.user = user;
        state.username = user.username;
        state.password = "";
        state.passwordAgain = "";
    },
    clear(state) {
        state.user = null;
        state.username = "";
        state.password = "";
        state.passwordAgain = "";
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};