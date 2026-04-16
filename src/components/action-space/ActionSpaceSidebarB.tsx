import { useState, useEffect, useRef, Fragment } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'
import { Plus, ChevronDown, ChevronUp, ChevronRight, ArrowRight, Check, Loader2, Undo2, FileText, Upload, FileUp, BookmarkPlus, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChatInput, type SavedPrompt } from '@/components/sidebar/ChatInput'
import { ClauseCardFlat } from './ClauseCardFlat'

type Tab = 'vault' | 'draft' | 'proof' | 'cascade' | 'enhance'
type View = 'main' | 'definitions'
type Mode = 'edit' | 'chat'
type ChatPhase = 'idle' | 'confirming' | 'processing'
type StepStatus = 'loading' | 'done' | 'waiting'
type InsertStatus = 'pending' | 'inserting' | 'inserted' | 'undone' | 'cancelled'
type DragState = 'idle' | 'dragging' | 'uploading'
type InsertPhase = 'idle' | 'running' | 'stopped' | 'done'
type InsertItem = {
  id: string
  type: 'clause' | 'definition'
  label: string
  location: string
  status: InsertStatus
}

type InsertBatch = {
  id: string
  items: InsertItem[]
}

const tabs: { id: Tab; label: string }[] = [
  { id: 'vault', label: 'Vault' },
  { id: 'draft', label: 'Draft' },
  { id: 'proof', label: 'Proof' },
  { id: 'cascade', label: 'Cascade' },
  { id: 'enhance', label: 'Enhance' },
]

type Source = { type: 'precedent'; name: string } | { type: 'ai' }

const definitions: { id: string; label: string; description: string; source: Source }[] = [
  {
    id: 'environmental-laws',
    label: 'Environmental Laws',
    description: 'all applicable laws, regulations, and standards relating to pollution, contamination, waste and environmental protection.',
    source: { type: 'precedent', name: 'APLMA Term Loan 2023' },
  },
  {
    id: 'hazardous-substances',
    label: 'Hazardous Substances',
    description: 'any substances regulated as hazardous, toxic, or harmful to the environment or human health.',
    source: { type: 'ai' },
  },
  {
    id: 'remediation',
    label: 'Remediation',
    description: 'actions to investigate, manage, or remove contamination to comply with the law.',
    source: { type: 'precedent', name: 'LMA Real Estate Finance 2022' },
  },
  {
    id: 'force-majeure',
    label: 'Force Majeure',
    description: "events beyond a Party's reasonable control that prevent performance without causing financial hardship.",
    source: { type: 'ai' },
  },
]

const definitionLocations: Record<string, string> = {
  'environmental-laws': "Definitions · after 'Environmental Claim'",
  'hazardous-substances': "Definitions · after 'Guarantor'",
  'remediation': "Definitions · after 'Related Fund'",
  'force-majeure': "Definitions · after 'Finance Documents'",
}

const saasAgreements = [
  'Salesforce Order Form – MSA 2023',
  'HubSpot Enterprise SaaS Agreement 2022',
  'Stripe Merchant Services Agreement 2023',
]

function SourceBadge({ source }: { source: Source }) {
  const base = 'bg-gray-200 border-transparent text-gray-600 font-normal'
  if (source.type === 'precedent') {
    return (
      <Badge
        variant="secondary"
        render={<button type="button" />}
        className={cn(base, 'cursor-pointer hover:bg-gray-300 hover:text-gray-700 transition-colors')}
      >
        {source.name}
      </Badge>
    )
  }
  return <Badge variant="secondary" className={base}>AI Generated</Badge>
}

function TimelineStep({
  status,
  label,
  description,
  showConnector,
}: {
  status: StepStatus
  label: string
  description: string
  showConnector: boolean
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        {status === 'done' && (
          <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-2.5 w-2.5 text-green-600" />
          </div>
        )}
        {status === 'loading' && (
          <Loader2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground animate-spin" />
        )}
        {status === 'waiting' && (
          <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full border border-muted-foreground" />
        )}
        {showConnector && <div className="w-px bg-border flex-1 mt-1" />}
      </div>
      <div className={cn('flex flex-col gap-0.5 min-w-0', showConnector && 'pb-3')}>
        <span className="text-[16px] font-medium leading-[20px] text-foreground">{label}</span>
        <p className="text-[14px] text-muted-foreground leading-[18px]">{description}</p>
      </div>
    </div>
  )
}

function InsertItemCard({
  item,
  onStop,
  onUndo,
}: {
  item: InsertItem
  onStop: () => void
  onUndo: (id: string) => void
}) {
  const typeLabel = item.type === 'clause' ? 'Clause' : 'Definition'
  return (
    <div
      className={cn(
        'w-full rounded-xl border border-border bg-background p-3 flex items-start gap-3',
        (item.status === 'pending' || item.status === 'cancelled') && 'opacity-40'
      )}
    >
      {/* Icon */}
      <div className="mt-0.5 shrink-0">
        {item.status === 'pending' && (
          <div className="h-4 w-4 rounded-full border border-muted-foreground/50" />
        )}
        {item.status === 'inserting' && (
          <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
        )}
        {item.status === 'inserted' && (
          <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-2.5 w-2.5 text-green-600" />
          </div>
        )}
        {item.status === 'undone' && (
          <Undo2 className="h-4 w-4 text-muted-foreground" />
        )}
        {item.status === 'cancelled' && (
          <div className="h-4 w-4 rounded-full border border-muted-foreground/40" />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
        {item.status === 'pending' && (
          <>
            <span className="text-[16px] font-medium text-muted-foreground">{typeLabel} queued</span>
            <span className="text-[14px] text-muted-foreground truncate">"{item.label}"</span>
          </>
        )}
        {item.status === 'inserting' && (
          <>
            <span className="text-[16px] font-medium">Inserting {typeLabel.toLowerCase()}</span>
            <span className="text-[14px] text-muted-foreground">"{item.label}" · {item.location}</span>
          </>
        )}
        {item.status === 'inserted' && (
          <>
            <span className="text-[16px] font-medium">{typeLabel} inserted</span>
            <span className="text-[14px] text-muted-foreground">"{item.label}" · {item.location}</span>
          </>
        )}
        {item.status === 'undone' && (
          <>
            <span className="text-[16px] font-medium text-muted-foreground">{typeLabel} removed</span>
            <span className="text-[14px] text-muted-foreground">"{item.label}"</span>
          </>
        )}
        {item.status === 'cancelled' && (
          <>
            <span className="text-[16px] font-medium text-muted-foreground">{typeLabel} not inserted</span>
            <span className="text-[14px] text-muted-foreground">"{item.label}"</span>
          </>
        )}
      </div>

      {/* Actions */}
      {item.status === 'inserting' && (
        <Button
          variant="ghost"
          size="xs"
          onClick={onStop}
          className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          Stop
        </Button>
      )}
      {item.status === 'inserted' && (
        <Button variant="ghost" size="xs" onClick={() => onUndo(item.id)} className="shrink-0">
          Undo
        </Button>
      )}
    </div>
  )
}

function DefinitionTimelineItem({
  item,
  showConnector,
  onUndo,
}: {
  item: InsertItem
  showConnector: boolean
  onUndo: (id: string) => void
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center shrink-0">
        <div className="mt-0.5">
          {item.status === 'pending' && (
            <div className="h-4 w-4 rounded-full border border-muted-foreground/40" />
          )}
          {item.status === 'inserting' && (
            <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
          )}
          {item.status === 'inserted' && (
            <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-2.5 w-2.5 text-green-600" />
            </div>
          )}
          {(item.status === 'undone' || item.status === 'cancelled') && (
            <div className="h-4 w-4 rounded-full border border-muted-foreground/30" />
          )}
        </div>
        {showConnector && <div className="w-px bg-border flex-1 mt-1" />}
      </div>
      <div className={cn('flex items-start justify-between flex-1 min-w-0', showConnector && 'pb-3')}>
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <span className={cn(
            'text-[16px] font-medium leading-[20px]',
            (item.status === 'pending' || item.status === 'undone' || item.status === 'cancelled') && 'text-muted-foreground'
          )}>
            {item.label}
          </span>
          {(item.status === 'inserting' || item.status === 'inserted') && (
            <span className="text-[14px] text-muted-foreground">{item.location}</span>
          )}
          {item.status === 'undone' && (
            <span className="text-[14px] text-muted-foreground">Removed</span>
          )}
        </div>
        {item.status === 'inserted' && (
          <Button variant="ghost" size="xs" onClick={() => onUndo(item.id)} className="shrink-0 ml-2">
            Undo
          </Button>
        )}
      </div>
    </div>
  )
}

function DefinitionGroupCard({
  items,
  insertPhase,
  onStop,
  onUndo,
  onUndoAll,
}: {
  items: InsertItem[]
  insertPhase: InsertPhase
  onStop: () => void
  onUndo: (id: string) => void
  onUndoAll: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  const isLoading =
    items.some((i) => i.status === 'inserting') ||
    (items.some((i) => i.status === 'pending') && insertPhase === 'running')
  const insertedCount = items.filter((i) => i.status === 'inserted').length
  const anyInserted = insertedCount > 0
  const allSettled = items.every((i) => ['inserted', 'undone', 'cancelled'].includes(i.status))

  return (
    <div className="w-full rounded-xl border border-border bg-background overflow-hidden">
      {/* Header row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors text-left"
      >
        {/* Status icon */}
        <div className="mt-0.5 shrink-0">
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
          ) : anyInserted ? (
            <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-2.5 w-2.5 text-green-600" />
            </div>
          ) : (
            <div className="h-4 w-4 rounded-full border border-muted-foreground/40" />
          )}
        </div>

        {/* Title */}
        <div className="flex-1 flex flex-col gap-0.5 min-w-0">
          <span className="text-[16px] font-medium">
            {!isLoading && allSettled && anyInserted
              ? `${insertedCount} ${insertedCount === 1 ? 'Definition' : 'Definitions'} inserted`
              : `${items.length} Definitions`}
          </span>
          {isLoading && (
            <span className="text-[14px] text-muted-foreground">Inserting definitions…</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {isLoading && (
            <Button
              variant="ghost"
              size="xs"
              onClick={(e) => { e.stopPropagation(); onStop() }}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              Stop
            </Button>
          )}
          {!isLoading && anyInserted && (
            <Button
              variant="ghost"
              size="xs"
              onClick={(e) => { e.stopPropagation(); onUndoAll() }}
            >
              Undo all
            </Button>
          )}
          {expanded
            ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
            : <ChevronDown className="h-4 w-4 text-muted-foreground" />
          }
        </div>
      </button>

      {/* Expanded timeline */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="border-t border-border p-3 flex flex-col">
              {items.map((item, i) => (
                <DefinitionTimelineItem
                  key={item.id}
                  item={item}
                  showConnector={i < items.length - 1}
                  onUndo={onUndo}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ActionSpaceSidebarB() {
  const [activeTab, setActiveTab] = useState<Tab>('enhance')
  const [view, setView] = useState<View>('main')
  const [mode, setMode] = useState<Mode>('chat')
  const [chatPhase, setChatPhase] = useState<ChatPhase>('idle')
  const [agentStep, setAgentStep] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [hasVisitedEditSpace, setHasVisitedEditSpace] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [reasonExpanded, setReasonExpanded] = useState(false)
  const [showRedline, setShowRedline] = useState(true)
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(definitions.map((d) => [d.id, true]))
  )
  const [insertPhase, setInsertPhase] = useState<InsertPhase>('idle')
  const [insertBatches, setInsertBatches] = useState<InsertBatch[]>([])
  const [insertStep, setInsertStep] = useState(-1)
  const insertBatchRef = useRef<InsertBatch | null>(null)
  const chatInputRef = useRef<HTMLTextAreaElement>(null)
  const [showConfirmation, setShowConfirmation] = useState(true)
  const [dragState, setDragState] = useState<DragState>('idle')
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const dragCounterRef = useRef<number>(0)
  const pendingFileRef = useRef<string>('')
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([])

  const allChecked = definitions.every((d) => checked[d.id])
  const checkedCount = definitions.filter((d) => checked[d.id]).length

  // Phase 1: animate steps 1–3 on initial send
  useEffect(() => {
    if (chatPhase === 'confirming') {
      setAgentStep(0)
      const t1 = setTimeout(() => setAgentStep(1), 100)
      const t2 = setTimeout(() => setAgentStep(2), 1000)
      const t3 = setTimeout(() => setAgentStep(3), 2000)
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
    }
  }, [chatPhase])

  // Phase 2: animate steps 4–5 after confirmation, then transition to edit
  useEffect(() => {
    if (chatPhase === 'processing') {
      const t4 = setTimeout(() => setAgentStep(4), 400)
      const t5 = setTimeout(() => setAgentStep(5), 1300)
      const t6 = setTimeout(() => setAgentStep(6), 2200)
      return () => { clearTimeout(t4); clearTimeout(t5); clearTimeout(t6) }
    }
  }, [chatPhase])

  // Transition to edit space once all steps are done
  useEffect(() => {
    if (agentStep === 6) {
      const tFade = setTimeout(() => setIsTransitioning(true), 400)
      const tSwitch = setTimeout(() => {
        setMode('edit')
        setHasVisitedEditSpace(true)
        // Preserve chatPhase and agentStep so the conversation is still visible when navigating back
        requestAnimationFrame(() => requestAnimationFrame(() => setIsTransitioning(false)))
      }, 1000)
      return () => { clearTimeout(tFade); clearTimeout(tSwitch) }
    }
  }, [agentStep])

  // Drive insert item sequence one step at a time
  useEffect(() => {
    if (insertPhase !== 'running' || insertStep < 0) return
    const batch = insertBatchRef.current
    if (!batch) return
    if (insertStep >= batch.items.length) {
      setInsertPhase('done')
      return
    }
    setInsertBatches((prev) =>
      prev.map((b) =>
        b.id === batch.id
          ? { ...b, items: b.items.map((item, i) => (i === insertStep ? { ...item, status: 'inserting' } : item)) }
          : b
      )
    )
    const t = setTimeout(() => {
      setInsertBatches((prev) =>
        prev.map((b) =>
          b.id === batch.id
            ? { ...b, items: b.items.map((item, i) => (i === insertStep ? { ...item, status: 'inserted' } : item)) }
            : b
        )
      )
      setInsertStep((s) => s + 1)
    }, 1200)
    return () => clearTimeout(t)
  }, [insertStep, insertPhase])

  function toggleSelectAll() {
    const next = !allChecked
    setChecked(Object.fromEntries(definitions.map((d) => [d.id, next])))
  }

  function toggleCheck(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function handleYes() {
    setChatPhase('processing')
  }

  function handleInsert() {
    const batchId = `batch-${Date.now()}`
    const items: InsertItem[] = [
      {
        id: `${batchId}-clause`,
        type: 'clause',
        label: 'Letters of Credit – Authorisation',
        location: 'after clause 7.1(a)',
        status: 'pending',
      },
      ...definitions
        .filter((d) => checked[d.id])
        .map((d) => ({
          id: `${batchId}-${d.id}`,
          type: 'definition' as const,
          label: d.label,
          location: definitionLocations[d.id] ?? 'Definitions section',
          status: 'pending' as InsertStatus,
        })),
    ]
    // Cancel any in-progress items from the previous batch
    const prevBatch = insertBatchRef.current
    if (prevBatch && (insertPhase === 'running' || insertPhase === 'stopped')) {
      setInsertBatches((prev) =>
        prev.map((b) =>
          b.id === prevBatch.id
            ? {
                ...b,
                items: b.items.map((item) =>
                  item.status === 'pending' || item.status === 'inserting'
                    ? { ...item, status: 'cancelled' }
                    : item
                ),
              }
            : b
        )
      )
    }
    const newBatch: InsertBatch = { id: batchId, items }
    insertBatchRef.current = newBatch
    setInsertBatches((prev) => [...prev, newBatch])
    setInsertStep(0)
    setInsertPhase('running')
    setMode('chat')
    setView('main')
  }

  function handleStop() {
    setInsertPhase('stopped')
    const batch = insertBatchRef.current
    if (!batch) return
    setInsertBatches((prev) =>
      prev.map((b) =>
        b.id === batch.id
          ? {
              ...b,
              items: b.items.map((item) =>
                item.status === 'pending' || item.status === 'inserting'
                  ? { ...item, status: 'cancelled' }
                  : item
              ),
            }
          : b
      )
    )
  }

  function handleUndo(id: string) {
    setInsertBatches((prev) =>
      prev.map((b) => ({
        ...b,
        items: b.items.map((item) => (item.id === id ? { ...item, status: 'undone' } : item)),
      }))
    )
  }

  function handleUndoAll(batchId: string) {
    setInsertBatches((prev) =>
      prev.map((b) =>
        b.id === batchId
          ? {
              ...b,
              items: b.items.map((item) =>
                item.type === 'definition' && item.status === 'inserted'
                  ? { ...item, status: 'undone' }
                  : item
              ),
            }
          : b
      )
    )
  }

  function handleSavePrompt(text: string) {
    if (savedPrompts.some((p) => p.prompt === text)) return
    const label = text.length > 42 ? text.slice(0, 40) + '…' : text
    setSavedPrompts((prev) => [{ id: `saved-${Date.now()}`, label, prompt: text }, ...prev])
  }

  // Transition to chat after upload completes, then focus the input
  useEffect(() => {
    if (dragState !== 'uploading') return
    const t = setTimeout(() => {
      if (pendingFileRef.current) {
        setUploadedFiles((prev) => [...prev, pendingFileRef.current])
        pendingFileRef.current = ''
      }
      setMode('chat')
      setView('main')
      setDragState('idle')
      setTimeout(() => chatInputRef.current?.focus(), 50)
    }, 2400)
    return () => clearTimeout(t)
  }, [dragState])

  // Reset counter whenever drag state returns to idle
  useEffect(() => {
    if (dragState === 'idle') dragCounterRef.current = 0
  }, [dragState])

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault()
    dragCounterRef.current += 1
    if (dragState === 'idle') setDragState('dragging')
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    dragCounterRef.current -= 1
    if (dragCounterRef.current === 0) setDragState('idle')
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    dragCounterRef.current = 0
    const file = e.dataTransfer.files[0]
    pendingFileRef.current = file?.name ?? 'document'
    setDragState('uploading')
  }

  const insertSummary = checkedCount === 0
    ? '1 clause to insert'
    : `1 clause and ${checkedCount} ${checkedCount === 1 ? 'definition' : 'definitions'} to insert`

  const footer = (
    <div className="border-t border-border px-3 py-2.5 flex items-center gap-3">
      <div className="flex-1 flex flex-col gap-1">
        <p className="text-[16px] font-medium text-foreground leading-[20px]">{insertSummary}</p>
        <p className="text-[16px] text-muted-foreground leading-[20px]">Edit will be inserted as plain text</p>
      </div>
      <div className="flex items-center shrink-0">
        <Button variant="default" size="default" className="rounded-r-none" onClick={handleInsert}>Insert edit</Button>
        <Popover open={menuOpen} onOpenChange={setMenuOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="default"
              size="default"
              className="rounded-l-none border-l border-primary-foreground/20 px-2"
              aria-label="More insert options"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-52 p-1">
            <Button variant="ghost" size="default" className="w-full justify-start">
              Insert with comments
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )

  const chatCrumb = (
    <button
      onClick={() => { setMode('chat'); setView('main') }}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
    >
      Chat
    </button>
  )
  const editSpaceCrumb = (
    <button
      onClick={() => setView('main')}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
    >
      Edit Space
    </button>
  )
  const sep = <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />

  // Step statuses derived from agentStep
  const step1Status: StepStatus = agentStep === 1 ? 'loading' : 'done'
  const step2Status: StepStatus = agentStep === 2 ? 'loading' : 'done'
  const step3Status: StepStatus = agentStep === 3 ? 'waiting' : 'done'
  const step4Status: StepStatus = agentStep === 4 ? 'loading' : 'done'
  const step5Status: StepStatus = agentStep === 5 ? 'loading' : 'done'

  return (
    <div className="action-space-theme flex h-full w-1/3 shrink-0 flex-col border-l border-border bg-sidebar">

      {/* ── Tab bar — always visible ── */}
      <div className="shrink-0 border-b border-border px-3 py-2 flex items-center gap-1 bg-background">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
        <div className="ml-auto">
          <Button variant="outline" size="icon-sm" aria-label="New chat">
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* ── Everything below the tab bar fades during transition ── */}
      <div
        className={cn('relative flex-1 flex flex-col min-h-0 transition-opacity duration-500', isTransitioning && 'opacity-0')}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >

        {/* ── Drag-and-drop overlay ── */}
        {/* Uploading while in chat mode uses the inline card below instead of the full overlay */}
        <AnimatePresence>
          {(dragState === 'dragging' || (dragState === 'uploading' && mode !== 'chat')) && (
            <motion.div
              key="drag-overlay"
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-sidebar/90 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AnimatePresence mode="wait">
                {dragState === 'dragging' && (
                  <motion.div
                    key="drop-zone"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="mx-6 w-full max-w-[260px] rounded-xl border-2 border-dashed border-primary/40 bg-background/60 px-6 py-10 flex flex-col items-center gap-3 text-center pointer-events-none"
                  >
                    <Upload className="h-8 w-8 text-primary/60" />
                    <p className="text-sm font-medium text-foreground">Drop document here</p>
                  </motion.div>
                )}
                {dragState === 'uploading' && (
                  <motion.div
                    key="uploading"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mx-6 w-full max-w-[260px] flex flex-col gap-3 pointer-events-none"
                  >
                    <div className="flex items-center gap-2">
                      <FileUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground truncate">Adding your document...</p>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2, ease: 'easeInOut' }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Heading bar ── */}
        {mode === 'chat' ? (
          <div className="shrink-0 border-b border-border px-3 py-2 flex items-center bg-background">
            <span className="flex-1 text-sm font-medium text-foreground">Chat</span>
          </div>
        ) : view === 'main' ? (
          <div className="shrink-0 border-b border-border px-3 py-2 flex items-center gap-2 bg-background">
            <div className="flex items-center gap-1 flex-1 min-w-0">
              {chatCrumb}
              {sep}
              <span className="text-sm font-medium text-foreground">Edit Space</span>
            </div>
            <Button variant="secondary" size="xs" onClick={() => setShowRedline((v) => !v)} className="shrink-0">
              {showRedline ? 'Hide redline' : 'Show redline'}
            </Button>
          </div>
        ) : (
          <div className="shrink-0 border-b border-border px-3 py-2 flex items-center gap-1 bg-background">
            {chatCrumb}
            {sep}
            {editSpaceCrumb}
            {sep}
            <span className="text-sm font-medium text-foreground">Definitions</span>
          </div>
        )}

        {/* ── Chat mode ── */}
        {mode === 'chat' && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto min-h-0">
              {/* Working on Edit Space — sticky at top of scroll area, content scrolls under */}
              {agentStep >= 6 && hasVisitedEditSpace && (
                <div className="sticky top-0 z-10 px-3 pb-2">
                  <button
                    onClick={() => setMode('edit')}
                    className="w-full flex items-center justify-between rounded-b-[14px] border border-input bg-background px-3 py-[9px] hover:bg-accent transition-colors group -mt-px shadow-md"
                  >
                    <span className="text-sm font-medium text-foreground">Working on the Edit Space</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              )}

              <div className="px-3 py-3 flex flex-col gap-5">
              {chatPhase !== 'idle' && (
                <>
                  {/* User message */}
                  {(() => {
                    const msg = 'Pull a limitation of liability clause for a SaaS agreement from Vault'
                    const isSaved = savedPrompts.some((p) => p.prompt === msg)
                    return (
                      <div className="flex justify-end group/msg">
                        <div className="flex flex-col items-end gap-1 w-full">
                          <div className="w-full rounded-xl rounded-tr-sm bg-[#B8C1DE] text-foreground px-3 py-2 text-[16px] leading-relaxed">
                            {msg}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSavePrompt(msg)}
                            className="opacity-0 group-hover/msg:opacity-100 transition-opacity flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                            aria-label="Save as prompt"
                          >
                            {isSaved
                              ? <Bookmark className="h-3 w-3 fill-current" />
                              : <BookmarkPlus className="h-3 w-3" />
                            }
                            {isSaved ? 'Saved' : 'Save'}
                          </button>
                        </div>
                      </div>
                    )
                  })()}

                  {/* Agent timeline card */}
                  {agentStep >= 1 && (
                    <div className="w-full rounded-xl border border-border bg-background p-3 flex flex-col">
                      <TimelineStep
                        status={step1Status}
                        label="Checking Vault access"
                        description="Verifying you have access to Vault."
                        showConnector={agentStep >= 2}
                      />
                      {agentStep >= 2 && (
                        <TimelineStep
                          status={step2Status}
                          label="Searching for SaaS agreements"
                          description="Looking for SaaS agreements in your personal Vault."
                          showConnector={agentStep >= 3}
                        />
                      )}
                      {agentStep >= 3 && (
                        <TimelineStep
                          status={step3Status}
                          label="Confirmation required"
                          description={agentStep === 3 ? 'Found 3 agreements. See below to confirm.' : 'You confirmed 3 agreements.'}
                          showConnector={agentStep >= 4}
                        />
                      )}
                      {agentStep >= 4 && (
                        <TimelineStep
                          status={step4Status}
                          label="Extracting Limitation of Liability clause"
                          description="Scanning the 3 agreements for relevant clauses."
                          showConnector={agentStep >= 5}
                        />
                      )}
                      {agentStep >= 5 && (
                        <TimelineStep
                          status={step5Status}
                          label="Drafting redline edit"
                          description="Adapting the clause for your working document."
                          showConnector={false}
                        />
                      )}
                    </div>
                  )}

                  {/* Summary card — found clause */}
                  {agentStep >= 6 && hasVisitedEditSpace && (
                    <div className="w-full rounded-xl border border-border bg-background p-3 flex items-start gap-3">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="text-[16px] font-medium">Found Letters of Credit – Authorisation</span>
                    </div>
                  )}

                  {/* Insert action cards — one clause card + one definition group card per batch */}
                  {insertBatches.map((batch, batchIdx) => {
                    const isActive = batchIdx === insertBatches.length - 1
                    const batchPhase = isActive ? insertPhase : 'done'
                    const clauseItems = batch.items.filter((i) => i.type === 'clause')
                    const defItems = batch.items.filter((i) => i.type === 'definition')
                    return (
                      <Fragment key={batch.id}>
                        {clauseItems.map((item) => (
                          <InsertItemCard
                            key={item.id}
                            item={item}
                            onStop={handleStop}
                            onUndo={handleUndo}
                          />
                        ))}
                        {defItems.length > 0 && (
                          <DefinitionGroupCard
                            items={defItems}
                            insertPhase={batchPhase}
                            onStop={handleStop}
                            onUndo={handleUndo}
                            onUndoAll={() => handleUndoAll(batch.id)}
                          />
                        )}
                      </Fragment>
                    )
                  })}
                </>
              )}
              </div>
            </div>

            {/* Sticky bottom */}
            <div className="shrink-0 border-t border-border flex flex-col bg-background">

              {/* Inline upload progress card — shown when uploading while already in chat mode */}
              <AnimatePresence>
                {dragState === 'uploading' && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
                    className="px-3 pt-3"
                  >
                    <div className="rounded-lg border border-border bg-background px-3 py-2.5 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <FileUp className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">Adding document...</p>
                      </div>
                      <div className="h-1 w-full rounded-full bg-border overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-primary"
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 2, ease: 'easeInOut' }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Confirmation card — only during confirming phase, after step 3 */}
              {chatPhase === 'confirming' && agentStep >= 3 && showConfirmation && (
                <div className="px-3 pt-3 pb-2">
                  <div className="rounded border border-border bg-[#d3d9eb] px-3 py-3 flex flex-col gap-3">
                    <p className="text-[16px] leading-[20px]">
                      I found the following SaaS agreements in your personal Vault. Would it be okay to use these to find a Limitation of Liability clause?
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {saasAgreements.map((name) => (
                        <button
                          key={name}
                          className="text-[16px] leading-[20px] text-primary underline underline-offset-2 text-left hover:opacity-80 transition-opacity"
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-col items-start gap-2">
                      <Button variant="default" size="default" onClick={handleYes}>Yes</Button>
                      <Button variant="secondary" size="default" onClick={() => setChatPhase('idle')}>No</Button>
                      <Button variant="ghost" size="default" onClick={() => setTimeout(() => chatInputRef.current?.focus(), 0)}>Type something else</Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="px-3 py-3">
                <ChatInput onSend={() => { setChatPhase('confirming'); setShowConfirmation(true) }} placeholder="Ask Enhance" rows={2} inputRef={chatInputRef} attachedFiles={uploadedFiles} onRemoveFile={(i) => setUploadedFiles((prev) => prev.filter((_, idx) => idx !== i))} savedPrompts={savedPrompts} />
              </div>
            </div>
          </div>
        )}

        {/* ── Enhance: main view ── */}
        {mode === 'edit' && activeTab === 'enhance' && view === 'main' && (
          <>
            <motion.div
              className="flex-1 overflow-hidden flex flex-col min-h-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: 0.05 }}
            >
              <div className="flex-1 overflow-y-auto min-h-0">
                <ClauseCardFlat showRedline={showRedline} />
              </div>
            </motion.div>

            <div className="shrink-0 border-t border-border flex flex-col bg-background">
              <motion.div
                className="px-3 pt-3 pb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut', delay: 0.15 }}
              >
                <div className="rounded border border-border bg-[#d3d9eb] px-3 py-2.5 flex flex-col gap-1">
                  <button
                    onClick={() => setReasonExpanded((v) => !v)}
                    className="flex items-center gap-3 text-left w-full"
                  >
                    <p className="flex-1 text-[16px] font-medium leading-[20px] text-muted-foreground">Reason for change</p>
                    {reasonExpanded
                      ? <ChevronUp className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      : <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    }
                  </button>
                  <AnimatePresence initial={false}>
                  {reasonExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p className="text-[16px] leading-[20px] pt-1">
                        These changes would narrow the Borrower's authorisation without materially departing from market-standard LMA risk allocation, while providing protection against defective or fraudulent claims.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                </div>
              </motion.div>

              <motion.div
                className="px-3 pt-1 pb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut', delay: 0.25 }}
              >
                <button
                  onClick={() => setView('definitions')}
                  className="group w-full text-left rounded border border-border bg-[#d3d9eb] px-3 py-2.5 flex items-start gap-3 hover:bg-[#c8d0e8] transition-colors"
                >
                  <div className="flex-1 flex flex-col gap-1">
                    <p className="text-[16px] font-medium leading-[20px] text-muted-foreground">{definitions.length} Definitions</p>
                    <p className="text-[16px] leading-[20px]">
                      The following definitions resolve terms introduced by this clause. AI-drafted ones are a first draft — review them on the document after inserting.
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-1 mt-0.5 text-muted-foreground">
                    <span className="text-[16px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">Open</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut', delay: 0.35 }}
              >
                {footer}
              </motion.div>
            </div>
          </>
        )}

        {/* ── Enhance: definitions view ── */}
        {mode === 'edit' && activeTab === 'enhance' && view === 'definitions' && (
          <>
            <div className="flex-1 overflow-y-auto min-h-0 px-3 pt-3 pb-3 flex flex-col gap-3">
              <motion.div
                className="flex items-start gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut', delay: 0.05 }}
              >
                <div className="flex-1 flex flex-col gap-1">
                  <p className="text-[16px] font-semibold leading-[20px] text-muted-foreground">Definitions</p>
                  <p className="text-[16px] text-muted-foreground leading-[20px]">
                    The following definitions resolve terms introduced by this clause. AI-drafted ones are a first draft — review them on the document after inserting.
                  </p>
                </div>
                <div className="shrink-0">
                  <Button variant="secondary" size="xs" onClick={toggleSelectAll}>
                    {allChecked ? 'Deselect all' : 'Select all'}
                  </Button>
                </div>
              </motion.div>
              <div className="flex flex-col">
                {definitions.map((def, i) => (
                  <motion.div
                    key={def.id}
                    className={cn(
                      'grid grid-cols-4 gap-x-3 py-3',
                      i < definitions.length - 1 && 'border-b border-border'
                    )}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 + i * 0.08 }}
                  >
                    <div className="col-span-3 flex items-start gap-2">
                      <Checkbox
                        checked={checked[def.id]}
                        onCheckedChange={() => toggleCheck(def.id)}
                        className="mt-1"
                      />
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-[16px] font-medium leading-[20px]">{def.label}</span>
                        <p className="text-[16px] text-muted-foreground leading-[20px]">{def.description}</p>
                      </div>
                    </div>
                    <div className="col-span-1 flex justify-end pt-0.5">
                      <SourceBadge source={def.source} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div
              className="shrink-0 border-t border-border flex flex-col bg-background"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 + definitions.length * 0.08 }}
            >
              {footer}
            </motion.div>
          </>
        )}

        {/* ── Non-enhance tabs ── */}
        {mode === 'edit' && activeTab !== 'enhance' && (
          <div className="flex-1 overflow-y-auto px-3 py-3 min-h-0">
            <p className="text-sm text-muted-foreground">
              {tabs.find((t) => t.id === activeTab)?.label} — coming soon
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
