import * as types from '../type'
import * as utils from '@utils'

const user = {
    state: {
        userInfo: null,
    },
    getters: {
        userInfo: state => state.userInfo
    },
    mutations: {
        // 设置用户信息
        [types.SET_USERINFO] ( state , userInfo ) {
            utils.setLocalStorage('userInfo',userInfo)
            state.userInfo = utils.getLocalStorage('userInfo')
        }
    },
    actions: {
        
    }
}
export default user