<template>
  <main class="cyberpunk-page min-h-screen overflow-hidden">
    <header class="cyber-header relative z-30 border-b">
      <div class="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 md:px-8">
        <RouterLink to="/" class="cyber-link flex items-center gap-3" :aria-label="t('cyberpunk.backToSpace')">
          <span class="cyber-mark" aria-hidden="true"><span /></span>
          <span class="font-mono text-xs uppercase tracking-[0.18em]">Jacory Space</span>
        </RouterLink>
        <div class="flex items-center gap-5 font-mono text-xs uppercase tracking-[0.14em]">
          <span class="hidden text-[var(--cy-dim)] md:inline">{{ t('cyberpunk.studyLabel') }}</span>
          <LanguageSwitcher />
        </div>
      </div>
    </header>

    <section class="cyber-hero relative isolate min-h-[calc(100svh-4.25rem)]">
      <div class="cyber-atmosphere" aria-hidden="true" />
      <div class="cyber-grid-floor" aria-hidden="true" />
      <div class="cyber-frame cyber-frame-left" aria-hidden="true" />
      <div class="cyber-frame cyber-frame-right" aria-hidden="true" />

      <div class="cyber-city" aria-hidden="true">
        <div
          v-for="building in skylineBuildings"
          :key="building.id"
          class="cyber-building"
          :style="{ '--building-height': `${building.height}%`, '--building-width': `${building.width}%`, '--building-left': `${building.left}%` }"
        >
          <span v-for="window in building.windows" :key="window" class="cyber-window" />
        </div>
        <span class="cyber-beacon" />
      </div>

      <div class="relative z-10 mx-auto grid min-h-[calc(100svh-4.25rem)] max-w-[1600px] grid-cols-12 content-between gap-y-12 px-5 pb-8 pt-12 md:px-8 md:pb-10 md:pt-16">
        <div class="col-span-12 md:col-span-7 lg:col-span-6">
          <p class="cyber-kicker flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em]">
            <span class="cyber-live-dot" aria-hidden="true" />
            {{ t('cyberpunk.kicker') }}
          </p>
          <h1 class="mt-8 max-w-4xl text-6xl font-medium uppercase leading-[0.82] tracking-[-0.08em] text-[var(--cy-bone)] sm:text-8xl md:mt-12 md:text-9xl">
            <span class="block">{{ t('cyberpunk.titleLead') }}</span>
            <span class="cyber-title-accent block">{{ t('cyberpunk.titleAccent') }}</span>
          </h1>
          <p class="mt-8 max-w-md text-sm leading-7 text-[var(--cy-mist)] md:mt-10 md:text-base">
            {{ t('cyberpunk.description') }}
          </p>
          <a href="#archive" class="cyber-button mt-8 inline-flex items-center gap-4 font-mono text-xs uppercase tracking-[0.16em] md:mt-10">
            <span>{{ t('cyberpunk.enterArchive') }}</span>
            <ArrowDownRight class="h-4 w-4" :stroke-width="1.5" />
          </a>
        </div>

        <aside class="cyber-monitor col-span-12 self-end md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9" aria-label="Signal monitor">
          <div class="flex items-start justify-between border-b border-[var(--cy-line)] px-4 py-3">
            <div>
              <p class="font-mono text-xs uppercase tracking-[0.18em] text-[var(--cy-signal)]">{{ t('cyberpunk.signalLabel') }}</p>
              <p class="mt-1 font-mono text-xs text-[var(--cy-dim)]">{{ t('cyberpunk.signalStatus') }}</p>
            </div>
            <Radio class="h-4 w-4 text-[var(--cy-warning)]" :stroke-width="1.5" />
          </div>
          <div class="cyber-waveform flex h-20 items-end gap-1 px-4 py-4" aria-hidden="true">
            <span v-for="bar in waveform" :key="bar" :style="{ '--bar-height': `${bar}%` }" />
          </div>
          <dl class="grid grid-cols-2 border-t border-[var(--cy-line)] font-mono text-xs">
            <div class="border-r border-[var(--cy-line)] px-4 py-3">
              <dt class="text-[var(--cy-dim)]">{{ t('cyberpunk.systemLabel') }}</dt>
              <dd class="mt-1 text-[var(--cy-bone)]">JX-09 / ONLINE</dd>
            </div>
            <div class="px-4 py-3">
              <dt class="text-[var(--cy-dim)]">{{ t('cyberpunk.locationLabel') }}</dt>
              <dd class="mt-1 text-[var(--cy-bone)]">31.2°N / 121.5°E</dd>
            </div>
          </dl>
        </aside>

        <div class="col-span-12 flex items-end justify-between border-t border-[var(--cy-line)] pt-4 font-mono text-xs uppercase tracking-[0.14em] text-[var(--cy-dim)]">
          <span>06 / 24 — {{ t('cyberpunk.studyLabel') }}</span>
          <span class="hidden sm:inline">{{ t('cyberpunk.timeLabel') }} · 23:41:08</span>
          <span class="cyber-scroll-cue inline-flex items-center gap-2 text-[var(--cy-signal)]"><span class="h-px w-8 bg-current" /> 01</span>
        </div>
      </div>
    </section>

    <section id="archive" class="cyber-archive relative border-t border-[var(--cy-line)]">
      <div class="mx-auto grid max-w-[1600px] gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-12 lg:gap-8">
        <div class="lg:col-span-4">
          <p class="cyber-kicker font-mono text-xs uppercase tracking-[0.2em]">{{ t('cyberpunk.archiveKicker') }}</p>
          <h2 class="mt-6 max-w-lg text-4xl font-medium uppercase leading-[0.9] tracking-[-0.06em] text-[var(--cy-bone)] md:text-6xl">
            {{ t('cyberpunk.archiveTitle') }}
          </h2>
          <p class="mt-7 max-w-md text-sm leading-7 text-[var(--cy-mist)]">{{ t('cyberpunk.archiveBody') }}</p>
        </div>

        <div class="lg:col-span-7 lg:col-start-6">
          <div class="border-y border-[var(--cy-line)]">
            <button
              v-for="(signal, index) in signals"
              :key="signal.id"
              type="button"
              class="cyber-signal-row group grid w-full grid-cols-[2.5rem_minmax(0,1fr)_auto] items-start gap-4 border-b border-[var(--cy-line)] py-5 text-left last:border-b-0 md:grid-cols-[3.5rem_minmax(0,1fr)_auto]"
              :aria-pressed="activeSignal === signal.id"
              @click="activeSignal = signal.id"
            >
              <span class="font-mono text-xs text-[var(--cy-dim)]">0{{ index + 1 }}</span>
              <span>
                <span class="block text-lg uppercase tracking-[-0.03em] text-[var(--cy-bone)] transition-colors group-hover:text-[var(--cy-signal)]">{{ signal.title }}</span>
                <span class="mt-2 block max-w-lg text-sm leading-6 text-[var(--cy-mist)]" :class="activeSignal === signal.id ? 'opacity-100' : 'opacity-70'">{{ signal.description }}</span>
              </span>
              <component :is="activeSignal === signal.id ? Minus : Plus" class="mt-1 h-4 w-4 text-[var(--cy-signal)]" :stroke-width="1.5" />
            </button>
          </div>
        </div>
      </div>
      <div class="cyber-archive-footer border-t border-[var(--cy-line)] px-5 py-5 md:px-8">
        <div class="mx-auto flex max-w-[1600px] items-center justify-between font-mono text-xs uppercase tracking-[0.15em] text-[var(--cy-dim)]">
          <span>{{ t('cyberpunk.footerLabel') }}</span>
          <RouterLink to="/" class="cyber-link inline-flex items-center gap-2 text-[var(--cy-signal)]">
            {{ t('cyberpunk.backToSpace') }}
            <ArrowUpRight class="h-3.5 w-3.5" :stroke-width="1.5" />
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowDownRight, ArrowUpRight, Minus, Plus, Radio } from 'lucide-vue-next'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'

const { t } = useI18n()
const activeSignal = ref('analog')

const skylineBuildings = [
  { id: 1, height: 43, width: 12, left: 0, windows: 7 },
  { id: 2, height: 58, width: 10, left: 9, windows: 9 },
  { id: 3, height: 35, width: 16, left: 18, windows: 6 },
  { id: 4, height: 68, width: 12, left: 32, windows: 12 },
  { id: 5, height: 50, width: 18, left: 43, windows: 10 },
  { id: 6, height: 79, width: 13, left: 57, windows: 15 },
  { id: 7, height: 46, width: 15, left: 70, windows: 8 },
  { id: 8, height: 62, width: 11, left: 82, windows: 11 },
  { id: 9, height: 38, width: 12, left: 91, windows: 6 },
]

const waveform = [22, 38, 18, 64, 46, 82, 36, 55, 28, 72, 49, 31, 66, 44, 88, 26, 52, 35, 74, 42, 59, 24, 67, 37]

const signals = computed(() => [
  { id: 'analog', title: t('cyberpunk.modules.analog.title'), description: t('cyberpunk.modules.analog.description') },
  { id: 'density', title: t('cyberpunk.modules.density.title'), description: t('cyberpunk.modules.density.description') },
  { id: 'linework', title: t('cyberpunk.modules.linework.title'), description: t('cyberpunk.modules.linework.description') },
  { id: 'motion', title: t('cyberpunk.modules.motion.title'), description: t('cyberpunk.modules.motion.description') },
])
</script>

<style scoped>
.cyberpunk-page {
  --background: var(--cy-void);
  --foreground: var(--cy-bone);
  --card: var(--cy-ink);
  --card-foreground: var(--cy-bone);
  --muted-foreground: var(--cy-dim);
  --border: var(--cy-line);
  --line: var(--cy-line);
  --line-strong: rgba(153, 202, 204, 0.46);
  --blue: var(--cy-signal);
  --cy-void: #070b10;
  --cy-ink: #101a28;
  --cy-ink-deep: #0b121b;
  --cy-signal: #70d8d2;
  --cy-signal-dim: #247c80;
  --cy-bone: #e3e9e3;
  --cy-mist: #a4b4b4;
  --cy-dim: #718189;
  --cy-line: rgba(153, 202, 204, 0.24);
  --cy-warning: #ed5c61;
  position: relative;
  background: var(--cy-void);
  color: var(--cy-bone);
}

.cyberpunk-page::before {
  position: fixed;
  inset: 0;
  z-index: 40;
  pointer-events: none;
  content: "";
  opacity: 0.08;
  background: repeating-linear-gradient(0deg, transparent 0, transparent 3px, rgba(159, 230, 224, 0.18) 4px, transparent 5px);
  mix-blend-mode: screen;
}

.cyber-header {
  border-color: var(--cy-line);
  background: rgba(7, 11, 16, 0.86);
  color: var(--cy-bone);
  backdrop-filter: blur(10px);
}

.cyber-link { transition: color 300ms var(--ease-premium); }
.cyber-link:hover, .cyber-link:focus-visible { color: var(--cy-signal); }

.cyber-mark { display: grid; width: 1.25rem; height: 1.25rem; place-items: center; border: 1px solid var(--cy-signal); transform: rotate(45deg); }
.cyber-mark span { display: block; width: 0.4rem; height: 0.4rem; background: var(--cy-warning); }
.cyber-hero { background: var(--cy-void); }

.cyber-atmosphere {
  position: absolute;
  inset: 0;
  z-index: -3;
  background: radial-gradient(circle at 72% 34%, rgba(19, 98, 101, 0.28), transparent 34%), linear-gradient(180deg, var(--cy-ink) 0%, var(--cy-void) 72%);
}

.cyber-atmosphere::after { position: absolute; inset: 0; content: ""; opacity: 0.22; background-image: radial-gradient(rgba(211, 234, 225, 0.55) 0.5px, transparent 0.5px); background-size: 5px 5px; mask-image: linear-gradient(180deg, transparent 0%, black 50%, transparent 100%); }

.cyber-grid-floor { position: absolute; inset: auto 0 0; z-index: -1; height: 34%; opacity: 0.34; background-image: linear-gradient(rgba(77, 181, 181, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(77, 181, 181, 0.2) 1px, transparent 1px); background-size: 54px 54px; transform: perspective(520px) rotateX(61deg) scale(1.3); transform-origin: bottom; mask-image: linear-gradient(180deg, transparent, black 75%); }

.cyber-frame { position: absolute; z-index: 1; top: 0; bottom: 0; width: 1px; background: var(--cy-line); }
.cyber-frame::before, .cyber-frame::after { position: absolute; left: -4px; width: 9px; height: 1px; content: ""; background: var(--cy-signal); }
.cyber-frame::before { top: 22%; } .cyber-frame::after { bottom: 18%; } .cyber-frame-left { left: 12%; } .cyber-frame-right { right: 12%; }

.cyber-city { position: absolute; z-index: -1; inset: auto 0 0; height: 68%; overflow: hidden; opacity: 0.75; mask-image: linear-gradient(180deg, transparent 0%, black 32%, black 100%); }
.cyber-building { position: absolute; bottom: 0; left: var(--building-left); width: var(--building-width); height: var(--building-height); border: 1px solid rgba(143, 206, 203, 0.25); background: linear-gradient(90deg, rgba(7, 14, 21, 0.88), rgba(13, 37, 48, 0.42)); box-shadow: inset 8px 0 rgba(105, 197, 190, 0.04), inset -7px 0 rgba(105, 197, 190, 0.04); }
.cyber-window { display: inline-block; width: 0.22rem; height: 0.38rem; margin: 0.52rem 0 0 0.5rem; background: var(--cy-signal-dim); opacity: 0.65; }
.cyber-window:nth-child(4n) { background: var(--cy-warning); opacity: 0.6; }
.cyber-beacon { position: absolute; bottom: 58%; left: 61%; width: 0.35rem; height: 0.35rem; border-radius: 999px; background: var(--cy-warning); box-shadow: 0 0 18px var(--cy-warning); animation: cyber-pulse 2.6s ease-in-out infinite; }

.cyber-kicker { color: var(--cy-signal); }
.cyber-live-dot { width: 0.4rem; height: 0.4rem; border-radius: 999px; background: var(--cy-warning); box-shadow: 0 0 10px var(--cy-warning); }
.cyber-title-accent { color: var(--cy-signal); text-shadow: 0 0 28px rgba(112, 216, 210, 0.18); }

.cyber-button { min-height: 3rem; border: 1px solid var(--cy-signal-dim); padding: 0.75rem 1rem; color: var(--cy-signal); transition: border-color 300ms var(--ease-premium), background-color 300ms var(--ease-premium), color 300ms var(--ease-premium); }
.cyber-button:hover, .cyber-button:focus-visible { border-color: var(--cy-signal); background: rgba(112, 216, 210, 0.1); color: var(--cy-bone); }

.cyber-monitor { border: 1px solid var(--cy-line); background: rgba(8, 19, 28, 0.76); box-shadow: 0 0 50px rgba(27, 147, 145, 0.09); backdrop-filter: blur(4px); }
.cyber-waveform span { display: block; flex: 1; height: var(--bar-height); background: var(--cy-signal); opacity: 0.58; transform-origin: bottom; animation: cyber-wave 2.4s ease-in-out infinite alternate; }
.cyber-waveform span:nth-child(3n) { background: var(--cy-warning); } .cyber-waveform span:nth-child(2n) { animation-delay: -0.8s; } .cyber-scroll-cue { animation: cyber-breathe 2.8s ease-in-out infinite; }
.cyber-archive { background: var(--cy-ink-deep); } .cyber-archive-footer { background: var(--cy-void); } .cyber-signal-row { transition: background-color 300ms var(--ease-premium); }
.cyber-signal-row:hover, .cyber-signal-row:focus-visible, .cyber-signal-row[aria-pressed="true"] { background: rgba(25, 101, 103, 0.12); }

@keyframes cyber-pulse { 0%, 100% { opacity: 0.45; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
@keyframes cyber-wave { from { transform: scaleY(0.65); } to { transform: scaleY(1); } }
@keyframes cyber-breathe { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }

@media (max-width: 767px) {
  .cyber-frame-left { left: 7%; } .cyber-frame-right { right: 7%; } .cyber-grid-floor { height: 23%; background-size: 34px 34px; } .cyber-city { height: 41%; } .cyber-building { transform: scaleX(0.8); transform-origin: bottom left; } .cyber-window { margin-top: 0.4rem; margin-left: 0.35rem; }
}

@media (prefers-reduced-motion: reduce) {
  .cyber-beacon, .cyber-waveform span, .cyber-scroll-cue { animation: none; }
}
</style>
