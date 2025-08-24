---
title: "Vue 3 Composition API 深度教程"
excerpt: "全面掌握 Vue 3 Composition API，学习响应式系统、组合式函数、生命周期钩子等核心概念，构建更加灵活的 Vue 应用。"
date: "2024-01-18"
category: "frontend"
tags: ["vue", "vue3", "composition-api", "javascript"]
cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop"
author: "Jacory"
readTime: "16 min"
---

# Vue 3 Composition API 深度教程

Vue 3 引入的 Composition API 为组件逻辑组合提供了全新的方式，让代码更加灵活、可复用、可测试。本文将深入探讨 Composition API 的核心概念和实践应用。

## 为什么需要 Composition API？

### Options API 的局限性

❌ **逻辑分散**：相关逻辑分布在不同选项中  
❌ **复用困难**：mixin 容易产生命名冲突  
❌ **类型推断**：TypeScript 支持不够友好  
❌ **代码组织**：大型组件难以维护  

### Composition API 的优势

✅ **逻辑聚合**：相关逻辑可以组织在一起  
✅ **更好的复用**：通过组合式函数实现逻辑复用  
✅ **TypeScript 友好**：更好的类型推断支持  
✅ **灵活性**：函数式编程范式，更加灵活  

## 响应式基础

### ref 和 reactive

```vue
<template>
  <div>
    <h2>计数器: {{ count }}</h2>
    <button @click="increment">+1</button>
    <button @click="decrement">-1</button>
    
    <h3>用户信息</h3>
    <p>姓名: {{ user.name }}</p>
    <p>年龄: {{ user.age }}</p>
    <button @click="updateUser">更新用户</button>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// ref - 基本类型响应式
const count = ref(0)

// reactive - 对象响应式
const user = reactive({
  name: 'Alice',
  age: 25
})

// 方法定义
const increment = () => {
  count.value++ // ref 需要通过 .value 访问
}

const decrement = () => {
  count.value--
}

const updateUser = () => {
  user.name = 'Bob' // reactive 对象直接修改
  user.age = 30
}
</script>
```

### 响应式原理深入

```javascript
import { ref, reactive, computed, watch, toRefs } from 'vue'

// ref 的本质
const count = ref(0)
console.log(count) // RefImpl 对象
console.log(count.value) // 0

// reactive 的本质
const state = reactive({
  name: 'Vue',
  version: 3
})
console.log(state) // Proxy 对象

// toRefs - 解构响应式对象
const { name, version } = toRefs(state)
// 现在 name 和 version 都是 ref

// isRef, isReactive 工具函数
import { isRef, isReactive } from 'vue'
console.log(isRef(count)) // true
console.log(isReactive(state)) // true
```

## 计算属性和侦听器

### computed 计算属性

```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

// 只读计算属性
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`
})

// 可写计算属性
const writableFullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  set(newValue) {
    const [first, last] = newValue.split(' ')
    firstName.value = first
    lastName.value = last
  }
})

// 购物车示例
const items = ref([
  { name: 'Apple', price: 10, quantity: 2 },
  { name: 'Banana', price: 5, quantity: 3 }
])

const totalPrice = computed(() => {
  return items.value.reduce((sum, item) => {
    return sum + item.price * item.quantity
  }, 0)
})

const formattedTotal = computed(() => {
  return `$${totalPrice.value.toFixed(2)}`
})
</script>
```

### watch 和 watchEffect

```vue
<script setup>
import { ref, watch, watchEffect } from 'vue'

const count = ref(0)
const message = ref('Hello')

// 侦听单个 ref
watch(count, (newCount, oldCount) => {
  console.log(`Count changed from ${oldCount} to ${newCount}`)
})

// 侦听多个数据源
watch([count, message], ([newCount, newMessage], [oldCount, oldMessage]) => {
  console.log('Multiple values changed')
})

// 侦听响应式对象
const user = reactive({
  name: 'Alice',
  age: 25
})

watch(
  () => user.name, // getter 函数
  (newName, oldName) => {
    console.log(`Name changed from ${oldName} to ${newName}`)
  }
)

// 深度侦听
watch(
  user,
  (newUser, oldUser) => {
    console.log('User object changed')
  },
  { deep: true }
)

// watchEffect - 自动收集依赖
watchEffect(() => {
  console.log(`Count is ${count.value}, message is ${message.value}`)
})

// 停止侦听
const stopWatcher = watch(count, () => {
  // 侦听逻辑
})

// 在需要时停止
stopWatcher()
</script>
```

## 生命周期钩子

```vue
<script setup>
import { 
  onMounted, 
  onUpdated, 
  onUnmounted,
  onBeforeMount,
  onBeforeUpdate,
  onBeforeUnmount
} from 'vue'

// 组件挂载前
onBeforeMount(() => {
  console.log('组件即将挂载')
})

// 组件挂载后
onMounted(() => {
  console.log('组件已挂载')
  // 访问 DOM、发起 API 请求等
})

// 组件更新前
onBeforeUpdate(() => {
  console.log('组件即将更新')
})

// 组件更新后
onUpdated(() => {
  console.log('组件已更新')
})

// 组件卸载前
onBeforeUnmount(() => {
  console.log('组件即将卸载')
  // 清理定时器、事件监听器等
})

// 组件卸载后
onUnmounted(() => {
  console.log('组件已卸载')
})

// 实际应用示例
const timer = ref(null)

onMounted(() => {
  timer.value = setInterval(() => {
    console.log('定时器执行')
  }, 1000)
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>
```

## 组合式函数 (Composables)

### 鼠标位置跟踪

```javascript
// composables/useMouse.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => {
    window.addEventListener('mousemove', update)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', update)
  })

  return { x, y }
}
```

### 异步数据获取

```javascript
// composables/useAsyncData.js
import { ref } from 'vue'

export function useAsyncData(fetchFunction) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  const execute = async (...args) => {
    loading.value = true
    error.value = null
    
    try {
      data.value = await fetchFunction(...args)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    error,
    loading,
    execute
  }
}
```

### 本地存储

```javascript
// composables/useLocalStorage.js
import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const storedValue = localStorage.getItem(key)
  const value = ref(storedValue ? JSON.parse(storedValue) : defaultValue)

  watch(
    value,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true }
  )

  return value
}
```

### 组合式函数使用示例

```vue
<template>
  <div>
    <h2>鼠标位置: {{ x }}, {{ y }}</h2>
    
    <div v-if="loading">加载中...</div>
    <div v-else-if="error">错误: {{ error.message }}</div>
    <div v-else-if="data">
      <h3>用户列表</h3>
      <ul>
        <li v-for="user in data" :key="user.id">
          {{ user.name }}
        </li>
      </ul>
    </div>
    
    <button @click="fetchUsers">获取用户</button>
    
    <div>
      <label>主题:</label>
      <select v-model="theme">
        <option value="light">浅色</option>
        <option value="dark">深色</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { useMouse } from './composables/useMouse'
import { useAsyncData } from './composables/useAsyncData'
import { useLocalStorage } from './composables/useLocalStorage'

// 使用组合式函数
const { x, y } = useMouse()

const fetchUsersApi = async () => {
  const response = await fetch('/api/users')
  return response.json()
}

const { data, error, loading, execute: fetchUsers } = useAsyncData(fetchUsersApi)

const theme = useLocalStorage('theme', 'light')
</script>
```

## 高级响应式 API

### toRef 和 toRefs

```javascript
import { reactive, toRef, toRefs } from 'vue'

const state = reactive({
  name: 'Vue',
  version: 3,
  features: ['Composition API', 'Fragments', 'Teleport']
})

// toRef - 为对象的单个属性创建 ref
const name = toRef(state, 'name')
console.log(name.value) // 'Vue'
name.value = 'Vue 3' // 会同步更新 state.name

// toRefs - 为对象的所有属性创建 ref
const { name: refName, version, features } = toRefs(state)

// 在组件中使用
export default {
  setup() {
    const state = reactive({
      count: 0,
      message: 'Hello'
    })
    
    // 直接返回会失去响应性
    // return { ...state } // ❌
    
    // 使用 toRefs 保持响应性
    return { ...toRefs(state) } // ✅
  }
}
```

### customRef

```javascript
import { customRef } from 'vue'

// 防抖 ref
function useDebouncedRef(value, delay = 200) {
  let timeout
  
  return customRef((track, trigger) => {
    return {
      get() {
        track() // 收集依赖
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger() // 触发更新
        }, delay)
      }
    }
  })
}

// 使用示例
const debouncedText = useDebouncedRef('', 500)
```

### shallowRef 和 shallowReactive

```javascript
import { shallowRef, shallowReactive } from 'vue'

// shallowRef - 只有 .value 的改变是响应式的
const shallowState = shallowRef({
  count: 0,
  nested: { value: 1 }
})

// 这会触发更新
shallowState.value = { count: 1, nested: { value: 2 } }

// 这不会触发更新
shallowState.value.count = 2

// shallowReactive - 只有根级别属性是响应式的
const shallowObj = shallowReactive({
  count: 0,
  nested: { value: 1 }
})

// 这会触发更新
shallowObj.count = 1

// 这不会触发更新
shallowObj.nested.value = 2
```

## 与 TypeScript 结合

### 类型化的组合式函数

```typescript
// composables/useCounter.ts
import { ref, Ref } from 'vue'

interface UseCounterOptions {
  min?: number
  max?: number
  step?: number
}

interface UseCounterReturn {
  count: Ref<number>
  increment: () => void
  decrement: () => void
  reset: () => void
}

export function useCounter(
  initialValue = 0,
  options: UseCounterOptions = {}
): UseCounterReturn {
  const { min = 0, max = 100, step = 1 } = options
  
  const count = ref(initialValue)
  
  const increment = () => {
    if (count.value < max) {
      count.value += step
    }
  }
  
  const decrement = () => {
    if (count.value > min) {
      count.value -= step
    }
  }
  
  const reset = () => {
    count.value = initialValue
  }
  
  return {
    count,
    increment,
    decrement,
    reset
  }
}
```

### 组件 Props 类型

```vue
<template>
  <div>
    <h2>{{ title }}</h2>
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Item {
  id: number
  name: string
}

interface Props {
  title: string
  items: Item[]
  maxItems?: number
}

// 定义 props
const props = withDefaults(defineProps<Props>(), {
  maxItems: 10
})

// 定义 emits
const emit = defineEmits<{
  itemClick: [item: Item]
  update: [count: number]
}>()

// 使用 props
console.log(props.title) // 类型安全
</script>
```

## 最佳实践

### 1. 组合式函数命名

```javascript
// ✅ 使用 "use" 前缀
export function useCounter() { }
export function useMouse() { }
export function useLocalStorage() { }

// ❌ 避免的命名
export function counter() { }
export function mouse() { }
```

### 2. 返回值约定

```javascript
// ✅ 返回对象，方便解构
export function useCounter() {
  return {
    count,
    increment,
    decrement
  }
}

// ✅ 大量返回值时使用 toRefs
export function useComplexState() {
  const state = reactive({
    // 很多属性
  })
  
  return {
    ...toRefs(state),
    // 方法
  }
}
```

### 3. 副作用清理

```javascript
export function useEventListener(target, event, handler) {
  onMounted(() => {
    target.addEventListener(event, handler)
  })
  
  onUnmounted(() => {
    target.removeEventListener(event, handler)
  })
}
```

### 4. 响应式最佳实践

```javascript
// ✅ 基本类型使用 ref
const count = ref(0)
const message = ref('')

// ✅ 对象使用 reactive
const user = reactive({
  name: '',
  age: 0
})

// ✅ 数组使用 ref 包装
const items = ref([])

// ❌ 避免解构 reactive 对象
const { name, age } = reactive({ name: '', age: 0 }) // 失去响应性

// ✅ 使用 toRefs 解构
const state = reactive({ name: '', age: 0 })
const { name, age } = toRefs(state)
```

## 迁移策略

### 从 Options API 迁移

```javascript
// Options API
export default {
  data() {
    return {
      count: 0,
      message: 'Hello'
    }
  },
  computed: {
    doubleCount() {
      return this.count * 2
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  mounted() {
    console.log('mounted')
  }
}

// Composition API
export default {
  setup() {
    const count = ref(0)
    const message = ref('Hello')
    
    const doubleCount = computed(() => count.value * 2)
    
    const increment = () => {
      count.value++
    }
    
    onMounted(() => {
      console.log('mounted')
    })
    
    return {
      count,
      message,
      doubleCount,
      increment
    }
  }
}
```

## 总结

Vue 3 Composition API 为组件开发带来了新的思路：

✨ **更好的逻辑复用**：通过组合式函数实现  
✨ **更清晰的代码组织**：相关逻辑聚合在一起  
✨ **更强的类型支持**：与 TypeScript 完美结合  
✨ **更灵活的组合**：函数式编程范式  

掌握 Composition API，让你的 Vue 应用更加现代化和可维护！

---

*探索更多 Vue 3 技巧，关注我的技术分享！*
