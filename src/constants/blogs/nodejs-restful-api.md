---
title: "Node.js RESTful API 开发实战"
excerpt: "从零开始构建 Node.js RESTful API，学习 Express、数据库集成、身份验证、错误处理等核心技能。"
date: "2024-01-16"
category: "backend"
tags: ["nodejs", "express", "api", "backend"]
cover: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop"
author: "Jacory"
readTime: "20 min"
---

# Node.js RESTful API 开发实战

Node.js 以其高性能和生态丰富著称，是构建 RESTful API 的热门选择。本文将带你从零开始构建一个完整的 Node.js API 服务。

## 项目初始化

### 创建项目结构

```bash
mkdir nodejs-api-demo
cd nodejs-api-demo
npm init -y

# 安装核心依赖
npm install express mongoose dotenv cors helmet
npm install -D nodemon jest supertest

# 创建项目结构
mkdir src
mkdir src/controllers src/models src/routes src/middleware src/utils
touch src/app.js src/server.js
touch .env .gitignore
```

### 项目结构

```
nodejs-api-demo/
├── src/
│   ├── controllers/     # 控制器
│   ├── models/         # 数据模型
│   ├── routes/         # 路由定义
│   ├── middleware/     # 中间件
│   ├── utils/          # 工具函数
│   ├── app.js          # Express 应用配置
│   └── server.js       # 服务器启动文件
├── tests/              # 测试文件
├── .env                # 环境变量
├── .gitignore
└── package.json
```

## Express 应用配置

### 基础应用设置

```javascript
// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
require('dotenv').config();

// 路由导入
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');

// 中间件导入
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

const app = express();

// 安全中间件
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// 解析中间件
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 自定义中间件
app.use(logger);

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    method: req.method,
    url: req.originalUrl
  });
});

// 错误处理中间件
app.use(errorHandler);

module.exports = app;
```

### 服务器启动文件

```javascript
// src/server.js
const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nodejs-api';

// 数据库连接
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// 启动服务器
async function startServer() {
  await connectDB();
  
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 API: http://localhost:${PORT}/api`);
    console.log(`❤️  Health: http://localhost:${PORT}/health`);
  });

  // 优雅关闭
  process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    server.close(() => {
      console.log('Process terminated');
      mongoose.connection.close();
    });
  });
}

if (require.main === module) {
  startServer();
}

module.exports = app;
```

## 数据模型设计

### 用户模型

```javascript
// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // 默认不返回密码字段
  },
  profile: {
    firstName: String,
    lastName: String,
    bio: String,
    avatar: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date
}, {
  timestamps: true
});

// 索引
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// 虚拟字段
userSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// 密码哈希中间件
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 实例方法
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
```

### 文章模型

```javascript
// src/models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [10, 'Content must be at least 10 characters']
  },
  excerpt: {
    type: String,
    maxlength: [200, 'Excerpt cannot exceed 200 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['technology', 'lifestyle', 'business', 'education']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featuredImage: String,
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  publishedAt: Date
}, {
  timestamps: true
});

// 索引
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ category: 1 });

// 虚拟字段
postSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

postSchema.virtual('commentsCount').get(function() {
  return this.comments.length;
});

// 中间件
postSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  if (!this.excerpt) {
    this.excerpt = this.content.substring(0, 150) + '...';
  }
  
  next();
});

// 静态方法
postSchema.statics.findPublished = function() {
  return this.find({ status: 'published' }).sort({ publishedAt: -1 });
};

postSchema.statics.findByAuthor = function(authorId) {
  return this.find({ author: authorId }).populate('author', 'username profile');
};

module.exports = mongoose.model('Post', postSchema);
```

## 控制器实现

### 用户控制器

```javascript
// src/controllers/userController.js
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// 获取所有用户
const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find({ isActive: true })
    .select('username email profile role createdAt')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments({ isActive: true });

  res.json({
    success: true,
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// 获取单个用户
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('username email profile role createdAt');

  if (!user) {
    throw new ApiError('User not found', 404);
  }

  res.json({
    success: true,
    data: user
  });
});

// 更新用户资料
const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, bio } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      'profile.firstName': firstName,
      'profile.lastName': lastName,
      'profile.bio': bio
    },
    { new: true, runValidators: true }
  ).select('-password');

  res.json({
    success: true,
    data: user,
    message: 'Profile updated successfully'
  });
});

// 删除用户账户
const deleteAccount = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });

  res.json({
    success: true,
    message: 'Account deactivated successfully'
  });
});

// 搜索用户
const searchUsers = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    throw new ApiError('Search query is required', 400);
  }

  const users = await User.find({
    isActive: true,
    $or: [
      { username: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
      { 'profile.firstName': { $regex: q, $options: 'i' } },
      { 'profile.lastName': { $regex: q, $options: 'i' } }
    ]
  }).select('username email profile').limit(20);

  res.json({
    success: true,
    data: users,
    count: users.length
  });
});

module.exports = {
  getUsers,
  getUser,
  updateProfile,
  deleteAccount,
  searchUsers
};
```

### 文章控制器

```javascript
// src/controllers/postController.js
const Post = require('../models/Post');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// 获取所有文章
const getPosts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category,
    tags,
    author,
    search
  } = req.query;

  const skip = (page - 1) * limit;
  const filter = { status: 'published' };

  // 构建查询条件
  if (category) filter.category = category;
  if (tags) filter.tags = { $in: tags.split(',') };
  if (author) filter.author = author;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ];
  }

  const posts = await Post.find(filter)
    .populate('author', 'username profile')
    .select('title excerpt author category tags createdAt likesCount views')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ publishedAt: -1 });

  const total = await Post.countDocuments(filter);

  res.json({
    success: true,
    data: posts,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// 获取单篇文章
const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'username profile')
    .populate('comments.user', 'username profile');

  if (!post) {
    throw new ApiError('Post not found', 404);
  }

  // 增加浏览量
  post.views += 1;
  await post.save();

  res.json({
    success: true,
    data: post
  });
});

// 创建文章
const createPost = asyncHandler(async (req, res) => {
  const postData = {
    ...req.body,
    author: req.user._id
  };

  const post = await Post.create(postData);
  await post.populate('author', 'username profile');

  res.status(201).json({
    success: true,
    data: post,
    message: 'Post created successfully'
  });
});

// 更新文章
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError('Post not found', 404);
  }

  // 检查权限
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError('Not authorized to update this post', 403);
  }

  Object.assign(post, req.body);
  await post.save();
  await post.populate('author', 'username profile');

  res.json({
    success: true,
    data: post,
    message: 'Post updated successfully'
  });
});

// 删除文章
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError('Post not found', 404);
  }

  // 检查权限
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError('Not authorized to delete this post', 403);
  }

  await post.deleteOne();

  res.json({
    success: true,
    message: 'Post deleted successfully'
  });
});

// 点赞文章
const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError('Post not found', 404);
  }

  const existingLike = post.likes.find(
    like => like.user.toString() === req.user._id.toString()
  );

  if (existingLike) {
    // 取消点赞
    post.likes = post.likes.filter(
      like => like.user.toString() !== req.user._id.toString()
    );
  } else {
    // 添加点赞
    post.likes.push({ user: req.user._id });
  }

  await post.save();

  res.json({
    success: true,
    data: {
      likes: post.likesCount,
      isLiked: !existingLike
    },
    message: existingLike ? 'Post unliked' : 'Post liked'
  });
});

// 添加评论
const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError('Post not found', 404);
  }

  post.comments.push({
    user: req.user._id,
    content
  });

  await post.save();
  await post.populate('comments.user', 'username profile');

  res.status(201).json({
    success: true,
    data: post.comments[post.comments.length - 1],
    message: 'Comment added successfully'
  });
});

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  addComment
};
```

## 身份验证系统

### JWT 工具

```javascript
// src/utils/jwt.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken
};
```

### 认证控制器

```javascript
// src/controllers/authController.js
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// 用户注册
const register = asyncHandler(async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;

  // 检查用户是否已存在
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    throw new ApiError('User already exists with this email or username', 400);
  }

  // 创建用户
  const user = await User.create({
    username,
    email,
    password,
    profile: { firstName, lastName }
  });

  // 生成 token
  const token = generateToken({ id: user._id });

  res.status(201).json({
    success: true,
    data: {
      user,
      token
    },
    message: 'User registered successfully'
  });
});

// 用户登录
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 查找用户（包含密码字段）
  const user = await User.findOne({ email }).select('+password');

  if (!user || !user.isActive) {
    throw new ApiError('Invalid credentials', 401);
  }

  // 验证密码
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError('Invalid credentials', 401);
  }

  // 更新最后登录时间
  user.lastLogin = new Date();
  await user.save();

  // 生成 token
  const token = generateToken({ id: user._id });

  res.json({
    success: true,
    data: {
      user: user.toJSON(),
      token
    },
    message: 'Login successful'
  });
});

// 获取当前用户信息
const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

// 修改密码
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  // 验证当前密码
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);

  if (!isCurrentPasswordValid) {
    throw new ApiError('Current password is incorrect', 400);
  }

  // 更新密码
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

// 登出
const logout = asyncHandler(async (req, res) => {
  // 如果使用 Redis 存储 token，可以在这里将 token 加入黑名单
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = {
  register,
  login,
  getMe,
  changePassword,
  logout
};
```

## 中间件

### 认证中间件

```javascript
// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // 从 header 中获取 token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError('Access token is required', 401);
  }

  try {
    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 获取用户信息
    const user = await User.findById(decoded.id);
    
    if (!user || !user.isActive) {
      throw new ApiError('User not found or inactive', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError('Invalid token', 401);
    } else if (error.name === 'TokenExpiredError') {
      throw new ApiError('Token expired', 401);
    }
    throw error;
  }
});

// 权限验证中间件
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError('Insufficient permissions', 403);
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
```

### 错误处理中间件

```javascript
// src/middleware/errorHandler.js
const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // 日志记录
  console.error(err);

  // Mongoose 错误处理
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ApiError(message, 404);
  }

  // Mongoose 重复字段错误
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = new ApiError(message, 400);
  }

  // Mongoose 验证错误
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new ApiError(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
```

### 请求日志中间件

```javascript
// src/middleware/logger.js
const logger = (req, res, next) => {
  const startTime = Date.now();

  // 记录请求信息
  console.log(`🔍 ${req.method} ${req.url} - ${req.ip}`);

  // 监听响应结束
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusColor = res.statusCode >= 400 ? '🔴' : '🟢';
    
    console.log(
      `${statusColor} ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};

module.exports = logger;
```

## 路由定义

### 用户路由

```javascript
// src/routes/userRoutes.js
const express = require('express');
const {
  getUsers,
  getUser,
  updateProfile,
  deleteAccount,
  searchUsers
} = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { updateProfileSchema } = require('../validators/userValidator');

const router = express.Router();

// 公开路由
router.get('/search', searchUsers);
router.get('/:id', getUser);

// 需要认证的路由
router.use(authenticate);

router.get('/', authorize('admin'), getUsers);
router.put('/profile', validate(updateProfileSchema), updateProfile);
router.delete('/account', deleteAccount);

module.exports = router;
```

### 文章路由

```javascript
// src/routes/postRoutes.js
const express = require('express');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  addComment
} = require('../controllers/postController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createPostSchema, updatePostSchema } = require('../validators/postValidator');

const router = express.Router();

// 公开路由
router.get('/', getPosts);
router.get('/:id', getPost);

// 需要认证的路由
router.use(authenticate);

router.post('/', validate(createPostSchema), createPost);
router.put('/:id', validate(updatePostSchema), updatePost);
router.delete('/:id', deletePost);
router.post('/:id/like', likePost);
router.post('/:id/comments', addComment);

module.exports = router;
```

## 数据验证

### 用户验证器

```javascript
// src/validators/userValidator.js
const Joi = require('joi');

const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(30),
  lastName: Joi.string().min(2).max(30),
  bio: Joi.string().max(500)
});

module.exports = {
  updateProfileSchema
};
```

### 验证中间件

```javascript
// src/middleware/validate.js
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        error: message
      });
    }
    
    next();
  };
};

module.exports = validate;
```

## 工具函数

### API 错误类

```javascript
// src/utils/ApiError.js
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
```

### 异步处理包装器

```javascript
// src/utils/asyncHandler.js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
```

## 测试

### 用户 API 测试

```javascript
// tests/user.test.js
const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

describe('User API', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('should not register user with existing email', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      await User.create(userData);

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
```

## 部署配置

### 环境变量

```bash
# .env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nodejs-api
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### PM2 配置

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'nodejs-api',
    script: './src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
```

## 总结

通过本文，我们构建了一个功能完整的 Node.js RESTful API，包含：

✨ **Express 框架配置**：中间件、路由、错误处理  
✨ **MongoDB 数据建模**：用户、文章模型设计  
✨ **JWT 身份验证**：注册、登录、权限控制  
✨ **CRUD 操作**：完整的增删改查功能  
✨ **数据验证**：请求参数验证和错误处理  
✨ **测试覆盖**：单元测试和集成测试  

这套架构为构建可扩展的 Node.js 应用提供了坚实基础！

---

*持续学习，不断进步！关注更多后端开发技巧~*
