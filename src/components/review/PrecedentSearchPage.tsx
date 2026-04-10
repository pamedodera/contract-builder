import { useState } from 'react'
import { ArrowLeft, BookOpen, Loader2, Check, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChatInput } from '@/components/sidebar/ChatInput'
import { cn } from '@/lib/utils'
import {
  mockClauses,
  mockDefinitions,
  precedentAlternatives,
  undefinedTermsByAlternative,
  type DocItem,
  type PrecedentAlternative,
  type UndefinedTerm,
} from '@/data/mockHomeData'

interface PrecedentSearchPageProps {
  onBack: () => void
}

type ItemType = 'clause' | 'definition'
type Stage = 'select' | 'loading' | 'results'

export function PrecedentSearchPage({ onBack }: PrecedentSearchPageProps) {
  const [itemType, setItemType] = useState<ItemType>('clause')
  const [selectedItems, setSelectedItems] = useState<DocItem[]>([])
  const [stage, setStage] = useState<Stage>('select')
  const [usedIds, setUsedIds] = useState<Set<string>>(new Set())

  const items = itemType === 'clause' ? mockClauses : mockDefinitions
  const totalAlternatives = selectedItems.reduce(
    (sum, item) => sum + (precedentAlternatives[item.id]?.length ?? 0), 0
  )

  function toggleItem(item: DocItem) {
    setSelectedItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    )
  }

  function handleSearch() {
    if (selectedItems.length === 0) return
    setStage('loading')
    setTimeout(() => setStage('results'), 2000)
  }

  function handleTypeChange(type: ItemType) {
    setItemType(type)
    setSelectedItems([])
    setStage('select')
  }

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="shrink-0 border-b border-border px-3 py-2.5 space-y-1.5">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" onClick={onBack} aria-label="Back">
            <ArrowLeft />
          </Button>
          <span className="flex-1 text-sm font-medium text-foreground">Find Similar Precedent</span>
        </div>
        {stage === 'results' && (
          <div className="flex items-center gap-1 pl-7 min-w-0">
            <button
              onClick={() => setStage('select')}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              Select {itemType}s
            </button>
            <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
            <span className="text-xs text-foreground truncate">
              Result: {totalAlternatives} alternative{totalAlternatives !== 1 ? 's' : ''} for {selectedItems.length} {itemType}{selectedItems.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">

        {/* Type toggle */}
        <div className="flex rounded-md border border-border bg-card overflow-hidden">
          {(['clause', 'definition'] as ItemType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={cn(
                'flex-1 py-1.5 text-xs font-medium transition-colors capitalize',
                type === 'definition' && 'border-l border-border',
                itemType === type
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {type === 'clause' ? 'Clauses' : 'Definitions'}
            </button>
          ))}
        </div>

        {/* Select stage */}
        {stage === 'select' && (
          <>
            <p className="text-xs text-muted-foreground px-0.5">
              Select one or more {itemType}s from your document
            </p>
            <div className="rounded-md border border-border bg-card overflow-hidden divide-y divide-border">
              {items.map((item) => {
                const checked = selectedItems.some((i) => i.id === item.id)
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item)}
                    className={cn(
                      'w-full flex items-start gap-3 px-3 py-2.5 text-left transition-colors',
                      checked ? 'bg-accent' : 'hover:bg-accent'
                    )}
                  >
                    <div className={cn(
                      'mt-0.5 h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-colors',
                      checked ? 'bg-foreground border-foreground' : 'border-border bg-card'
                    )}>
                      {checked && <Check className="h-2.5 w-2.5 text-background" strokeWidth={3} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug line-clamp-2">{item.text}</p>
                    </div>
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
              <p className="text-sm font-medium text-foreground">Searching your library…</p>
              <p className="text-xs text-muted-foreground">
                Finding similar precedents for {selectedItems.length} {itemType}{selectedItems.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        {/* Results stage */}
        {stage === 'results' && (
          <div className="space-y-4">
            {selectedItems.map((item) => {
              const alts = precedentAlternatives[item.id] ?? []
              return (
                <div key={item.id} className="space-y-2">
                  <p className="text-xs font-medium text-foreground px-0.5">{item.label}</p>
                  {alts.map((alt) => (
                    <AlternativeCard
                      key={alt.id}
                      alternative={alt}
                      used={usedIds.has(alt.id)}
                      onUse={() => setUsedIds((prev) => new Set(prev).add(alt.id))}
                      onUndo={() => setUsedIds((prev) => { const next = new Set(prev); next.delete(alt.id); return next })}
                    />
                  ))}
                </div>
              )
            })}
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-border px-3 py-3 space-y-2">
        {stage === 'select' && (
          <Button
            className="w-full"
            disabled={selectedItems.length === 0}
            onClick={handleSearch}
          >
            Search library
          </Button>
        )}
        <ChatInput onSend={() => {}} />
      </div>

    </div>
  )
}

function AlternativeCard({
  alternative,
  used,
  onUse,
  onUndo,
}: {
  alternative: PrecedentAlternative
  used: boolean
  onUse: () => void
  onUndo: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [replacing, setReplacing] = useState(false)
  const [undoingReplace, setUndoingReplace] = useState(false)
  const [insertedTerms, setInsertedTerms] = useState<Set<string>>(new Set())
  const [insertingTerm, setInsertingTerm] = useState<string | null>(null)
  const [undoingTerm, setUndoingTerm] = useState<string | null>(null)
  const [insertingAll, setInsertingAll] = useState(false)
  const itemLabel = alternative.id.startsWith('def') ? 'definition' : 'clause'
  const undefinedTerms: UndefinedTerm[] = undefinedTermsByAlternative[alternative.id] ?? []

  function handleReplace() {
    setReplacing(true)
    setTimeout(() => {
      setReplacing(false)
      onUse()
    }, 1800)
  }

  function handleUndoReplace() {
    setUndoingReplace(true)
    setTimeout(() => {
      setUndoingReplace(false)
      setInsertedTerms(new Set())
      onUndo()
    }, 1000)
  }

  function handleInsertAll() {
    setInsertingAll(true)
    setTimeout(() => {
      setInsertingAll(false)
      setInsertedTerms(new Set(undefinedTerms.map((t) => t.term)))
    }, 1800)
  }

  function handleInsertTerm(term: string) {
    setInsertingTerm(term)
    setTimeout(() => {
      setInsertingTerm(null)
      setInsertedTerms((prev) => new Set(prev).add(term))
    }, 1400)
  }

  function handleUndoTerm(term: string) {
    setUndoingTerm(term)
    setTimeout(() => {
      setUndoingTerm(null)
      setInsertedTerms((prev) => { const next = new Set(prev); next.delete(term); return next })
    }, 1000)
  }

  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      {/* Source */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/40">
        <BookOpen className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span className="flex-1 text-xs font-medium text-foreground truncate">{alternative.sourceDoc}</span>
        <span className="text-xs text-muted-foreground shrink-0">Last updated: {alternative.sourceDate}</span>
      </div>

      {/* Alternative text */}
      <div className="px-3 py-2.5 space-y-2">
        <p className={cn('text-xs text-foreground leading-relaxed', !expanded && 'line-clamp-3')}>
          "{alternative.text}"
        </p>
        {alternative.text.length > 120 && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}

        {/* Why it works */}
        <div className="rounded-md bg-muted/50 px-2.5 py-2 space-y-0.5">
          <p className="text-xs font-medium text-foreground">Why this works</p>
          <p className="text-xs text-muted-foreground leading-snug">{alternative.whyItWorks}</p>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-end gap-2 pt-0.5">
          {used ? (
            <>
              <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                {undoingReplace ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                {undoingReplace ? 'Undoing…' : 'Replaced on the document'}
              </span>
              {!undoingReplace && (
                <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-muted-foreground" onClick={handleUndoReplace}>
                  Undo
                </Button>
              )}
            </>
          ) : (
            <Button size="sm" variant="secondary" disabled={replacing} onClick={handleReplace}>
              {replacing
                ? <><Loader2 className="h-3 w-3 mr-1.5 animate-spin" /> Replacing…</>
                : `Replace with this ${itemLabel} on the document`}
            </Button>
          )}
        </div>
      </div>

      {/* Suggested definitions for new terms */}
      {used && undefinedTerms.length > 0 && (
        <div className="border-t border-border bg-muted/30 px-3 py-2.5 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-foreground">
              {undefinedTerms.length} new term{undefinedTerms.length !== 1 ? 's' : ''} — definitions suggested
            </p>
            {undefinedTerms.length > 1 && (
              <Button
                size="sm"
                variant="secondary"
                className="h-6 px-2 text-xs shrink-0"
                disabled={insertingAll || insertedTerms.size === undefinedTerms.length}
                onClick={handleInsertAll}
              >
                {insertingAll
                  ? <><Loader2 className="h-3 w-3 mr-1.5 animate-spin" />Inserting all…</>
                  : insertedTerms.size === undefinedTerms.length
                    ? <><Check className="h-3 w-3 mr-1" />All inserted</>
                    : 'Insert all definitions'
                }
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {undefinedTerms.map((ut) => (
              <UndefinedTermRow
                key={ut.term}
                term={ut}
                inserted={insertedTerms.has(ut.term) || insertingAll}
                inserting={insertingTerm === ut.term}
                undoing={undoingTerm === ut.term}
                onInsert={() => handleInsertTerm(ut.term)}
                onUndo={() => handleUndoTerm(ut.term)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function UndefinedTermRow({
  term,
  inserted,
  inserting,
  undoing,
  onInsert,
  onUndo,
}: {
  term: UndefinedTerm
  inserted: boolean
  inserting: boolean
  undoing: boolean
  onInsert: () => void
  onUndo: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-2 px-2.5 py-2 text-left hover:bg-accent transition-colors"
      >
        <span className="flex-1 text-xs font-medium text-foreground">{term.term}</span>
        {term.source === 'ai' ? (
          <Badge variant="outline" className="shrink-0 h-4 px-1.5 text-[10px] text-purple-600 border-purple-300 bg-purple-50">
            AI
          </Badge>
        ) : (
          <Badge variant="outline" className="shrink-0 h-4 px-1.5 text-[10px] text-muted-foreground border-border">
            Library
          </Badge>
        )}
      </button>
      {expanded && (
        <div className="border-t border-border px-2.5 py-2 space-y-2">
          {term.sourceDoc && (
            <p className="text-[10px] text-muted-foreground">From: {term.sourceDoc}</p>
          )}
          <p className="text-xs text-muted-foreground leading-snug">{term.definition}</p>
          <div className="flex items-center justify-end gap-2">
            {inserted ? (
              <>
                <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                  {undoing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                  {undoing ? 'Undoing…' : 'Definition inserted'}
                </span>
                {!undoing && (
                  <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-muted-foreground" onClick={onUndo}>
                    Undo
                  </Button>
                )}
              </>
            ) : (
              <Button size="sm" variant="secondary" disabled={inserting} onClick={onInsert}>
                {inserting
                  ? <><Loader2 className="h-3 w-3 mr-1.5 animate-spin" /> Inserting…</>
                  : 'Insert definition'
                }
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
