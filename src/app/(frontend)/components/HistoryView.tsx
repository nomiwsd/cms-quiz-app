'use client'

import { useState, useTransition } from 'react'
import { Search, ArrowLeft, Inbox, MessageSquare } from 'lucide-react'
import { getResultByEmail } from '@/app/actions/quiz'
import type { QuizResultData, BreakdownItem } from '@/app/actions/quiz'

type Props = {
  onBack: () => void
}

type LookupState = 'idle' | 'loading' | 'found' | 'not-found'

export default function HistoryView({ onBack }: Props) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<LookupState>('idle')
  const [result, setResult] = useState<QuizResultData | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleLookup(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    startTransition(async () => {
      setState('loading')
      const found = await getResultByEmail(email.trim())
      if (found) {
        setResult(found)
        setState('found')
      } else {
        setState('not-found')
      }
    })
  }

  return (
    <main className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 text-center md:text-left">
        <h1 className="mb-3 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-50">
          Look Up a Past Result
        </h1>
        <p className="text-slate-400">
          Enter the email address you used when saving your result
        </p>
      </div>

      <form onSubmit={handleLookup} className="flex flex-col gap-4 p-6 md:p-8 mb-10 border bg-slate-900 border-slate-800 rounded-2xl">
        <div className="flex flex-col gap-2">
          <label htmlFor="lookup-email" className="text-sm font-semibold text-slate-200">
            Email address
          </label>
          <input
            id="lookup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-3 text-sm transition-all border rounded-xl bg-slate-950 text-slate-100 border-slate-800 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <button
          id="lookup-btn"
          type="submit"
          disabled={isPending || !email.trim()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 mt-2 text-sm font-bold text-white transition-all bg-indigo-600 rounded-xl hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600"
        >
          <Search className="w-4 h-4" />
          {isPending ? 'Searching...' : 'Find Result'}
        </button>
      </form>

      {state === 'not-found' && (
        <div className="flex flex-col items-center justify-center gap-4 p-12 mb-10 text-center border border-dashed rounded-3xl border-slate-800 text-slate-400 bg-slate-900/30">
          <div className="p-4 rounded-full bg-slate-800/50">
            <Inbox className="w-8 h-8 text-slate-500" />
          </div>
          <div>
            <p className="mb-1 text-base font-semibold text-slate-200">No result found</p>
            <p className="text-sm">
              We couldn&apos;t find a saved result for <strong className="text-slate-300">{email}</strong>.
            </p>
          </div>
        </div>
      )}

      {state === 'found' && result && (
        <div className="mb-10 animate-in fade-in zoom-in-95 duration-500">
          <div className="mb-8 text-center p-8 md:p-12 rounded-3xl border bg-slate-900 border-slate-800">
            <p className="mb-6 text-xs font-bold tracking-widest text-slate-500 uppercase">
              Your saved result
            </p>
            <div className="flex items-baseline justify-center gap-2 mb-4">
              <span className="text-6xl md:text-7xl font-black text-slate-50 tracking-tighter leading-none">
                {result.score}
              </span>
              <span className="text-xl md:text-2xl font-medium text-slate-500">
                /30
              </span>
            </div>
            <p className="text-xl font-bold text-indigo-400">
              {result.resultLabel}
            </p>
            {result.submittedAt && (
              <p className="mt-6 text-xs font-medium tracking-wide text-slate-500 uppercase">
                {new Date(result.submittedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}
          </div>

          {result.notes && (
            <section className="mb-10">
              <h3 className="mb-4 text-xs font-bold tracking-widest text-slate-500 uppercase">
                Your notes
              </h3>
              <div className="flex gap-4 p-6 border rounded-2xl bg-slate-900/50 border-slate-800">
                <MessageSquare className="w-5 h-5 mt-0.5 text-indigo-400 shrink-0" />
                <blockquote className="text-sm italic leading-relaxed text-slate-300">
                  {result.notes}
                </blockquote>
              </div>
            </section>
          )}

          {result.breakdown && result.breakdown.length > 0 && (
            <section className="mb-10">
              <h3 className="mb-4 text-xs font-bold tracking-widest text-slate-500 uppercase">
                Score breakdown
              </h3>
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
                    {(result.breakdown as BreakdownItem[]).map((item, idx) => (
                      <tr key={item.questionId} className="hover:bg-slate-800/20 transition-colors">
                        <td className="px-4 py-3 text-center text-slate-500">{idx + 1}</td>
                        <td className="px-4 py-3 text-slate-300">{item.questionText}</td>
                        <td className="px-4 py-3 font-medium text-slate-100">{item.selectedLabel}</td>
                        <td className="px-4 py-3 font-bold text-right text-emerald-400">+{item.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      )}

      <div className="flex pt-8 border-t border-slate-800/50">
        <button
          id="back-to-quiz-btn"
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-all border rounded-xl text-slate-300 border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:text-white hover:border-slate-600 w-full md:w-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to quiz
        </button>
      </div>
    </main>
  )
}
