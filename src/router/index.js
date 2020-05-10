import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import SearchBirds from '../views/Search.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/lintuhaku',
    name: 'Home',
    component: Home
  },
  {
    path: '/lintuhaku/puhu',
    name: 'SearchBirds',
    component: SearchBirds
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
