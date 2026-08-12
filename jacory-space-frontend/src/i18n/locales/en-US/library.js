const developmentLibraryEntries = import.meta.env.DEV ? {
  podcastContentSummary: { title: 'Podcast Content Summary', description: 'Turn spoken podcast transcripts into a clear reader-facing summary and follow-up topics.' },
  podcastToBlog: { title: 'Podcast to Blog Draft', description: 'Extract one central thread from a podcast transcript and turn it into a de-identified Chinese blog draft.' },
  blogMarkdownPolish: { title: 'Blog Markdown Polish', description: 'Turn an existing draft into finished blog Markdown that follows the Jacory Space format.' },
} : {}

const developmentLibraryDetails = import.meta.env.DEV ? {
  podcastContentSummary: { about: 'Extract a readable summary, key ideas, narrative flow, and follow-up topics from a podcast transcript.', usage: 'Paste a structured transcript directly, or upload JSON with title, source, and transcript fields.', notes: 'The summary stays grounded in the transcript and names uncertainty rather than filling gaps.' },
  podcastToBlog: { about: 'Reorganize podcast material into an independently readable Chinese blog post that keeps a personal, bounded point of view.', usage: 'Provide the transcript. The model chooses the strongest thread, then returns a usable Markdown blog draft.', notes: 'The rules remove identifiable sources and private details; they never turn the original speaker’s experiences into the author’s.' },
  blogMarkdownPolish: { about: 'Polish a draft’s writing rhythm, frontmatter, file name, and site Markdown format without replacing the author’s central point of view.', usage: 'Paste one or more Chinese blog drafts. You can include temporary file names or incomplete frontmatter.', notes: 'This is editorial work, not a rewrite into a wholly different article.' },
} : {}

export default {
  library: {
    kicker: 'PROMPT & SKILL LIBRARY', titleLead: 'Plan', titleAccent: 'TO',
    description: 'A curated shelf of reusable prompts, Agent skills, and working methods. Find one, understand it, and take it with you.',
    indexLabel: 'ASSET INDEX', browseLabel: 'BROWSE BY CATEGORY', tagsLabel: 'TAGS CLOUD', filterAria: 'Filter assets', searchLabel: 'Search assets', searchPlaceholder: 'Search title or tag', updatedLabel: 'LAST UPDATE',
    filters: { all: 'ALL', prompts: 'PROMPTS', skills: 'SKILLS' }, copy: 'COPY', copied: 'COPIED', expandContent: 'EXPAND ALL', collapseContent: 'COLLAPSE', copySuccess: 'Copied to clipboard', copyError: 'Copy failed. Select the content manually.', empty: 'NO MATCHING ASSETS', backToLibrary: 'BACK TO LIBRARY', versionLabel: 'VERSION', commitLabel: 'COMMIT', licenseLabel: 'LICENSE', catalogedAtLabel: 'CATALOGED', assetsLabel: 'ASSETS', promptsLabel: 'PROMPTS', skillsLabel: 'SKILLS', aboutLabel: 'PURPOSE', contentLabel: 'PROMPT CONTENT', skillContentLabel: 'SKILL CONTENT', externalSkillLabel: 'EXTERNAL SKILL', usageLabel: 'USAGE', notesLabel: 'NOTES', useCasesLabel: 'USE CASES', precautionsLabel: 'PRECAUTIONS', coreContentLabel: 'CORE CONTENT', capabilityBoundaryLabel: 'CAPABILITY BOUNDARY', contentOutlineLabel: 'CONTENT OUTLINE', sourceAndDeploymentLabel: 'SOURCE & DEPLOYMENT', sourceRepositoryLabel: 'SOURCE REPOSITORY', sourcePathLabel: 'SOURCE PATH', deploymentCommandLabel: 'DEPLOYMENT COMMAND', copyInstallCommand: 'COPY DEPLOYMENT COMMAND', installCommandCopied: 'Deployment command copied to clipboard', switchToGrid: 'Switch to two-column view', switchToList: 'Switch to list view', notFound: 'ASSET NOT FOUND',
    tags: { podcast: 'Podcast', summary: 'Summary', writing: 'Writing', markdown: 'Markdown', minecraft: 'Minecraft', imageGeneration: 'Image Generation', threejs: 'Three.js', webgl: 'WebGL', vue: 'Vue', gsap: 'GSAP', animation: 'Animation' },
    clearTags: 'CLEAR',
    entries: {
      ...developmentLibraryEntries,
      minecraftSkinPreview: { title: 'Minecraft Dual-View Preview', description: 'Generate a standard Minecraft Java character preview for the downstream skin-conversion workflow.' },
      threejsFundamentals: { title: 'Three.js', description: 'A curated external skill for Three.js scenes, cameras, renderers, and object hierarchies.' },
      gsapCore: { title: 'GSAP', description: 'A curated official skill for GSAP core tweens, easing, staggering, and responsive animation.' }
    },
    details: {
      ...developmentLibraryDetails,
      minecraftSkinPreview: { about: 'Set up a long-running image-generation conversation for the Minecraft Java skin workflow. It produces a dual-view character preview, not a UV skin sheet.', usage: 'Start a new image-generation chat, upload the fixed dual-view reference, then paste the long-term rule. Follow with text requirements or character references.', notes: 'Image 1 controls composition, viewpoint, and proportions only. Character design comes from your request or later reference images.' },
      threejsFundamentals: { about: 'Use when creating or reviewing a Three.js project to address foundational concerns such as scenes, cameras, renderers, object hierarchies, coordinate transforms, and resource cleanup.', usage: 'Covers scene, camera, and renderer setup; Object3D / Group / Mesh hierarchies, coordinate transforms, and common math utilities; plus animation loops, responsive sizing, cleanup, loading, and performance handling.', notes: 'Covers foundational Three.js implementation. For specialized materials, lighting, loaders, or post-processing, refer to the corresponding skills in the source repository.' },
      gsapCore: { about: 'Use when writing or reviewing GSAP core tweens, easing, staggered motion, DOM / SVG animation, or responsive animation behavior.', usage: 'Covers tween patterns with `gsap.to()`, `from()`, `fromTo()`, and `set()`; duration, easing, stagger, and repeat options; DOM / SVG transforms, tween instance control, and responsive or reduced-motion setup with `gsap.matchMedia()`.', notes: 'Covers GSAP core animation. For scroll-driven motion, framework integration, plugins, and performance, refer to the corresponding skills in the source repository.' },
    }
  }
}
