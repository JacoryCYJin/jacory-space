---
title: "前端性能优化实战技巧"
excerpt: "深入学习前端性能优化技术，掌握代码分割、懒加载、缓存策略、图片优化等核心技能，打造极致用户体验。"
date: "2024-01-02"
category: "frontend"
tags: ["performance", "optimization", "web-vitals", "javascript"]
cover: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop"
author: "Jacory"
readTime: "20 min"
---

# 前端性能优化实战技巧

性能优化是前端开发的核心技能之一。本文将从多个维度深入探讨前端性能优化的实战技巧，帮你打造极致的用户体验。

## 性能指标和测量

### Core Web Vitals

🎯 **LCP (Largest Contentful Paint)**：最大内容绘制时间 < 2.5s  
⚡ **FID (First Input Delay)**：首次输入延迟 < 100ms  
🎨 **CLS (Cumulative Layout Shift)**：累积布局偏移 < 0.1  

### 性能监控实现

```javascript
// performance/monitor.js
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = {};
    this.init();
  }

  init() {
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeNavigationTiming();
    this.observeResourceTiming();
  }

  // 监控 LCP
  observeLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        this.metrics.lcp = {
          value: lastEntry.startTime,
          element: lastEntry.element,
          timestamp: Date.now()
        };

        this.reportMetric('LCP', lastEntry.startTime);
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.lcp = observer;
    }
  }

  // 监控 FID
  observeFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.fid = {
            value: entry.processingStart - entry.startTime,
            timestamp: Date.now()
          };

          this.reportMetric('FID', entry.processingStart - entry.startTime);
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
      this.observers.fid = observer;
    }
  }

  // 监控 CLS
  observeCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      let sessionValue = 0;
      let sessionEntries = [];

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            const firstSessionEntry = sessionEntries[0];
            const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

            if (sessionValue && 
                entry.startTime - lastSessionEntry.startTime < 1000 &&
                entry.startTime - firstSessionEntry.startTime < 5000) {
              sessionValue += entry.value;
              sessionEntries.push(entry);
            } else {
              sessionValue = entry.value;
              sessionEntries = [entry];
            }

            if (sessionValue > clsValue) {
              clsValue = sessionValue;
              this.metrics.cls = {
                value: clsValue,
                entries: [...sessionEntries],
                timestamp: Date.now()
              };

              this.reportMetric('CLS', clsValue);
            }
          }
        }
      });

      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.cls = observer;
    }
  }

  // 导航时间监控
  observeNavigationTiming() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      
      this.metrics.navigation = {
        dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcpConnect: navigation.connectEnd - navigation.connectStart,
        request: navigation.responseStart - navigation.requestStart,
        response: navigation.responseEnd - navigation.responseStart,
        domParse: navigation.domInteractive - navigation.responseEnd,
        domComplete: navigation.domComplete - navigation.domInteractive,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        ttfb: navigation.responseStart - navigation.requestStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        loadEvent: navigation.loadEventEnd - navigation.navigationStart
      };

      this.reportNavigationMetrics();
    });
  }

  // 资源加载时间监控
  observeResourceTiming() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.initiatorType === 'img' || 
            entry.initiatorType === 'script' || 
            entry.initiatorType === 'css') {
          
          const resourceMetric = {
            name: entry.name,
            type: entry.initiatorType,
            duration: entry.duration,
            size: entry.transferSize,
            cached: entry.transferSize === 0,
            timestamp: Date.now()
          };

          this.reportResourceMetric(resourceMetric);
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
    this.observers.resource = observer;
  }

  // 上报指标
  reportMetric(name, value) {
    // 发送到分析服务
    if (navigator.sendBeacon) {
      const data = JSON.stringify({
        metric: name,
        value: value,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      });

      navigator.sendBeacon('/api/performance', data);
    }
  }

  // 获取性能报告
  getPerformanceReport() {
    return {
      metrics: this.metrics,
      recommendations: this.generateRecommendations(),
      score: this.calculatePerformanceScore()
    };
  }

  // 生成优化建议
  generateRecommendations() {
    const recommendations = [];

    if (this.metrics.lcp && this.metrics.lcp.value > 2500) {
      recommendations.push({
        type: 'LCP',
        issue: 'LCP过高',
        suggestion: '优化图片加载、减少服务器响应时间、使用CDN'
      });
    }

    if (this.metrics.fid && this.metrics.fid.value > 100) {
      recommendations.push({
        type: 'FID',
        issue: 'FID过高',
        suggestion: '减少JavaScript执行时间、使用Web Workers、优化第三方脚本'
      });
    }

    if (this.metrics.cls && this.metrics.cls.value > 0.1) {
      recommendations.push({
        type: 'CLS',
        issue: 'CLS过高',
        suggestion: '为图片设置尺寸、避免动态插入内容、使用CSS containment'
      });
    }

    return recommendations;
  }
}

// 初始化性能监控
const performanceMonitor = new PerformanceMonitor();
export default performanceMonitor;
```

## 代码分割和懒加载

### React 代码分割

```javascript
// components/LazyComponents.js
import { lazy, Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';

// 路由级别的代码分割
const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => 
  import('../pages/About').then(module => ({
    default: module.About
  }))
);
const Dashboard = lazy(() => 
  import(/* webpackChunkName: "dashboard" */ '../pages/Dashboard')
);

// 组件级别的代码分割
const HeavyChart = lazy(() => 
  import(/* webpackChunkName: "charts" */ '../components/HeavyChart')
);

// 条件加载
const AdminPanel = lazy(() => {
  return import('../components/AdminPanel').catch(() => {
    // 降级处理
    return import('../components/FallbackComponent');
  });
});

// 预加载策略
const preloadDashboard = () => {
  import(/* webpackChunkName: "dashboard" */ '../pages/Dashboard');
};

// 路由配置
function AppRouter() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route 
            path="/dashboard" 
            element={<Dashboard />}
            onMouseEnter={preloadDashboard} // 鼠标悬停预加载
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

// 智能预加载
class IntelligentPreloader {
  constructor() {
    this.preloadQueue = new Set();
    this.isIdle = false;
    this.setupIdleDetection();
  }

  setupIdleDetection() {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.isIdle = true;
        this.processPreloadQueue();
      });
    }
  }

  preload(importFn, priority = 'low') {
    if (priority === 'high') {
      importFn();
    } else {
      this.preloadQueue.add(importFn);
      if (this.isIdle) {
        this.processPreloadQueue();
      }
    }
  }

  processPreloadQueue() {
    if (this.preloadQueue.size === 0) return;

    const importFn = this.preloadQueue.values().next().value;
    this.preloadQueue.delete(importFn);
    
    importFn().then(() => {
      // 继续处理队列
      if (this.preloadQueue.size > 0) {
        requestIdleCallback(() => this.processPreloadQueue());
      }
    });
  }
}

export const preloader = new IntelligentPreloader();
```

### Webpack 优化配置

```javascript
// webpack.config.js
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // 第三方库
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        // 公共组件
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true,
        },
        // 大型库单独分包
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          chunks: 'all',
          priority: 20,
        },
        lodash: {
          test: /[\\/]node_modules[\\/]lodash[\\/]/,
          name: 'lodash',
          chunks: 'all',
          priority: 15,
        },
      },
    },
    // 运行时代码单独分包
    runtimeChunk: {
      name: 'runtime',
    },
  },
  plugins: [
    // 分析包大小
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZE ? 'server' : 'disabled',
    }),
  ],
};
```

## 图片和资源优化

### 响应式图片加载

```javascript
// components/OptimizedImage.js
import { useState, useEffect, useRef } from 'react';

function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  lazy = true,
  placeholder = 'blur',
  quality = 75,
  formats = ['webp', 'jpg'],
  sizes = '(max-width: 768px) 100vw, 50vw',
  ...props 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [error, setError] = useState(false);
  const imgRef = useRef();

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // 提前50px开始加载
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, isInView]);

  // 生成不同格式的图片URL
  const generateSrcSet = (baseSrc, format) => {
    const sizes = [400, 800, 1200, 1600];
    return sizes
      .map(size => `${baseSrc}?w=${size}&f=${format}&q=${quality} ${size}w`)
      .join(', ');
  };

  // 生成Picture元素的sources
  const renderSources = () => {
    return formats.map(format => (
      <source
        key={format}
        type={`image/${format}`}
        srcSet={generateSrcSet(src, format)}
        sizes={sizes}
      />
    ));
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
  };

  // 占位符组件
  const PlaceholderComponent = () => (
    <div 
      style={{ 
        width, 
        height, 
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666'
      }}
    >
      {error ? '加载失败' : '加载中...'}
    </div>
  );

  if (!isInView) {
    return (
      <div ref={imgRef} style={{ width, height }}>
        <PlaceholderComponent />
      </div>
    );
  }

  if (error) {
    return <PlaceholderComponent />;
  }

  return (
    <div ref={imgRef} style={{ position: 'relative', width, height }}>
      {/* 模糊占位符 */}
      {!isLoaded && placeholder === 'blur' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `url(${src}?w=20&blur=20) center/cover`,
            filter: 'blur(10px)',
            zIndex: 1
          }}
        />
      )}

      {/* 主图片 */}
      <picture>
        {renderSources()}
        <img
          src={`${src}?w=${width}&f=jpg&q=${quality}`}
          alt={alt}
          width={width}
          height={height}
          loading={lazy ? 'lazy' : 'eager'}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
            position: 'relative',
            zIndex: 2
          }}
          {...props}
        />
      </picture>
    </div>
  );
}

export default OptimizedImage;
```

### 资源预加载策略

```javascript
// utils/resourcePreloader.js
class ResourcePreloader {
  constructor() {
    this.preloadedResources = new Set();
    this.priorities = {
      critical: 1,
      high: 2,
      medium: 3,
      low: 4
    };
  }

  // 预加载图片
  preloadImage(src, priority = 'medium') {
    if (this.preloadedResources.has(src)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    
    if (priority === 'critical') {
      link.fetchPriority = 'high';
    }

    document.head.appendChild(link);
    this.preloadedResources.add(src);
  }

  // 预加载字体
  preloadFont(src, type = 'woff2') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = `font/${type}`;
    link.href = src;
    link.crossOrigin = 'anonymous';

    document.head.appendChild(link);
  }

  // 预加载CSS
  preloadCSS(src) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = src;
    link.onload = () => {
      link.rel = 'stylesheet';
    };

    document.head.appendChild(link);
  }

  // 预加载JavaScript
  preloadScript(src, priority = 'medium') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = src;

    if (priority === 'critical') {
      link.fetchPriority = 'high';
    }

    document.head.appendChild(link);
  }

  // 智能预加载
  preloadOnIdle(resources) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        resources.forEach(resource => {
          this.preloadByType(resource);
        });
      });
    } else {
      // 降级处理
      setTimeout(() => {
        resources.forEach(resource => {
          this.preloadByType(resource);
        });
      }, 1000);
    }
  }

  preloadByType(resource) {
    const { type, src, priority } = resource;
    
    switch (type) {
      case 'image':
        this.preloadImage(src, priority);
        break;
      case 'font':
        this.preloadFont(src);
        break;
      case 'css':
        this.preloadCSS(src);
        break;
      case 'script':
        this.preloadScript(src, priority);
        break;
    }
  }
}

export const resourcePreloader = new ResourcePreloader();

// 使用示例
// 预加载关键资源
resourcePreloader.preloadImage('/hero-image.webp', 'critical');
resourcePreloader.preloadFont('/fonts/main.woff2');

// 空闲时预加载
resourcePreloader.preloadOnIdle([
  { type: 'image', src: '/gallery-1.webp', priority: 'low' },
  { type: 'image', src: '/gallery-2.webp', priority: 'low' },
  { type: 'script', src: '/analytics.js', priority: 'low' }
]);
```

## 缓存策略

### Service Worker 实现

```javascript
// sw.js
const CACHE_NAME = 'app-v1.2.0';
const STATIC_CACHE = 'static-v1.2.0';
const DYNAMIC_CACHE = 'dynamic-v1.2.0';

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/static/fonts/inter.woff2',
  '/manifest.json'
];

// 安装事件
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// 激活事件
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// 请求拦截
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API请求策略：网络优先，缓存降级
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      networkFirstStrategy(request)
    );
    return;
  }

  // 图片资源策略：缓存优先
  if (request.destination === 'image') {
    event.respondWith(
      cacheFirstStrategy(request)
    );
    return;
  }

  // 静态资源策略：缓存优先
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      cacheFirstStrategy(request)
    );
    return;
  }

  // 其他请求：网络优先
  event.respondWith(
    networkFirstStrategy(request)
  );
});

// 缓存优先策略
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    return new Response('Network error', { status: 408 });
  }
}

// 网络优先策略
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// 后台同步
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // 处理离线时的数据同步
  const offlineRequests = await getOfflineRequests();
  
  for (const request of offlineRequests) {
    try {
      await fetch(request);
      await removeOfflineRequest(request);
    } catch (error) {
      console.error('Background sync failed:', error);
    }
  }
}
```

### HTTP 缓存配置

```javascript
// express server缓存配置
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');

const app = express();

// 启用gzip压缩
app.use(compression({
  threshold: 1024, // 大于1KB才压缩
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// 安全头设置
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// 静态资源缓存
app.use('/static', express.static('public', {
  maxAge: '1y', // 1年
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    // 根据文件类型设置不同缓存策略
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else if (path.match(/\.(js|css)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (path.match(/\.(jpg|jpeg|png|webp|svg)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=2592000'); // 30天
    }
  }
}));

// API缓存中间件
const apiCache = (duration) => (req, res, next) => {
  const key = req.originalUrl;
  const cached = cache.get(key);
  
  if (cached) {
    res.setHeader('X-Cache', 'HIT');
    return res.json(cached);
  }
  
  res.sendResponse = res.json;
  res.json = (body) => {
    cache.set(key, body, duration);
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', `public, max-age=${duration}`);
    res.sendResponse(body);
  };
  
  next();
};

// 使用API缓存
app.get('/api/products', apiCache(300), (req, res) => {
  // 5分钟缓存
  res.json(products);
});
```

## JavaScript 性能优化

### 防抖和节流

```javascript
// utils/performance.js

// 防抖函数
export function debounce(func, wait, immediate = false) {
  let timeout;
  let args, context, result;

  const later = () => {
    timeout = null;
    if (!immediate) {
      result = func.apply(context, args);
      context = args = null;
    }
  };

  const debounced = function (...params) {
    context = this;
    args = params;
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }
    
    return result;
  };

  debounced.cancel = () => {
    clearTimeout(timeout);
    timeout = context = args = null;
  };

  return debounced;
}

// 节流函数
export function throttle(func, wait, options = {}) {
  let timeout, context, args, result;
  let previous = 0;
  
  const { leading = true, trailing = true } = options;

  const later = () => {
    previous = leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  const throttled = function (...params) {
    const now = Date.now();
    
    if (!previous && leading === false) previous = now;
    
    const remaining = wait - (now - previous);
    context = this;
    args = params;
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    
    return result;
  };

  throttled.cancel = () => {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}

// 使用示例
const searchInput = document.getElementById('search');
const handleSearch = debounce((value) => {
  // API请求
  fetch(`/api/search?q=${value}`)
    .then(response => response.json())
    .then(data => updateResults(data));
}, 300);

searchInput.addEventListener('input', (e) => {
  handleSearch(e.target.value);
});

// 滚动事件节流
const handleScroll = throttle(() => {
  // 滚动处理逻辑
  updateScrollProgress();
}, 16); // 60fps

window.addEventListener('scroll', handleScroll);
```

### 虚拟滚动实现

```javascript
// components/VirtualList.js
import { useState, useEffect, useMemo, useCallback } from 'react';

function VirtualList({ 
  items, 
  itemHeight, 
  containerHeight, 
  renderItem,
  overscan = 5 
}) {
  const [scrollTop, setScrollTop] = useState(0);

  // 计算可见范围
  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    );

    return {
      start: Math.max(0, start - overscan),
      end: Math.min(items.length - 1, end + overscan)
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // 计算渲染项
  const visibleItems = useMemo(() => {
    const result = [];
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      result.push({
        index: i,
        item: items[i],
        style: {
          position: 'absolute',
          top: i * itemHeight,
          height: itemHeight,
          width: '100%'
        }
      });
    }
    return result;
  }, [visibleRange, items, itemHeight]);

  // 滚动处理
  const handleScroll = useCallback(
    throttle((e) => {
      setScrollTop(e.target.scrollTop);
    }, 16),
    []
  );

  // 总高度
  const totalHeight = items.length * itemHeight;

  return (
    <div
      style={{
        height: containerHeight,
        overflow: 'auto'
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ index, item, style }) => (
          <div key={index} style={style}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

// 使用示例
function App() {
  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    value: Math.random()
  }));

  const renderItem = (item, index) => (
    <div className="list-item">
      <h4>{item.name}</h4>
      <p>Value: {item.value.toFixed(2)}</p>
    </div>
  );

  return (
    <VirtualList
      items={items}
      itemHeight={80}
      containerHeight={400}
      renderItem={renderItem}
    />
  );
}
```

### Web Workers 优化

```javascript
// workers/dataProcessor.js
class DataProcessor {
  constructor() {
    this.worker = null;
    this.initWorker();
  }

  initWorker() {
    // 内联Worker代码
    const workerCode = `
      // 处理大量数据的函数
      function processLargeDataset(data) {
        const result = [];
        
        for (let i = 0; i < data.length; i++) {
          // 复杂计算
          const processed = {
            ...data[i],
            computed: Math.sqrt(data[i].value) * Math.PI,
            normalized: data[i].value / Math.max(...data.map(d => d.value))
          };
          result.push(processed);
          
          // 定期报告进度
          if (i % 1000 === 0) {
            self.postMessage({
              type: 'progress',
              progress: (i / data.length) * 100
            });
          }
        }
        
        return result;
      }

      // 数据排序
      function sortData(data, sortKey, order = 'asc') {
        return data.sort((a, b) => {
          const aVal = a[sortKey];
          const bVal = b[sortKey];
          
          if (order === 'asc') {
            return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          } else {
            return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
          }
        });
      }

      // 监听主线程消息
      self.onmessage = function(e) {
        const { type, data, options } = e.data;
        
        try {
          let result;
          
          switch (type) {
            case 'process':
              result = processLargeDataset(data);
              break;
            case 'sort':
              result = sortData(data, options.sortKey, options.order);
              break;
            default:
              throw new Error('Unknown task type');
          }
          
          self.postMessage({
            type: 'success',
            result: result
          });
        } catch (error) {
          self.postMessage({
            type: 'error',
            error: error.message
          });
        }
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    this.worker = new Worker(URL.createObjectURL(blob));

    this.worker.onmessage = this.handleWorkerMessage.bind(this);
    this.worker.onerror = this.handleWorkerError.bind(this);
  }

  processData(data, onProgress, onComplete, onError) {
    return new Promise((resolve, reject) => {
      this.onProgress = onProgress;
      this.onComplete = onComplete;
      this.onError = onError;
      this.resolve = resolve;
      this.reject = reject;

      this.worker.postMessage({
        type: 'process',
        data: data
      });
    });
  }

  sortData(data, sortKey, order = 'asc') {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;

      this.worker.postMessage({
        type: 'sort',
        data: data,
        options: { sortKey, order }
      });
    });
  }

  handleWorkerMessage(e) {
    const { type, result, progress, error } = e.data;

    switch (type) {
      case 'progress':
        if (this.onProgress) {
          this.onProgress(progress);
        }
        break;
      case 'success':
        if (this.onComplete) {
          this.onComplete(result);
        }
        if (this.resolve) {
          this.resolve(result);
        }
        break;
      case 'error':
        if (this.onError) {
          this.onError(error);
        }
        if (this.reject) {
          this.reject(new Error(error));
        }
        break;
    }
  }

  handleWorkerError(error) {
    console.error('Worker error:', error);
    if (this.onError) {
      this.onError(error.message);
    }
    if (this.reject) {
      this.reject(error);
    }
  }

  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

// 使用示例
const processor = new DataProcessor();

// 处理大量数据
const largeDataset = Array.from({ length: 100000 }, (_, i) => ({
  id: i,
  value: Math.random() * 1000,
  category: `Category ${i % 10}`
}));

processor.processData(
  largeDataset,
  (progress) => {
    console.log(`处理进度: ${progress.toFixed(1)}%`);
    updateProgressBar(progress);
  },
  (result) => {
    console.log('处理完成', result);
    displayResults(result);
  },
  (error) => {
    console.error('处理失败', error);
  }
);

export default DataProcessor;
```

## 总结

前端性能优化是一个系统工程，需要从多个维度进行：

✨ **测量和监控**：建立完善的性能监控体系  
✨ **资源优化**：图片、字体、代码分割  
✨ **缓存策略**：HTTP缓存、Service Worker  
✨ **JavaScript优化**：防抖节流、虚拟滚动、Web Workers  
✨ **用户体验**：加载状态、错误处理、渐进式增强  

性能优化是持续的过程，需要在开发的每个阶段都要考虑性能影响！

---

*性能即用户体验，优化永无止境！*
