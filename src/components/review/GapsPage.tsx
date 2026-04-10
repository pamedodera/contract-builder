import { useState } from 'react'
import { ArrowLeft, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChatInput } from '@/components/sidebar/ChatInput'
import { cn } from '@/lib/utils'
import { gapTypeList, mockGaps, type GapType } from '@/data/mockHomeData'

interface GapsPageProps {
  onBack: () => void
}

type Stage = 'config' | 'loading' | 'results'

const gapTypeBadgeClass: Record<GapType, string> = {
  'Placeholders': 'text-orange-600 border-orange-300 bg-orange-50',
  'Bracketed text': 'text-blue-600 border-blue-300 bg-blue-50',
  'Comments': 'text-purple-600 border-purple-300 bg-purple-50',
  'Underlining': 'text-pink-600 border-pink-300 bg-pink-50',
  'Underscoring': 'text-indigo-600 border-indigo-300 bg-indigo-50',
  'Highlighting': 'text-yellow-700 border-yellow-300 bg-yellow-50',
}

export function GapsPage({ onBack }: GapsPageProps) {
  const [selected, setSelected] = useState<Set<GapType>>(new Set(gapTypeList))
  const [stage, setStage] = useState<Stage>('config')
  const [insertedIds, setInsertedIds] = useState<Set<string>>(new Set())

  const canGenerate = selected.size > 0

  function toggle(type: GapType) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(type)) {
        if (next.size === 1) return prev // keep at least one
        next.delete(type)
      } else {
        next.add(type)
      }
      return next
    })
  }

  function handleGenerate() {
    setStage('loading')
    setTimeout(() => setStage('results'), 2000)
  }

  const visibleGaps = mockGaps.filter((g) => selected.has(g.type))
  const remaining = visibleGaps.filter((g) => !insertedIds.has(g.id)).length

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="shrink-0 border-b border-border px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => { setStage('config'); onBack() }}
            aria-label="Back"
          >
            <ArrowLeft />
          </Button>
          <span className="flex-1 text-sm font-medium text-foreground">
            {stage === 'results' ? 'Gaps List' : 'Generate Gaps List'}
          </span>
          {stage === 'results' && (
            <span className="text-xs text-muted-foreground shrink-0">
              {remaining > 0 ? `${remaining} remaining` : 'All resolved'}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 min-h-0">

        {/* Config stage */}
        {stage === 'config' && (
          <>
            <p className="text-xs text-muted-foreground px-0.5">Select what to look for</p>
            <div className="rounded-md border border-border bg-card overflow-hidden divide-y divide-border">
              {gapTypeList.map((type) => {
                const isSelected = selected.has(type)
                const isLast = selected.size === 1 && isSelected
                return (
                  <button
                    key={type}
                    onClick={() => toggle(type)}
                    disabled={isLast}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors',
                      isLast ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'
                    )}
                  >
                    <div className={cn(
                      'h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-colors',
                      isSelected ? 'bg-foreground border-foreground' : 'border-border bg-card'
                    )}>
                      {isSelected && <Check className="h-2.5 w-2.5 text-background" strokeWidth={3} />}
                    </div>
                    <span className="text-sm text-foreground">{type}</span>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* Loading stage */}
        {stage === 'loading' && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Scanning document…</p>
              <p className="text-xs text-muted-foreground">
                Looking for {Array.from(selected).join(', ').toLowerCase()}
              </p>
            </div>
          </div>
        )}

        {/* Results stage */}
        {stage === 'results' && (
          <>
            {visibleGaps.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <p className="text-sm font-medium text-foreground">No gaps found</p>
                <p className="text-xs text-muted-foreground">Your document looks clean for the selected categories.</p>
              </div>
            ) : (
              visibleGaps.map((gap) => (
                <GapCard
                  key={gap.id}
                  type={gap.type}
                  clauseRef={gap.clauseRef}
                  text={gap.text}
                  suggestedFix={gap.suggestedFix}
                  inserted={insertedIds.has(gap.id)}
                  onInsert={() => setInsertedIds((prev) => new Set(prev).add(gap.id))}
                  onUndo={() => setInsertedIds((prev) => { const next = new Set(prev); next.delete(gap.id); return next })}
                />
              ))
            )}
          </>
        )}

      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-border px-3 py-3 space-y-2">
        {stage === 'config' && (
          <Button className="w-full" disabled={!canGenerate} onClick={handleGenerate}>
            Generate
          </Button>
        )}
        {stage === 'results' && <ChatInput onSend={() => {}} />}
      </div>

    </div>
  )
}

function GapCard({
  type,
  clauseRef,
  text,
  suggestedFix,
  inserted,
  onInsert,
  onUndo,
}: {
  type: GapType
  clauseRef: string
  text: string
  suggestedFix: string
  inserted: boolean
  onInsert: () => void
  onUndo: () => void
}) {
  const [open, setOpen] = useState(false)
  const [inserting, setInserting] = useState(false)
  const [undoing, setUndoing] = useState(false)

  function handleInsert() {
    setInserting(true)
    setTimeout(() => {
      setInserting(false)
      onInsert()
    }, 1200)
  }

  function handleUndo() {
    setUndoing(true)
    setTimeout(() => {
      onUndo()
    }, 1000)
  }

  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start gap-2.5 px-3 py-2.5 text-left hover:bg-accent transition-colors"
      >
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-xs text-muted-foreground">{clauseRef}</p>
          <p className="text-sm font-mono text-foreground leading-snug truncate">{text}</p>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 mt-0.5">
          {inserted ? (
            <Badge variant="outline" className="h-5 px-1.5 text-xs font-medium text-green-600 border-green-300 bg-green-50">
              Fixed
            </Badge>
          ) : (
            <Badge variant="outline" className={cn('h-5 px-1.5 text-xs font-medium', gapTypeBadgeClass[type])}>
              {type}
            </Badge>
          )}
        </div>
      </button>

      {open && (
        <div className="border-t border-border px-3 py-2.5 space-y-2.5">
          <div className="rounded-md bg-muted/50 px-2.5 py-2 space-y-0.5">
            <p className="text-xs font-medium text-foreground">Suggested fix</p>
            <p className="text-xs text-muted-foreground leading-snug">{suggestedFix}</p>
          </div>
          <div className="flex items-center justify-end gap-2">
            {inserted ? (
              <>
                <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                  {undoing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                  {undoing ? 'Undoing…' : 'Fix inserted'}
                </span>
                {!undoing && (
                  <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-muted-foreground" onClick={handleUndo}>
                    Undo
                  </Button>
                )}
              </>
            ) : (
              <Button size="sm" variant="secondary" disabled={inserting} onClick={handleInsert}>
                {inserting ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Insert fix'}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
