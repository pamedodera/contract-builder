import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { counterparties, type MockDoc } from '@/data/mockReviewData'

interface CounterpartyDocSelectorProps {
  counterpartyId: string
  selectedDocs: MockDoc[]
  onDocsChange: (docs: MockDoc[]) => void
}

export function CounterpartyDocSelector({ counterpartyId, selectedDocs, onDocsChange }: CounterpartyDocSelectorProps) {
  const counterparty = counterparties.find((cp) => cp.id === counterpartyId)
  if (!counterparty) return null

  const allSelected = selectedDocs.length === counterparty.previousDocs.length

  function toggle(doc: MockDoc) {
    const exists = selectedDocs.some((d) => d.id === doc.id)
    onDocsChange(exists ? selectedDocs.filter((d) => d.id !== doc.id) : [...selectedDocs, doc])
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Previous documents with{' '}
          <span className="font-medium text-foreground">{counterparty.name}</span>
        </p>
        <button
          onClick={() => onDocsChange(allSelected ? [] : [...counterparty.previousDocs])}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {allSelected ? 'Clear all' : 'Select all'}
        </button>
      </div>
      <div className="rounded-md border border-border divide-y divide-border overflow-hidden">
        {counterparty.previousDocs.map((doc) => {
          const selected = selectedDocs.some((d) => d.id === doc.id)
          return (
            <button
              key={doc.id}
              onClick={() => toggle(doc)}
              className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-accent"
            >
              <span className={cn(
                'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
                selected ? 'bg-foreground border-foreground' : 'border-border bg-background'
              )}>
                {selected && <Check className="h-2.5 w-2.5 text-background" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground truncate">{doc.title}</p>
                <p className="text-xs text-muted-foreground">{doc.date}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
