import { computed, inject, onBeforeUnmount, provide, reactive, ref } from 'vue'

const homeReadinessKey = Symbol('home-readiness')

export async function decodeHomeImage(image) {
  await image.decode()
  if (!image.complete || !image.naturalWidth) throw new Error('Homepage image is incomplete')
}

export function useHomeReadiness() {
  const tasks = reactive(new Map())
  const sealed = ref(false)
  let disposed = false
  onBeforeUnmount(() => { disposed = true })

  function register(name) {
    tasks.set(name, 'pending')
    const resolve = () => {
      if (!disposed && tasks.get(name) === 'pending') tasks.set(name, 'ready')
    }
    const reject = (error) => {
      if (disposed) return
      tasks.set(name, 'failed')
      console.error(`[HomeReadiness] ${name}`, error)
    }
    const run = async (prepare) => {
      try {
        await prepare()
        resolve()
      } catch (error) {
        reject(error)
      }
    }
    return { resolve, reject, run }
  }

  provide(homeReadinessKey, register)
  const states = computed(() => [...tasks.values()])
  return {
    register,
    seal: () => { sealed.value = true },
    ready: computed(() => sealed.value && states.value.every(state => state === 'ready')),
    failed: computed(() => states.value.includes('failed')),
    progress: computed(() => sealed.value && states.value.length
      ? states.value.filter(state => state === 'ready').length / states.value.length * 100
      : 0)
  }
}

export function useHomeLoadingTask(name) {
  const register = inject(homeReadinessKey)
  return register(name)
}

// Include the fonts used by all mounted homepage text, even below the fold.
// FontFaceSet.ready alone also resolves when a face has failed to load.
export function loadHomeFonts(root) {
  const fonts = new Map([
    ['400 16px Anton', 'WHO AM I? JACORY VISUAL MOTION DESIGN PHOTO VIDEO DEVELOPMENT'],
    ['900 16px "Geist Variable"', '0123456789']
  ])
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const node = walker.currentNode
    const element = node.parentElement
    const text = node.textContent.trim()
    if (!text || !element || element.closest('script, style, noscript')) continue
    const style = getComputedStyle(element)
    const font = `${style.fontStyle} ${style.fontWeight} 16px ${style.fontFamily}`
    fonts.set(font, (fonts.get(font) || '') + text)
  }
  return Promise.all([...fonts].map(([font, text]) =>
    document.fonts.load(font, [...new Set(text)].join(''))
  ))
}
