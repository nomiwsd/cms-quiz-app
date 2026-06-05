'use client'

import { useState } from 'react'
import { Check, Sparkles } from 'lucide-react'
import type { Question } from './QuizContainer'
import type { AnswerMap } from '@/app/actions/quiz'

type Props = {
  questions: Question[]
  onSubmit: (answers: AnswerMap) => void
}

export default function QuizView({ questions, onSubmit }: Props) {
  const [answers, setAnswers] = useState<AnswerMap>({})

  const answeredCount = Object.keys(answers).length
  const allAnswered = questions.length > 0 && answeredCount === questions.length
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0

  function selectOption(questionId: number | string, score: number) {
    setAnswers((prev) => ({ ...prev, [Number(questionId)]: score }))
  }

  return (
    <main className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12 text-center md:text-left">
        <div className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-indigo-400 uppercase border border-indigo-500/20 bg-indigo-500/10 rounded-full">
          Personality Quiz
        </div>
        <h1 className="mb-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-50">
          What Kind of Cosmic Animal Are You?
        </h1>
        <p className="mb-8 text-slate-400">
          Answer all {questions.length} questions to discover your cosmic identity
        </p>

        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 font-medium">
          <span>{answeredCount} of {questions.length} answered</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="flex flex-col gap-6 mb-12">
        {questions.map((q, idx) => {
          const qId = Number(q.id)
          const selected = answers[qId]
          const isAnswered = selected !== undefined

          return (
            <div
              key={q.id}
              className={`p-6 md:p-8 rounded-2xl border transition-colors duration-300 ${
                isAnswered ? 'bg-slate-900 border-indigo-500/30' : 'bg-slate-900/50 border-slate-800'
              }`}
            >
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-sm font-bold text-indigo-400 font-mono tracking-wider shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h2 className="text-lg md:text-xl font-semibold text-slate-100 leading-snug">
                  {q.text}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options.map((opt) => {
                  const isSelected = selected === opt.score
                  return (
                    <button
                      key={opt.label}
                      id={`q${qId}-opt-${opt.score}`}
                      onClick={() => selectOption(q.id, opt.score)}
                      className={`relative flex items-center w-full p-4 text-left border rounded-xl transition-all duration-200 ${
                        isSelected
                          ? 'bg-indigo-500/10 border-indigo-500 text-slate-50 shadow-[0_0_0_1px_rgba(99,102,241,1)]'
                          : 'bg-slate-950/50 border-slate-700 text-slate-300 hover:border-indigo-400/50 hover:bg-slate-800 hover:text-slate-100'
                      }`}
                    >
                      <div
                        className={`flex items-center justify-center w-5 h-5 rounded-full border mr-3 shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600'
                            : 'bg-transparent border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                      </div>
                      <span className="text-sm md:text-base">{opt.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-center pb-12">
        {!allAnswered && answeredCount > 0 && (
          <p className="mb-4 text-sm text-slate-500">
            {questions.length - answeredCount} question{questions.length - answeredCount !== 1 ? 's' : ''} left
          </p>
        )}
        <button
          id="submit-quiz-btn"
          disabled={!allAnswered}
          onClick={() => onSubmit(answers)}
          className={`inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-white transition-all duration-200 rounded-xl ${
            allAnswered
              ? 'bg-indigo-600 hover:bg-indigo-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/25 active:translate-y-0'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          Reveal My Result
        </button>
      </div>
    </main>
  )
}
