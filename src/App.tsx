import { useState, useCallback } from 'react'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { ReviewSidebar } from '@/components/review/ReviewSidebar'
import { DefinelySidebar } from '@/components/review/DefinelySidebar'
import { ActionSpaceSidebar } from '@/components/action-space/ActionSpaceSidebar'
import { ActionSpaceSidebarB } from '@/components/action-space/ActionSpaceSidebarB'
import { DocumentViewer } from '@/components/document/DocumentViewer'
import { WordShell } from '@/components/word-shell/WordShell'

function App() {
  const [activeFlow] = useState(
    new URLSearchParams(window.location.search).get('flow') ?? 'word-shell'
  )
  const [contextChips, setContextChips] = useState<{ id: string; text: string }[]>([])

  const handleAddContext = useCallback((text: string) => {
    setContextChips((prev) => [...prev, { id: `ctx-${Date.now()}`, text }])
  }, [])

  const handleRemoveContextChip = useCallback((id: string) => {
    setContextChips((prev) => prev.filter((c) => c.id !== id))
  }, [])

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">

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
        {activeFlow === 'action-space-b' && (
          <>
            <main className="flex w-2/3 overflow-hidden">
              <DocumentViewer onTermClick={() => {}} onAskContext={handleAddContext} onEditContext={handleAddContext} />
            </main>
            <ActionSpaceSidebarB contextChips={contextChips} onRemoveContextChip={handleRemoveContextChip} />
          </>
        )}
        {activeFlow === 'word-shell' && (
          <WordShell
            onAskContext={handleAddContext}
            onEditContext={handleAddContext}
            sidebar={
              <ActionSpaceSidebarB contextChips={contextChips} onRemoveContextChip={handleRemoveContextChip} />
            }
          />
        )}
      </div>

    </div>
  )
}

export default App
