import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import register from '../views/register.vue'
import index from '../views/index.vue'
import my from '../views/my.vue'
import myBlog from '../views/myBlog.vue'
import principal from '../views/principal.vue'
import release from '../component/release.vue'
import login from '../views/login.vue'
import love from '../views/love.vue'
import weibo from '../views/weibo.vue'
import editProfile from '../views/editProfile.vue'
import follow from '../views/follow.vue'
import userBlog from '../views/userBlog.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/index',
    name: 'index',
    component: index
  },
  {
    path: '/',
    name: 'index',
    component: index,
    // beforeEnter: (to,form,next)=>{
    //   const store = window.sessionStorage.getItem('store')
    //   if (store) return next('/principal')
    //   if (!store) return next('/')
    // }
  },
  {
    path: '/register',
    name: 'register',
    component: register,
  },
  {
    path: '/Home',
    name: 'Home',
    component: Home
  }, {
    path: '/my',
    name: 'my',
    component: my
  },
  {
    path: '/principal',
    name: 'principal',
    component: principal
    
  },
  {
    path: '/myBlog',
    name: 'myBlog',
    component: myBlog
  },
  {
    path: '/release',
    name: 'release',
    component: release
  },
  {
    path: '/login',
    name: 'login',
    component: login,
    beforeEnter: (to,form,next)=>{
      const store = window.sessionStorage.getItem('store')
      if (store) return next('/principal')
      if(!store) return next('/login')
    }
  },
  {
    path: '/love',
    name: 'love',
    component: love
  },
  {
    path: '/weibo/',
    name: 'weibo',
    component: weibo
  },
  {
    path: '/editProfile/',
    name: 'editProfile',
    component: editProfile
  },
  {
    path: '/follow',
    name: 'follow',
    component: follow
  },
  {
    path: '/userBlog',
    name: 'userBlog',
    component: userBlog
  }
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// ????????????????????????
router.beforeEach((to, from, next) => {
  // to ?????????????????????
  // from ?????????????????????????????????
  // next ??????????????????????????????
  //     next()  ??????    next('/login')  ????????????

  if (to.path === '/login') return next()
  if (to.path === '/') return next()
  if (to.path === '/register') return next()
  // ??????store????????????
  const store = window.sessionStorage.getItem('store')
  if (!store) return next('/')
  next()
})

export default router
