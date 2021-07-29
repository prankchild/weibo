import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// const 
export default new Vuex.Store({
  state : {
    user:{
      user_id:'',
      token: ''
    }
  },
  // 唯一赋值的方法,同步阻塞
  mutations: {
    updateUser(state,user) {
      state.user = user;
    }
  },
  // 异步调用mutations方法
  actions: {
    asyncUpdateUser(context,user){
      context.commit('updateUser',user);
    }
  },
  modules: {
  },
  // 唯一取值的方法
  getters: {
    getUser(state){
      return state.user;
    }
  },
})
