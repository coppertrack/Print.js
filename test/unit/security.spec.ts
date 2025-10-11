import { describe, it, expect, beforeEach, vi } from 'vitest'
import { isValidUrl, isSafeUrlForWindow, isValidCssPath } from '../../src/js/security'

describe('security', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      location: {
        origin: 'http://localhost:3000'
      }
    })
  })

  describe('isValidUrl', () => {
    it('should accept valid http URLs', () => {
      expect(isValidUrl('http://example.com/file.pdf')).toBe(true)
    })

    it('should accept valid https URLs', () => {
      expect(isValidUrl('https://example.com/file.pdf')).toBe(true)
    })

    it('should accept blob URLs', () => {
      expect(isValidUrl('blob:http://localhost/123')).toBe(true)
    })

    it('should accept data:application/pdf URLs', () => {
      expect(isValidUrl('data:application/pdf;base64,JVBERi0xLjQ=')).toBe(true)
    })

    it('should accept relative paths', () => {
      expect(isValidUrl('/path/to/file.pdf')).toBe(true)
      expect(isValidUrl('file.pdf')).toBe(true)
      expect(isValidUrl('../file.pdf')).toBe(true)
    })

    it('should reject javascript: protocol', () => {
      expect(isValidUrl('javascript:alert(1)')).toBe(false)
    })

    it('should reject file: protocol', () => {
      expect(isValidUrl('file:///etc/passwd')).toBe(false)
    })

    it('should reject data: URLs that are not PDF', () => {
      expect(isValidUrl('data:text/html,<script>alert(1)</script>')).toBe(false)
    })

    it('should reject protocol-relative URLs', () => {
      expect(isValidUrl('//evil.com/file.pdf')).toBe(false)
    })

    it('should reject null and undefined', () => {
      expect(isValidUrl(null)).toBe(false)
      expect(isValidUrl(undefined as any)).toBe(false)
    })

    it('should reject empty strings', () => {
      expect(isValidUrl('')).toBe(false)
      expect(isValidUrl('   ')).toBe(false)
    })

    it('should reject non-string values', () => {
      expect(isValidUrl(123 as any)).toBe(false)
      expect(isValidUrl({} as any)).toBe(false)
      expect(isValidUrl([] as any)).toBe(false)
    })

    it('should reject relative paths with dangerous protocols', () => {
      expect(isValidUrl('javascript:alert(1)')).toBe(false)
      expect(isValidUrl('vbscript:msgbox(1)')).toBe(false)
    })

    it('should trim whitespace', () => {
      expect(isValidUrl('  https://example.com/file.pdf  ')).toBe(true)
    })
  })

  describe('isSafeUrlForWindow', () => {
    it('should accept valid http URLs', () => {
      expect(isSafeUrlForWindow('http://example.com/file.pdf')).toBe(true)
    })

    it('should accept valid https URLs', () => {
      expect(isSafeUrlForWindow('https://example.com/file.pdf')).toBe(true)
    })

    it('should accept data:application/pdf URLs', () => {
      expect(isSafeUrlForWindow('data:application/pdf;base64,JVBERi0xLjQ=')).toBe(true)
    })

    it('should reject blob URLs', () => {
      expect(isSafeUrlForWindow('blob:http://localhost/123')).toBe(false)
    })

    it('should accept relative paths (resolved against window.location.origin)', () => {
      expect(isSafeUrlForWindow('/path/to/file.pdf')).toBe(true)
      expect(isSafeUrlForWindow('file.pdf')).toBe(true)
    })

    it('should reject javascript: protocol', () => {
      expect(isSafeUrlForWindow('javascript:alert(1)')).toBe(false)
    })

    it('should reject file: protocol', () => {
      expect(isSafeUrlForWindow('file:///etc/passwd')).toBe(false)
    })

    it('should reject data: URLs that are not PDF', () => {
      expect(isSafeUrlForWindow('data:text/html,<script>alert(1)</script>')).toBe(false)
    })

    it('should reject protocol-relative URLs', () => {
      expect(isSafeUrlForWindow('//evil.com/file.pdf')).toBe(false)
    })

    it('should reject null and undefined', () => {
      expect(isSafeUrlForWindow(null)).toBe(false)
      expect(isSafeUrlForWindow(undefined as any)).toBe(false)
    })

    it('should reject empty strings', () => {
      expect(isSafeUrlForWindow('')).toBe(false)
      expect(isSafeUrlForWindow('   ')).toBe(false)
    })

    it('should reject non-string values', () => {
      expect(isSafeUrlForWindow(123 as any)).toBe(false)
      expect(isSafeUrlForWindow({} as any)).toBe(false)
    })

    it('should trim whitespace', () => {
      expect(isSafeUrlForWindow('  https://example.com/file.pdf  ')).toBe(true)
    })
  })

  describe('isValidCssPath', () => {
    it('should accept valid http URLs', () => {
      expect(isValidCssPath('http://example.com/style.css')).toBe(true)
    })

    it('should accept valid https URLs', () => {
      expect(isValidCssPath('https://example.com/style.css')).toBe(true)
    })

    it('should accept relative paths', () => {
      expect(isValidCssPath('/path/to/style.css')).toBe(true)
      expect(isValidCssPath('style.css')).toBe(true)
      expect(isValidCssPath('../style.css')).toBe(true)
    })

    it('should reject javascript: protocol', () => {
      expect(isValidCssPath('javascript:alert(1)')).toBe(false)
    })

    it('should reject data: protocol', () => {
      expect(isValidCssPath('data:text/css,body{background:red}')).toBe(false)
    })

    it('should reject vbscript: protocol', () => {
      expect(isValidCssPath('vbscript:msgbox(1)')).toBe(false)
    })

    it('should reject file: protocol', () => {
      expect(isValidCssPath('file:///etc/passwd')).toBe(false)
    })

    it('should reject protocol-relative URLs', () => {
      expect(isValidCssPath('//evil.com/style.css')).toBe(false)
    })

    it('should accept valid relative paths even with special characters', () => {
      expect(isValidCssPath('style.css')).toBe(true)
      expect(isValidCssPath('path/to/style.css')).toBe(true)
    })

    it('should reject null and undefined', () => {
      expect(isValidCssPath(null)).toBe(false)
      expect(isValidCssPath(undefined as any)).toBe(false)
    })

    it('should reject empty strings', () => {
      expect(isValidCssPath('')).toBe(false)
      expect(isValidCssPath('   ')).toBe(false)
    })

    it('should reject non-string values', () => {
      expect(isValidCssPath(123 as any)).toBe(false)
      expect(isValidCssPath({} as any)).toBe(false)
    })

    it('should trim whitespace', () => {
      expect(isValidCssPath('  https://example.com/style.css  ')).toBe(true)
    })
  })
})
