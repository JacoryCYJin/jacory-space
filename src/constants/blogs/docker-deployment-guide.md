---
title: "Docker 容器化部署指南"
excerpt: "从基础概念到生产部署，全面掌握 Docker 容器技术。学习镜像构建、容器编排、多环境部署等实战技能。"
date: "2024-01-14"
category: "devops"
tags: ["docker", "containerization", "deployment", "devops"]
cover: "https://images.unsplash.com/photo-1605745341112-85968b19335a?w=800&h=400&fit=crop"
author: "Jacory"
readTime: "22 min"
---

# Docker 容器化部署指南

Docker 彻底改变了应用程序的部署方式，让"在我的机器上能跑"成为历史。本文将从零开始，带你掌握 Docker 容器化部署的完整流程。

## Docker 基础概念

### 什么是 Docker？

Docker 是一个开源的容器化平台，它可以让开发者打包应用程序及其依赖项到一个轻量级、可移植的容器中。

### 核心概念

📦 **镜像 (Image)**：只读的模板，用于创建容器  
🚀 **容器 (Container)**：镜像的运行实例  
📋 **Dockerfile**：构建镜像的指令文件  
🏪 **Registry**：存储和分发镜像的仓库  

### Docker vs 传统虚拟化

| 特性 | Docker 容器 | 传统虚拟机 |
|------|-------------|-------------|
| 资源占用 | 轻量级 | 重量级 |
| 启动时间 | 秒级 | 分钟级 |
| 隔离级别 | 进程级 | 操作系统级 |
| 性能损耗 | 几乎无损耗 | 5-20% 损耗 |

## Docker 安装与配置

### Linux 安装

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 添加用户到 docker 组
sudo usermod -aG docker $USER

# 启动 Docker 服务
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
docker --version
docker run hello-world
```

### macOS 安装

```bash
# 使用 Homebrew
brew install --cask docker

# 或下载 Docker Desktop
# https://www.docker.com/products/docker-desktop
```

### 配置 Docker

```json
// /etc/docker/daemon.json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
```

## Dockerfile 最佳实践

### Node.js 应用 Dockerfile

```dockerfile
# 多阶段构建
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production && npm cache clean --force

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM node:18-alpine AS production

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# 设置工作目录
WORKDIR /app

# 复制必要文件
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# 启动应用
CMD ["npm", "start"]
```

### Python 应用 Dockerfile

```dockerfile
FROM python:3.11-slim

# 设置环境变量
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 安装系统依赖
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 创建工作目录
WORKDIR /app

# 复制依赖文件
COPY requirements.txt .

# 安装 Python 依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY . .

# 创建非 root 用户
RUN adduser --disabled-password --gecos '' appuser
RUN chown -R appuser:appuser /app
USER appuser

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app:app"]
```

### Go 应用 Dockerfile

```dockerfile
# 构建阶段
FROM golang:1.21-alpine AS builder

WORKDIR /app

# 复制 go mod 文件
COPY go.mod go.sum ./

# 下载依赖
RUN go mod download

# 复制源代码
COPY . .

# 构建应用
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# 运行阶段
FROM alpine:latest

# 安装 ca-certificates
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# 复制二进制文件
COPY --from=builder /app/main .

# 暴露端口
EXPOSE 8080

# 启动应用
CMD ["./main"]
```

## Docker Compose 编排

### 全栈应用编排

```yaml
# docker-compose.yml
version: '3.8'

services:
  # 前端应用
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:5000
    depends_on:
      - backend
    networks:
      - app-network

  # 后端 API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mongodb://mongo:27017/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis
    volumes:
      - ./backend/uploads:/app/uploads
    networks:
      - app-network

  # MongoDB 数据库
  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
    volumes:
      - mongo-data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    networks:
      - app-network

  # Redis 缓存
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - app-network

  # Nginx 反向代理
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    networks:
      - app-network

volumes:
  mongo-data:
  redis-data:

networks:
  app-network:
    driver: bridge
```

### 开发环境配置

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      target: development
    volumes:
      - ./frontend/src:/app/src
      - ./frontend/public:/app/public
    environment:
      - CHOKIDAR_USEPOLLING=true

  backend:
    build:
      context: ./backend
      target: development
    volumes:
      - ./backend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev
```

### 生产环境配置

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      target: production
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      target: production
    restart: unless-stopped
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

  mongo:
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 1G
```

## 镜像优化技巧

### 减小镜像体积

```dockerfile
# ❌ 错误做法
FROM ubuntu:20.04
RUN apt-get update
RUN apt-get install -y python3
RUN apt-get install -y python3-pip
COPY . .
RUN pip3 install -r requirements.txt

# ✅ 正确做法
FROM python:3.11-slim

# 合并 RUN 指令
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# 利用缓存层
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
```

### 多阶段构建优化

```dockerfile
# 构建阶段
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 运行阶段
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

USER nextjs

CMD ["npm", "start"]
```

### .dockerignore 文件

```dockerignore
# 版本控制
.git
.gitignore

# 依赖目录
node_modules
npm-debug.log*

# 构建输出
dist
build
.next

# 环境文件
.env.local
.env.development.local

# 日志文件
*.log

# 临时文件
.DS_Store
Thumbs.db

# IDE 文件
.vscode
.idea

# 测试文件
coverage
.nyc_output

# 文档
README.md
CHANGELOG.md
```

## 容器网络与存储

### 网络配置

```bash
# 创建自定义网络
docker network create --driver bridge my-network

# 查看网络
docker network ls

# 连接容器到网络
docker run --network my-network nginx

# 网络详情
docker network inspect my-network
```

### 数据卷管理

```bash
# 创建数据卷
docker volume create my-volume

# 挂载数据卷
docker run -v my-volume:/data nginx

# 绑定挂载
docker run -v /host/path:/container/path nginx

# 查看数据卷
docker volume ls
docker volume inspect my-volume
```

### Docker Compose 网络

```yaml
version: '3.8'

services:
  web:
    image: nginx
    networks:
      - frontend
      - backend

  api:
    image: myapi
    networks:
      - backend
      - database

  db:
    image: postgres
    networks:
      - database

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
  database:
    driver: bridge
    internal: true  # 内部网络，不能访问外网
```

## 监控与日志

### 容器监控

```yaml
# monitoring/docker-compose.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana

  cadvisor:
    image: gcr.io/cadvisor/cadvisor
    ports:
      - "8080:8080"
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro

volumes:
  prometheus-data:
  grafana-data:
```

### 日志管理

```yaml
version: '3.8'

services:
  app:
    image: myapp
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # ELK Stack 日志收集
  elasticsearch:
    image: elasticsearch:7.14.0
    environment:
      - discovery.type=single-node
    volumes:
      - es-data:/usr/share/elasticsearch/data

  logstash:
    image: logstash:7.14.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf

  kibana:
    image: kibana:7.14.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200

volumes:
  es-data:
```

## 安全最佳实践

### 容器安全

```dockerfile
# 使用非 root 用户
FROM node:18-alpine

# 创建应用用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# 设置工作目录权限
WORKDIR /app
RUN chown -R nextjs:nodejs /app

# 切换到非 root 用户
USER nextjs

# 只暴露必要端口
EXPOSE 3000

# 使用 HTTPS
ENV NODE_ENV=production
ENV HTTPS=true
```

### 镜像安全扫描

```bash
# 使用 Docker Scout
docker scout quickview myapp:latest
docker scout cves myapp:latest

# 使用 Trivy
trivy image myapp:latest

# 使用 Snyk
snyk container test myapp:latest
```

### Secrets 管理

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    image: myapp
    secrets:
      - db_password
      - api_key
    environment:
      - DB_PASSWORD_FILE=/run/secrets/db_password

secrets:
  db_password:
    file: ./secrets/db_password.txt
  api_key:
    external: true
```

## CI/CD 集成

### GitHub Actions

```yaml
# .github/workflows/docker.yml
name: Docker Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Login to DockerHub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKERHUB_USERNAME }}
        password: ${{ secrets.DOCKERHUB_TOKEN }}
    
    - name: Build and push
      uses: docker/build-push-action@v4
      with:
        context: .
        platforms: linux/amd64,linux/arm64
        push: true
        tags: |
          myapp:latest
          myapp:${{ github.sha }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Deploy to production
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          docker pull myapp:${{ github.sha }}
          docker-compose up -d
```

### 多环境部署

```bash
#!/bin/bash
# deploy.sh

ENVIRONMENT=$1
IMAGE_TAG=$2

if [ -z "$ENVIRONMENT" ] || [ -z "$IMAGE_TAG" ]; then
    echo "Usage: ./deploy.sh <environment> <image_tag>"
    exit 1
fi

# 部署到不同环境
case $ENVIRONMENT in
    "staging")
        docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d
        ;;
    "production")
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
        ;;
    *)
        echo "Unknown environment: $ENVIRONMENT"
        exit 1
        ;;
esac

echo "Deployed $IMAGE_TAG to $ENVIRONMENT"
```

## 性能优化

### 容器资源限制

```yaml
version: '3.8'

services:
  app:
    image: myapp
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
```

### 健康检查

```dockerfile
# Dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

```yaml
# docker-compose.yml
services:
  app:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## 故障排查

### 常用调试命令

```bash
# 查看容器日志
docker logs <container_id>
docker logs -f --tail=100 <container_id>

# 进入容器
docker exec -it <container_id> /bin/bash
docker exec -it <container_id> /bin/sh

# 查看容器详情
docker inspect <container_id>

# 查看容器资源使用
docker stats <container_id>

# 查看容器进程
docker top <container_id>

# 复制文件
docker cp <container_id>:/path/to/file ./local/path
docker cp ./local/file <container_id>:/path/to/
```

### 常见问题解决

```bash
# 清理系统
docker system prune -f
docker volume prune -f
docker image prune -f

# 查看磁盘使用
docker system df

# 删除未使用的资源
docker container prune
docker image prune -a
docker network prune
```

## 总结

Docker 容器化技术为现代应用部署提供了强大而灵活的解决方案：

✨ **环境一致性**：开发、测试、生产环境完全一致  
✨ **快速部署**：秒级启动，快速扩缩容  
✨ **资源高效**：轻量级虚拟化，资源利用率高  
✨ **微服务友好**：完美支持微服务架构  
✨ **DevOps 集成**：无缝集成 CI/CD 流程  

掌握 Docker，让你的应用部署更加可靠、高效、可扩展！

---

*容器化改变世界，持续学习 DevOps 技能！*
