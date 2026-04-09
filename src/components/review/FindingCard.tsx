import { useState } from 'react'
import { ChevronDown, ChevronUp, Loader2, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Finding } from '@/data/mockReviewData'

interface FindingCardProps {
  finding: Finding
  defaultOpen?: boolean
  isInserted?: boolean
  onInserted?: () => void
  selectedAction?: string | null
  onActionSelect?: (actionId: string | null) => void
  showValidation?: boolean
  trafficLight?: boolean
}

const severityConfig = {
  high: { label: 'High', className: 'text-red-600 border-red-300 bg-red-50' },
  medium: { label: 'Medium', className: 'text-amber-600 border-amber-300 bg-amber-50' },
  low: { label: 'Aligned', className: 'text-green-600 border-green-300 bg-green-50' },
}

const trafficLightConfig = {
  high: { label: 'Below Fallback', className: 'text-red-600 border-red-300 bg-red-50' },
  medium: { label: 'Within Fallback', className: 'text-amber-600 border-amber-300 bg-amber-50' },
  low: { label: 'Within Standard', className: 'text-green-600 border-green-300 bg-green-50' },
}

export function FindingCard({ finding, defaultOpen = false, isInserted = false, onInserted, selectedAction: controlledAction, onActionSelect, showValidation = false, trafficLight = false }: FindingCardProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [internalAction, setInternalAction] = useState<string | null>(null)
  const [insertingId, setInsertingId] = useState<string | null>(null)
  const [insertedActionId, setInsertedActionId] = useState<string | null>(null)
  const config = trafficLight ? trafficLightConfig[finding.severity] : severityConfig[finding.severity]
  const hasActions = finding.actions && finding.actions.length > 0

  const selectedAction = controlledAction !== undefined ? controlledAction : internalAction
  function setSelectedAction(id: string | null) {
    if (onActionSelect) onActionSelect(id)
    else setInternalAction(id)
  }

  function handleInsert(actionId: string) {
    setInsertingId(actionId)
    setTimeout(() => {
      setInsertingId(null)
      setInsertedActionId(actionId)
      onInserted?.()
    }, 1500)
  }

  const needsResolution = showValidation && !isInserted && !selectedAction && hasActions

  return (
    <div className={cn('rounded-md border bg-card overflow-hidden', needsResolution ? 'border-amber-400' : 'border-border')}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-2 px-3 py-2.5 text-left hover:bg-accent transition-colors"
      >
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-medium text-foreground">{finding.areaLabel}</p>
          <p className="text-xs text-muted-foreground leading-snug">{finding.summary}</p>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 mt-0.5">
          {isInserted ? (
            <Badge variant="outline" className="h-5 px-1.5 text-xs font-medium text-green-600 border-green-300 bg-green-50">
              Fixed
            </Badge>
          ) : (
            <Badge variant="outline" className={cn('h-5 px-1.5 text-xs font-medium', config.className)}>
              {config.label}
            </Badge>
          )}
          <span className="text-muted-foreground">
            {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </span>
        </div>
      </button>
      {open && (
        <div className="border-t border-border px-3 py-2.5 space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">{finding.detail}</p>
          {hasActions && (
            <div className="space-y-2 border-t border-border pt-3">
              <p className="text-xs font-medium text-foreground">How would you like to resolve this?</p>
              {finding.actions!.map((action) => (
                <div key={action.id} className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    id={`${finding.id}-${action.id}`}
                    name={`action-${finding.id}`}
                    value={action.id}
                    checked={selectedAction === action.id}
                    onChange={() => setSelectedAction(action.id)}
                    onClick={() => { if (selectedAction === action.id) setSelectedAction(null) }}
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-foreground cursor-pointer"
                  />
                  <label
                    htmlFor={`${finding.id}-${action.id}`}
                    className={cn(
                      'flex-1 text-sm leading-snug cursor-pointer transition-colors',
                      selectedAction === action.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {action.label}
                  </label>
                  {selectedAction === action.id && insertedActionId !== action.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0 h-6 px-2 text-xs -mt-0.5"
                      disabled={insertingId === action.id}
                      onClick={(e) => { e.stopPropagation(); handleInsert(action.id) }}
                    >
                      {insertingId === action.id
                        ? <Loader2 className="h-3 w-3 animate-spin" />
                        : 'Insert'
                      }
                    </Button>
                  )}
                  {insertedActionId === action.id && (
                    <span className="shrink-0 flex items-center gap-1 text-xs font-medium text-green-600 -mt-0.5">
                      <Check className="h-3 w-3" />
                      Inserted
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          {needsResolution && open && (
            <p className="text-xs text-amber-600 pt-1">Select a resolution above before inserting.</p>
          )}
        </div>
      )}
      {needsResolution && !open && (
        <div className="border-t border-amber-200 bg-amber-50/60 px-3 py-1.5">
          <p className="text-xs text-amber-600">Select a resolution to insert changes.</p>
        </div>
      )}
    </div>
  )
}
