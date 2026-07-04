import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import VideoParser from '../views/VideoParser.vue'
import PodcastParser from '../views/PodcastParser.vue'
import About from '../views/About.vue'
import Blog from '../views/Blog.vue'
import BlogPost from '../views/BlogPost.vue'
import Tools from '../views/Tools.vue'

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
    path: '/podcast-parser',
    name: 'PodcastParser',
    component: PodcastParser
  },
  {
    path: '/tools',
    name: 'Tools',
    component: Tools
  },
  {
    path: '/blog',
    name: 'Blog',
    component: Blog
  },
  {
    path: '/blog/:slug',
    name: 'BlogPost',
    component: BlogPost
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
