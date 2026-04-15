import { useState } from 'react'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { ReviewSidebar } from '@/components/review/ReviewSidebar'
import { DefinelySidebar } from '@/components/review/DefinelySidebar'
import { ActionSpaceSidebar } from '@/components/action-space/ActionSpaceSidebar'
import { DocumentViewer } from '@/components/document/DocumentViewer'
import { cn } from '@/lib/utils'

const flows = [
  { id: 'definely-brand', label: 'Future Proposals' },
  { id: 'action-space', label: 'Actions Flow' },
]

function App() {
  const [activeFlow, setActiveFlow] = useState('definely-brand')

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">

      {/* ── Top nav ── */}
      <nav className="shrink-0 flex items-center gap-1 border-b border-border bg-background px-4 h-12">
        {flows.map((flow) => (
          <button
            key={flow.id}
            onClick={() => setActiveFlow(flow.id)}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              activeFlow === flow.id
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            {flow.label}
          </button>
        ))}
      </nav>

      {/* ── Flow content ── */}
      <div className="flex flex-1 overflow-hidden">
        {activeFlow === 'contract-builder' && (
          <>
            <main className="flex w-2/3 items-center justify-center bg-muted/30">
              <span className="text-muted-foreground text-sm select-none">
                Imagine an agreement comes here.
              </span>
            </main>
            <Sidebar />
          </>
        )}
        {activeFlow === 'review' && (
          <>
            <main className="flex w-2/3 items-center justify-center bg-muted/30">
              <span className="text-muted-foreground text-sm select-none">
                Imagine a document comes here.
              </span>
            </main>
            <ReviewSidebar />
          </>
        )}
        {activeFlow === 'definely-brand' && (
          <>
            <main className="flex w-2/3 overflow-hidden">
              <DocumentViewer onTermClick={() => {}} />
            </main>
            <DefinelySidebar />
          </>
        )}
        {activeFlow === 'action-space' && (
          <>
            <main className="flex w-2/3 overflow-hidden">
              <DocumentViewer onTermClick={() => {}} />
            </main>
            <ActionSpaceSidebar />
          </>
        )}
      </div>

    </div>
  )
}

export default App
