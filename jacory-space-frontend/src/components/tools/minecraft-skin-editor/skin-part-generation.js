import { SKIN_PARTS } from './skin-core'

const COLOR_PATTERN = /^#[0-9a-f]{6}(?:[0-9a-f]{2})?$/i
const TOKEN_PATTERN = /^[0-9A-Z]$/

function partFaces(partName, layer) {
  return SKIN_PARTS[partName]?.[layer] || null
}

function isTransparent(color) {
  return color.length === 9 && color.slice(-2).toLowerCase() === '00'
}

function hexToRgba(hex) {
  const normalized = hex.slice(1)
  const value = normalized.length === 6 ? `${normalized}ff` : normalized
  return [0, 2, 4, 6].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16))
}

function writePixel(context, x, y, color) {
  const [red, green, blue, alpha] = hexToRgba(color)
  const image = context.createImageData(1, 1)
  image.data.set([red, green, blue, alpha])
  context.putImageData(image, x, y)
}

function validatePalette(palette, errors) {
  if (!palette || typeof palette !== 'object' || Array.isArray(palette)) {
    errors.push('palette must be an object keyed by one-character tokens')
    return
  }
  const entries = Object.entries(palette)
  if (entries.length < 3 || entries.length > 16) errors.push('palette must contain between 3 and 16 colors')
  entries.forEach(([token, color]) => {
    if (!TOKEN_PATTERN.test(token)) errors.push(`palette token "${token}" must be one uppercase letter or digit`)
    if (!COLOR_PATTERN.test(color || '')) errors.push(`palette.${token} must be a #RRGGBB or #RRGGBBAA color`)
  })
}

function validateFaceRows(rows, rect, palette, prefix, errors) {
  const [, , width, height] = rect
  if (!Array.isArray(rows) || rows.length !== height) {
    errors.push(`${prefix} must contain exactly ${height} rows`)
    return
  }
  rows.forEach((row, rowIndex) => {
    if (typeof row !== 'string' || row.length !== width) {
      errors.push(`${prefix}[${rowIndex}] must be a ${width}-character string`)
      return
    }
    for (const token of row) {
      if (!Object.hasOwn(palette, token)) errors.push(`${prefix}[${rowIndex}] references unknown palette token "${token}"`)
    }
  })
}

export function validatePixelPartDesign(design, { expectedPart = null, expectedModel = 'classic' } = {}) {
  const errors = []
  if (!design || typeof design !== 'object' || Array.isArray(design)) return { valid: false, errors: ['design must be an object'] }
  if (design.version !== 1) errors.push('design.version must be 1')
  if (!Object.hasOwn(SKIN_PARTS, design.part)) errors.push('design.part must be a supported Minecraft body part')
  if (expectedPart && design.part !== expectedPart) errors.push(`design.part must be "${expectedPart}"`)
  if (design.model !== expectedModel) errors.push(`design.model must be "${expectedModel}"`)

  validatePalette(design.palette, errors)
  const palette = design.palette && typeof design.palette === 'object' ? design.palette : {}
  const layers = design.layers
  if (!layers || typeof layers !== 'object' || Array.isArray(layers)) {
    errors.push('layers must contain base and outer face maps')
    return { valid: false, errors }
  }

  ;['base', 'outer'].forEach((layer) => {
    const faces = partFaces(design.part, layer)
    const faceRows = layers[layer]
    if (!faceRows || typeof faceRows !== 'object' || Array.isArray(faceRows)) {
      errors.push(`layers.${layer} must be an object containing every face`)
      return
    }
    Object.entries(faces || {}).forEach(([faceName, rect]) => {
      validateFaceRows(faceRows[faceName], rect, palette, `layers.${layer}.${faceName}`, errors)
    })
    Object.keys(faceRows).forEach((faceName) => {
      if (!faces || !Object.hasOwn(faces, faceName)) errors.push(`layers.${layer}.${faceName} is not a valid face for ${design.part}`)
    })
  })

  if (layers.base && palette) {
    Object.values(layers.base).flat().forEach((token) => {
      if (palette[token] && isTransparent(palette[token])) errors.push('base layer cannot contain transparent pixels')
    })
  }

  const usedOpaqueColors = new Set()
  ;['base', 'outer'].forEach((layer) => {
    Object.values(layers[layer] || {}).flat().forEach((token) => {
      const color = palette[token]
      if (color && !isTransparent(color)) usedOpaqueColors.add(color.toLowerCase())
    })
  })
  if (usedOpaqueColors.size < 3) errors.push('design must use at least three opaque colors so the part has deliberate value structure')

  return { valid: errors.length === 0, errors }
}

function assertValidDesign(design, options) {
  const validation = validatePixelPartDesign(design, options)
  if (!validation.valid) throw new Error(validation.errors.join('; '))
}

export function applyPixelPartDesign(canvas, design, options) {
  assertValidDesign(design, options)
  const context = canvas.getContext('2d', { willReadFrequently: true })
  let changedPixels = 0

  ;['base', 'outer'].forEach((layer) => {
    Object.entries(SKIN_PARTS[design.part][layer]).forEach(([faceName, [originX, originY]]) => {
      design.layers[layer][faceName].forEach((row, localY) => {
        for (let localX = 0; localX < row.length; localX += 1) {
          writePixel(context, originX + localX, originY + localY, design.palette[row[localX]])
          changedPixels += 1
        }
      })
    })
  })

  return {
    changedPixels,
    part: design.part,
    layers: ['base', 'outer']
  }
}

export function createPixelPartProposalCanvas(canvas, design, options) {
  const proposal = document.createElement('canvas')
  proposal.width = canvas.width
  proposal.height = canvas.height
  const context = proposal.getContext('2d', { willReadFrequently: true })
  context.imageSmoothingEnabled = false
  context.drawImage(canvas, 0, 0)
  return { canvas: proposal, ...applyPixelPartDesign(proposal, design, options) }
}

export function readPixelPartDesign(canvas, part, model = 'classic') {
  const context = canvas.getContext('2d', { willReadFrequently: true })
  const palette = {}
  const colorTokens = new Map()
  const availableTokens = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  const tokenForColor = (color) => {
    if (colorTokens.has(color)) return colorTokens.get(color)
    const token = availableTokens.shift()
    if (!token) throw new Error('The selected part uses more than 36 colors and cannot be sent as a compact pixel design.')
    colorTokens.set(color, token)
    palette[token] = color
    return token
  }

  const layers = Object.fromEntries(['base', 'outer'].map((layer) => [layer, Object.fromEntries(Object.entries(SKIN_PARTS[part][layer]).map(([faceName, [originX, originY, width, height]]) => {
    const rows = []
    for (let localY = 0; localY < height; localY += 1) {
      let row = ''
      for (let localX = 0; localX < width; localX += 1) {
        const data = context.getImageData(originX + localX, originY + localY, 1, 1).data
        const color = `#${[data[0], data[1], data[2], data[3]].map((value) => value.toString(16).padStart(2, '0')).join('')}`
        row += tokenForColor(color)
      }
      rows.push(row)
    }
    return [faceName, rows]
  }))]))

  return { version: 1, part, model, palette, layers }
}
