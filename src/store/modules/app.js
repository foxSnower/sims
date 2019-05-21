import * as types from '../type'
import * as utils from '@utils'

const app = {
  state: {
    //主题
    localTheme: utils.getLocalStorage('localTheme') || {themeColor:'#56C499',themeColorDeep:''},
    asideWidth: '250px',
    menuList: utils.getLocalStorage('menu') || [],
    showTabsArray: utils.getLocalStorage('showTabsArray') || [{
      name: '/welcome',
      title: '欢迎页',
      url:'Common/Welcome',
      curTab: 1
    }],
    openedSubmenuArr: [],
    pageOpenedList: [{
      name: 'system_manage',
      title: '系统管理',
      icon: 'ios-gear',
    }]
  },
  getters: {
    localTheme: state => state.localTheme,
    asideWidth: state => state.asideWidth,
    menuList: state => state.menuList,
    showTabsArray: state => state.showTabsArray,
    openedSubmenuArr: state => state.openedSubmenuArr,
    shrink: state => state.shrink
  },
  mutations: {
    // 设置主题颜色
    [types.LOCAL_THEME](state, localTheme) {
      utils.setLocalStorage('localTheme', localTheme)
      state.localTheme = localTheme
    },
    // 设置导航的宽度
    [types.ASIDE_WIDTH](state, width) {
      state.asideWidth = width
    },

    // 设置菜单
    [types.SET_MENU](state, menu) {
      utils.setLocalStorage('menu', menu)
      state.menuList = utils.getLocalStorage('menu')
    },

    // 设置页签
    [types.SET_TABS_ARRAY](state, showTabsArray) {
      utils.setLocalStorage('showTabsArray', showTabsArray)
      state.showTabsArray = utils.getLocalStorage('showTabsArray')
    },

    // 设置展开的子菜单
    [types.ADD_OPEN_SUBMENU](state, name) {
      let hasThisName = false;
      let isEmpty = false;
      if (name.length === 0) {
        isEmpty = true;
      }
      const openedSubParentArr = utils.getSubMenuArr(state.menuList, name)
      if (openedSubParentArr.sort().toString() == state.openedSubmenuArr.sort().toString()) {
        hasThisName = true
      }
      if (!hasThisName && !isEmpty) {
        state.openedSubmenuArr = openedSubParentArr
      }
    },

    // 路由一旦变化则修改页面标签数组
    [types.OPEN_NEW_PAGE](state, to) {
      const routerObj = to.currentPathObj
      let pageOpenedList = state.pageOpenedList;
      let len = pageOpenedList.length;
      let i = 0;
      if (i < len) {
        console.log(routerObj.name)
        if (utils.oneOf(routerObj, pageOpenedList)) {
          console.log('true')
        } else {
          console.log('false')
        }
      }
      console.log(routerObj)
    }
  },
  actions: {

  }
}
export default app
