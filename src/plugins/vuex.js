import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/store/modules/user'
import userData from '@/store/modules/userData'
import country from '@/store/modules/country'
import {auth} from '@/store/modules/auth'

Vue.use(Vuex)

export default new Vuex.Store({
    modules:{
        user,
        userData,
        country,
        auth
    }
})