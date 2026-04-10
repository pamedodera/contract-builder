import { useState } from 'react'
import { cn } from '@/lib/utils'
import { RefreshCw, Settings, Network } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ReviewSidebar } from './ReviewSidebar'
import { DefinelySidebarHome } from './DefinelySidebarHome'

type Tab = 'home' | 'review' | 'library'

const tabs: { id: Tab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'review', label: 'Review' },
  { id: 'library', label: 'Library' },
]

export function DefinelySidebar() {
  const [activeTab, setActiveTab] = useState<Tab>('home')

  return (
    <div className="brand-theme flex h-full w-1/3 shrink-0 flex-col border-l border-border bg-sidebar">

      {/* ── Tab bar ── */}
      <div className="shrink-0 border-b border-border px-3 py-2 flex items-center gap-1">
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
        <div className="ml-auto flex items-center gap-0.5">
          <Button variant="ghost" size="icon-sm" aria-label="Cascading effects">
            <Network className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Refresh">
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Settings">
            <Settings className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* ── Tab content ── */}
      {activeTab === 'review' && (
        <div className="flex-1 overflow-hidden [&>aside]:w-full [&>aside]:border-l-0">
          <ReviewSidebar />
        </div>
      )}

      {activeTab === 'home' && <DefinelySidebarHome />}

      {activeTab !== 'review' && activeTab !== 'home' && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            {tabs.find((t) => t.id === activeTab)?.label} — coming soon
          </p>
        </div>
      )}

    </div>
  )
}
