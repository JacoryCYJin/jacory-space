import Home from '../views/Home.vue'
import MediaParserSoftware from '../views/MediaParserSoftware.vue'
import About from '../views/About.vue'
import Blog from '../views/Blog.vue'
import BlogPost from '../views/BlogPost.vue'
import Tools from '../views/Tools.vue'
import MinecraftSkinEditor from '../views/MinecraftSkinEditor.vue'
import Library from '../views/Library.vue'
import LibraryDetail from '../views/LibraryDetail.vue'
import RetroFuturismSignalStudy from '../views/RetroFuturismSignalStudy.vue'

export const routes = [
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
    path: '/library',
    name: 'Library',
    component: Library
  },
  {
    path: '/library/:id',
    name: 'LibraryDetail',
    component: LibraryDetail
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/experiments/retro-futurism',
    name: 'RetroFuturismSignalStudy',
    component: RetroFuturismSignalStudy
  }
]
