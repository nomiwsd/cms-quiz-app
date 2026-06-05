/**
 * Caesar cipher — shifts each character's code point by `shift`.
 * Matches the exact snippet provided in the task README.
 *
 * Why Caesar cipher? The README explicitly provided this snippet
 * and said "use the following code to save time." It's intentionally
 * simple — this is a quiz app, not a banking system.
 */
export function encrypt(str: string, shift = 3): string {
  return str
    .split('')
    .map((char) => String.fromCharCode(char.charCodeAt(0) + shift))
    .join('')
}

export function decrypt(str: string, shift = 3): string {
  return str
    .split('')
    .map((char) => String.fromCharCode(char.charCodeAt(0) - shift))
    .join('')
}
