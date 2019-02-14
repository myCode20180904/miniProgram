import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import mainPage from '@/pages/mainPage'

Vue.use(Router)

export default new Router({
  routes: [
    {path:'/',name:'mainPage',component:mainPage},
    {path:'/HelloWorld',name:'HelloWorld',component:HelloWorld}
  ]
})
