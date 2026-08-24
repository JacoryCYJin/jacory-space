export const HOME_DOT_MATRIX_CONFIG = {
  columns: 280,
  rowDensity: 1,
  dotSize: 0.76,
  gap: 0.1
}

export function resolveDotMatrixRows(width, height) {
  const aspect = Math.max(width / Math.max(height, 1), 0.001)

  return Math.max(
    1,
    Math.round((HOME_DOT_MATRIX_CONFIG.columns / aspect) * HOME_DOT_MATRIX_CONFIG.rowDensity)
  )
}
