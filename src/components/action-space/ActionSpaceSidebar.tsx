import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChatInput } from '@/components/sidebar/ChatInput'
import { ClauseCard } from './ClauseCard'

type Tab = 'vault' | 'draft' | 'proof' | 'cascade' | 'enhance'

const tabs: { id: Tab; label: string }[] = [
  { id: 'vault', label: 'Vault' },
  { id: 'draft', label: 'Draft' },
  { id: 'proof', label: 'Proof' },
  { id: 'cascade', label: 'Cascade' },
  { id: 'enhance', label: 'Enhance' },
]

export function ActionSpaceSidebar() {
  const [activeTab, setActiveTab] = useState<Tab>('enhance')

  return (
    <div className="action-space-theme flex h-full w-1/3 shrink-0 flex-col border-l border-border bg-sidebar">

      {/* ── Tab bar ── */}
      <div className="shrink-0 border-b border-border px-3 py-2 flex items-center gap-1 bg-background">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
        <div className="ml-auto">
          <Button variant="outline" size="icon-sm" aria-label="New chat">
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* ── Heading bar ── */}
      <div className="shrink-0 border-b border-border px-3 py-2 flex items-center bg-background">
        <span className="flex-1 text-sm font-medium text-foreground">Edit Space</span>
        <Button variant="ghost" size="icon-sm" aria-label="Close">
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* ── Tab content ── */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">
        {activeTab === 'enhance' && <ClauseCard />}
        {activeTab !== 'enhance' && (
          <p className="text-sm text-muted-foreground">
            {tabs.find((t) => t.id === activeTab)?.label} — coming soon
          </p>
        )}
      </div>

      {/* ── Sticky footer ── */}
      <div className="shrink-0 border-t border-border px-3 py-3">
        <ChatInput onSend={() => {}} placeholder="Ask Enhance" />
      </div>

    </div>
  )
}
