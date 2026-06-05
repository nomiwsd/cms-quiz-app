'use client'

import { useState, useMemo } from 'react'
import QuizView from './QuizView'
import ScoreView from './ScoreView'
import HistoryView from './HistoryView'
import { getResultLabel } from '@/lib/scoring'
import type { BreakdownItem, AnswerMap } from '@/app/actions/quiz'

export type Option = { label: string; score: number }

export type Question = {
  id: number | string
  text: string
  order: number
  options: Option[]
}

type View = 'quiz' | 'score' | 'history'

type ScoreState = {
  totalScore: number
  resultLabel: string
  breakdown: BreakdownItem[]
}

// Seeded shuffle — gives a stable order for the lifetime of the component
// but a fresh random order each time the quiz restarts (new seed on mount)
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr]
  let s = seed
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    const j = Math.abs(s) % (i + 1)
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

type Props = {
  questions: Question[]
}

export default function QuizContainer({ questions }: Props) {
  const [view, setView] = useState<View>('quiz')
  const [scoreState, setScoreState] = useState<ScoreState | null>(null)
  // New seed each mount — options look fresh each time the quiz starts
  const [shuffleSeed] = useState(() => Math.floor(Math.random() * 1_000_000))

  // Shuffle each question's options once per quiz session
  // useMemo ensures this doesn't re-run on every render
  const shuffledQuestions = useMemo(
    () =>
      questions.map((q, qi) => ({
        ...q,
        options: seededShuffle(q.options, shuffleSeed + qi),
      })),
    [questions, shuffleSeed],
  )

  function handleQuizSubmit(answers: AnswerMap) {
    const totalScore = Object.values(answers).reduce((acc, s) => acc + s, 0)
    const resultLabel = getResultLabel(totalScore)

    // Build the per-question breakdown for the score page
    const breakdown: BreakdownItem[] = shuffledQuestions.map((q) => {
      const chosenScore = answers[Number(q.id)] ?? 0
      const chosen = q.options.find((o) => o.score === chosenScore)
      return {
        questionId: Number(q.id),
        questionText: q.text,
        selectedLabel: chosen?.label ?? '—',
        score: chosenScore,
      }
    })

    setScoreState({ totalScore, resultLabel, breakdown })
    setView('score')
  }

  function handleRestart() {
    setScoreState(null)
    setView('quiz')
  }

  return (
    <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-12 md:py-20 md:px-8">
      {view === 'quiz' && (
        <QuizView questions={shuffledQuestions} onSubmit={handleQuizSubmit} />
      )}
      {view === 'score' && scoreState && (
        <ScoreView
          totalScore={scoreState.totalScore}
          resultLabel={scoreState.resultLabel}
          breakdown={scoreState.breakdown}
          onRestart={handleRestart}
          onViewHistory={() => setView('history')}
        />
      )}
      {view === 'history' && (
        <HistoryView onBack={handleRestart} />
      )}
    </div>
  )
}
