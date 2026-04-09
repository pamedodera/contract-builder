import { Loader2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { comparisonAreas } from '@/data/mockGapData'

interface AreaSelectorProps {
  isLoading: boolean
  selectedAreas: string[]
  onChange: (areas: string[]) => void
}

export function AreaSelector({ isLoading, selectedAreas, onChange }: AreaSelectorProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Identifying relevant sections to review…
      </div>
    )
  }

  function toggle(id: string) {
    onChange(
      selectedAreas.includes(id)
        ? selectedAreas.filter((a) => a !== id)
        : [...selectedAreas, id]
    )
  }

  const allSelected = selectedAreas.length === comparisonAreas.length

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Suggested sections to review</p>
        <button
          onClick={() => onChange(allSelected ? [] : comparisonAreas.map((a) => a.id))}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {allSelected ? 'Clear all' : 'Select all'}
        </button>
      </div>
      <div className="space-y-2">
        {comparisonAreas.map((area) => {
          const selected = selectedAreas.includes(area.id)
          return (
            <button
              key={area.id}
              onClick={() => toggle(area.id)}
              className="w-full rounded-md border border-border bg-card px-3 py-2.5 text-left transition-colors hover:bg-accent"
            >
              <div className="flex items-start gap-2.5">
                {/* Checkbox */}
                <span className={cn(
                  'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
                  selected
                    ? 'bg-foreground border-foreground'
                    : 'border-border bg-background'
                )}>
                  {selected && <Check className="h-2.5 w-2.5 text-background" />}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{area.label}</p>
                  <p className="text-xs mt-0.5 leading-snug text-muted-foreground">{area.reason}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
