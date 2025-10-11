/**
 * Security utilities for validating and sanitizing inputs
 */

const ALLOWED_PROTOCOLS = ['http:', 'https:', 'blob:', 'data:application/pdf']

/**
 * Validates if a URL uses an allowed protocol
 * @param url - The URL to validate
 * @returns true if the URL is safe, false otherwise
 */
export function isValidUrl (url: string | null): boolean {
  if (!url || typeof url !== 'string') {
    return false
  }

  // Trim whitespace
  const trimmedUrl = url.trim()

  // Reject empty strings
  if (trimmedUrl === '') {
    return false
  }

  // Reject protocol-relative URLs (//evil.com)
  if (trimmedUrl.startsWith('//')) {
    return false
  }

  // Try to parse as URL
  try {
    const urlObj = new URL(trimmedUrl, window.location.origin)

    // Check if protocol is in allowed list
    if (ALLOWED_PROTOCOLS.includes(urlObj.protocol)) {
      return true
    }

    // Special case for data URLs - only allow PDF
    if (urlObj.protocol === 'data:') {
      return trimmedUrl.toLowerCase().startsWith('data:application/pdf')
    }

    return false
  } catch (e) {
    // If URL parsing fails, treat as relative path
    // Relative paths are safe if they don't contain protocol
    if (trimmedUrl.includes(':')) {
      // Contains colon but isn't a valid URL - likely dangerous protocol
      return false
    }

    // Relative path without protocol is safe
    return true
  }
}

/**
 * Validates if a URL is safe to open in a new window
 * More restrictive than isValidUrl - only allows http(s) and data:application/pdf
 * @param url - The URL to validate
 * @returns true if safe to open, false otherwise
 */
export function isSafeUrlForWindow (url: string | null): boolean {
  if (!url || typeof url !== 'string') {
    return false
  }

  const trimmedUrl = url.trim()

  if (trimmedUrl === '') {
    return false
  }

  // Reject protocol-relative URLs
  if (trimmedUrl.startsWith('//')) {
    return false
  }

  try {
    const urlObj = new URL(trimmedUrl, window.location.origin)

    // Only allow http, https, and data:application/pdf for window.open
    if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
      return true
    }

    if (urlObj.protocol === 'data:') {
      return trimmedUrl.toLowerCase().startsWith('data:application/pdf')
    }

    return false
  } catch (e) {
    // Invalid URL
    return false
  }
}

/**
 * Validates if a CSS file path is safe
 * @param path - The CSS file path to validate
 * @returns true if safe, false otherwise
 */
export function isValidCssPath (path: string | null): boolean {
  if (!path || typeof path !== 'string') {
    return false
  }

  const trimmedPath = path.trim()

  if (trimmedPath === '') {
    return false
  }

  // Reject protocol-relative URLs
  if (trimmedPath.startsWith('//')) {
    return false
  }

  // Reject javascript: and other dangerous protocols
  if (trimmedPath.match(/^(javascript|data|vbscript|file):/i)) {
    return false
  }

  // Allow http(s) URLs and relative paths
  try {
    const urlObj = new URL(trimmedPath, window.location.origin)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch (e) {
    // Relative path - validate it doesn't contain dangerous patterns
    return !trimmedPath.includes('<') && !trimmedPath.includes('>')
  }
}
