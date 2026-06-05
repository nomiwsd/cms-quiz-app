import React from 'react'
import { getPayloadClient } from '@/lib/payload'
import QuizContainer from '@/app/(frontend)/components/QuizContainer'
import type { Question } from '@/app/(frontend)/components/QuizContainer'
import './styles.css'

// Force static generation — questions are fetched at build time
// In dev mode Next.js re-fetches on each request, so seeded data shows up immediately
export const dynamic = 'force-static'

export const metadata = {
  title: 'What Kind of Cosmic Animal Are You?',
  description:
    'A 10-question personality quiz that reveals your inner cosmic animal. Are you a Mooncat, Solar Fox, Cosmic Bear, or Galactic Dragon?',
}

export default async function HomePage() {
  const payload = await getPayloadClient()

  const { docs } = await payload.find({
    collection: 'questions',
    sort: 'order',
    limit: 10,
  })

  // Map Payload docs to the shape the client component expects
  const questions: Question[] = docs.map((doc) => ({
    id: doc.id,
    text: doc.text,
    order: doc.order ?? 0,
    options: (doc.options ?? []).map((opt: { label: string; score: number }) => ({
      label: opt.label,
      score: opt.score,
    })),
  }))

  return <QuizContainer questions={questions} />
}
