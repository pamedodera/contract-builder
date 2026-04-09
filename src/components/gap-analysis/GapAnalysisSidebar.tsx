import { useState, useMemo, useEffect } from 'react'
import { ArrowLeft, Download, X, Loader2, Check, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DocSourceSelector } from './DocSourceSelector'
import { AreaSelector } from './AreaSelector'
import { FindingCard } from './FindingCard'
import { ChatThread, type Message } from '@/components/sidebar/ChatThread'
import { ChatInput } from '@/components/sidebar/ChatInput'
import { mockFindings, comparisonAreas, type MockDoc, type Finding } from '@/data/mockGapData'

type View = 'select-doc' | 'select-areas' | 'loading' | 'results'

type StepStatus = 'waiting' | 'loading' | 'done'

interface AgentStep {
  id: string
  label: string
  status: StepStatus
}

function buildSteps(doc: MockDoc, areaIds: string[]): AgentStep[] {
  const areas = comparisonAreas.filter((a) => areaIds.includes(a.id))
  return [
    { id: 'read-draft', label: 'Reading your document', status: 'waiting' },
    { id: 'read-precedent', label: `Reading "${doc.title}"`, status: 'waiting' },
    { id: 'extract-structure', label: 'Extracting clause structure', status: 'waiting' },
    { id: 'identify-terms', label: 'Identifying defined terms', status: 'waiting' },
    ...areas.map((a) => ({ id: a.id, label: `Analysing ${a.label}`, status: 'waiting' as StepStatus })),
    { id: 'cross-ref', label: 'Cross-referencing findings', status: 'waiting' },
    { id: 'report', label: 'Generating report', status: 'waiting' },
  ]
}

export function GapAnalysisSidebar() {
  const [view, setView] = useState<View>('select-doc')
  const [selectedDoc, setSelectedDoc] = useState<MockDoc | null>(null)
  const [isLoadingAreas, setIsLoadingAreas] = useState(false)
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [findings, setFindings] = useState<Finding[]>([])
  const [messages, setMessages] = useState<Message[]>([])

  // Loading view state
  const [steps, setSteps] = useState<AgentStep[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  function handleDocSelect(doc: MockDoc) {
    if (!doc.id) return
    setSelectedDoc(doc)
  }

  function handleCompare() {
    if (!selectedDoc) return
    setSelectedAreas([])
    setIsLoadingAreas(true)
    setView('select-areas')
    setTimeout(() => setIsLoadingAreas(false), 1000)
  }

  function handleRunComparison() {
    if (!selectedDoc) return
    const newSteps = buildSteps(selectedDoc, selectedAreas)
    setSteps(newSteps)
    setCurrentStepIndex(0)
    setView('loading')
  }

  // Animate steps when in loading view
  useEffect(() => {
    if (view !== 'loading' || steps.length === 0) return

    const interval = setInterval(() => {  // 700ms per step so all states are observable
      setCurrentStepIndex((prev) => {
        const next = prev + 1
        if (next >= steps.length) {
          clearInterval(interval)
          // All done — advance to results after a short pause
          setTimeout(() => {
            const resultFindings = mockFindings.filter((f) =>
              selectedAreas.includes(f.areaId)
            )
            // Sort: high first, then medium, then low
            const order = { high: 0, medium: 1, low: 2 }
            resultFindings.sort((a, b) => order[a.severity] - order[b.severity])
            setFindings(resultFindings)
            setView('results')
          }, 400)
          return prev
        }
        return next
      })
    }, 700)

    return () => clearInterval(interval)
  }, [view, steps.length, selectedAreas])

  // Build step display list with current status applied
  const displaySteps = useMemo<AgentStep[]>(() => {
    return steps.map((step, i) => ({
      ...step,
      status:
        i < currentStepIndex ? 'done'
        : i === currentStepIndex ? 'loading'
        : 'waiting',
    }))
  }, [steps, currentStepIndex])

  function handleSend(text: string) {
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: 'I can help you review these findings. Which clause would you like to explore further?',
      }
      setMessages((prev) => [...prev, aiMsg])
    }, 1200)
  }

  const canCompare = selectedDoc !== null && selectedDoc.id !== ''
  const canRun = selectedAreas.length > 0

  return (
    <aside className="flex h-full w-1/3 shrink-0 flex-col bg-sidebar border-l border-border">

      {/* ── Header ── */}
      <div className="shrink-0 border-b border-border px-4 py-4 space-y-3">
        <div className="flex items-start gap-2">
          {(view === 'select-areas' || view === 'results') && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 -ml-1"
              onClick={() => setView(view === 'results' ? 'select-areas' : 'select-doc')}
              aria-label="Back"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
          )}
          <div className="min-w-0 space-y-1">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {view === 'results'
                ? `${findings.length} Finding${findings.length !== 1 ? 's' : ''}`
                : 'Gap Analysis'}
            </h1>
            <p className="text-sm text-muted-foreground leading-snug">
              {view === 'select-doc' && 'Select a document to compare against your current draft.'}
              {view === 'select-areas' && selectedDoc && `Comparing against "${selectedDoc.title}". Select the areas you'd like to review.`}
              {view === 'loading' && 'Running comparison…'}
              {view === 'results' && selectedDoc && `Compared against "${selectedDoc.title}".`}
            </p>
          </div>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {view === 'select-doc' && (
          <DocSourceSelector
            selectedDoc={selectedDoc}
            onDocSelect={handleDocSelect}
          />
        )}

        {view === 'select-areas' && (
          <AreaSelector
            isLoading={isLoadingAreas}
            selectedAreas={selectedAreas}
            onChange={setSelectedAreas}
          />
        )}

        {view === 'loading' && (
          <div className="py-2 space-y-1">
            {displaySteps.map((step) => (
              <div key={step.id} className="flex items-center gap-3 py-2">
                <span className="shrink-0">
                  {step.status === 'done' && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground">
                      <Check className="h-3 w-3 text-background" />
                    </span>
                  )}
                  {step.status === 'loading' && (
                    <Loader2 className="h-5 w-5 animate-spin text-foreground" />
                  )}
                  {step.status === 'waiting' && (
                    <Clock className="h-5 w-5 text-muted-foreground/40" />
                  )}
                </span>
                <span className={cn(
                  'text-sm',
                  step.status === 'done' && 'text-foreground',
                  step.status === 'loading' && 'text-foreground font-medium',
                  step.status === 'waiting' && 'text-muted-foreground/50',
                )}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {view === 'results' && (
          <div className="space-y-2">
            {findings.map((finding, i) => (
              <FindingCard key={finding.id} finding={finding} defaultOpen={i === 0} />
            ))}
          </div>
        )}
      </div>

      {/* ── Sticky footer ── */}
      <div className={cn(
        'shrink-0 border-t border-border px-4 py-3 flex flex-col gap-3',
        messages.length > 0 && 'max-h-1/2 overflow-hidden'
      )}>
        {/* Action buttons */}
        {view === 'select-doc' && (
          <Button
            className="w-full"
            disabled={!canCompare}
            onClick={handleCompare}
          >
            Compare
          </Button>
        )}
        {view === 'select-areas' && (
          <Button
            className="w-full"
            disabled={!canRun}
            onClick={handleRunComparison}
          >
            Run comparison {canRun ? `(${selectedAreas.length})` : ''}
          </Button>
        )}
        {view === 'results' && (
          <Button variant="outline" className="w-full gap-2">
            <Download className="h-4 w-4 shrink-0" />
            Export findings
          </Button>
        )}

        {/* Chat */}
        {messages.length > 0 ? (
          <>
            <div className="flex items-center justify-between shrink-0">
              <p className="text-xs font-medium text-muted-foreground">Conversation</p>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                onClick={() => setMessages([])}
                aria-label="Close conversation"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <ChatThread messages={messages} />
            </div>
          </>
        ) : (
          <ChatThread messages={messages} />
        )}
        <ChatInput onSend={handleSend} />
      </div>
    </aside>
  )
}
