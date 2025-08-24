---
title: "TypeScript 实战指南"
excerpt: "从基础语法到高级特性，掌握 TypeScript 在大型项目中的应用。学习类型系统、泛型、装饰器等核心概念。"
date: "2024-01-20"
category: "frontend"
tags: ["typescript", "javascript", "types", "tutorial"]
cover: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800&h=400&fit=crop"
author: "Jacory"
readTime: "18 min"
---

# TypeScript 实战指南

TypeScript 是 JavaScript 的超集，为大型应用程序开发提供了强大的类型系统。本文将带你从基础到高级，全面掌握 TypeScript 的实战应用。

## 为什么选择 TypeScript？

### JavaScript 的局限性

❌ **运行时错误**：类型错误只有在运行时才能发现  
❌ **重构困难**：缺乏类型信息，重构风险高  
❌ **IDE 支持有限**：自动补全和错误检查不够准确  
❌ **团队协作困难**：缺乏明确的接口定义  

### TypeScript 的优势

✅ **编译时类型检查**：在开发阶段就能发现错误  
✅ **更好的 IDE 体验**：智能提示、重构、导航  
✅ **渐进式采用**：可以逐步从 JavaScript 迁移  
✅ **更好的文档化**：类型即文档  

## 基础类型系统

### 基本类型

```typescript
// 基础类型
let name: string = "Jacory";
let age: number = 25;
let isActive: boolean = true;
let scores: number[] = [95, 87, 92];
let colors: Array<string> = ["red", "green", "blue"];

// 元组类型
let person: [string, number] = ["Alice", 30];

// 枚举类型
enum Status {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected"
}

// 联合类型
type Theme = "light" | "dark";
let currentTheme: Theme = "light";

// 字面量类型
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
```

### 对象类型和接口

```typescript
// 接口定义
interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string; // 可选属性
  readonly createdAt: Date; // 只读属性
}

// 接口继承
interface Admin extends User {
  permissions: string[];
  role: "admin" | "super-admin";
}

// 类型别名
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

// 函数类型
interface EventHandler {
  (event: MouseEvent): void;
}

// 索引签名
interface StringDictionary {
  [key: string]: string;
}
```

## 高级类型特性

### 泛型 (Generics)

```typescript
// 基本泛型函数
function identity<T>(arg: T): T {
  return arg;
}

// 泛型接口
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

// 泛型约束
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// 条件类型
type NonNullable<T> = T extends null | undefined ? never : T;

// 映射类型
type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

### 实用类型工具

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Pick - 选择特定属性
type PublicUser = Pick<User, "id" | "name" | "email">;

// Omit - 排除特定属性  
type CreateUser = Omit<User, "id">;

// Record - 创建记录类型
type UserRoles = Record<string, "admin" | "user" | "guest">;

// Extract 和 Exclude
type T1 = Extract<"a" | "b" | "c", "a" | "f">; // "a"
type T2 = Exclude<"a" | "b" | "c", "a" | "f">; // "b" | "c"
```

## React 中的 TypeScript

### 组件类型定义

```typescript
import React, { FC, ReactNode } from 'react';

// Props 接口
interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// 函数组件
const Button: FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  onClick 
}) => {
  return (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// 使用泛型的组件
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item, index)}</li>
      ))}
    </ul>
  );
}
```

### Hook 类型定义

```typescript
import { useState, useEffect, useReducer } from 'react';

// useState 类型推断
const [count, setCount] = useState(0); // number
const [name, setName] = useState<string | null>(null);

// useEffect 依赖项类型
useEffect(() => {
  // 副作用逻辑
}, [count]); // count 必须是依赖项

// useReducer 类型定义
interface State {
  count: number;
  loading: boolean;
}

type Action = 
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'setLoading'; payload: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    case 'decrement':
      return { ...state, count: state.count - 1 };
    case 'setLoading':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0, loading: false });
```

## API 集成类型

### Fetch API 类型化

```typescript
// API 响应类型
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  createdAt: string;
}

// 类型化的 API 客户端
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async post<T, U>(endpoint: string, data: T): Promise<ApiResponse<U>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    return response.json();
  }
}

// 使用示例
const apiClient = new ApiClient('https://api.example.com');

async function fetchPosts(): Promise<Post[]> {
  const response = await apiClient.get<Post[]>('/posts');
  return response.data;
}

async function createPost(postData: Omit<Post, 'id' | 'createdAt'>): Promise<Post> {
  const response = await apiClient.post<typeof postData, Post>('/posts', postData);
  return response.data;
}
```

## 装饰器 (Decorators)

```typescript
// 启用装饰器 (tsconfig.json)
// "experimentalDecorators": true

// 类装饰器
function Component(target: any) {
  target.prototype.isComponent = true;
}

// 方法装饰器
function Log(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyName} with args:`, args);
    const result = method.apply(this, args);
    console.log(`Method ${propertyName} returned:`, result);
    return result;
  };
}

// 属性装饰器
function ReadOnly(target: any, propertyName: string) {
  Object.defineProperty(target, propertyName, {
    writable: false
  });
}

// 使用装饰器
@Component
class UserService {
  @ReadOnly
  private apiUrl = 'https://api.example.com';

  @Log
  async getUser(id: number): Promise<User> {
    const response = await fetch(`${this.apiUrl}/users/${id}`);
    return response.json();
  }
}
```

## 配置和最佳实践

### tsconfig.json 配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/utils/*": ["utils/*"]
    }
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

### 最佳实践

#### 1. 类型组织

```typescript
// types/index.ts - 集中管理类型
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
}

export type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};
```

#### 2. 严格模式配置

```typescript
// 启用严格模式
"strict": true,
"noImplicitAny": true,
"strictNullChecks": true,
"strictFunctionTypes": true,
"noImplicitReturns": true,
"noUnusedLocals": true,
"noUnusedParameters": true
```

#### 3. 错误处理

```typescript
// 结果类型模式
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function safeApiCall<T>(
  apiCall: () => Promise<T>
): Promise<Result<T>> {
  try {
    const data = await apiCall();
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Unknown error') 
    };
  }
}

// 使用示例
const result = await safeApiCall(() => fetchUser(123));

if (result.success) {
  console.log(result.data.name); // 类型安全
} else {
  console.error(result.error.message);
}
```

## 迁移策略

### 从 JavaScript 迁移

```typescript
// 1. 重命名文件：.js → .ts
// 2. 添加基本类型注解
// 3. 启用严格模式
// 4. 逐步完善类型定义

// 迁移前 (JavaScript)
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// 迁移后 (TypeScript)
interface CartItem {
  price: number;
  quantity: number;
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
```

## 总结

TypeScript 为 JavaScript 开发带来了强大的类型系统，虽然增加了一些学习成本，但在大型项目中的收益是巨大的：

✨ **开发效率提升**：更好的 IDE 支持和错误检查  
✨ **代码质量提高**：编译时发现潜在问题  
✨ **团队协作改善**：明确的接口定义和文档化  
✨ **重构更安全**：类型系统保证重构的正确性  

从简单的类型注解开始，逐步掌握泛型、高级类型等特性，你会发现 TypeScript 让 JavaScript 开发变得更加愉快和可靠！

---

*更多 TypeScript 技巧和实践，请关注我的技术博客！*
