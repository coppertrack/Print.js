import { describe, it, expect } from 'vitest'
import Image from '../../src/js/image'

describe('Image', () => {
  it('has a method named print', () => {
    expect(typeof Image.print).toBe('function')
  })
})
