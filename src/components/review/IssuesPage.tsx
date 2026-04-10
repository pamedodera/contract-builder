import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChatInput } from '@/components/sidebar/ChatInput'
import { FindingCard } from './FindingCard'
import { type Finding } from '@/data/mockReviewData'

interface IssuesPageProps {
  title: string
  findings: Finding[]
  onBack: () => void
}

export function IssuesPage({ title, findings, onBack }: IssuesPageProps) {
  const [insertedIds, setInsertedIds] = useState<Set<string>>(new Set())
  const [selectedActions, setSelectedActions] = useState<Record<string, string | null>>({})

  const visibleFindings = findings.filter((f) => f.severity !== 'low')
  const resolvedCount = visibleFindings.filter((f) => insertedIds.has(f.id)).length
  const remaining = visibleFindings.length - resolvedCount

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="shrink-0 border-b border-border px-3 py-2.5 space-y-0.5">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" onClick={onBack} aria-label="Back">
            <ArrowLeft />
          </Button>
          <span className="flex-1 text-sm font-medium text-foreground">{title}</span>
          <span className="text-xs text-muted-foreground shrink-0">
            {remaining > 0 ? `${remaining} remaining` : 'All resolved'}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 min-h-0">
        {visibleFindings.map((finding, i) => (
          <FindingCard
            key={finding.id}
            finding={finding}
            defaultOpen={i === 0}
            isInserted={insertedIds.has(finding.id)}
            onInserted={() => setInsertedIds((prev) => new Set(prev).add(finding.id))}
            selectedAction={selectedActions[finding.id] ?? null}
            onActionSelect={(id) => setSelectedActions((prev) => ({ ...prev, [finding.id]: id }))}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-border px-3 py-3">
        <ChatInput onSend={() => {}} />
      </div>

    </div>
  )
}
