'use server'

import { getPayloadClient } from '@/lib/payload'
import { getResultLabel } from '@/lib/scoring'

// Shape of a quiz answer from the client
export type AnswerMap = Record<number, number> // questionId → score

// What gets saved and returned for a quiz result
export type BreakdownItem = {
  questionId: number
  questionText: string
  selectedLabel: string
  score: number
}

export type SaveResultInput = {
  answers: AnswerMap
  breakdown: BreakdownItem[]
  totalScore: number
  email?: string
  notes?: string
}

export type SaveResultResponse =
  | { success: true; id: number | string }
  | { success: false; error: string }

/**
 * Saves a completed quiz result to the database.
 * The notes field is automatically encrypted by the QuizResults
 * collection's beforeChange hook before it hits the DB.
 */
export async function saveQuizResult(input: SaveResultInput): Promise<SaveResultResponse> {
  try {
    const { totalScore, breakdown, email, notes } = input
    const resultLabel = getResultLabel(totalScore)

    const payload = await getPayloadClient()

    const created = await payload.create({
      collection: 'quiz-results',
      data: {
        score: totalScore,
        resultLabel,
        breakdown,
        // only include email/notes if they were provided
        ...(email ? { email } : {}),
        ...(notes ? { notes } : {}),
        submittedAt: new Date().toISOString(),
      },
    })

    return { success: true, id: created.id }
  } catch (err) {
    console.error('[saveQuizResult] failed:', err)
    return { success: false, error: 'Failed to save your result. Please try again.' }
  }
}

// Shape of what we return to the frontend
export type QuizResultData = {
  id: number | string
  email?: string | null
  score: number
  resultLabel: string
  notes?: string | null
  breakdown?: BreakdownItem[] | null
  submittedAt?: string | null
}

/**
 * Looks up the most recent quiz result for a given email address.
 * Notes are automatically decrypted by the afterRead hook.
 */
export async function getResultByEmail(email: string): Promise<QuizResultData | null> {
  if (!email || !email.includes('@')) return null

  try {
    const payload = await getPayloadClient()

    const results = await payload.find({
      collection: 'quiz-results',
      where: {
        email: { equals: email },
      },
      sort: '-submittedAt',
      limit: 1,
    })

    if (!results.docs.length) return null

    const doc = results.docs[0]

    return {
      id: doc.id,
      email: doc.email,
      score: doc.score,
      resultLabel: doc.resultLabel,
      notes: doc.notes,
      // breakdown is stored as JSON — cast it back
      breakdown: (doc.breakdown as BreakdownItem[]) ?? null,
      submittedAt: doc.submittedAt ?? null,
    }
  } catch (err) {
    console.error('[getResultByEmail] failed:', err)
    return null
  }
}
