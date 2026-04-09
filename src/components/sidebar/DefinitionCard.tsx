import { Check, Plus, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ContractItem } from '@/types/contract'

interface DefinitionCardProps {
  item: ContractItem
  inDraft: boolean
  onToggle: (id: string) => void
  onDelete?: () => void
  onExplain?: () => void
  onReplace?: () => void
  compact?: boolean
  suggested?: boolean
}

export function DefinitionCard({ item, inDraft, onToggle, onDelete, onExplain, onReplace, compact, suggested }: DefinitionCardProps) {
  return (
    <div className={cn(
      'rounded-md border bg-card px-3 py-2.5',
      suggested ? 'border-violet-300 bg-violet-50/50 dark:bg-violet-950/20' : 'border-border',
      inDraft && !onDelete && 'opacity-50'
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="shrink-0 h-5 px-1.5 text-xs font-medium text-sky-600 border-sky-300">
              DEF
            </Badge>
            <span className="truncate text-sm font-medium text-foreground">{item.title}</span>
          </div>
          {!compact && <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{item.preview}</p>}
        </div>

        {onDelete ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 mt-0.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            onClick={onDelete}
            aria-label="Remove from draft"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'h-6 w-6 shrink-0 mt-0.5 transition-colors',
              inDraft
                ? 'text-green-600 hover:text-red-500 hover:bg-red-50'
                : 'text-muted-foreground hover:text-foreground'
            )}
            onClick={() => onToggle(item.id)}
            aria-label={inDraft ? 'Remove from draft' : 'Add to draft'}
          >
            {inDraft ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          </Button>
        )}
      </div>

      <div className="mt-2 flex items-center gap-3">
        {onExplain && (
          <button
            onClick={onExplain}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Explain
          </button>
        )}
        {onReplace && (
          <button
            onClick={onReplace}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Replace
          </button>
        )}
      </div>
    </div>
  )
}
