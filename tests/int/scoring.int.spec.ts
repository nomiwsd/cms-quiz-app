import { describe, it, expect } from 'vitest'
import { getResultLabel, SCORE_RANGES } from '@/lib/scoring'
import { encrypt, decrypt } from '@/lib/encryption'

// ─── Scoring tests ──────────────────────────────────────────────────────────

describe('getResultLabel()', () => {
  it('returns the easter egg for exactly 13', () => {
    expect(getResultLabel(13)).toBe('You lucky fucker! You scored 13 exactly.')
  })

  it('returns Mooncat for scores 0 to 6', () => {
    for (let s = 0; s <= 6; s++) {
      expect(getResultLabel(s)).toContain('Mooncat')
    }
  })

  it('returns Solar Fox for scores 7 to 14 (except 13)', () => {
    const solarFoxScores = [7, 8, 9, 10, 11, 12, 14]
    for (const s of solarFoxScores) {
      expect(getResultLabel(s)).toContain('Solar Fox')
    }
  })

  it('returns Cosmic Bear for scores 15 to 22', () => {
    for (let s = 15; s <= 22; s++) {
      expect(getResultLabel(s)).toContain('Cosmic Bear')
    }
  })

  it('returns Galactic Dragon for scores 23 to 30', () => {
    for (let s = 23; s <= 30; s++) {
      expect(getResultLabel(s)).toContain('Galactic Dragon')
    }
  })

  it('SCORE_RANGES covers 0 to 30 without gaps', () => {
    for (let s = 0; s <= 30; s++) {
      const label = getResultLabel(s)
      // Should match a range or be the easter egg — never unknown
      expect(label).not.toBe('Unknown result — something cosmic went wrong.')
    }
  })
})

// ─── Encryption tests ────────────────────────────────────────────────────────

describe('encrypt() / decrypt()', () => {
  it('encrypts a string by shifting char codes', () => {
    // shift of 3: 'A' (65) → 'D' (68)
    expect(encrypt('ABC', 3)).toBe('DEF')
  })

  it('decrypts back to the original string', () => {
    const original = 'Hello, cosmos!'
    expect(decrypt(encrypt(original))).toBe(original)
  })

  it('encrypt and decrypt are inverse operations for default shift', () => {
    const samples = ['short', 'a longer note about my quiz result', '42 points!!!']
    for (const s of samples) {
      expect(decrypt(encrypt(s))).toBe(s)
    }
  })

  it('works with a custom shift value', () => {
    expect(encrypt('a', 5)).toBe('f')
    expect(decrypt('f', 5)).toBe('a')
  })

  it('returns empty string for empty input', () => {
    expect(encrypt('')).toBe('')
    expect(decrypt('')).toBe('')
  })
})
