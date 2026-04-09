import { useState } from 'react'
import { Scale, ListChecks, ArrowLeftRight, ClipboardCheck, History, BookOpen, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { counterparties } from '@/data/mockReviewData'

type Action = 'benchmark' | 'coverage' | 'clause' | 'audit' | 'definitions'

interface ActionSelectorProps {
  onSelect: (action: Action) => void
  onCounterpartySelect: (counterpartyId: string) => void
}

const actions: { id: Action; icon: React.ElementType; title: string; description: string }[] = [
  {
    id: 'benchmark',
    icon: Scale,
    title: 'Benchmark Comparison',
    description: 'Check your document against a standard or template.',
  },
  {
    id: 'clause',
    icon: ArrowLeftRight,
    title: 'Clause Comparison',
    description: 'Compare clauses with another document, clause by clause.',
  },
  {
    id: 'definitions',
    icon: BookOpen,
    title: 'Definitions Comparison',
    description: 'Compare defined terms between your document and another.',
  },
  {
    id: 'coverage',
    icon: ListChecks,
    title: 'Coverage & Completeness',
    description: 'Identify what\'s covered and what might be missing.',
  },
  {
    id: 'audit',
    icon: ClipboardCheck,
    title: 'Contract Audit',
    description: 'Select areas to audit and get a detailed review.',
  },
]

export function ActionSelector({ onSelect, onCounterpartySelect }: ActionSelectorProps) {
  const [counterpartyOpen, setCounterpartyOpen] = useState(true)

  return (
    <div className="space-y-2">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <button
            key={action.id}
            onClick={() => onSelect(action.id)}
            className="w-full rounded-md border border-border bg-card px-3 py-3 text-left transition-colors hover:bg-accent"
          >
            <div className="flex items-start gap-3">
              <Icon className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{action.title}</p>
                <p className="text-xs mt-0.5 leading-snug text-muted-foreground">{action.description}</p>
              </div>
            </div>
          </button>
        )
      })}

      {/* Counterparty card */}
      <div className="rounded-md border border-border bg-card overflow-hidden">
        <button
          onClick={() => setCounterpartyOpen((v) => !v)}
          className="flex w-full items-start gap-3 px-3 py-3 text-left hover:bg-accent transition-colors"
        >
          <History className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">Compare against previous deals</p>
            <p className="text-xs mt-0.5 leading-snug text-muted-foreground">Review terms against what you've agreed with a counterparty before.</p>
          </div>
          <ChevronDown className={cn('h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground transition-transform', counterpartyOpen && 'rotate-180')} />
        </button>
        {counterpartyOpen && (
          <div className="border-t border-border divide-y divide-border">
            {counterparties.map((cp) => (
              <button
                key={cp.id}
                onClick={() => onCounterpartySelect(cp.id)}
                className="flex w-full items-center justify-between px-3 py-2.5 text-left hover:bg-accent transition-colors"
              >
                <span className="text-sm text-foreground">{cp.name}</span>
                <span className="text-xs text-muted-foreground">{cp.previousDocs.length} doc{cp.previousDocs.length !== 1 ? 's' : ''}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
