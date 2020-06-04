export function getGlobalThis(): NodeJS.Global | Window {
  try {
    return window
  } catch {
    return global
  }
}
