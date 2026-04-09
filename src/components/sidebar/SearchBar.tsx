import { Search, SlidersHorizontal, Upload } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  query: string
  onQueryChange: (v: string) => void
  filterOpen: boolean
  onFilterToggle: () => void
}

export function SearchBar({ query, onQueryChange, filterOpen, onFilterToggle }: SearchBarProps) {
  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search clauses & definitions…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className={cn('pl-8 h-8 text-sm', query && 'pr-16')}
        />
        {query && (
          <button
            onClick={() => onQueryChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>
      <Button
        variant="outline"
        size="icon"
        className={cn('h-8 w-8 shrink-0', filterOpen && 'bg-accent text-accent-foreground')}
        onClick={onFilterToggle}
        aria-label="Toggle filters"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 shrink-0"
        disabled
        aria-label="Upload document"
      >
        <Upload className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
