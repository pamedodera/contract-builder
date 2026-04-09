import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { comparisonAreas } from '@/data/mockReviewData'

interface AuditConfigProps {
  selectedAreas: string[]
  onChange: (areas: string[]) => void
  prompt: string
  onPromptChange: (text: string) => void
}

export function AuditConfig({ selectedAreas, onChange, prompt, onPromptChange }: AuditConfigProps) {
  function toggle(id: string) {
    onChange(
      selectedAreas.includes(id)
        ? selectedAreas.filter((a) => a !== id)
        : [...selectedAreas, id]
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Areas to review</p>
        <div className="flex flex-wrap gap-2">
          {comparisonAreas.map((area) => {
            const selected = selectedAreas.includes(area.id)
            return (
              <button
                key={area.id}
                onClick={() => toggle(area.id)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  selected
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background text-foreground border-border hover:bg-accent'
                )}
              >
                {selected && <Check className="h-3 w-3" />}
                {area.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-medium text-foreground">Or describe what you'd like to review</p>
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="e.g. Check whether the indemnity provisions are balanced…"
          rows={4}
          className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>
    </div>
  )
}
