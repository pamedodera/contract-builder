import { useState, useMemo } from 'react'
import { ArrowLeft, Pencil, FilePlus, ShieldAlert, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { SearchBar } from './SearchBar'
import { FilterPanel } from './FilterPanel'
import { CardList } from './CardList'
import { ChatInput } from './ChatInput'
import { ChatThread, type Message } from './ChatThread'
import { AgreementInput } from './AgreementInput'
import { mockItems } from '@/data/mockItems'
import { suggestionMap, chatResponses, type AgreementType } from '@/data/mockSuggestions'
import type { ContractItem, ItemSource, ItemType } from '@/types/contract'

interface ActiveFilters {
  types: ItemType[]
  sources: ItemSource[]
}

export function Sidebar() {
  const [view, setView] = useState<'library' | 'wip' | 'replace'>('library')
  const [query, setQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({ types: [], sources: [] })
  const [draftIds, setDraftIds] = useState<Set<string>>(new Set())
  const [draftOrder, setDraftOrder] = useState<string[]>([])
  const [items] = useState(mockItems)

  // Replace view state
  const [replaceItem, setReplaceItem] = useState<ContractItem | null>(null)
  const [replaceQuery, setReplaceQuery] = useState('')
  const [replaceFilterOpen, setReplaceFilterOpen] = useState(false)

  // AI state
  const [agreementType, setAgreementType] = useState('')
  const [isAnalysing, setIsAnalysing] = useState(false)
  const [suggestedIds, setSuggestedIds] = useState<string[]>([])
  const [messages, setMessages] = useState<Message[]>([])

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesQuery =
        query.trim() === '' ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.preview.toLowerCase().includes(query.toLowerCase())
      const matchesType =
        activeFilters.types.length === 0 || activeFilters.types.includes(item.type)
      const matchesSource =
        activeFilters.sources.length === 0 || activeFilters.sources.includes(item.source)
      return matchesQuery && matchesType && matchesSource
    })
  }, [items, query, activeFilters])

  const draftItems = useMemo(
    () => draftOrder.map((id) => items.find((i) => i.id === id)!).filter(Boolean),
    [draftOrder, items]
  )

  const replaceAlternatives = useMemo(() => {
    if (!replaceItem) return []
    return items.filter((item) => {
      if (item.id === replaceItem.id) return false
      if (item.type !== replaceItem.type) return false
      const matchesQuery =
        replaceQuery.trim() === '' ||
        item.title.toLowerCase().includes(replaceQuery.toLowerCase()) ||
        item.preview.toLowerCase().includes(replaceQuery.toLowerCase())
      return matchesQuery
    })
  }, [items, replaceItem, replaceQuery])

  // First two alternatives are AI-suggested
  const replaceSuggestedIds = useMemo(
    () => replaceAlternatives.slice(0, 2).map((i) => i.id),
    [replaceAlternatives]
  )

  function toggleDraft(id: string) {
    if (draftIds.has(id)) {
      const next = new Set(draftIds)
      next.delete(id)
      setDraftIds(next)
      setDraftOrder(draftOrder.filter((i) => i !== id))
    } else {
      const next = new Set(draftIds)
      next.add(id)
      setDraftIds(next)
      setDraftOrder([...draftOrder, id])
    }
  }

  function addAllToDraft(ids: string[]) {
    const toAdd = ids.filter((id) => !draftIds.has(id))
    if (toAdd.length === 0) return
    const next = new Set(draftIds)
    toAdd.forEach((id) => next.add(id))
    setDraftIds(next)
    setDraftOrder([...draftOrder, ...toAdd])
  }

  function handleExplain(id: string) {
    const item = items.find((i) => i.id === id)
    if (!item) return
    handleSend(`Can you explain the "${item.title}" ${item.type} in plain English?`)
  }

  function handleReplace(id: string) {
    const item = items.find((i) => i.id === id)
    if (!item) return
    setReplaceItem(item)
    setReplaceQuery('')
    setReplaceFilterOpen(false)
    setView('replace')
  }

  function handleSelectReplacement(newId: string) {
    if (!replaceItem) return
    const newOrder = draftOrder.map((id) => (id === replaceItem.id ? newId : id))
    const next = new Set(draftIds)
    next.delete(replaceItem.id)
    next.add(newId)
    setDraftIds(next)
    setDraftOrder(newOrder)
    setReplaceItem(null)
    setView('wip')
  }

  function deleteDraft(id: string) {
    const next = new Set(draftIds)
    next.delete(id)
    setDraftIds(next)
    setDraftOrder(draftOrder.filter((i) => i !== id))
  }

  function handleAgreementSelect(type: AgreementType | null) {
    if (type === null) {
      setAgreementType('')
      setSuggestedIds([])
      return
    }
    setAgreementType(type)
    setIsAnalysing(true)
    setSuggestedIds([])
    setTimeout(() => {
      setSuggestedIds(suggestionMap[type] ?? [])
      setIsAnalysing(false)
    }, 1500)
  }

  function handleSend(text: string) {
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text }
    setMessages((prev) => [...prev, userMsg])

    setTimeout(() => {
      const respFn =
        chatResponses[(agreementType as AgreementType) ?? 'default'] ?? chatResponses['default']
      const aiText = respFn(draftOrder.length)
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', text: aiText }
      setMessages((prev) => [...prev, aiMsg])
    }, 1200)
  }

  const isWip = view === 'wip'
  const isReplace = view === 'replace'

  return (
    <aside className="flex h-full w-1/3 shrink-0 flex-col bg-sidebar border-l border-border">

      {/* ── Header ── */}
      <div className="shrink-0 space-y-3 border-b border-border px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 min-w-0">
            {(isWip || isReplace) && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 -ml-1"
                onClick={() => setView(isReplace ? 'wip' : 'library')}
                aria-label="Back"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </Button>
            )}
            <div className="min-w-0 space-y-1">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                {isReplace ? replaceItem?.title : isWip ? 'Draft Agreement' : 'Assemble'}
              </h1>
              {!isWip && !isReplace && (
                <p className="text-sm text-muted-foreground leading-snug">
                  Bring in the components of your first draft before moving your work to the document.
                </p>
              )}
              {isReplace && replaceItem && (
                <p className="text-sm text-muted-foreground leading-snug line-clamp-2">
                  {replaceItem.preview}
                </p>
              )}
            </div>
          </div>

          {isWip ? (
            <Button variant="outline" size="icon" className="h-8 w-8 shrink-0 mt-0.5" disabled aria-label="Edit draft">
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          ) : !isReplace ? (
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 mt-0.5"
              disabled={draftIds.size === 0}
              onClick={() => setView('wip')}
            >
              View WIP
            </Button>
          ) : null}
        </div>

        {/* Agreement type selector — library view only */}
        {!isWip && !isReplace && (
          <div className="-mx-4 px-4 py-3 border-t border-b border-border">
            <AgreementInput
              value={agreementType}
              isAnalysing={isAnalysing}
              onChange={handleAgreementSelect}
            />
          </div>
        )}

        {/* Search + filters */}
        <SearchBar
          query={isReplace ? replaceQuery : query}
          onQueryChange={isReplace ? setReplaceQuery : setQuery}
          filterOpen={isReplace ? replaceFilterOpen : filterOpen}
          onFilterToggle={() => isReplace ? setReplaceFilterOpen((v) => !v) : setFilterOpen((v) => !v)}
        />
        {(isReplace ? replaceFilterOpen : filterOpen) && (
          <FilterPanel activeFilters={activeFilters} onChange={setActiveFilters} />
        )}
      </div>

      {/* ── Scrollable card list ── */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {isReplace ? (
          <CardList
            items={replaceAlternatives}
            draftIds={new Set()}
            onToggle={handleSelectReplacement}
            suggestedIds={replaceSuggestedIds}
            onExplain={handleExplain}
          />
        ) : isWip ? (
          <CardList
            items={draftItems}
            draftIds={draftIds}
            onToggle={toggleDraft}
            onDelete={deleteDraft}
            onExplain={handleExplain}
            onReplace={handleReplace}
          />
        ) : (
          <>
            <p className="mb-2 text-sm font-medium text-foreground">{filtered.length} Results</p>
            <CardList
              items={filtered}
              draftIds={draftIds}
              onToggle={toggleDraft}
              suggestedIds={suggestedIds}
              onAddAllSuggested={addAllToDraft}
              onExplain={handleExplain}
            />
          </>
        )}
      </div>

      {/* ── Sticky footer ── */}
      <div className={cn(
        'shrink-0 border-t border-border px-4 py-3 flex flex-col gap-3',
        messages.length > 0 && 'max-h-1/2 overflow-hidden'
      )}>
        {isWip && (
          <div className="flex shrink-0">
            <Button variant="outline" className="relative flex-1 gap-2 rounded-r-none h-auto py-3 justify-center">
              <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
              Find Issues
            </Button>
            <Button variant="outline" className="relative flex-1 gap-2 rounded-l-none -ml-px h-auto py-3 justify-center">
              <FilePlus className="h-3.5 w-3.5 shrink-0" />
              Add to document
            </Button>
          </div>
        )}
        {messages.length > 0 ? (
          <>
            <div className="flex items-center justify-between shrink-0">
              <p className="text-xs font-medium text-muted-foreground">Conversation</p>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                onClick={() => setMessages([])}
                aria-label="Close conversation"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <ChatThread messages={messages} />
            </div>
          </>
        ) : (
          <ChatThread messages={messages} />
        )}
        <ChatInput onSend={handleSend} />
      </div>
    </aside>
  )
}
