import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import SearchByName from '../views/SearchByName.vue'
import SearchByCharacteristics from '../views/SearchByCharacteristics.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/lintuhaku-nimella',
    name: 'SearchByName',
    component: SearchByName
  },
  {
    path: '/lintuhaku-tuntomerkeilla',
    name: 'SearchByCharacteristics',
    component: SearchByCharacteristics
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
