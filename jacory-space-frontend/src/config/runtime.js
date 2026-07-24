export const isDevelopment = import.meta.env.DEV
export const isProduction = import.meta.env.PROD

export function devOnly(value, fallback = '') {
  return isDevelopment ? value : fallback
}
