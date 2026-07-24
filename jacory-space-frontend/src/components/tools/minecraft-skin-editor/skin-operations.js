import { MIRROR_FACES, MIRROR_PARTS, SKIN_PARTS, findSkinFaceAtPixel } from './skin-core'

export const AI_SKIN_OPERATION_TYPES = ['palette', 'patch', 'mirror', 'clear', 'style']
export const AI_SKIN_LAYERS = ['base', 'outer']
export const AI_SKIN_STYLE_PATTERNS = ['armor', 'jacket', 'tech', 'trim']

const HEX_COLOR = /^#[0-9a-f]{6}(?:[0-9a-f]{2})?$/i

function isPart(value) {
  return typeof value === 'string' && Object.hasOwn(SKIN_PARTS, value)
}

function isLayer(value) {
  return AI_SKIN_LAYERS.includes(value)
}

function targetParts(operation) {
  if (Array.isArray(operation.targets)) return operation.targets
  if (typeof operation.target === 'string') return [operation.target]
  return []
}

function validateOperation(operation, index) {
  const prefix = `operations[${index}]`
  const errors = []
  if (!operation || typeof operation !== 'object') return [`${prefix} must be an object`]
  if (!AI_SKIN_OPERATION_TYPES.includes(operation.type)) errors.push(`${prefix}.type is unsupported`)
  if (!isLayer(operation.layer)) errors.push(`${prefix}.layer must be "base" or "outer"`)

  const parts = targetParts(operation)
  if (!parts.length) errors.push(`${prefix}.targets must include at least one body part`)
  parts.forEach((part) => {
    if (!isPart(part)) errors.push(`${prefix}.targets contains unknown body part: ${part}`)
  })

  if (operation.type === 'palette') {
    if (!Array.isArray(operation.replacements) || !operation.replacements.length) {
      errors.push(`${prefix}.replacements must not be empty`)
    } else {
      operation.replacements.forEach((replacement, replacementIndex) => {
        if (!HEX_COLOR.test(replacement?.from || '') || !HEX_COLOR.test(replacement?.to || '')) {
          errors.push(`${prefix}.replacements[${replacementIndex}] requires valid from and to colors`)
        }
      })
    }
  }

  if (operation.type === 'patch') {
    if (!Array.isArray(operation.pixels) || !operation.pixels.length) errors.push(`${prefix}.pixels must not be empty`)
    operation.pixels?.forEach((pixel, pixelIndex) => {
      if (!Number.isInteger(pixel?.x) || !Number.isInteger(pixel?.y) || pixel.x < 0 || pixel.x >= 64 || pixel.y < 0 || pixel.y >= 64) {
        errors.push(`${prefix}.pixels[${pixelIndex}] has an invalid coordinate`)
      }
      if (!HEX_COLOR.test(pixel?.color || '')) errors.push(`${prefix}.pixels[${pixelIndex}].color is invalid`)
      if (Number.isInteger(pixel?.x) && Number.isInteger(pixel?.y) && !targetParts(operation).some((part) => {
        const face = findSkinFaceAtPixel(pixel, operation.layer)
        return face?.partName === part
      })) {
        errors.push(`${prefix}.pixels[${pixelIndex}] is outside its declared body parts`)
      }
    })
  }

  if (operation.type === 'mirror') {
    if (parts.length !== 1) errors.push(`${prefix}.mirror requires exactly one source target`)
    if (!MIRROR_PARTS[parts[0]]) errors.push(`${prefix}.targets[0] cannot be mirrored`)
  }

  if (operation.type === 'clear' && operation.color && !HEX_COLOR.test(operation.color)) {
    errors.push(`${prefix}.color is invalid`)
  }

  if (operation.type === 'style') {
    if (!AI_SKIN_STYLE_PATTERNS.includes(operation.pattern)) errors.push(`${prefix}.pattern is unsupported`)
    if (!operation.palette || typeof operation.palette !== 'object') {
      errors.push(`${prefix}.palette is required`)
    } else {
      ;['base', 'shadow', 'highlight', 'accent'].forEach((key) => {
        if (operation.palette[key] && !HEX_COLOR.test(operation.palette[key])) errors.push(`${prefix}.palette.${key} is invalid`)
      })
      if (!HEX_COLOR.test(operation.palette.base || '')) errors.push(`${prefix}.palette.base is required`)
    }
  }

  return errors
}

export function validateAiSkinEditPlan(plan) {
  const errors = []
  if (!plan || typeof plan !== 'object') return { valid: false, errors: ['plan must be an object'] }
  if (!Array.isArray(plan.operations) || !plan.operations.length) errors.push('plan.operations must not be empty')
  plan.operations?.forEach((operation, index) => errors.push(...validateOperation(operation, index)))
  plan.preserve?.forEach?.((part) => {
    if (!isPart(part)) errors.push(`preserve contains unknown body part: ${part}`)
  })
  return { valid: errors.length === 0, errors }
}

function assertPlanIsSafe(plan) {
  const result = validateAiSkinEditPlan(plan)
  if (!result.valid) throw new Error(`Invalid AI skin edit plan: ${result.errors.join('; ')}`)
}

function rectsForParts(parts, layer) {
  return parts.flatMap((partName) => Object.values(SKIN_PARTS[partName][layer]))
}

function rgbaToHex(data, offset) {
  return `#${[data[offset], data[offset + 1], data[offset + 2], data[offset + 3]].map((value) => value.toString(16).padStart(2, '0')).join('')}`
}

function hexToRgba(hex) {
  const normalized = hex.slice(1)
  const values = normalized.length === 6 ? `${normalized}ff` : normalized
  return [0, 2, 4, 6].map((offset) => Number.parseInt(values.slice(offset, offset + 2), 16))
}

function setPixel(context, x, y, color) {
  const [red, green, blue, alpha] = hexToRgba(color)
  const image = context.createImageData(1, 1)
  image.data.set([red, green, blue, alpha])
  context.putImageData(image, x, y)
}

function applyPalette(context, operation) {
  const replacements = new Map(operation.replacements.map(({ from, to }) => [from.toLowerCase(), to]))
  const image = context.getImageData(0, 0, 64, 64)
  let changedPixels = 0
  rectsForParts(targetParts(operation), operation.layer).forEach(([x, y, width, height]) => {
    for (let pixelY = y; pixelY < y + height; pixelY += 1) {
      for (let pixelX = x; pixelX < x + width; pixelX += 1) {
        const offset = (pixelY * 64 + pixelX) * 4
        const replacement = replacements.get(rgbaToHex(image.data, offset)) || replacements.get(rgbaToHex(image.data, offset).slice(0, 7))
        if (replacement) {
          setPixel(context, pixelX, pixelY, replacement)
          changedPixels += 1
        }
      }
    }
  })
  return changedPixels
}

function applyPatch(context, operation) {
  let changedPixels = 0
  operation.pixels.forEach(({ x, y, color }) => {
    setPixel(context, x, y, color)
    changedPixels += 1
  })
  return changedPixels
}

function applyMirror(context, operation) {
  const sourcePart = targetParts(operation)[0]
  const targetPart = MIRROR_PARTS[sourcePart]
  const sourceFaces = SKIN_PARTS[sourcePart][operation.layer]
  const targetFaces = SKIN_PARTS[targetPart][operation.layer]
  const sourceImage = context.getImageData(0, 0, 64, 64)
  let changedPixels = 0

  Object.entries(sourceFaces).forEach(([face, sourceRect]) => {
    const targetRect = targetFaces[MIRROR_FACES[face]]
    const [sourceX, sourceY, width, height] = sourceRect
    const [targetX, targetY] = targetRect
    for (let localY = 0; localY < height; localY += 1) {
      for (let localX = 0; localX < width; localX += 1) {
        const sourceOffset = ((sourceY + localY) * 64 + sourceX + localX) * 4
        const color = rgbaToHex(sourceImage.data, sourceOffset)
        setPixel(context, targetX + width - localX - 1, targetY + localY, color)
        changedPixels += 1
      }
    }
  })
  return changedPixels
}

function applyClear(context, operation) {
  const clearColor = operation.color || '#00000000'
  let changedPixels = 0
  rectsForParts(targetParts(operation), operation.layer).forEach(([x, y, width, height]) => {
    for (let pixelY = y; pixelY < y + height; pixelY += 1) {
      for (let pixelX = x; pixelX < x + width; pixelX += 1) {
        setPixel(context, pixelX, pixelY, clearColor)
        changedPixels += 1
      }
    }
  })
  return changedPixels
}

function fillRect(context, x, y, width, height, color) {
  context.fillStyle = color
  context.fillRect(x, y, width, height)
}

function applyStyle(context, operation) {
  const palette = {
    base: operation.palette.base,
    shadow: operation.palette.shadow || operation.palette.base,
    highlight: operation.palette.highlight || operation.palette.base,
    accent: operation.palette.accent || operation.palette.highlight || operation.palette.base
  }
  let changedPixels = 0

  rectsForParts(targetParts(operation), operation.layer).forEach(([x, y, width, height]) => {
    fillRect(context, x, y, width, height, palette.base)
    changedPixels += width * height
    if (width < 2 || height < 2) return

    fillRect(context, x, y + height - 1, width, 1, palette.shadow)
    fillRect(context, x + width - 1, y, 1, height, palette.shadow)
    fillRect(context, x, y, width - 1, 1, palette.highlight)

    if (operation.pattern === 'armor') {
      const panelWidth = Math.max(1, Math.min(2, width - 2))
      const panelX = x + Math.floor((width - panelWidth) / 2)
      const panelY = y + Math.min(2, height - 1)
      const panelHeight = Math.max(1, height - panelY + y - 2)
      fillRect(context, panelX, panelY, panelWidth, panelHeight, palette.accent)
    }
    if (operation.pattern === 'jacket') {
      const bandY = y + Math.floor(height / 2)
      fillRect(context, x + 1, bandY, Math.max(1, width - 2), 1, palette.accent)
    }
    if (operation.pattern === 'tech') {
      const lineX = x + Math.floor(width / 2)
      fillRect(context, lineX, y + 1, 1, Math.max(1, height - 2), palette.accent)
    }
    if (operation.pattern === 'trim') {
      fillRect(context, x, y, 1, height - 1, palette.accent)
      fillRect(context, x, y, width - 1, 1, palette.accent)
    }
  })
  return changedPixels
}

export function applyAiSkinEditPlan(canvas, plan) {
  assertPlanIsSafe(plan)
  const preserved = new Set(plan.preserve || [])
  const unsafeParts = plan.operations.flatMap(targetParts).filter((part) => preserved.has(part))
  if (unsafeParts.length) {
    throw new Error(`AI plan attempts to modify a preserved body part: ${[...new Set(unsafeParts)].join(', ')}`)
  }
  const before = canvas.toDataURL('image/png')
  const context = canvas.getContext('2d', { willReadFrequently: true })
  let changedPixels = 0

  plan.operations.forEach((operation) => {
    if (operation.type === 'palette') changedPixels += applyPalette(context, operation)
    if (operation.type === 'patch') changedPixels += applyPatch(context, operation)
    if (operation.type === 'mirror') changedPixels += applyMirror(context, operation)
    if (operation.type === 'clear') changedPixels += applyClear(context, operation)
    if (operation.type === 'style') changedPixels += applyStyle(context, operation)
  })

  return {
    before,
    after: canvas.toDataURL('image/png'),
    changedPixels,
    operationCount: plan.operations.length,
    targets: [...new Set(plan.operations.flatMap(targetParts))],
    layers: [...new Set(plan.operations.map((operation) => operation.layer))],
    source: 'ai'
  }
}

export function createAiSkinProposalCanvas(canvas, plan) {
  const proposal = document.createElement('canvas')
  proposal.width = canvas.width
  proposal.height = canvas.height
  const context = proposal.getContext('2d', { willReadFrequently: true })
  context.imageSmoothingEnabled = false
  context.drawImage(canvas, 0, 0)
  const result = applyAiSkinEditPlan(proposal, plan)
  return { canvas: proposal, ...result }
}
