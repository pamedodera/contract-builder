import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AISuggestionsBarProps {
  onDragDrop: () => void
}

export function AISuggestionsBar({ onDragDrop }: AISuggestionsBarProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(true)
  }

  function handleDragLeave() {
    setIsDragOver(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    onDragDrop()
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'rounded-md border border-dashed border-border px-3 py-2.5 transition-colors',
        isDragOver && 'border-primary bg-primary/5 ring-1 ring-primary/20'
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground leading-tight">AI suggestions</p>
            <p className="truncate text-xs text-muted-foreground leading-tight mt-0.5">
              Drop docs to extract clauses & definitions
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
