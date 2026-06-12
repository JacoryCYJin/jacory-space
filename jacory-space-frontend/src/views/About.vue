<template>
  <div class="min-h-screen bg-white py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-2xl border border-gray-200 p-8 md:p-12">
        <!-- 头像和标题 -->
        <div class="text-center mb-8">
          <div class="w-32 h-32 bg-[#f7f8f3] border border-[#dbe2c4] rounded-full mx-auto mb-4 flex items-center justify-center">
            <UserRound class="h-14 w-14 text-[#6b7a2e]" />
          </div>
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Jacory</h1>
          <p class="text-xl text-gray-600">UP主 / 开发者 / 创作者</p>
        </div>

        <!-- 简介 -->
        <div class="prose prose-lg max-w-none">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">关于我</h2>
          <p class="text-gray-600 mb-6">
            你好！我是 Jacory，一名热爱技术和创作的 UP 主。
            这个网站是我的个人空间，用来分享我开发的工具、技术文章和生活感悟。
          </p>

          <h2 class="text-2xl font-bold text-gray-800 mb-4">我的项目</h2>
          <ul class="space-y-3 text-gray-600">
            <li class="flex items-start gap-3">
              <Clapperboard class="h-5 w-5 text-[#b75e22] mt-0.5" />
              <span><strong>视频解析工具</strong> - 支持多平台视频下载</span>
            </li>
            <li class="flex items-start gap-3">
              <FileText class="h-5 w-5 text-[#6b7a2e] mt-0.5" />
              <span><strong>技术博客</strong> - 分享开发经验和学习笔记（开发中）</span>
            </li>
            <li class="flex items-start gap-3">
              <Wrench class="h-5 w-5 text-[#6b7a2e] mt-0.5" />
              <span><strong>更多工具</strong> - 持续更新中...</span>
            </li>
          </ul>

          <h2 class="text-2xl font-bold text-gray-800 mb-4 mt-8">联系方式</h2>
          <div class="flex flex-wrap gap-4">
            <a href="mailto:chengyue.jin@outlook.com" class="inline-flex items-center gap-2 px-4 py-2 bg-[#f6f2e8] text-[#556123] rounded-lg hover:bg-[#efe2c3] transition-colors">
              <Mail class="h-4 w-4" />
              <span>Email</span>
            </a>
            <a href="#" class="inline-flex items-center gap-2 px-4 py-2 bg-[#efe2c3] text-[#964a19] rounded-lg hover:bg-[#e7d7b1] transition-colors">
              <Twitter class="h-4 w-4" />
              <span>Twitter</span>
            </a>
            <a href="https://github.com/JacoryCYJin" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Github class="h-4 w-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Clapperboard, FileText, Github, Mail, Twitter, UserRound, Wrench } from 'lucide-vue-next'
</script>
