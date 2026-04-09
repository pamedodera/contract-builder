import { cn } from '@/lib/utils'
import type { ItemSource, ItemType } from '@/types/contract'

interface ActiveFilters {
  types: ItemType[]
  sources: ItemSource[]
}

interface FilterPanelProps {
  activeFilters: ActiveFilters
  onChange: (filters: ActiveFilters) => void
}

const typeOptions: { value: ItemType; label: string }[] = [
  { value: 'clause', label: 'Clause' },
  { value: 'definition', label: 'Definition' },
]

const sourceOptions: { value: ItemSource; label: string }[] = [
  { value: 'personal', label: 'Personal' },
  { value: 'company', label: 'Company' },
  { value: 'ai', label: 'AI' },
]

function toggle<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
}

function Chip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
        active
          ? 'border-foreground bg-foreground text-background'
          : 'border-border bg-transparent text-muted-foreground hover:border-foreground/40 hover:text-foreground'
      )}
    >
      {label}
    </button>
  )
}

export function FilterPanel({ activeFilters, onChange }: FilterPanelProps) {
  return (
    <div className="space-y-2 pt-1">
      <div className="space-y-1.5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Type</p>
        <div className="flex flex-wrap gap-1.5">
          {typeOptions.map((opt) => (
            <Chip
              key={opt.value}
              label={opt.label}
              active={activeFilters.types.includes(opt.value)}
              onClick={() => onChange({ ...activeFilters, types: toggle(activeFilters.types, opt.value) })}
            />
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Source</p>
        <div className="flex flex-wrap gap-1.5">
          {sourceOptions.map((opt) => (
            <Chip
              key={opt.value}
              label={opt.label}
              active={activeFilters.sources.includes(opt.value)}
              onClick={() => onChange({ ...activeFilters, sources: toggle(activeFilters.sources, opt.value) })}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
