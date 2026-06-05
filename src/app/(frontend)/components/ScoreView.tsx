'use client'

import { useState, useTransition } from 'react'
import { Save, Search, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react'
import { saveQuizResult } from '@/app/actions/quiz'
import type { BreakdownItem } from '@/app/actions/quiz'

type Props = {
  totalScore: number
  resultLabel: string
  breakdown: BreakdownItem[]
  onRestart: () => void
  onViewHistory: () => void
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export default function ScoreView({ totalScore, resultLabel, breakdown, onRestart, onViewHistory }: Props) {
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [isPending, startTransition] = useTransition()

  const isEasterEgg = totalScore === 13

  function handleSave() {
    startTransition(async () => {
      setSaveStatus('saving')
      const result = await saveQuizResult({
        answers: {},
        breakdown,
        totalScore,
        email: email.trim() || undefined,
        notes: notes.trim() || undefined,
      })
      if (result.success) {
        setSaveStatus('saved')
      } else {
        setSaveStatus('error')
        setErrorMsg(result.error)
      }
    })
  }

  return (
    <main className="animate-in fade-in zoom-in-95 duration-500">
      {/* Score card */}
      <div
        className={`mb-10 text-center p-8 md:p-12 rounded-3xl border ${
          isEasterEgg
            ? 'bg-gradient-to-br from-amber-500/10 to-slate-900 border-amber-500/30'
            : 'bg-slate-900 border-slate-800'
        }`}
      >
        <p className="mb-6 text-xs font-bold tracking-widest text-slate-500 uppercase">
          Your Result
        </p>
        <div className="flex items-baseline justify-center gap-2 mb-4">
          <span className="text-7xl md:text-8xl font-black text-slate-50 tracking-tighter leading-none">
            {totalScore}
          </span>
          <span className="text-xl md:text-2xl font-medium text-slate-500">
            /30
          </span>
        </div>
        <p className="text-xl md:text-2xl font-bold text-indigo-400">
          {resultLabel}
        </p>
        {isEasterEgg && (
          <p className="mt-4 text-sm font-medium italic text-amber-500">
            You hit the magic number.
          </p>
        )}
      </div>

      {/* Breakdown */}
      <section className="mb-10">
        <h2 className="mb-4 text-xs font-bold tracking-widest text-slate-500 uppercase">
          Score breakdown
        </h2>
        <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-900/50">
          <table className="w-full text-sm text-left">
            <thead className="text-xs tracking-wider text-slate-400 uppercase bg-slate-900/80 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold text-center w-12">#</th>
                <th className="px-4 py-3 font-semibold">Question</th>
                <th className="px-4 py-3 font-semibold">Your answer</th>
                <th className="px-4 py-3 font-semibold text-right w-16">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {breakdown.map((item, idx) => (
                <tr key={item.questionId} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-4 py-3 text-center text-slate-500">{idx + 1}</td>
                  <td className="px-4 py-3 text-slate-300">{item.questionText}</td>
                  <td className="px-4 py-3 font-medium text-slate-100">{item.selectedLabel}</td>
                  <td className="px-4 py-3 font-bold text-right text-emerald-400">+{item.score}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-900/80 border-t border-slate-700">
                <td colSpan={3} className="px-4 py-3 text-xs font-bold tracking-widest text-right text-slate-400 uppercase">
                  Total
                </td>
                <td className="px-4 py-3 text-base font-bold text-right text-slate-50">
                  {totalScore}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* Save section */}
      {saveStatus !== 'saved' ? (
        <section className="mb-10">
          <h2 className="mb-4 text-xs font-bold tracking-widest text-slate-500 uppercase">
            Save your result
          </h2>
          <div className="flex flex-col gap-5 p-6 border rounded-2xl bg-slate-900 border-slate-800">
            <div className="flex flex-col gap-2">
              <label htmlFor="notes-input" className="text-sm font-semibold text-slate-200">
                Notes <span className="font-normal text-slate-500">(optional)</span>
              </label>
              <textarea
                id="notes-input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Write anything about this result..."
                className="w-full px-4 py-3 text-sm transition-all border rounded-xl bg-slate-950 text-slate-100 border-slate-800 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y min-h-[80px]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email-input" className="text-sm font-semibold text-slate-200">
                Email <span className="font-normal text-slate-500">(optional — to look up later)</span>
              </label>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 text-sm transition-all border rounded-xl bg-slate-950 text-slate-100 border-slate-800 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {saveStatus === 'error' && (
              <div className="flex items-start gap-2 p-3 mt-1 text-sm text-red-400 border rounded-lg bg-red-500/10 border-red-500/20">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>{errorMsg}</p>
              </div>
            )}

            <button
              id="save-result-btn"
              onClick={handleSave}
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 mt-2 text-sm font-bold text-white transition-all bg-indigo-600 rounded-xl hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
            >
              <Save className="w-4 h-4" />
              {isPending ? 'Saving...' : 'Save Result'}
            </button>
          </div>
        </section>
      ) : (
        <div className="flex items-center gap-4 p-5 mb-10 border rounded-2xl bg-emerald-500/10 border-emerald-500/20">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0" />
          <div>
            <p className="font-semibold text-slate-100">Saved successfully</p>
            {email && (
              <p className="text-sm text-slate-400 mt-0.5">
                You can retrieve this result anytime with <strong className="text-slate-300">{email}</strong>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse md:flex-row items-stretch md:items-center justify-between gap-4 pt-8 border-t border-slate-800/50">
        <button
          id="view-history-btn"
          onClick={onViewHistory}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-colors text-slate-400 hover:text-slate-100"
        >
          <Search className="w-4 h-4" />
          Look up a past result
        </button>
        <button
          id="restart-quiz-btn"
          onClick={onRestart}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-all border rounded-xl text-slate-300 border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:text-white hover:border-slate-600"
        >
          <RotateCcw className="w-4 h-4" />
          Take it again
        </button>
      </div>
    </main>
  )
}
