import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AGREEMENT_TYPES, type AgreementType } from '@/data/mockSuggestions'

interface AgreementInputProps {
  value: string
  isAnalysing: boolean
  onChange: (type: AgreementType | null) => void
}

export function AgreementInput({ value, isAnalysing, onChange }: AgreementInputProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">What type of agreement are you drafting?</p>
      <div className="flex flex-wrap gap-1.5">
        {AGREEMENT_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => onChange(value === type ? null : type)}
            disabled={isAnalysing}
            className={cn(
              'rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors disabled:opacity-50',
              value === type
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-transparent text-muted-foreground hover:border-foreground/40 hover:text-foreground'
            )}
          >
            {type}
          </button>
        ))}
      </div>
      {isAnalysing && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          Analysing agreement type…
        </div>
      )}
    </div>
  )
}
