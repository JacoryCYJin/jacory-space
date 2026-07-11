import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import MediaParserSoftware from '../views/MediaParserSoftware.vue'
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
    path: '/media-parser',
    name: 'MediaParser',
    component: MediaParserSoftware
  },
  {
    path: '/video-parser',
    redirect: '/media-parser'
  },
  {
    path: '/podcast-parser',
    redirect: '/media-parser'
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
