# 视频解析下载工具 - 前端

基于 Vite + Vue3 + Tailwind CSS 构建的视频解析下载工具前端界面。

## 技术栈

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **HTTP 客户端**: Axios

## 安装依赖

```bash
npm install
```

## 开发模式

```bash
npm run dev
```

访问 `http://localhost:3001`

## 构建生产版本

```bash
npm run build
```

## 预览生产构建

```bash
npm run preview
```

## 功能特性

- ✨ 现代化 UI 设计
- 🎨 Tailwind CSS 样式
- 📱 响应式布局
- ⚡ Vite 快速热更新
- 🔄 实时加载状态
- 💾 多分辨率下载选项

## 项目结构

```
jacory-space-frontend/
├── src/
│   ├── App.vue          # 主组件
│   ├── main.js          # 入口文件
│   └── style.css        # 全局样式
├── index.html           # HTML 模板
├── vite.config.js       # Vite 配置
├── tailwind.config.js   # Tailwind 配置
├── postcss.config.js    # PostCSS 配置
└── package.json         # 依赖配置
```

## API 代理

开发环境下，所有 `/api` 请求会被代理到 `http://localhost:5001`（后端服务）。

确保后端服务已启动：

```bash
cd ../jacory-space-backend/media-backend
npm install
npm run dev
```
