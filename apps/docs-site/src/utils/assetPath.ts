/**
 * Resolve asset paths with Vite's base URL so built docs can load assets from sub-paths.
 * @param assetPath path relative to the public root (e.g. "assets/images/test.png")
 */
export function resolveAssetPath(assetPath: string) {
  const base = import.meta.env.BASE_URL || '/'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  const normalizedPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath
  return `${normalizedBase}${normalizedPath}`
}
