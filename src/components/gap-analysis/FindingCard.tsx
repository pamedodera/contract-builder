import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Finding } from '@/data/mockGapData'

interface FindingCardProps {
  finding: Finding
  defaultOpen?: boolean
}

const severityConfig = {
  high: { label: 'High', className: 'text-red-600 border-red-300 bg-red-50' },
  medium: { label: 'Medium', className: 'text-amber-600 border-amber-300 bg-amber-50' },
  low: { label: 'Low', className: 'text-green-600 border-green-300 bg-green-50' },
}

export function FindingCard({ finding, defaultOpen = false }: FindingCardProps) {
  const [open, setOpen] = useState(defaultOpen)
  const config = severityConfig[finding.severity]

  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-2 px-3 py-2.5 text-left hover:bg-accent transition-colors"
      >
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className={cn('shrink-0 h-5 px-1.5 text-xs font-medium', config.className)}>
              {config.label}
            </Badge>
            <span className="truncate text-sm font-medium text-foreground">{finding.areaLabel}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-snug">{finding.summary}</p>
        </div>
        <span className="shrink-0 mt-0.5 text-muted-foreground">
          {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </span>
      </button>
      {open && (
        <div className="border-t border-border px-3 py-2.5">
          <p className="text-sm text-muted-foreground leading-relaxed">{finding.detail}</p>
        </div>
      )}
    </div>
  )
}
