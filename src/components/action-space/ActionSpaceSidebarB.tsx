import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'
import { Plus, ChevronDown, ChevronUp, ChevronRight, ArrowRight, Check, Loader2, Undo2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChatInput } from '@/components/sidebar/ChatInput'
import { ClauseCardFlat } from './ClauseCardFlat'

type Tab = 'vault' | 'draft' | 'proof' | 'cascade' | 'enhance'
type View = 'main' | 'definitions'
type Mode = 'edit' | 'chat'
type ChatPhase = 'idle' | 'confirming' | 'processing'
type StepStatus = 'loading' | 'done' | 'waiting'
type InsertStatus = 'pending' | 'inserting' | 'inserted' | 'undone' | 'cancelled'
type InsertPhase = 'idle' | 'running' | 'stopped' | 'done'
type InsertItem = {
  id: string
  type: 'clause' | 'definition'
  label: string
  location: string
  status: InsertStatus
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
  const [insertItems, setInsertItems] = useState<InsertItem[]>([])
  const [insertStep, setInsertStep] = useState(-1)
  const insertItemsRef = useRef<InsertItem[]>([])
  const chatInputRef = useRef<HTMLTextAreaElement>(null)
  const [showConfirmation, setShowConfirmation] = useState(true)

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
    const items = insertItemsRef.current
    if (insertStep >= items.length) {
      setInsertPhase('done')
      return
    }
    setInsertItems((prev) =>
      prev.map((item, i) => (i === insertStep ? { ...item, status: 'inserting' } : item))
    )
    const t = setTimeout(() => {
      setInsertItems((prev) =>
        prev.map((item, i) => (i === insertStep ? { ...item, status: 'inserted' } : item))
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
    const items: InsertItem[] = [
      {
        id: 'clause',
        type: 'clause',
        label: 'Letters of Credit – Authorisation',
        location: 'after clause 7.1(a)',
        status: 'pending',
      },
      ...definitions
        .filter((d) => checked[d.id])
        .map((d) => ({
          id: d.id,
          type: 'definition' as const,
          label: d.label,
          location: definitionLocations[d.id] ?? 'Definitions section',
          status: 'pending' as InsertStatus,
        })),
    ]
    insertItemsRef.current = items
    setInsertItems(items)
    setInsertStep(0)
    setInsertPhase('running')
    setMode('chat')
    setView('main')
  }

  function handleStop() {
    setInsertPhase('stopped')
    setInsertItems((prev) =>
      prev.map((item) =>
        item.status === 'pending' || item.status === 'inserting'
          ? { ...item, status: 'cancelled' }
          : item
      )
    )
  }

  function handleUndo(id: string) {
    setInsertItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'undone' } : item))
    )
  }

  function handleUndoAll() {
    setInsertItems((prev) =>
      prev.map((item) =>
        item.type === 'definition' && item.status === 'inserted'
          ? { ...item, status: 'undone' }
          : item
      )
    )
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
      <div className={cn('flex-1 flex flex-col min-h-0 transition-opacity duration-500', isTransitioning && 'opacity-0')}>

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
          <>
            {/* Working on Edit Space — fixed below Chat header, flush against it */}
            {agentStep >= 6 && hasVisitedEditSpace && (
              <div className="shrink-0 px-3 pb-2">
                <button
                  onClick={() => setMode('edit')}
                  className="w-full flex items-center justify-between rounded-b-[14px] border border-input bg-background px-3 py-[9px] hover:bg-accent transition-colors group -mt-px"
                >
                  <span className="text-sm font-medium text-foreground">Working on the Edit Space</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto min-h-0 px-3 py-3 flex flex-col gap-5">
              {chatPhase !== 'idle' && (
                <>
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="w-full rounded-xl rounded-tr-sm bg-[#B8C1DE] text-foreground px-3 py-2 text-[16px] leading-relaxed">
                      Pull a limitation of liability clause for a SaaS agreement from Vault
                    </div>
                  </div>

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

                  {/* Summary card — clause + definitions introduced */}
                  {agentStep >= 6 && hasVisitedEditSpace && (
                    <>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 py-1">
                        <div className="shrink-0 h-6 w-6 rounded-full bg-[#DEE3F0]" />
                        <p className="text-[16px] text-foreground">The alternative clause I found from the selected documents</p>
                      </div>
                      <div className="w-full rounded-xl border border-border bg-background p-3 flex flex-col gap-2">
                        <p className="text-[16px] font-medium">Letters of Credit – Authorisation</p>
                        <div className="h-px bg-border" />
                        <div>
                          <p className="text-[14px] text-muted-foreground mb-1.5">Definitions introduced</p>
                          <div className="flex flex-col gap-0.5">
                            {definitions.map((d) => (
                              <p key={d.id} className="text-[16px]">{d.label}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    </>
                  )}

                  {/* Insert action cards — clause individual, definitions grouped */}
                  {insertItems.length > 0 && (
                    <>
                      {insertItems
                        .filter((i) => i.type === 'clause')
                        .map((item) => (
                          <InsertItemCard
                            key={item.id}
                            item={item}
                            onStop={handleStop}
                            onUndo={handleUndo}
                          />
                        ))}
                      {insertItems.some((i) => i.type === 'definition') && (
                        <DefinitionGroupCard
                          items={insertItems.filter((i) => i.type === 'definition')}
                          insertPhase={insertPhase}
                          onStop={handleStop}
                          onUndo={handleUndo}
                          onUndoAll={handleUndoAll}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </div>

            {/* Sticky bottom */}
            <div className="shrink-0 border-t border-border flex flex-col bg-background">

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
                <ChatInput onSend={() => { setChatPhase('confirming'); setShowConfirmation(true) }} placeholder="Ask Enhance" rows={2} inputRef={chatInputRef} />
              </div>
            </div>
          </>
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
