<template>
  <section
    ref="photoVideoPage"
    data-home-photo-video-page
    class="home-photo-video-page relative isolate grid grid-rows-[auto_1fr] overflow-hidden bg-photo-video-lower text-photo-video-copy"
    aria-label="Photo &amp; Video"
  >
    <div
      data-photo-video-background-upper
      class="home-photo-video-heading pointer-events-none relative z-0 w-full bg-photo-video-background px-[2%]"
    >
      <h2 class="m-0 flex justify-between whitespace-nowrap font-display text-photo-video-display font-normal leading-none tracking-[-0.025em] text-photo-video-title">
        <span class="home-photo-video-word">PHOTO</span>
        <span class="home-photo-video-word">&amp;</span>
        <span class="home-photo-video-word">VIDEO</span>
      </h2>
    </div>
    <aside
      data-photo-video-interests
      lang="en"
      aria-label="Interests and visual influences"
      class="absolute inset-x-[4%] bottom-6 z-0 grid grid-cols-2 gap-x-6 gap-y-6 lg:relative lg:inset-auto lg:ml-[2cqw] lg:mt-[2cqw] lg:flex lg:min-h-0 lg:flex-col lg:gap-0 lg:mb-[2cqw] lg:w-[calc(48cqw-0.33*min(100cqw,var(--home-transition-stage-height)*1.6)-1.5rem)] lg:self-stretch lg:[container-type:size]"
    >
      <p ref="partFrame" data-photo-video-part class="m-0 hidden h-1/3 w-[calc(100%+min(100vw,var(--home-transition-stage-height)*1.6)*0.1)] shrink-0 items-start whitespace-nowrap font-display text-photo-video-part font-normal leading-none tracking-tight text-photo-video-background lg:flex">
        <span ref="partLabel" class="home-photo-video-word text-photo-video-part" :style="partSize ? { '--photo-video-part-size': partSize } : undefined">PART II</span>
      </p>
      <div ref="interestCopy" :style="{ '--photo-video-copy-offset': `${copyOffset}px` }" class="contents lg:grid lg:min-h-0 lg:flex-1 lg:translate-y-[var(--photo-video-copy-offset)] lg:grid-rows-[6fr_4fr] lg:gap-[4cqh] lg:pt-[6cqh]">
        <div
          v-for="group in interestGroups"
          :key="group.id"
          class="lg:flex lg:min-h-0 lg:flex-col"
        >
          <h3 :id="group.id" class="m-0 font-sans text-xs font-medium uppercase leading-relaxed tracking-[0.12em] text-photo-video-copy lg:text-photo-video-caption lg:tracking-[0.08em]">
            {{ group.title }}
          </h3>
          <ul
            :aria-labelledby="group.id"
            class="m-0 mt-3 list-none space-y-1 p-0 font-sans text-base font-medium leading-snug tracking-tight lg:mt-[2cqh] lg:flex lg:flex-1 lg:flex-col lg:justify-between lg:space-y-0 lg:font-display lg:text-photo-video-interest lg:font-normal lg:uppercase lg:tracking-[-0.015em] lg:text-photo-video-background"
          >
            <li v-for="item in group.items" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>
    </aside>
    <div class="pointer-events-none absolute inset-0 z-10 grid place-items-center">
      <div ref="artworkStage" class="home-photo-video-composition relative isolate aspect-[4/5] w-full sm:aspect-[8/5]">
        <div :style="{ '--photo-video-artwork-scale': artworkScale, '--photo-video-artwork-offset': `${artworkOffset}px` }" class="absolute inset-0 z-10 lg:origin-[17%_57%] lg:translate-y-[var(--photo-video-artwork-offset)] lg:scale-[var(--photo-video-artwork-scale)]">
          <div
            v-for="frame in frames"
            :key="frame.name"
            :data-photo-video-frame="frame.name"
            :class="frame.layout"
            class="pointer-events-none absolute overflow-hidden outline outline-1 outline-white"
            aria-hidden="true"
          >
            <img
              v-if="frame.src"
              :src="frame.src"
              :style="frame.crop"
              class="absolute max-w-none select-none"
              alt=""
              :width="frame.width || 1774"
              :height="frame.height || 887"
              loading="lazy"
              decoding="async"
              draggable="false"
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onBeforeUnmount, nextTick, ref } from 'vue'
import dinosaur from '../../../assets/home-photo-video/photo-video-dinosaur.png'
import dog from '../../../assets/home-photo-video/dog-avatar-human-v3.png'
import cat from '../../../assets/home-photo-video/photo-video-cat.png'
import dinosaurDetail from '../../../assets/home-photo-video/dinosaur-detail-v2.png'
import dinosaurPortrait from '../../../assets/home-photo-video/dinosaur-portrait-v2.png'
import dogDetail from '../../../assets/home-photo-video/dog-detail-flap-v3.png'
import dogPortrait from '../../../assets/home-photo-video/dog-portrait-human-v3.png'
import catDetail from '../../../assets/home-photo-video/cat-detail-v2.png'
import catPortrait from '../../../assets/home-photo-video/cat-portrait-human-v3.png'

const characterSets = [
  { landscape: dinosaur, portrait: dinosaurPortrait, square: dinosaurDetail },
  { landscape: dog, portrait: dogPortrait, square: dogDetail },
  { landscape: cat, portrait: catPortrait, square: catDetail }
]
const photoVideoPage = ref(null)
const partFrame = ref(null)
const partLabel = ref(null)
const partSize = ref('')
const artworkStage = ref(null)
const artworkScale = ref(1)
const artworkOffset = ref(0)
const interestCopy = ref(null)
const copyOffset = ref(0)
let textMetrics
let labelObserver

// Keep the square's upper-left corner fixed so the left text layout stays intact.
function fitArtworkGroup() {
  const page = photoVideoPage.value
  const stage = artworkStage.value
  if (!page || !stage || !window.matchMedia('(min-width: 1024px)').matches) {
    artworkScale.value = 1
    artworkOffset.value = 0
    return
  }
  const square = stage.querySelector('[data-photo-video-frame="square"]')
  const frames = Array.from(stage.querySelectorAll('[data-photo-video-frame]'))
  if (!square || !frames.length) return
  const pageBounds = page.getBoundingClientRect()
  const stageBounds = stage.getBoundingClientRect()
  const anchorX = stageBounds.left + square.offsetLeft
  const anchorY = stageBounds.top + square.offsetTop
  const rightExtent = Math.max(...frames.map(frame => frame.offsetLeft + frame.offsetWidth)) - square.offsetLeft
  const bottomExtent = Math.max(...frames.map(frame => frame.offsetTop + frame.offsetHeight)) - square.offsetTop
  const gutter = page.clientWidth * 0.02
  artworkScale.value = Math.max(1, Math.min(
    (pageBounds.right - gutter - anchorX) / rightExtent,
    (pageBounds.bottom - gutter - anchorY) / bottomExtent
  ))
  const bottomSpace = pageBounds.bottom - (anchorY + bottomExtent * artworkScale.value)
  artworkOffset.value = Math.max(0, Math.min(20, bottomSpace - 12))
}

// Fit natural letterforms to the empty space above the square image.
async function fitPartLabel() {
  fitArtworkGroup()
  const frame = partFrame.value
  const label = partLabel.value
  const square = photoVideoPage.value?.querySelector('[data-photo-video-frame="square"]')
  if (!frame?.clientWidth || !label || !square) return
  const bounds = label.getBoundingClientRect()
  if (!bounds.width || !bounds.height) return
  // Keep label sizing anchored to the square's original position, before the visual shift.
  const squareTop = artworkStage.value.getBoundingClientRect().top + square.offsetTop
  const availableHeight = Math.min(frame.clientHeight, squareTop - frame.getBoundingClientRect().top - 12)
  if (availableHeight <= 0) return
  const scale = Math.min(frame.clientWidth / bounds.width, availableHeight / bounds.height)
  partSize.value = `${parseFloat(getComputedStyle(label).fontSize) * scale}px`
  await nextTick()
  balanceInterestCopy()
}

// Use visible glyph edges instead of line boxes, which include font leading.
function glyphBounds(element) {
  const style = getComputedStyle(element)
  const box = element.getBoundingClientRect()
  textMetrics ??= document.createElement('canvas').getContext('2d')
  textMetrics.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
  const content = style.textTransform === 'uppercase' ? element.textContent.toUpperCase() : element.textContent
  const metrics = textMetrics.measureText(content.trim())
  const size = parseFloat(style.fontSize)
  const ascent = metrics.fontBoundingBoxAscent ?? size * 0.8
  const descent = metrics.fontBoundingBoxDescent ?? size * 0.2
  const baseline = box.top + (parseFloat(style.lineHeight) - ascent - descent) / 2 + ascent
  return { top: baseline - metrics.actualBoundingBoxAscent, bottom: baseline + metrics.actualBoundingBoxDescent }
}

function balanceInterestCopy() {
  const copy = interestCopy.value
  if (!copy || getComputedStyle(copy).display !== 'grid') return
  const first = copy.querySelector('h3')
  const last = Array.from(copy.querySelectorAll('li')).at(-1)
  if (!first || !last || !partLabel.value || !photoVideoPage.value) return
  const upperGap = glyphBounds(first).top - partLabel.value.getBoundingClientRect().bottom
  const lowerGap = photoVideoPage.value.getBoundingClientRect().bottom - glyphBounds(last).bottom
  copyOffset.value += (lowerGap - upperGap) / 2
}

onBeforeUnmount(() => labelObserver?.disconnect())
const interestGroups = [
  {
    id: 'photo-video-subjects',
    title: 'Subjects of interest',
    items: ['Humanities', 'Social sciences', 'Everyday life', 'Culture & memory', 'People & places']
  },
  {
    id: 'photo-video-influences',
    title: 'Visual influences',
    items: ['Documentary', 'Cinematic realism', 'Experimental imagery']
  }
]

const fullImage = { width: '100%', height: '100%', left: 0, top: 0, objectFit: 'contain' }

const frames = ref([
  {
    name: 'landscape',
    src: null,
    width: 1448,
    height: 1086,
    layout: 'left-[18%] top-[27%] z-0 aspect-[4/3] w-[64%] sm:left-[27%] sm:top-[25%] sm:w-[46%]',
    crop: fullImage
  },
  {
    name: 'portrait',
    src: null,
    width: 941,
    height: 1672,
    layout: 'left-[72%] top-[42%] z-10 aspect-[9/16] w-[23%] sm:left-[68%] sm:top-[35.2%] sm:w-[18.4%]',
    crop: fullImage
  },
  {
    name: 'square',
    src: null,
    width: 1254,
    height: 1254,
    layout: 'left-[5%] top-[51%] z-20 aspect-square w-[26%] sm:left-[17%] sm:top-[57%] sm:w-[18%]',
    crop: fullImage
  }
])

onMounted(() => {
  labelObserver = new ResizeObserver(fitPartLabel)
  labelObserver.observe(photoVideoPage.value)
  labelObserver.observe(partFrame.value)
  labelObserver.observe(artworkStage.value)
  document.fonts.ready.then(fitPartLabel)
  // Pick one complete set per visit, after hydration, so all three images match.
  const character = characterSets[Math.floor(Math.random() * characterSets.length)]
  frames.value = frames.value.map(frame => ({ ...frame, src: character[frame.name] }))
})
</script>

<style scoped>
.home-photo-video-page {
  height: var(--home-transition-stage-height);
  container-type: inline-size;
}

.home-photo-video-composition {
  container-type: inline-size;
  max-width: calc(var(--home-transition-stage-height) * 0.8);
}

.home-photo-video-heading {
  /* Keep the mobile title aligned with the collage, with equal total gaps. */
  padding-block: max(1rem, calc(var(--home-transition-stage-height) / 2 - 40cqw));
}

.home-photo-video-word {
  /* Remove font-internal leading so visible capitals have balanced spacing. */
  text-box: trim-both cap alphabetic;
}

@media (min-width: 640px) {
  .home-photo-video-composition {
    max-width: calc(var(--home-transition-stage-height) * 1.6);
  }

  .home-photo-video-heading {
    padding-block: 2.5cqw;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .home-photo-video-page {
    position: sticky;
    top: var(--navbar-height);
    z-index: 0;
  }
}
</style>
