import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Link2, Plus, ChevronRight, Unlink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChatInput } from '@/components/sidebar/ChatInput'
import { LinkedDocsPage } from './LinkedDocsPage'
import { IssuesPage } from './IssuesPage'
import { type MockDoc, proofFindings, cascadeFindings } from '@/data/mockReviewData'

type View = 'home' | 'linked-docs' | 'proof-issues' | 'cascade-issues'

const actions = [
  'Find similar language from a precedent',
  'Find a precedent to compare & use',
  'Apply the corresponding/consequential changes',
  'Generate gaps list, and integrate gaps',
]

const issueTypes: { id: 'proof-issues' | 'cascade-issues'; label: string; count: number }[] = [
  { id: 'proof-issues', label: 'Proof Issues', count: proofFindings.filter((f) => f.severity !== 'low').length },
  { id: 'cascade-issues', label: 'Cascade Issues', count: cascadeFindings.filter((f) => f.severity !== 'low').length },
]

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%' }),
  center: { x: 0 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%' }),
}

const transition = { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] as const }

export function DefinelySidebarHome() {
  const [view, setView] = useState<View>('home')
  const [direction, setDirection] = useState(0)
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const [linkedDocs, setLinkedDocs] = useState<MockDoc[]>([])

  function navigate(to: View, dir: number) {
    setDirection(dir)
    setView(to)
  }

  function toggleDoc(doc: MockDoc) {
    setLinkedDocs((prev) =>
      prev.some((d) => d.id === doc.id)
        ? prev.filter((d) => d.id !== doc.id)
        : [...prev, doc]
    )
  }

  return (
    <div className="relative flex-1 overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        {view === 'home' && (
          <motion.div
            key="home"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            className="absolute inset-0 flex flex-col"
          >
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
                <div
                  className="rounded-md border border-dashed border-border bg-card overflow-hidden cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => navigate('linked-docs', 1)}
                >
                  {linkedDocs.length === 0 ? (
                    <div className="flex items-center gap-2.5 px-3 py-2.5">
                      <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">Linked documents</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Open a document to get started</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Add"
                        onClick={(e) => { e.stopPropagation(); navigate('linked-docs', 1) }}
                      >
                        <Plus />
                      </Button>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {linkedDocs.map((doc) => (
                        <div key={doc.id} className="flex items-center gap-2.5 px-3 py-2">
                          <Link2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          <span className="flex-1 text-sm text-foreground truncate">{doc.title}</span>
                          <span className="text-xs text-muted-foreground shrink-0 mr-1">{doc.date}</span>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Unlink"
                            className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={(e) => { e.stopPropagation(); toggleDoc(doc) }}
                          >
                            <Unlink className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                      <div className="px-3 py-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                          onClick={(e) => { e.stopPropagation(); navigate('linked-docs', 1) }}
                        >
                          <Plus className="h-3.5 w-3.5 mr-1.5" />
                          Add document
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Issues */}
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground px-0.5">Issues</p>
                <div className="rounded-md border border-border bg-card overflow-hidden divide-y divide-border">
                  {issueTypes.map((issue) => (
                    <button
                      key={issue.id}
                      onClick={() => navigate(issue.id, 1)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-accent transition-colors"
                    >
                      <span className="flex-1 text-sm font-medium text-foreground">{issue.label}</span>
                      <Badge variant="outline" className="shrink-0 text-primary border-primary/30">{issue.count} Substantive</Badge>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </button>
                  ))}
                </div>
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
          </motion.div>
        )}

        {view === 'linked-docs' && (
          <motion.div
            key="linked-docs"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            className="absolute inset-0 flex flex-col"
          >
            <LinkedDocsPage
              selectedDocs={linkedDocs}
              onToggle={toggleDoc}
              onBack={() => navigate('home', -1)}
            />
          </motion.div>
        )}

        {view === 'proof-issues' && (
          <motion.div
            key="proof-issues"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            className="absolute inset-0 flex flex-col"
          >
            <IssuesPage
              title="Proof Issues"
              findings={proofFindings}
              onBack={() => navigate('home', -1)}
            />
          </motion.div>
        )}

        {view === 'cascade-issues' && (
          <motion.div
            key="cascade-issues"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            className="absolute inset-0 flex flex-col"
          >
            <IssuesPage
              title="Cascade Issues"
              findings={cascadeFindings}
              onBack={() => navigate('home', -1)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
