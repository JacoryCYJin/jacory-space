export const SKIN_SIZE = 64

// Source: Mojang's official Java Edition Steve skin template. It is embedded so
// the initial texture remains same-origin and can be exported after editing.
export const DEFAULT_STEVE_SKIN_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFDUlEQVR42u2a20sUURzH97G0LKMotPuWbVpslj1olJXdjCgyisowsSjzgrB0gSKyC5UF1ZNQWEEQSBQ9dHsIe+zJ/+nXfM/sb/rN4ZwZ96LOrnPgyxzP/M7Z+X7OZc96JpEISfWrFhK0YcU8knlozeJKunE4HahEqSc2nF6zSEkCgGCyb+82enyqybtCZQWAzdfVVFgBJJNJn1BWFgC49/VpwGVlD0CaxQiA5HSYEwBM5sMAdKTqygcAG9+8coHKY/XXAZhUNgDYuBSPjJL/GkzVVhAEU5tqK5XZ7cnFtHWtq/TahdSw2l0HUisr1UKIWJQBAMehDuqiDdzndsP2EZECAG1ZXaWMwOCODdXqysLf++uXUGv9MhUHIByDOijjdiSAoH3ErANQD73C7TXXuGOsFj1d4YH4OTJAEy8y9Hd0mCaeZ5z8dfp88zw1bVyiYhCLOg1ZeAqC0ybaDttHRGME1DhDeVWV26u17lRAPr2+mj7dvULfHw2q65fhQRrLXKDfIxkau3ZMCTGIRR3URR5toU38HbaPiMwUcKfBAkoun09PzrbQ2KWD1JJaqswjdeweoR93rirzyCMBCmIQizqoizZkm2H7iOgAcHrMHbbV9KijkUYv7qOn55sdc4fo250e+vUg4329/Xk6QB/6DtOws+dHDGJRB3XRBve+XARt+4hIrAF4UAzbnrY0ve07QW8uHfB+0LzqanMM7qVb+3f69LJrD90/1axiEIs6qIs21BTIToewfcSsA+Bfb2x67OoR1aPPzu2i60fSNHRwCw221Suz0O3jO+jh6V1KyCMGse9721XdN5ePutdsewxS30cwuMjtC860T5JUKpXyKbSByUn7psi5l+juDlZYGh9324GcPKbkycaN3jUSAGxb46IAYPNZzW0AzgiQ5tVnzLUpUDCAbakMQXXrOtX1UMtHn+Q9/X5L4wgl7t37r85OSrx+TYl379SCia9KXjxRpiTjIZTBFOvrV1f8ty2eY/T7XJ81FQAwmA8ASH1ob68r5PnBsxA88/xAMh6SpqW4HRnLBrkOA9Xv5wPAZjAUgOkB+SHxgBgR0qSMh0zmZRsmwDJm1gFg2PMDIC8/nAHIMls8x8GgzOsG5WiaqREgYzDvpTwjLDy8NM15LpexDEA3LepjU8Z64my+8PtDCmUyRr+fFwA2J0eAFYA0AxgSgMmYBMZTwFQnO9RNAEaHOj2DXF5UADmvAToA2ftyxZYA5BqgmZZApDkdAK4mAKo8GzPlr8G8AehzMAyA/i1girUA0HtYB2CaIkUBEHQ/cBHSvwF0AKZFS5M0ZwMQtEaEAmhtbSUoDADH9ff3++QZ4o0I957e+zYAMt6wHkhzpjkuAcgpwNcpA7AZDLsvpwiuOkBvxygA6Bsvb0HlaeKIF2EbADZpGiGzBsA0gnwQHGOhW2snRpbpPexbAB2Z1oicAMQpTnGKU5ziFKc4xSlOcYpTnOIUpzgVmgo+XC324WfJAdDO/+ceADkCpuMFiFKbApEHkOv7BfzfXt+5gpT8V7rpfYJcDz+jAsB233r6yyBsJ0mlBCDofuBJkel4vOwBFPv8fyYAFPJ+wbSf/88UANNRVy4Awo6+Ig2gkCmgA5DHWjoA+X7AlM//owLANkX0w0359od++pvX8fdMAcj3/QJ9iJsAFPQCxHSnQt8vMJ3v2wCYpkhkAOR7vG7q4aCXoMoSgG8hFAuc/grMdAD4B/kHl9da7Ne9AAAAAElFTkSuQmCC'
export const DEFAULT_ALEX_SKIN_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAZlBMVEUAAAD////v2r/r0LDvu7HfxKLUt4/zqFiUyJKMvorrmD+GuYTljT97snjegS5xq26UlmuAglpvb29lZWV8Vz51UDhYWFhyTjZPT09sRi5kQSwjYiQrVChcOyc/Pz82NjYYOBYoKCgm8xoJAAAAAXRSTlMAQObYZgAAAwZJREFUeNrtlu1W6jAQRWtjWiaZtCC9/YgC8v4vec9Mg6Uur6b8ve6S0Lo8O2NYmClusOMGF7Nr8HKu2IoDTYPk44K6lvBciePNAm7mlTGz3G2voAaYZg9vFzCCjtnZqoHjAYHDJjAM1tqqgmR7Bahf9tFaA6zND6JwXRpxxosZIkz4uQzOWFmTrJPOUgdjOP1hzu7flmNrJe4wtCBoMgR1LVE1mNIYNbAurpafN5N5Xto8vZbl65PhWg0aRiU/C2Rpa0x5w/LHnjQwZVTgGk755+eyNMbWXDeukQIwMjaRm6qyJjmMtTAi1ziHF0OQQwsul+u1SJBnZsTbRJEgIqzxD8H1erksAt80MLTtCawFpvpScDqtKzhUYpA8yKgAv7Wq4GCripmT4PsKPFGIQxdjbFsPCPiDsbY6tAvBU2K+KRZiCHHquimC0ylGCoH8vjSmVEG4xb0Mmb2MYmGYpgH5boBA7iAIPuxL5CUtT0Q72u0wy6SDioVOosh3k5ggQIZgQB4iDITlOqwoFiaJwzJAcMJARhOShUCX3AGjWMWYYqHv+zghHntwPPaoWQJh58mLRe5FUSpQ6BenWDgi1B81rCAki0oIgiDvQRRlMkh+JdDgi2b78zieEUKEWglRG4gQp+8EEupTeOz78f39/U32n1oKb3iAQ642CWQfPlWAUAr3MtoQ2jck4XmTe7wL7ykPrFkJRkm9HCUuopF8CN6TXsGTEAjvt2+7Gu4Fl/N5xN+PMs6XCwZJLv4BER480MzHFsyfwi9ZpDNSYH7IIKcDPKB4iHSwPk7tVo974ZDYZ1VQ/PKfg9Nsddg6ouWfyCMNh2OqzBbBCdxXUDMq2Cq4r6CmDRVEoRvm4z4Q8OwowdmCbgDThEq8Jwg8pb4gSzANU5cY4l1ngCtDMM0NR4yYwfS5LzgoewXPXwuQ1bZDsIJJ2OJHPvcL49wQJEyGQI+5pV/o9Sj8IKcCSd31C5sFEhrv+gVrzAbBul9QINiwB+t+QdHWLBmyPgXtF8CtX5CO4LsK/gL4WlU0/HKH/gAAAABJRU5ErkJggg=='

export const SKIN_PARTS = {
  head: {
    label: 'HEAD',
    size: [8, 8, 8],
    position: [0, 14, 0],
    base: { top: [8, 0, 8, 8], bottom: [16, 0, 8, 8], right: [0, 8, 8, 8], front: [8, 8, 8, 8], left: [16, 8, 8, 8], back: [24, 8, 8, 8] },
    outer: { top: [40, 0, 8, 8], bottom: [48, 0, 8, 8], right: [32, 8, 8, 8], front: [40, 8, 8, 8], left: [48, 8, 8, 8], back: [56, 8, 8, 8] }
  },
  body: {
    label: 'BODY',
    size: [8, 12, 4],
    position: [0, 4, 0],
    base: { top: [20, 16, 8, 4], bottom: [28, 16, 8, 4], right: [16, 20, 4, 12], front: [20, 20, 8, 12], left: [28, 20, 4, 12], back: [32, 20, 8, 12] },
    outer: { top: [20, 32, 8, 4], bottom: [28, 32, 8, 4], right: [16, 36, 4, 12], front: [20, 36, 8, 12], left: [28, 36, 4, 12], back: [32, 36, 8, 12] }
  },
  rightArm: {
    label: 'R ARM',
    size: [4, 12, 4],
    position: [-6, 4, 0],
    base: { top: [44, 16, 4, 4], bottom: [48, 16, 4, 4], right: [40, 20, 4, 12], front: [44, 20, 4, 12], left: [48, 20, 4, 12], back: [52, 20, 4, 12] },
    outer: { top: [44, 32, 4, 4], bottom: [48, 32, 4, 4], right: [40, 36, 4, 12], front: [44, 36, 4, 12], left: [48, 36, 4, 12], back: [52, 36, 4, 12] }
  },
  leftArm: {
    label: 'L ARM',
    size: [4, 12, 4],
    position: [6, 4, 0],
    base: { top: [36, 48, 4, 4], bottom: [40, 48, 4, 4], right: [32, 52, 4, 12], front: [36, 52, 4, 12], left: [40, 52, 4, 12], back: [44, 52, 4, 12] },
    outer: { top: [52, 48, 4, 4], bottom: [56, 48, 4, 4], right: [48, 52, 4, 12], front: [52, 52, 4, 12], left: [56, 52, 4, 12], back: [60, 52, 4, 12] }
  },
  rightLeg: {
    label: 'R LEG',
    size: [4, 12, 4],
    position: [-2, -8, 0],
    base: { top: [4, 16, 4, 4], bottom: [8, 16, 4, 4], right: [0, 20, 4, 12], front: [4, 20, 4, 12], left: [8, 20, 4, 12], back: [12, 20, 4, 12] },
    outer: { top: [4, 32, 4, 4], bottom: [8, 32, 4, 4], right: [0, 36, 4, 12], front: [4, 36, 4, 12], left: [8, 36, 4, 12], back: [12, 36, 4, 12] }
  },
  leftLeg: {
    label: 'L LEG',
    size: [4, 12, 4],
    position: [2, -8, 0],
    base: { top: [20, 48, 4, 4], bottom: [24, 48, 4, 4], right: [16, 52, 4, 12], front: [20, 52, 4, 12], left: [24, 52, 4, 12], back: [28, 52, 4, 12] },
    outer: { top: [4, 48, 4, 4], bottom: [8, 48, 4, 4], right: [0, 52, 4, 12], front: [4, 52, 4, 12], left: [8, 52, 4, 12], back: [12, 52, 4, 12] }
  }
}

export const MIRROR_PARTS = {
  head: 'head', body: 'body', rightArm: 'leftArm', leftArm: 'rightArm', rightLeg: 'leftLeg', leftLeg: 'rightLeg'
}

export const MIRROR_FACES = {
  top: 'top', bottom: 'bottom', right: 'left', front: 'front', left: 'right', back: 'back'
}

export function findSkinFaceAtPixel(pixel, layer) {
  for (const [partName, part] of Object.entries(SKIN_PARTS)) {
    for (const [face, rect] of Object.entries(part[layer])) {
      const [x, y, width, height] = rect
      if (pixel.x >= x && pixel.x < x + width && pixel.y >= y && pixel.y < y + height) {
        return { partName, face, rect, localX: pixel.x - x, localY: pixel.y - y }
      }
    }
  }
  return null
}

export function mirrorSkinPixel(pixel, layer) {
  const source = findSkinFaceAtPixel(pixel, layer)
  if (!source) return null
  const targetPart = SKIN_PARTS[MIRROR_PARTS[source.partName]]
  const targetRect = targetPart[layer][MIRROR_FACES[source.face]]
  const [x, y, width] = targetRect
  return { x: x + width - source.localX - 1, y: y + source.localY }
}

function samePixel(data, offset, red, green, blue, alpha) {
  return data[offset] === red && data[offset + 1] === green && data[offset + 2] === blue && data[offset + 3] === alpha
}

export function floodFillSkinFace(canvas, pixel, layer, color) {
  const face = findSkinFaceAtPixel(pixel, layer)
  if (!face) return false
  const [originX, originY, width, height] = face.rect
  const context = canvas.getContext('2d', { willReadFrequently: true })
  const image = context.getImageData(originX, originY, width, height)
  const startX = face.localX
  const startY = face.localY
  const startOffset = (startY * width + startX) * 4
  const [red, green, blue, alpha] = image.data.slice(startOffset, startOffset + 4)
  const queue = [[startX, startY]]
  const visited = new Set()
  context.fillStyle = color

  while (queue.length) {
    const [x, y] = queue.pop()
    const key = `${x}:${y}`
    if (visited.has(key) || x < 0 || y < 0 || x >= width || y >= height) continue
    visited.add(key)
    const offset = (y * width + x) * 4
    if (!samePixel(image.data, offset, red, green, blue, alpha)) continue
    context.fillRect(originX + x, originY + y, 1, 1)
    queue.push([x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1])
  }

  return visited.size > 0
}

export function createSkinCanvas() {
  const canvas = document.createElement('canvas')
  canvas.width = SKIN_SIZE
  canvas.height = SKIN_SIZE
  const context = canvas.getContext('2d', { willReadFrequently: true })
  context.imageSmoothingEnabled = false
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      context.drawImage(image, 0, 0, SKIN_SIZE, SKIN_SIZE)
      resolve(canvas)
    }
    image.onerror = () => reject(new Error('Unable to load the default Steve skin.'))
    image.src = DEFAULT_STEVE_SKIN_DATA_URL
  })
}

function drawDefaultSkin(context) {
  context.clearRect(0, 0, SKIN_SIZE, SKIN_SIZE)
  const skin = '#b9795c'
  const skinShadow = '#9a5f47'
  const hair = '#3b2718'
  const hairShade = '#2b1b12'
  const shirt = '#16aab1'
  const shirtShade = '#0b8d96'
  const pants = '#4b3baa'
  const pantsShade = '#37298b'
  const shoes = '#53575b'

  const fillPart = (part, color) => {
    context.fillStyle = color
    Object.values(part.base).forEach(([x, y, width, height]) => context.fillRect(x, y, width, height))
  }
  const fillFace = (part, face, color) => {
    const [x, y, width, height] = part.base[face]
    context.fillStyle = color
    context.fillRect(x, y, width, height)
  }
  const band = (part, face, offsetY, height, color) => {
    const [x, y, width] = part.base[face]
    context.fillStyle = color
    context.fillRect(x, y + offsetY, width, height)
  }

  fillPart(SKIN_PARTS.head, skin)
  fillFace(SKIN_PARTS.head, 'top', hair)
  fillFace(SKIN_PARTS.head, 'back', hair)
  ;['front', 'left', 'right'].forEach((face) => band(SKIN_PARTS.head, face, 0, 2, hair))
  fillFace(SKIN_PARTS.head, 'left', hairShade)
  band(SKIN_PARTS.head, 'left', 2, 6, skinShadow)
  band(SKIN_PARTS.head, 'right', 2, 6, skinShadow)
  const [faceX, faceY] = SKIN_PARTS.head.base.front
  context.fillStyle = '#f2f2f2'
  context.fillRect(faceX + 1, faceY + 3, 2, 2)
  context.fillRect(faceX + 5, faceY + 3, 2, 2)
  context.fillStyle = '#4c68b2'
  context.fillRect(faceX + 2, faceY + 3, 1, 2)
  context.fillRect(faceX + 5, faceY + 3, 1, 2)
  context.fillStyle = skinShadow
  context.fillRect(faceX + 3, faceY + 5, 2, 1)

  fillPart(SKIN_PARTS.body, shirt)
  fillFace(SKIN_PARTS.body, 'left', shirtShade)
  fillFace(SKIN_PARTS.body, 'back', shirtShade)
  const [bodyX, bodyY] = SKIN_PARTS.body.base.front
  context.fillStyle = '#21bbc0'
  context.fillRect(bodyX + 2, bodyY, 4, 12)

  ;[SKIN_PARTS.rightArm, SKIN_PARTS.leftArm].forEach((arm) => {
    fillPart(arm, skin)
    ;['front', 'back', 'left', 'right'].forEach((face) => band(arm, face, 0, 4, shirt))
    band(arm, 'left', 4, 8, skinShadow)
  })

  ;[SKIN_PARTS.rightLeg, SKIN_PARTS.leftLeg].forEach((leg) => {
    fillPart(leg, pants)
    fillFace(leg, 'left', pantsShade)
    fillFace(leg, 'back', pantsShade)
    ;['front', 'back', 'left', 'right'].forEach((face) => band(leg, face, 9, 3, shoes))
  })
}

export function drawCanvasToGrid(canvas, target) {
  const context = target.getContext('2d')
  const size = Math.min(target.clientWidth || 512, target.clientHeight || 512)
  const pixelSize = Math.floor(size / SKIN_SIZE)
  target.width = pixelSize * SKIN_SIZE
  target.height = pixelSize * SKIN_SIZE
  context.imageSmoothingEnabled = false
  context.clearRect(0, 0, target.width, target.height)
  context.drawImage(canvas, 0, 0, target.width, target.height)
  context.strokeStyle = 'rgba(29, 33, 39, 0.14)'
  context.lineWidth = 1
  for (let index = 0; index <= SKIN_SIZE; index += 1) {
    const offset = index * pixelSize + 0.5
    context.beginPath()
    context.moveTo(offset, 0)
    context.lineTo(offset, target.height)
    context.stroke()
    context.beginPath()
    context.moveTo(0, offset)
    context.lineTo(target.width, offset)
    context.stroke()
  }
}

export function paintPixel(canvas, event, color) {
  const bounds = event.currentTarget.getBoundingClientRect()
  const x = Math.floor(((event.clientX - bounds.left) / bounds.width) * SKIN_SIZE)
  const y = Math.floor(((event.clientY - bounds.top) / bounds.height) * SKIN_SIZE)
  if (x < 0 || y < 0 || x >= SKIN_SIZE || y >= SKIN_SIZE) return false
  const context = canvas.getContext('2d')
  context.fillStyle = color
  context.fillRect(x, y, 1, 1)
  return true
}

export function downloadCanvas(canvas, filename = 'minecraft-skin.png') {
  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL('image/png')
  link.click()
}

export function importSkinFile(file, targetCanvas) {
  return new Promise((resolve, reject) => {
    if (!file || file.type !== 'image/png') {
      reject(new Error('Only PNG skins are supported.'))
      return
    }
    const image = new Image()
    image.onload = () => {
      const context = targetCanvas.getContext('2d')
      context.clearRect(0, 0, SKIN_SIZE, SKIN_SIZE)
      context.imageSmoothingEnabled = false
      context.drawImage(image, 0, 0, SKIN_SIZE, SKIN_SIZE)
      resolve({ width: image.width, height: image.height })
    }
    image.onerror = reject
    image.src = URL.createObjectURL(file)
  })
}
