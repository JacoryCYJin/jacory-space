<template>
  <section class="border border-line bg-card">
    <div class="flex items-center justify-between gap-4 border-b border-line px-5 py-3 md:px-7">
      <p class="tech text-xs text-blue">04 — {{ t('library.sourceAndDeploymentLabel') }}</p>
    </div>

    <div class="p-5 md:p-7">
      <dl class="font-mono text-sm">
        <div class="grid gap-2 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-6">
          <dt class="tech text-xs text-blue">{{ t('library.sourceRepositoryLabel') }}</dt>
          <dd class="min-w-0">
            <a :href="entry.sourceUrl" target="_blank" rel="noreferrer" class="inline-flex max-w-full items-center gap-2 break-all font-mono text-sm leading-7 text-foreground transition-colors hover:text-blue">
              <span>{{ entry.sourceUrl }}</span>
              <ExternalLink :size="14" stroke-width="1.5" class="shrink-0" aria-hidden="true" />
            </a>
          </dd>
        </div>
      </dl>

      <div v-if="entry.installCommand" class="mt-8">
        <div class="mb-3 flex items-center justify-between gap-4">
          <p class="tech text-xs text-blue">{{ t('library.deploymentCommandLabel') }}</p>
          <button type="button" class="inline-flex shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-foreground transition-colors hover:text-blue" @click="$emit('copy-install-command', entry.installCommand)">
            <Copy :size="14" stroke-width="1.5" aria-hidden="true" />
            {{ t('library.copyInstallCommand') }}
          </button>
        </div>
        <pre class="overflow-x-auto border border-line bg-background px-4 py-4 font-mono text-sm leading-7 text-foreground"><code>{{ entry.installCommand }}</code></pre>
      </div>

      <div v-if="entry.outline?.length" class="mt-10 border-t border-line pt-8">
        <p class="tech text-xs text-blue">{{ t('library.contentOutlineLabel') }}</p>
        <ol class="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 font-mono text-xs leading-6 text-muted-foreground sm:grid-cols-2 xl:grid-cols-3">
          <li v-for="item in entry.outline" :key="item.title" :class="outlineIndentClass(item.level)">{{ item.title }}</li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { Copy, ExternalLink } from 'lucide-vue-next'

defineProps({
  entry: {
    type: Object,
    required: true,
  },
})

defineEmits(['copy-install-command'])

const { t } = useI18n()

function outlineIndentClass(level) {
  if (level >= 4) return 'pl-6'
  if (level >= 3) return 'pl-3'
  return ''
}
</script>
