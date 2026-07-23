import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import MediaParserSoftware from '../views/MediaParserSoftware.vue'
import About from '../views/About.vue'
import Blog from '../views/Blog.vue'
import BlogPost from '../views/BlogPost.vue'
import Tools from '../views/Tools.vue'
import MinecraftSkinEditor from '../views/MinecraftSkinEditor.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/tools/media-parser',
    name: 'MediaParser',
    component: MediaParserSoftware
  },
  {
    path: '/media-parser',
    redirect: '/tools/media-parser'
  },
  {
    path: '/video-parser',
    redirect: '/tools/media-parser'
  },
  {
    path: '/podcast-parser',
    redirect: '/tools/media-parser'
  },
  {
    path: '/tools',
    name: 'Tools',
    component: Tools
  },
  {
    path: '/tools/minecraft-skin-editor',
    name: 'MinecraftSkinEditor',
    component: MinecraftSkinEditor
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
