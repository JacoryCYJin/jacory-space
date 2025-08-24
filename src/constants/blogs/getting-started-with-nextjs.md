---
title: "Next.js 入门指南"
excerpt: "从零开始学习 Next.js，构建现代化的 React 应用程序。本文将带你了解 Next.js 的核心概念和最佳实践。"
date: "2024-01-15"
category: "frontend"
tags: ["nextjs", "react", "javascript", "tutorial"]
cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop"
author: "Jacory"
readTime: "10 min"
---

# Next.js 入门指南

Next.js 是一个基于 React 的生产级框架，为现代 Web 应用程序提供了最佳的开发体验。本文将引导你从零开始学习 Next.js。

## 什么是 Next.js？

Next.js 是由 Vercel 开发的 React 框架，它提供了许多开箱即用的功能：

- **服务器端渲染 (SSR)**：提升 SEO 和首屏加载速度
- **静态站点生成 (SSG)**：预渲染页面，获得最佳性能
- **API 路由**：轻松创建 API 端点
- **自动代码分割**：只加载需要的代码
- **内置 CSS 支持**：支持 CSS Modules 和 Sass
- **图片优化**：自动优化图片加载

## 安装和设置

### 1. 创建新项目

```bash
npx create-next-app@latest my-next-app
cd my-next-app
npm run dev
```

### 2. 项目结构

```
my-next-app/
├── pages/          # 页面文件
├── public/         # 静态资源
├── styles/         # 样式文件
├── components/     # React 组件
└── package.json
```

## 核心概念

### 页面和路由

Next.js 使用基于文件的路由系统：

```javascript
// pages/index.js - 主页 (/)
export default function Home() {
  return <h1>欢迎来到 Next.js!</h1>
}

// pages/about.js - 关于页面 (/about)
export default function About() {
  return <h1>关于我们</h1>
}

// pages/blog/[slug].js - 动态路由 (/blog/*)
export default function BlogPost({ slug }) {
  return <h1>博客文章: {slug}</h1>
}
```

### 数据获取

Next.js 提供了多种数据获取方法：

#### getStaticProps (静态生成)

```javascript
export async function getStaticProps() {
  const res = await fetch('https://api.example.com/posts')
  const posts = await res.json()

  return {
    props: {
      posts,
    },
    // 重新生成页面的时间间隔 (秒)
    revalidate: 60,
  }
}
```

#### getServerSideProps (服务器端渲染)

```javascript
export async function getServerSideProps(context) {
  const res = await fetch(`https://api.example.com/post/${context.params.id}`)
  const post = await res.json()

  return {
    props: {
      post,
    },
  }
}
```

### API 路由

创建 API 端点非常简单：

```javascript
// pages/api/users.js
export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ users: [] })
  } else if (req.method === 'POST') {
    // 处理 POST 请求
    res.status(201).json({ message: '用户创建成功' })
  }
}
```

## 样式处理

### CSS Modules

```javascript
// components/Button.module.css
.button {
  background-color: blue;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
}

// components/Button.js
import styles from './Button.module.css'

export default function Button({ children }) {
  return (
    <button className={styles.button}>
      {children}
    </button>
  )
}
```

### Styled JSX

```javascript
export default function StyledComponent() {
  return (
    <div>
      <h1>标题</h1>
      <style jsx>{`
        h1 {
          color: red;
          font-size: 2rem;
        }
      `}</style>
    </div>
  )
}
```

## 图片优化

Next.js 提供了优化的 Image 组件：

```javascript
import Image from 'next/image'

export default function MyImage() {
  return (
    <Image
      src="/my-image.jpg"
      alt="描述"
      width={500}
      height={300}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  )
}
```

## 部署

### Vercel 部署 (推荐)

1. 将代码推送到 GitHub
2. 在 Vercel 中连接仓库
3. 自动部署完成

### 其他平台

```bash
# 构建生产版本
npm run build
npm start
```

## 最佳实践

### 1. 性能优化

- 使用 `next/image` 组件优化图片
- 利用动态导入进行代码分割
- 合理使用 SSG 和 SSR

### 2. SEO 优化

```javascript
import Head from 'next/head'

export default function MyPage() {
  return (
    <>
      <Head>
        <title>页面标题</title>
        <meta name="description" content="页面描述" />
        <meta property="og:title" content="页面标题" />
      </Head>
      <main>
        {/* 页面内容 */}
      </main>
    </>
  )
}
```

### 3. 环境变量

```javascript
// .env.local
DATABASE_URL=your-database-url
API_KEY=your-api-key

// 在组件中使用
const apiKey = process.env.API_KEY
```

## 总结

Next.js 是一个功能强大且易于使用的 React 框架，它提供了：

✅ **开箱即用的优化**：自动代码分割、图片优化等  
✅ **灵活的渲染方式**：SSG、SSR、CSR 任你选择  
✅ **优秀的开发体验**：热重载、TypeScript 支持  
✅ **生产就绪**：内置性能优化和安全特性  

开始你的 Next.js 之旅吧！这个框架将帮助你构建快速、现代化的 Web 应用程序。

---

> 💡 **提示**: 查看 [Next.js 官方文档](https://nextjs.org/docs) 获取更多详细信息和高级用法。
