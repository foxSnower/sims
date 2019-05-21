import * as types from '../type'
import * as utils from '@utils'

const auth = {
    state: {
        authInfo: utils.getLocalStorage('authInfo') || [],
    },
    getters: {
        authInfo: state => state.authInfo
    },
    mutations: {
        // 设置权限信息
        [types.SET_AUTHINFO] ( state , authInfo ) {
            utils.setLocalStorage('authInfo',authInfo)
            state.authInfo = authInfo
        }
    },
    actions: {
        
    }
}
export default auth