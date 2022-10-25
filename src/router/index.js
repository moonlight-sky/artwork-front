import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue' 
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/User.vue'
import Person from '../components/user/Person.vue'
import Goods from '../components/Goods.vue'
import Cat from '../components/Cat.vue'
import Comment from '../components/Comment.vue'
import Index from '../components/Index.vue'
import Detail from '../components/client/Detail.vue'

Vue.use(VueRouter)

const routes = [
  { path:"/",redirect:"/index" },
  { path:"/login",component: Login },
  { path:"/index",component: Index },
  { path:"/detail",component:Detail},  

  {
    path:"/home",
    redirect:"/welcome",
    component: Home,
    children: [
      { path:'/welcome',component:Welcome},
      { path:'/user',component:User},
      { path:'/person',component:Person},
      { path:'/goods',component:Goods},
      { path:'/cat',component:Cat},
      { path:'/comment',component:Comment}
    ]
  },
  // { path:"/index",component:Index}
] 

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to 将要访问的路径
  //from 代表从哪个路径跳转而来
  //next 是一个函数，表示放行
  //  next() 放行   next('/login') 强制跳转
  
  if(to.path == '/index') return next()
  if(to.path == '/login') return next()
  //获取user
  const UserFlag = window.sessionStorage.getItem('user')
  const PersonFlag = window.sessionStorage.getItem('person')
  if(!UserFlag || !PersonFlag) return next()
  next()
})

export default router
