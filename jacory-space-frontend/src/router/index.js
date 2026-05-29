import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import VideoParser from '../views/VideoParser.vue'
import About from '../views/About.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/video-parser',
    name: 'VideoParser',
    component: VideoParser
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
