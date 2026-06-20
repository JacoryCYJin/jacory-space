<template>
  <main class="grain min-h-screen bg-background text-foreground">
    <section class="px-5 pb-20 pt-28 md:px-8 md:pt-32">
      <div class="mx-auto max-w-screen-2xl">
        <header class="border-b border-line pb-9">
          <div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p class="font-mono text-xs tracking-[0.18em] text-blue">№ 001 — UTILITY / LOCAL TOOL</p>
              <h1 class="mt-5 text-5xl font-medium leading-none tracking-tight text-foreground md:text-7xl">
                Video <span class="italic text-blue">Parser</span>
              </h1>
              <p class="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
                {{ t('videoParser.pageDescription') }}
              </p>
            </div>

            <div class="flex items-center gap-5">
              <button
                type="button"
                class="inline-flex h-10 items-center gap-3 border border-line px-4 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground transition-colors hover:border-line-strong hover:text-blue"
                :class="showSettingsRail || isCookiesRequiredError ? 'border-line-strong text-blue' : ''"
                @click="toggleSettingsRail"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-blue"></span>
                {{ t('videoParser.ui.settings') }}
              </button>
              <span class="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:inline">
                {{ t('videoParser.ui.cookiesDirectory') }}
              </span>
            </div>
          </div>
        </header>

        <div class="mt-10 grid gap-10" :class="showSettingsRail ? 'xl:grid-cols-[minmax(0,1fr)_410px]' : ''">
          <div class="min-w-0">
            <section class="grid gap-5 border-b border-line pb-10 md:grid-cols-[96px_minmax(0,1fr)]">
              <div>
                <p class="font-mono text-xs uppercase tracking-[0.18em] text-blue">01</p>
                <p class="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-blue">{{ t('videoParser.sections.command') }}</p>
              </div>
              <div class="border border-line bg-card sm:flex sm:min-h-14 sm:items-center">
                <div class="flex min-w-0 flex-1 items-center">
                  <div class="flex h-14 w-14 shrink-0 items-center justify-center border-r border-line text-muted-foreground">
                    <LinkIcon class="h-4.5 w-4.5" />
                  </div>
                  <input
                    v-model="videoUrl"
                    type="text"
                    :placeholder="t('videoParser.inputPlaceholder')"
                    class="h-14 min-w-0 flex-1 bg-transparent px-5 font-mono text-sm text-foreground outline-none placeholder:text-haze"
                    @keypress.enter="parseVideo"
                  />
                </div>
                <button
                  type="button"
                  class="flex h-14 w-full shrink-0 items-center justify-center gap-3 border-t border-line px-6 font-mono text-xs uppercase tracking-[0.18em] text-blue transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:text-haze sm:w-auto sm:border-l sm:border-t-0"
                  :disabled="loading || !videoUrl.trim()"
                  @click="parseVideo"
                >
                  {{ loading ? t('videoParser.parsing') : t('videoParser.parse') }}
                  <ArrowRight class="h-3.5 w-3.5" />
                </button>
              </div>
            </section>

            <section v-if="showStatusSection" class="grid gap-5 border-b border-line py-10 md:grid-cols-[96px_minmax(0,1fr)]">
              <div>
                <p class="font-mono text-xs uppercase tracking-[0.18em] text-blue">02</p>
                <p class="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-blue">{{ t('videoParser.sections.status') }}</p>
              </div>
              <div>
                <div class="flex flex-col gap-5 xl:flex-row xl:items-start">
                  <div class="min-w-0 flex-1 overflow-x-auto pb-2">
                    <div class="grid min-w-[760px] grid-cols-6 gap-y-6">
                      <div
                        v-for="(item, index) in statusRail"
                        :key="item.key"
                        class="status-step relative min-w-0 pr-4"
                        :class="{
                          'is-active': parserState === item.key,
                          'is-reached': index <= activeStatusIndex,
                          'is-failed': parserState === 'FAILED' && item.key === 'FAILED'
                        }"
                      >
                        <span class="status-dot"></span>
                        <p class="mt-4 whitespace-nowrap text-sm text-muted-foreground">
                          {{ item.label }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <p
                  v-if="isCookiesRequiredError"
                  class="mt-4 border-l border-line-strong pl-4 text-sm leading-relaxed text-muted-foreground"
                >
                  {{ t('videoParser.cookieEntry.hint') }}
                </p>
                <p
                  v-else-if="loading"
                  class="mt-4 border-l border-line-strong pl-4 text-sm leading-relaxed text-muted-foreground"
                >
                  {{ t('videoParser.messages.readingMetadata') }}
                </p>
                <p v-if="error" class="mt-6 border-l border-line-strong pl-4 text-sm leading-relaxed text-muted-foreground">
                  {{ error }}
                </p>
                <p v-else-if="success" class="mt-6 border-l border-line-strong pl-4 text-sm leading-relaxed text-muted-foreground">
                  {{ success }}
                </p>
              </div>
            </section>

            <div
              v-if="showResolvedModules || showOutlineModule || showOutputPathSection"
              class="grid border-b border-line"
              :class="showOutlineModule ? 'lg:grid-cols-[minmax(0,1.08fr)_minmax(430px,0.92fr)]' : ''"
            >
              <div class="min-w-0 lg:border-r lg:border-line lg:pr-8">
                <section v-if="showResolvedModules" class="grid gap-5 border-b border-line py-10 md:grid-cols-[96px_minmax(0,1fr)]">
                  <div>
                    <p class="font-mono text-xs uppercase tracking-[0.18em] text-blue">03</p>
                    <p class="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-blue">{{ t('videoParser.sections.videoInfo') }}</p>
                  </div>
                  <div>
                    <div v-if="videoInfo" class="video-info-resolved">
                      <img
                        v-if="videoInfo.thumbnail_proxy || videoInfo.thumbnail"
                        :src="videoInfo.thumbnail_proxy || videoInfo.thumbnail"
                        :alt="t('videoParser.thumbnailAlt')"
                        referrerpolicy="no-referrer"
                        crossorigin="anonymous"
                        class="video-info-thumb border border-line object-cover"
                      />
                      <div v-else class="video-info-thumb flex items-center justify-center border border-line bg-muted">
                        <Clapperboard class="h-6 w-6 text-haze" />
                      </div>

                      <div class="min-w-0">
                        <h2 class="video-info-title text-xl font-medium leading-snug tracking-tight text-foreground md:text-2xl">
                          {{ videoInfo.title || 'Untitled Video' }}
                        </h2>
                        <dl class="mt-6 grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2 xl:grid-cols-4">
                          <div>
                            <dt class="tech">{{ t('videoParser.info.source') }}</dt>
                            <dd class="mt-1 text-foreground">{{ sourcePlatform }}</dd>
                          </div>
                          <div>
                            <dt class="tech">{{ t('videoParser.info.duration') }}</dt>
                            <dd class="mt-1 text-foreground">{{ videoInfo.duration ? formatDuration(videoInfo.duration) : '--' }}</dd>
                          </div>
                          <div>
                            <dt class="tech">{{ t('videoParser.info.uploader') }}</dt>
                            <dd class="mt-1 text-foreground">{{ videoInfo.uploader || videoInfo.channel || '--' }}</dd>
                          </div>
                          <div>
                            <dt class="tech">{{ t('videoParser.info.pubDate') }}</dt>
                            <dd class="mt-1 text-foreground">{{ formatUploadDate(videoInfo.upload_date || videoInfo.release_date) }}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    <div v-else class="border border-line bg-card px-5 py-10">
                      <p class="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">{{ t('videoParser.info.awaitingUrl') }}</p>
                      <p class="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">
                        {{ t('videoParser.info.awaitingDescription') }}
                      </p>
                    </div>
                  </div>
                </section>

                <section v-if="showResolvedModules" class="grid gap-5 border-b border-line py-10 md:grid-cols-[96px_minmax(0,1fr)]">
                  <div>
                    <p class="font-mono text-xs uppercase tracking-[0.18em] text-blue">04</p>
                    <p class="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-blue">{{ t('videoParser.sections.downloadRegistry') }}</p>
                  </div>
                  <div class="min-w-0">
                    <div class="mb-3 flex items-center">
                      <span class="tech">{{ t('videoParser.registry.items', { count: registryRows.length }) }}</span>
                    </div>
                    <div class="overflow-x-auto border border-line">
                      <table class="w-full table-fixed border-collapse text-left">
                        <colgroup>
                          <col class="w-[8%]" />
                          <col class="w-[17%]" />
                          <col class="w-[23%]" />
                          <col class="w-[13%]" />
                          <col class="w-[22%]" />
                          <col class="w-[17%]" />
                        </colgroup>
                        <thead class="border-b border-line bg-muted/40">
                          <tr class="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                            <th class="px-3 py-3 font-medium">№</th>
                            <th class="px-3 py-3 font-medium">{{ t('videoParser.registry.resolution') }}</th>
                            <th class="px-3 py-3 font-medium">{{ t('videoParser.registry.format') }}</th>
                            <th class="px-3 py-3 font-medium">{{ t('videoParser.registry.size') }}</th>
                            <th class="px-3 py-3 font-medium">{{ t('videoParser.registry.status') }}</th>
                            <th class="px-3 py-3 text-right font-medium">{{ t('videoParser.registry.action') }}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(format, index) in registryRows"
                            :key="formatKey(format)"
                            class="border-b border-line last:border-b-0"
                          >
                            <td class="px-3 py-4 font-mono text-xs text-blue">{{ String(index + 1).padStart(2, '0') }}</td>
                            <td class="px-3 py-4 font-mono text-sm text-foreground">{{ format.resolution }}</td>
                            <td class="truncate px-3 py-4 font-mono text-xs text-muted-foreground" :title="formatLabel(format)">{{ formatLabel(format) }}</td>
                            <td class="truncate px-3 py-4 font-mono text-xs text-muted-foreground">{{ format.filesize_mb || '--' }} MB</td>
                            <td class="px-3 py-4">
                              <div class="flex items-center gap-2">
                                <span class="h-1.5 w-1.5 rounded-full" :class="rowStatusClass(format).dot"></span>
                                <span class="font-mono text-[11px] uppercase tracking-[0.14em]" :class="rowStatusClass(format).text">
                                  {{ rowStatusLabel(format) }}
                                </span>
                                <template v-if="rowStatus(format) === 'DOWNLOADING'">
                                  <span class="font-mono text-[11px] text-muted-foreground">{{ rowProgress(format) }}%</span>
                                  <span class="h-px w-10 bg-line">
                                    <span class="block h-px bg-blue transition-all duration-300" :style="{ width: `${rowProgress(format)}%` }"></span>
                                  </span>
                                </template>
                              </div>
                            </td>
                            <td class="px-3 py-4 text-right">
                              <button
                                type="button"
                                class="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-blue transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:text-haze"
                                :disabled="downloading[format.resolution] || rowStatus(format) === 'UNAVAILABLE'"
                                @click="downloadVideo(format)"
                              >
                                {{ rowActionLabel(format) }}
                                <ArrowRight v-if="rowStatus(format) === 'READY'" class="h-3.5 w-3.5" />
                                <Pause v-else-if="rowStatus(format) === 'DOWNLOADING'" class="h-3.5 w-3.5" />
                                <ExternalLink v-else-if="rowStatus(format) === 'COMPLETE'" class="h-3.5 w-3.5" />
                                <RefreshCw v-else-if="rowStatus(format) === 'FAILED'" class="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                          <tr v-if="!registryRows.length">
                            <td colspan="6" class="px-3 py-10 text-base text-muted-foreground">
                              {{ t('videoParser.registry.empty') }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                <section v-if="showOutputPathSection" class="grid gap-5 py-10 md:grid-cols-[96px_minmax(0,1fr)]">
                  <div>
                    <p class="font-mono text-xs uppercase tracking-[0.18em] text-blue">06</p>
                    <p class="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-blue">{{ t('videoParser.sections.outputPath') }}</p>
                  </div>
                  <div>
                    <p v-if="copyStatus" class="mb-3 border-l border-line-strong pl-3 text-sm leading-relaxed text-muted-foreground">
                      {{ copyStatus }}
                    </p>
                    <div class="flex flex-col border border-line bg-card sm:flex-row sm:items-center">
                    <div class="flex min-w-0 flex-1 items-center gap-3 px-5 py-4">
                      <Folder class="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span class="truncate font-mono text-xs text-foreground">{{ outputPath }}</span>
                    </div>
                    <div class="flex shrink-0 border-t border-line sm:border-l sm:border-t-0">
                      <button
                        type="button"
                        class="inline-flex h-12 items-center gap-2 px-5 font-mono text-[11px] uppercase tracking-[0.16em] text-blue hover:bg-muted"
                        @click="copyOutputPath"
                      >
                        <Copy class="h-3.5 w-3.5" />
                        {{ t('videoParser.output.copyPath') }}
                      </button>
                      <button
                        type="button"
                        class="inline-flex h-12 items-center gap-2 border-l border-line px-5 font-mono text-[11px] uppercase tracking-[0.16em] text-blue hover:bg-muted"
                        @click="revealOutputPath"
                      >
                        <FolderOpen class="h-3.5 w-3.5" />
                        {{ t('videoParser.output.revealInFinder') }}
                      </button>
                    </div>
                    </div>
                  </div>
                </section>
              </div>

              <aside v-if="showOutlineModule" class="py-10 lg:pl-8">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-mono text-xs uppercase tracking-[0.18em] text-blue">05</p>
                    <p class="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-blue">{{ t('videoParser.sections.outlineMap') }}</p>
                  </div>
                  <button
                    type="button"
                    class="font-mono text-[11px] uppercase tracking-[0.16em] text-blue transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:text-haze"
                    :disabled="outlineState !== 'success'"
                    @click="copyOutline"
                  >
                    {{ t('videoParser.outline.copyOutline') }}
                  </button>
                </div>

                <div v-if="outlineState === 'success'" class="mt-7 overflow-x-auto pb-2">
                  <div class="outline-map">
                    <div class="outline-root">{{ t('videoParser.outline.root') }}</div>
                    <div class="outline-trunk"></div>
                    <div class="outline-branches">
                      <div v-for="item in outlineNodes" :key="item.id" class="outline-branch">
                        <div class="outline-node">{{ item.title }}</div>
                        <ul>
                          <li v-for="child in item.children" :key="child">{{ child }}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="mt-7 flex min-h-[430px] items-center border border-line bg-card px-8 py-10">
                  <div>
                    <p class="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {{ outlineStateMeta.title }}
                    </p>
                    <p class="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                      {{ outlineStateMeta.description }}
                    </p>
                    <div v-if="outlineState === 'generating'" class="mt-6 h-px w-40 overflow-hidden bg-line">
                      <span class="outline-loading-line block h-px w-16 bg-blue"></span>
                    </div>
                    <button
                      v-if="outlineState === 'failed'"
                      type="button"
                      class="mt-6 inline-flex h-10 items-center gap-2 border border-line px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-blue hover:bg-muted"
                      @click="retryOutline"
                    >
                      <RefreshCw class="h-3.5 w-3.5" />
                      {{ t('videoParser.outline.retry') }}
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>

          <aside v-if="showSettingsRail" class="settings-rail border-line xl:border-l xl:pl-8">
            <div class="sticky top-24 space-y-10">
              <section class="border-b border-line pb-9">
                <div class="mb-7 flex items-center justify-between">
                  <div>
                    <p class="font-mono text-xs uppercase tracking-[0.18em] text-blue">{{ t('videoParser.sections.cookiesSettings') }}</p>
                  </div>
                  <button type="button" class="text-muted-foreground hover:text-foreground" @click="showSettingsRail = false">
                    <X class="h-4 w-4" />
                  </button>
                </div>

                <div class="space-y-7">
                  <div>
                    <p class="tech">{{ t('videoParser.settings.mode') }}</p>
                    <div class="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        v-for="mode in cookieModes"
                        :key="mode"
                        type="button"
                        class="settings-choice"
                        :class="{ 'is-selected': cookieMode === mode }"
                        @click="cookieMode = mode"
                      >
                        {{ t(`videoParser.settings.cookieModes.${mode}`) }}
                      </button>
                    </div>
                  </div>

                  <div>
                    <p class="tech">{{ t('videoParser.settings.browserSource') }}</p>
                    <div class="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        v-for="source in browserSources"
                        :key="source.value"
                        type="button"
                        class="settings-choice"
                        :class="{ 'is-selected': browserCookieSource === source.value }"
                        :disabled="cookieMode !== 'browser'"
                        @click="browserCookieSource = source.value"
                      >
                        {{ source.label }}
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    class="inline-flex h-10 items-center border border-line px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-blue hover:bg-muted disabled:text-haze"
                    :disabled="savingCookieSettings"
                    @click="saveCookieSettings"
                  >
                    {{ savingCookieSettings ? t('videoParser.saving') : t('videoParser.saveUsage') }}
                  </button>

                  <p class="text-xs leading-relaxed text-muted-foreground">
                    {{ t('videoParser.settings.cookiesUsageNote') }}
                  </p>

                  <p
                    v-if="cookieSettingsStatus"
                    class="border-l border-line-strong pl-3 text-xs leading-relaxed text-muted-foreground"
                  >
                    {{ cookieSettingsStatus.message }}
                  </p>

                  <div>
                    <div class="mb-3 flex items-center justify-between">
                      <p class="tech">{{ t('videoParser.settings.platformCookies') }}</p>
                      <button
                        type="button"
                        class="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.16em] text-blue hover:text-foreground"
                        @click="showAddPlatform = true"
                      >
                        <Plus class="h-3.5 w-3.5" />
                        {{ t('videoParser.settings.custom') }}
                      </button>
                    </div>

                    <div class="border-t border-line">
                      <div
                        v-for="platform in cookiePlatformRows"
                        :key="platform.key"
                        class="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-line py-4"
                      >
                        <div class="min-w-0">
                          <div class="flex items-center gap-3">
                            <span class="h-1.5 w-1.5 rounded-full" :class="cookiesInfo[platform.key]?.has_cookies ? 'bg-blue' : 'bg-haze'"></span>
                            <span class="font-medium text-foreground">{{ platform.label }}</span>
                          </div>
                          <p class="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                            {{ cookiesInfo[platform.key]?.has_cookies ? t('videoParser.settings.set') : t('videoParser.settings.notSet') }}
                          </p>
                        </div>
                        <div class="flex items-center gap-4">
                          <button type="button" class="settings-link" @click="editPlatform(platform.key)">
                            {{ cookiesInfo[platform.key]?.has_cookies ? t('videoParser.settings.edit') : t('videoParser.settings.set') }}
                          </button>
                          <button
                            v-if="cookiesInfo[platform.key]?.has_cookies || platform.custom"
                            type="button"
                            class="settings-link"
                            @click="deletePlatformCookies(platform.key)"
                          >
                            {{ t('videoParser.settings.delete') }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <div class="mb-7">
                  <p class="font-mono text-xs uppercase tracking-[0.18em] text-blue">{{ t('videoParser.sections.directorySettings') }}</p>
                </div>

                <div class="space-y-6">
                  <div>
                    <p class="tech">{{ t('videoParser.settings.defaultDownloadDirectory') }}</p>
                    <div class="mt-3 flex border border-line bg-card">
                      <div class="flex min-w-0 flex-1 items-center gap-3 px-3 py-3">
                        <Folder class="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span class="truncate font-mono text-xs text-foreground">{{ defaultDownloadDir || t('videoParser.notSet') }}</span>
                      </div>
                      <button
                        type="button"
                        class="border-l border-line px-3 font-mono text-[11px] uppercase tracking-[0.16em] text-blue hover:bg-muted disabled:text-haze"
                        :disabled="savingSettings"
                        @click="chooseFolderAndSaveDefault"
                      >
                        {{ t('videoParser.settings.change') }}
                      </button>
                    </div>
                  </div>

                  <div>
                    <p class="tech">{{ t('videoParser.settings.temporaryDirectory') }}</p>
                    <div class="mt-3 flex border border-line bg-card">
                      <div class="flex min-w-0 flex-1 items-center gap-3 px-3 py-3">
                        <Folder class="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span class="truncate font-mono text-xs text-foreground">{{ downloadDirOverride || t('videoParser.settings.useDefaultDirectory') }}</span>
                      </div>
                      <button
                        type="button"
                        class="border-l border-line px-3 font-mono text-[11px] uppercase tracking-[0.16em] text-blue hover:bg-muted"
                        @click="chooseFolderForOnce"
                      >
                        {{ t('videoParser.settings.change') }}
                      </button>
                    </div>
                    <button
                      v-if="downloadDirOverride"
                      type="button"
                      class="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground hover:text-blue"
                      @click="downloadDirOverride = ''"
                    >
                      {{ t('videoParser.clearOneTimeDirectory') }}
                    </button>
                    <p class="mt-3 text-xs leading-relaxed text-muted-foreground">
                      {{ t('videoParser.settings.temporaryDirectoryNote') }}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <div
      v-if="showAddPlatform"
      class="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4"
      @click.self="showAddPlatform = false"
    >
      <div class="w-full max-w-md border border-line bg-card p-6">
        <h3 class="font-mono text-xs uppercase tracking-[0.18em] text-blue">{{ t('videoParser.addPlatformTitle') }}</h3>
        <input
          v-model="newPlatformName"
          type="text"
          :placeholder="t('videoParser.platformPlaceholder')"
          class="mt-5 h-12 w-full border border-line bg-transparent px-4 font-mono text-sm outline-none focus:border-line-strong"
          @keypress.enter="addCustomPlatform"
        />
        <div class="mt-5 flex gap-3">
          <button
            type="button"
            class="h-10 flex-1 border border-line px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-blue hover:bg-muted disabled:text-haze"
            :disabled="!newPlatformName.trim()"
            @click="addCustomPlatform"
          >
            {{ t('videoParser.actions.add') }}
          </button>
          <button
            type="button"
            class="h-10 border border-line px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground hover:bg-muted"
            @click="showAddPlatform = false"
          >
            {{ t('videoParser.actions.cancel') }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showEditCookies"
      class="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4"
      @click.self="showEditCookies = false"
    >
      <div class="w-full max-w-2xl border border-line bg-card p-6">
        <div class="mb-5 flex items-center justify-between">
          <h3 class="font-mono text-xs uppercase tracking-[0.18em] text-blue">
            {{ t('videoParser.setCookiesTitle', { platform: editingPlatform }) }}
          </h3>
          <button type="button" class="text-muted-foreground hover:text-foreground" @click="showEditCookies = false">
            <X class="h-4 w-4" />
          </button>
        </div>
        <p class="mb-4 border-l border-line-strong pl-3 text-xs leading-relaxed text-muted-foreground">
          {{ t('videoParser.cookiesSavedTip') }}
        </p>
        <textarea
          v-model="cookiesText"
          :placeholder="t('videoParser.cookiesPlaceholder', { platform: editingPlatform })"
          class="h-64 w-full border border-line bg-transparent px-4 py-3 font-mono text-sm outline-none focus:border-line-strong"
        ></textarea>
        <div class="mt-5 flex gap-3">
          <button
            type="button"
            class="h-10 flex-1 border border-line px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-blue hover:bg-muted disabled:text-haze"
            :disabled="!cookiesText.trim() || savingCookies"
            @click="saveCookies"
          >
            {{ savingCookies ? t('videoParser.saving') : t('videoParser.actions.save') }}
          </button>
          <button
            type="button"
            class="h-10 border border-line px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground hover:bg-muted"
            @click="showEditCookies = false"
          >
            {{ t('videoParser.actions.cancel') }}
          </button>
        </div>
        <p v-if="cookiesStatus" class="mt-4 border-l border-line-strong pl-3 text-xs leading-relaxed text-muted-foreground">
          {{ cookiesStatus.message }}
        </p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import {
  ArrowRight,
  Clapperboard,
  Copy,
  ExternalLink,
  Folder,
  FolderOpen,
  Link as LinkIcon,
  Pause,
  Plus,
  RefreshCw,
  X
} from 'lucide-vue-next'

const { t, locale } = useI18n()

const getClientId = () => {
  const key = 'jacory_client_id'
  const existing = localStorage.getItem(key)
  if (existing) return existing
  const generated = `u_${crypto.randomUUID().replace(/-/g, '')}`
  localStorage.setItem(key, generated)
  return generated
}

axios.defaults.headers.common['x-client-id'] = getClientId()

const videoUrl = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')
const videoInfo = ref(null)
const downloading = reactive({})
const downloadRows = reactive({})
const downloadTimers = new Map()
const lastDownloadedPath = ref('')
const defaultDownloadDir = ref('')
const downloadDirOverride = ref('')
const savingSettings = ref(false)
const cookieMode = ref('manual')
const browserCookieSource = ref('chrome')
const savingCookieSettings = ref(false)
const cookieSettingsStatus = ref(null)
const copyStatus = ref('')
const outlineGenerationState = ref('idle')

const showSettingsRail = ref(false)
const showEditCookies = ref(false)
const showAddPlatform = ref(false)
const cookiesText = ref('')
const savingCookies = ref(false)
const cookiesStatus = ref(null)
const editingPlatform = ref('')
const newPlatformName = ref('')
const customPlatforms = ref([])
const cookiesInfo = ref({ youtube: {}, bilibili: {} })

const statusKeys = ['READY', 'PARSING', 'RESOLVED', 'DOWNLOADING', 'COMPLETE', 'FAILED']

const outlineMock = {
  'zh-CN': [
    {
      id: 'intro',
      title: '1. 引言',
      children: ['为什么需要个人操作系统', '数字空间的混乱与成本', 'OS 思维：系统化与可组合性']
    },
    {
      id: 'core',
      title: '2. 核心理念',
      children: ['统一入口与标准化输出', '收藏 → 处理 → 存储 → 输出', '自动化流程：从想法到沉淀']
    },
    {
      id: 'workflow',
      title: '3. 工作流',
      children: ['工具链与数据源', '获取与工具选择策略', '任务编排与稳定运行']
    },
    {
      id: 'tools',
      title: '4. 工具系统',
      children: ['解析工具链与质量层次', '格式策略与参数说明', '下载与校验机制优化']
    },
    {
      id: 'summary',
      title: '5. 总结',
      children: ['构建属于自己的数字空间', '下一步：持续迭代与优化']
    }
  ],
  'en-US': [
    {
      id: 'intro',
      title: '1. Introduction',
      children: ['Why personal operating systems matter', 'The cost of scattered digital space', 'OS thinking: systems and composability']
    },
    {
      id: 'core',
      title: '2. Core Idea',
      children: ['One entry point and normalized output', 'Collect → process → store → publish', 'Automation from raw idea to archive']
    },
    {
      id: 'workflow',
      title: '3. Workflow',
      children: ['Toolchain and data sources', 'Acquisition and tool selection strategy', 'Task orchestration and stable runs']
    },
    {
      id: 'tools',
      title: '4. Tool System',
      children: ['Parser chain and quality layers', 'Format strategy and parameter notes', 'Download and verification improvements']
    },
    {
      id: 'summary',
      title: '5. Summary',
      children: ['Build a digital space that belongs to you', 'Next step: continuous iteration']
    }
  ]
}

const cookieModes = ['manual', 'browser', 'none']
const browserSources = [
  { value: 'chrome', label: 'Chrome' },
  { value: 'safari', label: 'Safari' },
  { value: 'firefox', label: 'Firefox' },
  { value: 'edge', label: 'Edge' }
]

const registryRows = computed(() => {
  return (videoInfo.value?.formats || []).filter((format) => {
    const ext = String(format?.ext || '').toLowerCase()
    return ['mp4', 'm4a'].includes(ext)
  })
})

const statusRail = computed(() =>
  statusKeys.map((key) => ({
    key,
    label: t(`videoParser.statusRail.${key}`)
  }))
)

const hasActiveDownload = computed(() => Object.values(downloading).some(Boolean))

const isCookiesRequiredError = computed(() => {
  const msg = error.value.toLowerCase()
  return msg.includes('cookie') || msg.includes('cookies') || msg.includes('登录') || msg.includes('sign in') || msg.includes('403')
})

const parserState = computed(() => {
  if (loading.value) return 'PARSING'
  if (hasActiveDownload.value) return 'DOWNLOADING'
  if (error.value) return 'FAILED'
  if (lastDownloadedPath.value) return 'COMPLETE'
  if (videoInfo.value) return 'RESOLVED'
  return 'READY'
})

const activeStatusIndex = computed(() => Math.max(0, statusKeys.indexOf(parserState.value)))

const showStatusSection = computed(() => parserState.value !== 'READY' || Boolean(error.value || success.value))
const showResolvedModules = computed(() => Boolean(videoInfo.value))
const showOutlineModule = computed(() => ['noSubtitles', 'subtitlesAvailable', 'generating', 'success', 'failed'].includes(outlineState.value))
const showOutputPathSection = computed(() => Boolean(lastDownloadedPath.value))

const outlineNodes = computed(() => outlineMock[locale.value] || outlineMock['zh-CN'])

const hasSubtitleSource = computed(() => {
  const info = videoInfo.value
  if (!info) return false
  return Boolean(
    info.has_subtitles ||
    info.has_automatic_captions ||
    info.subtitle_languages?.length ||
    info.automatic_caption_languages?.length
  )
})

const outlineState = computed(() => {
  if (!videoInfo.value) return 'idle'
  if (outlineGenerationState.value === 'generating') return 'generating'
  if (outlineGenerationState.value === 'failed') return 'failed'
  if (outlineGenerationState.value === 'success') return 'success'
  return hasSubtitleSource.value ? 'subtitlesAvailable' : 'noSubtitles'
})

const outlineStateMeta = computed(() => {
  const key = outlineState.value
  return {
    title: t(`videoParser.outline.states.${key}.title`),
    description: t(`videoParser.outline.states.${key}.description`)
  }
})

const sourcePlatform = computed(() => {
  const raw = videoInfo.value?.source_url || videoUrl.value
  try {
    const host = new URL(raw).hostname.toLowerCase()
    if (host.includes('youtube') || host.includes('youtu.be')) return 'YouTube'
    if (host.includes('bilibili')) return 'Bilibili'
    return host.replace(/^www\./, '')
  } catch (_err) {
    return '--'
  }
})

const outputPath = computed(() => {
  return lastDownloadedPath.value || downloadDirOverride.value || defaultDownloadDir.value || t('videoParser.notSet')
})

const hasOutputPath = computed(() => Boolean(lastDownloadedPath.value || downloadDirOverride.value || defaultDownloadDir.value))

const cookiePlatformRows = computed(() => [
  { key: 'youtube', label: 'YouTube', custom: false },
  { key: 'bilibili', label: 'Bilibili', custom: false },
  ...customPlatforms.value.map((platform) => ({ key: platform, label: platform, custom: true }))
])

const formatKey = (format) => format?.format_id || format?.resolution || 'unknown'

const formatLabel = (format) => {
  const ext = String(format?.ext || 'file').toUpperCase()
  const note = format?.format_note ? ` · ${format.format_note}` : ''
  return `${ext}${note}`
}

const rowData = (format) => downloadRows[formatKey(format)] || null

const rowStatus = (format) => {
  const row = rowData(format)
  if (row?.status) return row.status
  if (!format?.format_id && !format?.resolution) return 'UNAVAILABLE'
  return 'READY'
}

const rowStatusLabel = (format) => t(`videoParser.registry.rowStatus.${rowStatus(format)}`)

const rowProgress = (format) => rowData(format)?.progress || 0

const rowStatusClass = (format) => {
  const status = rowStatus(format)
  if (status === 'DOWNLOADING' || status === 'COMPLETE' || status === 'READY') {
    return { dot: 'bg-blue', text: 'text-blue' }
  }
  if (status === 'FAILED') return { dot: 'bg-foreground', text: 'text-foreground' }
  return { dot: 'bg-haze', text: 'text-muted-foreground' }
}

const rowActionLabel = (format) => {
  const status = rowStatus(format)
  if (status === 'DOWNLOADING') return t('videoParser.registry.actions.pause')
  if (status === 'COMPLETE') return t('videoParser.registry.actions.reveal')
  if (status === 'FAILED') return t('videoParser.registry.actions.retry')
  if (status === 'UNAVAILABLE') return '--'
  return t('videoParser.registry.actions.download')
}

const startDownloadProgress = (key) => {
  clearDownloadProgress(key)
  downloadRows[key] = { status: 'DOWNLOADING', progress: 8 }
  const timer = window.setInterval(() => {
    const row = downloadRows[key]
    if (!row || row.status !== 'DOWNLOADING') return
    row.progress = Math.min(92, row.progress + Math.ceil((92 - row.progress) * 0.16))
  }, 700)
  downloadTimers.set(key, timer)
}

const clearDownloadProgress = (key) => {
  const timer = downloadTimers.get(key)
  if (timer) window.clearInterval(timer)
  downloadTimers.delete(key)
}

const parseVideo = async () => {
  const url = videoUrl.value.trim()
  if (!url) {
    error.value = t('videoParser.errors.emptyUrl')
    return
  }
  if (!isValidVideoUrl(url)) {
    error.value = t('videoParser.errors.invalidUrl')
    return
  }
  loading.value = true
  error.value = ''
  success.value = ''
  videoInfo.value = null
  lastDownloadedPath.value = ''
  outlineGenerationState.value = 'idle'
  Object.keys(downloadRows).forEach((key) => delete downloadRows[key])
  try {
    const response = await axios.post('/api/parse', { url })
    videoInfo.value = response.data
    videoUrl.value = response.data?.source_url || url
  } catch (err) {
    if (err.response?.data?.code === 'NO_VISIBLE_FORMATS') {
      error.value = t('videoParser.errors.noVisibleFormats')
    } else {
      error.value = err.response?.data?.error || t('videoParser.errors.parseFailed', { message: err.message })
    }
  } finally {
    loading.value = false
  }
}

const downloadVideo = async (format) => {
  const resolution = format?.resolution || ''
  const key = formatKey(format)
  downloading[resolution] = true
  startDownloadProgress(key)
  error.value = ''
  success.value = t('videoParser.messages.downloadingResolution', { resolution })
  try {
    const response = await axios.post('/api/download', {
      url: videoUrl.value,
      resolution,
      format_id: format?.format_id || '',
      output_dir: downloadDirOverride.value.trim() || undefined
    })
    lastDownloadedPath.value = response.data.path || response.data.output_dir || ''
    downloadRows[key] = { status: 'COMPLETE', progress: 100, path: lastDownloadedPath.value }
    success.value = t('videoParser.messages.downloadComplete', { path: response.data.path })
  } catch (err) {
    downloadRows[key] = { status: 'FAILED', progress: 0 }
    error.value = err.response?.data?.error || t('videoParser.errors.downloadFailed', { message: err.message })
    success.value = ''
  } finally {
    clearDownloadProgress(key)
    downloading[resolution] = false
  }
}

const loadSettings = async () => {
  try {
    const response = await axios.get('/api/settings')
    defaultDownloadDir.value = response.data.default_download_dir || ''
    cookieMode.value = response.data.cookie_mode || 'manual'
    browserCookieSource.value = response.data.browser_cookie_source || 'chrome'
  } catch (err) {
    console.error(t('videoParser.errors.loadSettingsFailed'), err)
  }
}

const saveDefaultDownloadDir = async () => {
  if (!defaultDownloadDir.value.trim()) return
  savingSettings.value = true
  error.value = ''
  try {
    const response = await axios.post('/api/settings', {
      default_download_dir: defaultDownloadDir.value.trim()
    })
    defaultDownloadDir.value = response.data.default_download_dir || defaultDownloadDir.value
    success.value = t('videoParser.messages.defaultDirSaved', { path: defaultDownloadDir.value })
  } catch (err) {
    error.value = err.response?.data?.error || t('videoParser.errors.saveDefaultDirFailed')
  } finally {
    savingSettings.value = false
  }
}

const saveCookieSettings = async () => {
  savingCookieSettings.value = true
  cookieSettingsStatus.value = null
  try {
    await axios.post('/api/settings', {
      cookie_mode: cookieMode.value,
      browser_cookie_source: browserCookieSource.value
    })
    cookieSettingsStatus.value = { type: 'success', message: t('videoParser.messages.cookieUsageSaved') }
  } catch (err) {
    cookieSettingsStatus.value = { type: 'error', message: err.response?.data?.error || t('videoParser.errors.saveCookieSettingsFailed') }
  } finally {
    savingCookieSettings.value = false
  }
}

const chooseFolderNative = async () => {
  const response = await axios.post('/api/folder-dialog')
  if (response.data?.cancelled) return ''
  return response.data?.path || ''
}

const chooseFolderAndSaveDefault = async () => {
  try {
    const selected = await chooseFolderNative()
    if (!selected) return
    defaultDownloadDir.value = selected
    await saveDefaultDownloadDir()
  } catch (err) {
    error.value = err.response?.data?.error || t('videoParser.errors.folderDialogFailed')
  }
}

const chooseFolderForOnce = async () => {
  try {
    const selected = await chooseFolderNative()
    if (!selected) return
    downloadDirOverride.value = selected
  } catch (err) {
    error.value = err.response?.data?.error || t('videoParser.errors.folderDialogFailed')
  }
}

const formatDuration = (seconds) => {
  const total = Math.max(0, Math.round(Number(seconds) || 0))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  return `${m}:${s.toString().padStart(2, '0')}`
}

const formatUploadDate = (value) => {
  const raw = String(value || '').trim()
  if (!raw) return '--'
  if (/^\d{8}$/.test(raw)) return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
  return raw
}

const isValidVideoUrl = (value) => {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch (_err) {
    return false
  }
}

const loadCookiesInfo = async () => {
  try {
    const response = await axios.get('/api/cookies')
    cookiesInfo.value = response.data.platforms || {}
    customPlatforms.value = response.data.custom_platforms || []
  } catch (err) {
    console.error(t('videoParser.errors.loadCookiesFailed'), err)
  }
}

const editPlatform = async (platform) => {
  editingPlatform.value = platform
  cookiesStatus.value = null
  showEditCookies.value = true
  if (cookiesInfo.value[platform]?.has_cookies) {
    try {
      const response = await axios.get(`/api/cookies/${platform}`)
      cookiesText.value = response.data.cookies || ''
    } catch (_err) {
      cookiesText.value = ''
    }
  } else {
    cookiesText.value = ''
  }
}

const saveCookies = async () => {
  savingCookies.value = true
  cookiesStatus.value = null
  try {
    const response = await axios.post('/api/cookies', {
      cookies: cookiesText.value,
      platform: editingPlatform.value
    })
    cookiesStatus.value = { type: 'success', message: response.data.message }
    await loadCookiesInfo()
    setTimeout(() => {
      showEditCookies.value = false
      cookiesText.value = ''
      cookiesStatus.value = null
    }, 1500)
  } catch (err) {
    cookiesStatus.value = { type: 'error', message: err.response?.data?.error || t('videoParser.errors.saveFailed') }
  } finally {
    savingCookies.value = false
  }
}

const deletePlatformCookies = async (platform) => {
  if (!confirm(t('videoParser.messages.confirmDeleteCookies', { platform }))) return
  try {
    await axios.delete(`/api/cookies/${platform}`)
    await loadCookiesInfo()
  } catch (_err) {
    alert(t('videoParser.errors.deleteFailed'))
  }
}

const addCustomPlatform = () => {
  const name = newPlatformName.value.trim().toLowerCase()
  if (!name) return
  if (customPlatforms.value.includes(name) || name === 'youtube' || name === 'bilibili') {
    alert(t('videoParser.errors.platformExists'))
    return
  }
  customPlatforms.value.push(name)
  newPlatformName.value = ''
  showAddPlatform.value = false
  editPlatform(name)
}

const toggleSettingsRail = async () => {
  showSettingsRail.value = !showSettingsRail.value
  if (showSettingsRail.value) {
    cookieSettingsStatus.value = null
    await Promise.all([loadCookiesInfo(), loadSettings()])
  }
}

const copyToClipboard = async (text) => {
  if (!text || text === t('videoParser.notSet')) return
  try {
    await navigator.clipboard.writeText(text)
  } catch (_err) {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
}

const markCopied = (message) => {
  copyStatus.value = message
  window.setTimeout(() => {
    if (copyStatus.value === message) copyStatus.value = ''
  }, 1800)
}

const copyOutputPath = async () => {
  await copyToClipboard(outputPath.value)
  if (hasOutputPath.value) markCopied(t('videoParser.output.copied'))
}

const revealOutputPath = () => {
  const path = outputPath.value
  if (!path || path === t('videoParser.notSet')) return
  const url = path.startsWith('/') ? `file://${encodeURI(path)}` : path
  window.open(url, '_blank')
}

const copyOutline = () => {
  if (outlineState.value !== 'success') return
  const text = outlineNodes
    .value
    .map((node) => `${node.title}\n${node.children.map((child) => `- ${child}`).join('\n')}`)
    .join('\n\n')
  copyToClipboard(text)
  markCopied(t('videoParser.outline.copied'))
}

const retryOutline = () => {
  outlineGenerationState.value = 'generating'
  window.setTimeout(() => {
    outlineGenerationState.value = 'failed'
  }, 900)
}

loadSettings()

onBeforeUnmount(() => {
  downloadTimers.forEach((timer) => window.clearInterval(timer))
  downloadTimers.clear()
})
</script>

<style scoped>
.status-step {
  color: var(--muted-foreground);
}

.status-step::before {
  position: absolute;
  top: 3px;
  right: 0;
  left: 0;
  height: 1px;
  content: "";
  background: var(--line-strong);
}

.status-step::after {
  position: absolute;
  top: 3px;
  right: 0;
  left: 0;
  height: 1px;
  content: "";
  background: var(--blue);
  transform: scaleX(0);
  transform-origin: left center;
}

.status-step.is-reached::after {
  transform: scaleX(1);
}

.status-step.is-active::after {
  transform: scaleX(0);
}

.status-step:last-child::after,
.status-step:last-child::before {
  display: none;
}

.status-dot {
  position: relative;
  z-index: 1;
  display: block;
  width: 9px;
  height: 9px;
  border: 1px solid var(--haze);
  border-radius: 9999px;
  background: var(--background);
}

.status-step.is-reached {
  color: var(--blue);
}

.status-step.is-reached .status-dot {
  border-color: var(--blue);
  background: var(--blue);
}

.status-step.is-active {
  color: var(--blue);
}

.status-step.is-active .status-dot {
  border-color: var(--blue);
  background: var(--blue);
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--blue) 12%, transparent);
}

.status-step.is-reached p,
.status-step.is-active p {
  color: var(--blue);
}

.status-step.is-failed .status-dot {
  border-color: var(--destructive);
  background: var(--destructive);
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--destructive) 10%, transparent);
}

.status-step.is-failed p {
  color: var(--destructive);
}

.video-info-resolved {
  display: grid;
  grid-template-columns: minmax(180px, 220px) minmax(0, 1fr);
  gap: 1.75rem;
  align-items: start;
}

.video-info-thumb {
  width: 100%;
  aspect-ratio: 16 / 9;
}

.video-info-title {
  display: -webkit-box;
  max-width: 100%;
  overflow: hidden;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

@media (min-width: 1280px) {
  .video-info-resolved {
    grid-template-columns: minmax(190px, 240px) minmax(0, 1fr);
  }
}

@media (max-width: 767px) {
  .video-info-resolved {
    grid-template-columns: 1fr;
  }
}

.outline-map {
  position: relative;
  min-width: 560px;
  min-height: 430px;
  padding: 86px 0 28px;
}

.outline-root,
.outline-node {
  width: max-content;
  border: 1px solid var(--line-strong);
  background: var(--card);
  padding: 0.55rem 0.7rem;
  font-family: theme("fontFamily.mono");
  font-size: 0.75rem;
  line-height: 1.2;
  color: var(--foreground);
}

.outline-root {
  position: absolute;
  top: 192px;
  left: 0;
}

.outline-trunk {
  position: absolute;
  top: 210px;
  left: 128px;
  width: 42px;
  height: 1px;
  background: var(--line-strong);
}

.outline-branches {
  margin-left: 170px;
  display: grid;
  gap: 26px;
}

.outline-branch {
  position: relative;
  display: grid;
  grid-template-columns: 190px minmax(190px, 1fr);
  align-items: center;
  gap: 34px;
}

.outline-branch::before {
  position: absolute;
  left: -42px;
  width: 42px;
  height: 1px;
  content: "";
  background: var(--line-strong);
}

.outline-branch::after {
  position: absolute;
  left: -42px;
  width: 1px;
  height: calc(100% + 26px);
  content: "";
  background: var(--line-strong);
}

.outline-branch:first-child::after {
  top: 50%;
}

.outline-branch:last-child::after {
  bottom: 50%;
}

.outline-branch:not(:first-child):not(:last-child)::after {
  top: calc(-50% - 13px);
  height: calc(100% + 26px);
}

.outline-branch ul {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.outline-branch li {
  position: relative;
  font-size: 0.75rem;
  line-height: 1.35;
  color: var(--muted-foreground);
}

.outline-branch li::before {
  display: inline-block;
  width: 5px;
  height: 5px;
  margin-right: 9px;
  border: 1px solid var(--haze);
  border-radius: 9999px;
  content: "";
}

.settings-choice {
  border-bottom: 1px solid transparent;
  padding: 0.35rem 0.25rem;
  font-family: theme("fontFamily.mono");
  font-size: 0.6875rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--muted-foreground);
  transition:
    color 200ms var(--ease-premium),
    border-color 200ms var(--ease-premium);
}

.settings-choice:hover,
.settings-choice.is-selected {
  border-color: var(--blue);
  color: var(--blue);
}

.settings-choice:disabled {
  cursor: not-allowed;
  border-color: transparent;
  color: var(--haze);
}

.settings-link {
  font-family: theme("fontFamily.mono");
  font-size: 0.6875rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--blue);
  transition: color 200ms var(--ease-premium);
}

.settings-link:hover {
  color: var(--foreground);
}

@media (max-width: 1023px) {
  .outline-map {
    min-width: 520px;
  }
}
</style>
