import Vue from 'vue'
import Vuex from 'vuex'
import authentication from './authentication'
import tasks from './tasks'
import alert from './alert'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

/* If you don't know about Vuex, please refer to https://vuex.vuejs.org/ */

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    plugins: [createPersistedState({
        key: 'vuex',
        reducer(val) {
            if (val.user === null) { // val.user.token 
                return {}
            }
            return val
        }
    })],
    modules: {
        alert,
        authentication,
        tasks,
    },
})