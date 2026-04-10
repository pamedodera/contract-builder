import { useState } from 'react'
import { X, Link2, Plus, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChatInput } from '@/components/sidebar/ChatInput'

const actions = [
  'Find similar language from a precedent',
  'Find a precedent to compare & use',
  'Apply the corresponding/consequential changes',
  'Generate gaps list, and integrate gaps',
]

export function DefinelySidebarHome() {
  const [bannerDismissed, setBannerDismissed] = useState(false)

  return (
    <div className="flex flex-col h-full">

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-3 min-h-0">

        {/* Hint banner */}
        {!bannerDismissed && (
          <div className="flex items-center justify-between gap-2 border-t border-b border-blue-200 bg-blue-50 px-4 py-2 -mx-3">
            <p className="text-xs text-blue-700 leading-snug">Double-click any underlined term to get started.</p>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setBannerDismissed(true)}
              className="shrink-0 -mr-1 text-blue-400 hover:text-blue-600 hover:bg-blue-100"
              aria-label="Dismiss"
            >
              <X />
            </Button>
          </div>
        )}

        {/* Linked Documents */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground px-0.5">Linked Documents</p>
          <div className="rounded-md border border-dashed border-border bg-card flex items-center gap-2.5 px-3 py-2.5">
            <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">Linked documents</p>
              <p className="text-xs text-muted-foreground mt-0.5">Open a document to get started</p>
            </div>
            <Button variant="ghost" size="icon-sm" aria-label="Add">
              <Plus />
            </Button>
          </div>
        </div>

        {/* Issues */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground px-0.5">Issues</p>
          <button className="w-full rounded-md border border-border bg-card flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-accent transition-colors">
            <span className="flex-1 text-sm font-medium text-foreground">Proof Issues</span>
            <Badge variant="outline" className="shrink-0 text-primary border-primary/30">32 Substantive</Badge>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        </div>

        {/* Actions */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground px-0.5">Actions</p>
          <div className="rounded-md border border-border bg-card overflow-hidden divide-y divide-border">
            {actions.map((action) => (
              <button
                key={action}
                className="w-full flex items-start justify-between gap-2 px-3 py-2.5 text-left hover:bg-accent transition-colors"
              >
                <span className="text-sm text-foreground leading-snug">{action}</span>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground mt-0.5" />
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* ── Sticky footer ── */}
      <div className="shrink-0 border-t border-border px-3 py-3">
        <ChatInput onSend={() => {}} />
      </div>

    </div>
  )
}
