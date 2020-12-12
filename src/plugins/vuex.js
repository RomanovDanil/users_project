import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/store/modules/user'
import userData from '@/store/modules/userData'
import countries from '@/store/modules/countries'
import {auth} from '@/store/modules/auth'

Vue.use(Vuex)

export default new Vuex.Store({
    modules:{
        user,
        userData,
        countries,
        auth
    }
})