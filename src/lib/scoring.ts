// Score ranges from the task spec — 10 questions × max score 3 = max 30
// Each range maps to a cosmic animal personality
export const SCORE_RANGES = [
  { range: [0, 6] as [number, number],   label: '🌙 Mooncat — Mysterious, calm, and observant.' },
  { range: [7, 14] as [number, number],  label: '🦊 Solar Fox — Clever, curious, and adaptable.' },
  { range: [15, 22] as [number, number], label: '🐻 Cosmic Bear — Grounded, strong, and thoughtful.' },
  { range: [23, 30] as [number, number], label: '🐉 Galactic Dragon — Wild, bold, and unstoppable.' },
]

/**
 * Maps a raw score to its cosmic animal result label.
 * Easter egg: exactly 13 returns a special message per the spec.
 */
export function getResultLabel(score: number): string {
  if (score === 13) {
    // Easter egg — exact string specified in the task README
    return 'You lucky fucker! You scored 13 exactly.'
  }

  const match = SCORE_RANGES.find(({ range }) => score >= range[0] && score <= range[1])
  return match?.label ?? 'Unknown result — something cosmic went wrong.'
}
