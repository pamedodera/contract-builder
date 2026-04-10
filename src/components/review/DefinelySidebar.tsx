import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { RefreshCw, Settings, Network, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ReviewSidebar } from './ReviewSidebar'
import { DefinelySidebarHome } from './DefinelySidebarHome'

type Tab = 'home' | 'review' | 'library'
type RefreshState = 'idle' | 'loading' | 'done'

const tabs: { id: Tab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'review', label: 'Review' },
  { id: 'library', label: 'Library' },
]

function formatDateTime(date: Date) {
  return date.toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function DefinelySidebar() {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [refreshState, setRefreshState] = useState<RefreshState>('idle')
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const doneTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleRefresh() {
    if (refreshState === 'loading') return
    if (doneTimerRef.current) clearTimeout(doneTimerRef.current)
    setRefreshState('loading')
    setTimeout(() => {
      setLastUpdated(new Date())
      setRefreshState('done')
      doneTimerRef.current = setTimeout(() => setRefreshState('idle'), 1500)
    }, 1500)
  }

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
          <Button variant="secondary" size="icon-sm" aria-label="Cascading effects">
            <Network className="h-3.5 w-3.5" />
          </Button>
          <div className="relative group/refresh">
            <Button
              variant="secondary"
              size="icon-sm"
              aria-label="Refresh"
              onClick={handleRefresh}
              disabled={refreshState === 'loading'}
            >
              {refreshState === 'loading' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {refreshState === 'done' && <Check className="h-3.5 w-3.5" />}
              {refreshState === 'idle' && <RefreshCw className="h-3.5 w-3.5" />}
            </Button>
            {refreshState !== 'loading' && (
              <div className="pointer-events-none absolute top-full right-0 mt-1.5 hidden group-hover/refresh:block z-50">
                <div className="rounded-md bg-popover border border-border px-2.5 py-1.5 shadow-md whitespace-nowrap">
                  <p className="text-xs text-muted-foreground">
                    {refreshState === 'done' ? 'Rescanned' : `Last updated: ${formatDateTime(lastUpdated)}`}
                  </p>
                </div>
              </div>
            )}
          </div>
          <Button variant="secondary" size="icon-sm" aria-label="Settings">
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
