import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import app from './modules/app'
import auth from './modules/auth'
import baseData from './modules/baseData'

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules:{
        user,
        app,
        auth,
        baseData
    }
})

export default store