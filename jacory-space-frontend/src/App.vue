<template>
  <div>
    <Navbar v-if="!isMinecraftSkinEditor" />
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'

const route = useRoute()
const isMinecraftSkinEditor = computed(() => route.path === '/tools/minecraft-skin-editor')

const siteUrl = 'https://jacoryspace.top'
const pageMeta = computed(() => {
  const pages = {
    Home: {
      title: 'Jacory Space — Personal Operating System',
      description: 'Jacory 的个人数字空间：工具、创作、Field Notes 与持续演进的个人工作系统。',
      path: '/',
      type: 'website',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Jacory Space',
        url: siteUrl,
        description: 'Jacory 的个人数字空间：工具、创作、Field Notes 与持续演进的个人工作系统。',
      },
    },
    Tools: {
      title: 'Tools — Jacory Space',
      description: 'Jacory Space 的自建工具、界面实验与项目入口。',
      path: '/tools',
    },
    MediaParser: {
      title: 'Media Parser Desktop — Jacory Space',
      description: '本地优先的媒体解析桌面工具，支持视频、播客与个人内容工作流。',
      path: '/tools/media-parser',
    },
    MinecraftSkinEditor: {
      title: 'Minecraft Skin Studio — Jacory Space',
      description: '在浏览器中编辑、预览与导出 Minecraft 皮肤。',
      path: '/tools/minecraft-skin-editor',
    },
    Blog: {
      title: 'Field Notes — Jacory Space',
      description: '关于产品、AI、工作方法与个人实践的持续记录。',
      path: '/blog',
    },
    BlogPost: {
      title: 'Field Notes — Jacory Space',
      description: 'Jacory Space 的 Field Notes。',
      path: route.path,
      type: 'article',
    },
    About: {
      title: 'About — Jacory Space',
      description: '了解 Jacory Space 的个人工作系统、创作方向与联系方式。',
      path: '/about',
    },
  }

  return pages[route.name] || pages.Home
})

useHead(() => {
  const meta = pageMeta.value
  const canonicalUrl = new URL(meta.path, siteUrl).href
  const head = {
    title: meta.title,
    meta: [
      { key: 'description', name: 'description', content: meta.description },
      { key: 'robots', name: 'robots', content: 'index, follow' },
      { key: 'og:title', property: 'og:title', content: meta.title },
      { key: 'og:description', property: 'og:description', content: meta.description },
      { key: 'og:type', property: 'og:type', content: meta.type || 'website' },
      { key: 'og:url', property: 'og:url', content: canonicalUrl },
      { key: 'og:site_name', property: 'og:site_name', content: 'Jacory Space' },
      { key: 'twitter:card', name: 'twitter:card', content: 'summary' },
    ],
    link: [{ key: 'canonical', rel: 'canonical', href: canonicalUrl }],
  }

  if (meta.structuredData) {
    head.script = [{
      key: 'website-structured-data',
      type: 'application/ld+json',
      children: JSON.stringify(meta.structuredData),
    }]
  }

  return head
})
</script>
