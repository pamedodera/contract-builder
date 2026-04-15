import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Plus, X, ChevronDown, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChatInput } from '@/components/sidebar/ChatInput'
import { ClauseCardFlat } from './ClauseCardFlat'

type Tab = 'vault' | 'draft' | 'proof' | 'cascade' | 'enhance'
type View = 'main' | 'definitions'

const tabs: { id: Tab; label: string }[] = [
  { id: 'vault', label: 'Vault' },
  { id: 'draft', label: 'Draft' },
  { id: 'proof', label: 'Proof' },
  { id: 'cascade', label: 'Cascade' },
  { id: 'enhance', label: 'Enhance' },
]

const CLAUSE_NAME = 'Letters of Credit – Authorisation'

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

export function ActionSpaceSidebarB() {
  const [activeTab, setActiveTab] = useState<Tab>('enhance')
  const [view, setView] = useState<View>('main')
  const [menuOpen, setMenuOpen] = useState(false)
  const [reasonExpanded, setReasonExpanded] = useState(false)
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(definitions.map((d) => [d.id, true]))
  )

  const allChecked = definitions.every((d) => checked[d.id])
  const checkedCount = definitions.filter((d) => checked[d.id]).length

  function toggleSelectAll() {
    const next = !allChecked
    setChecked(Object.fromEntries(definitions.map((d) => [d.id, next])))
  }

  function toggleCheck(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const insertSummary = checkedCount === 0
    ? '1 clause to insert'
    : `1 clause and ${checkedCount} ${checkedCount === 1 ? 'definition' : 'definitions'} to insert`

  const footer = (
    <div className="border-t border-border px-3 py-2.5 flex items-center gap-3">
      <div className="flex-1 flex flex-col gap-1">
        <p className="text-[14px] font-medium text-foreground leading-[20px]">{insertSummary}</p>
        <p className="text-[14px] text-muted-foreground leading-[20px]">Edit will be inserted as plain text</p>
      </div>
      <div className="flex items-center shrink-0">
        <Button variant="default" size="default" className="rounded-r-none">Insert edit</Button>
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

  return (
    <div className="action-space-theme flex h-full w-1/3 shrink-0 flex-col border-l border-border bg-sidebar">

      {/* ── Tab bar ── */}
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

      {/* ── Heading bar — changes based on view ── */}
      {view === 'main' ? (
        <div className="shrink-0 border-b border-border px-3 py-2 flex items-center bg-background">
          <span className="flex-1 text-sm font-medium text-foreground">Edit Space</span>
          <Button variant="ghost" size="icon-sm" aria-label="Close">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <div className="shrink-0 border-b border-border px-2 py-2 flex items-center gap-1 bg-background">
          <Button variant="ghost" size="icon-sm" aria-label="Back" onClick={() => setView('main')}>
            <ArrowLeft className="h-3.5 w-3.5" />
          </Button>
          <span className="flex-1 text-sm font-medium text-foreground">Definitions</span>
        </div>
      )}

      {/* ── Enhance: main view ── */}
      {activeTab === 'enhance' && view === 'main' && (
        <>
          {/* Clause body — fills available space, scrolls internally */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto min-h-0">
              <ClauseCardFlat />
            </div>
          </div>

          {/* Sticky bottom */}
          <div className="shrink-0 border-t border-border flex flex-col">

            {/* Definitions collapsed card */}
            <div className="px-3 pt-3 pb-2">
              <button
                onClick={() => setView('definitions')}
                className="group w-full text-left rounded border border-border bg-[#d3d9eb] px-3 py-2.5 flex items-start gap-3 hover:bg-[#c8d0e8] transition-colors"
              >
                <div className="flex-1 flex flex-col gap-1">
                  <p className="text-[14px] font-medium leading-[20px] text-muted-foreground">Definitions</p>
                  <p className="text-[14px] leading-[20px]">
                    The following definitions resolve terms introduced by this clause. AI-drafted ones are a first draft — review them on the document after inserting.
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-1 mt-0.5 text-muted-foreground">
                  <span className="text-[13px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">Open</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </button>
            </div>

            {/* Reason for change (collapsible) */}
            <div className="px-3 pt-1 pb-3">
              <div className="rounded border border-border bg-[#d3d9eb] px-3 py-2.5 flex flex-col gap-1">
                <button
                  onClick={() => setReasonExpanded((v) => !v)}
                  className="flex items-center gap-3 text-left w-full"
                >
                  <p className="flex-1 text-[14px] font-medium leading-[20px] text-muted-foreground">Reason for change</p>
                  {reasonExpanded
                    ? <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    : <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  }
                </button>
                {reasonExpanded && (
                  <p className="text-[14px] leading-[20px]">
                    These changes would narrow the Borrower's authorisation without materially departing from market-standard LMA risk allocation, while providing protection against defective or fraudulent claims.
                  </p>
                )}
              </div>
            </div>

            {footer}
          </div>
        </>
      )}

      {/* ── Enhance: definitions view ── */}
      {activeTab === 'enhance' && view === 'definitions' && (
        <>
          <div className="flex-1 overflow-y-auto min-h-0 px-3 pt-3 pb-3 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="flex-1 flex flex-col gap-1">
                <p className="text-[14px] font-semibold leading-[20px] text-muted-foreground">Definitions</p>
                <p className="text-[14px] text-muted-foreground leading-[20px]">
                  The following definitions resolve terms introduced by this clause. AI-drafted ones are a first draft — review them on the document after inserting.
                </p>
              </div>
              <div className="shrink-0">
                <Button variant="secondary" size="xs" onClick={toggleSelectAll}>
                  {allChecked ? 'Deselect all' : 'Select all'}
                </Button>
              </div>
            </div>
            <div className="flex flex-col">
              {definitions.map((def, i) => (
                <div
                  key={def.id}
                  className={cn(
                    'grid grid-cols-4 gap-x-3 py-3',
                    i < definitions.length - 1 && 'border-b border-border'
                  )}
                >
                  <div className="col-span-3 flex items-start gap-2">
                    <Checkbox
                      checked={checked[def.id]}
                      onCheckedChange={() => toggleCheck(def.id)}
                      className="mt-1"
                    />
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="text-[14px] font-medium leading-[20px]">{def.label}</span>
                      <p className="text-[14px] text-muted-foreground leading-[20px]">{def.description}</p>
                    </div>
                  </div>
                  <div className="col-span-1 flex justify-end pt-0.5">
                    <SourceBadge source={def.source} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="shrink-0 border-t border-border flex flex-col">
            {footer}
          </div>
        </>
      )}

      {/* ── Non-enhance tabs ── */}
      {activeTab !== 'enhance' && (
        <div className="flex-1 overflow-y-auto px-3 py-3 min-h-0">
          <p className="text-sm text-muted-foreground">
            {tabs.find((t) => t.id === activeTab)?.label} — coming soon
          </p>
        </div>
      )}

      {/* ── Chat input ── */}
      <div className="shrink-0 border-t border-border px-3 py-3">
        <ChatInput onSend={() => {}} placeholder="Ask Enhance" />
      </div>

    </div>
  )
}
