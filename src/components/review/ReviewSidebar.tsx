import { useState, useMemo, useEffect, useRef } from 'react'
import { ArrowLeft, X, Loader2, Check, Clock, ShieldCheck, FileText, RotateCcw, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { DocSourceSelector } from './DocSourceSelector'
import { PositionDocSelector } from './PositionDocSelector'
import { CounterpartyDocSelector } from './CounterpartyDocSelector'
import { AreaSelector } from './AreaSelector'
import { AuditConfig } from './AuditConfig'
import { ActionSelector } from './ActionSelector'
import { FindingCard } from './FindingCard'
import { ChatThread, type Message } from '@/components/sidebar/ChatThread'
import { ChatInput } from '@/components/sidebar/ChatInput'
import {
  comparisonAreas,
  counterparties,
  mockFindings,
  benchmarkFindings,
  coverageFindings,
  fallbackFindings,
  type MockDoc,
  type Finding,
} from '@/data/mockReviewData'

type Action = 'benchmark' | 'coverage' | 'clause' | 'audit' | 'counterparty' | 'definitions' | 'fallback'
type View = 'home' | 'select-doc' | 'select-areas' | 'audit-config' | 'loading' | 'results'
type StepStatus = 'waiting' | 'loading' | 'done'

interface AgentStep {
  id: string
  label: string
  status: StepStatus
}

const actionLabels: Record<Action, string> = {
  benchmark: 'Benchmark Comparison',
  coverage: 'Coverage & Completeness',
  clause: 'Clause Comparison',
  audit: 'Contract Audit',
  counterparty: 'Compare against Previous Deals',
  definitions: 'Definitions Comparison',
  fallback: 'Fallback Position Assessment',
}

function buildSteps(action: Action, doc: MockDoc | null, areaIds: string[], fallbackDoc?: MockDoc | null): AgentStep[] {
  const areas = comparisonAreas.filter((a) => areaIds.includes(a.id))

  let labels: string[]

  if (action === 'fallback') {
    labels = [
      'Reading your document',
      doc ? `Reading "${doc.title}"` : 'Reading standard document',
      fallbackDoc ? `Reading "${fallbackDoc.title}"` : 'Reading fallback document',
      'Assessing against standard position',
      'Assessing against fallback position',
      'Generating traffic-light report',
    ]
  } else if (action === 'benchmark' || action === 'counterparty') {
    labels = [
      'Reading your document',
      doc ? `Reading "${doc.title}"` : 'Reading comparison document',
      'Identifying document structure',
      'Comparing terms and clauses',
      'Flagging deviations',
      'Generating report',
    ]
  } else if (action === 'definitions') {
    labels = [
      'Reading your document',
      doc ? `Reading "${doc.title}"` : 'Reading comparison document',
      'Extracting defined terms from both documents',
      'Matching definitions by term name',
      'Identifying scope and wording differences',
      'Generating report',
    ]
  } else if (action === 'coverage') {
    labels = [
      'Reading your document',
      'Identifying agreement type',
      'Checking clause coverage',
      'Reviewing defined terms',
      'Assessing completeness',
      'Generating report',
    ]
  } else if (action === 'clause') {
    labels = [
      'Reading your document',
      doc ? `Reading "${doc.title}"` : 'Reading comparison document',
      'Extracting clause inventory',
      'Matching corresponding clauses',
      ...areas.map((a) => `Analysing ${a.label}`),
      'Generating comparison report',
    ]
  } else {
    labels = [
      'Reading your document',
      'Identifying audit scope',
      ...areas.map((a) => `Reviewing ${a.label}`),
      'Cross-referencing findings',
      'Generating audit report',
    ]
  }

  return labels.map((label, i) => ({ id: `step-${i}`, label, status: 'waiting' as StepStatus }))
}

export function ReviewSidebar() {
  const [view, setView] = useState<View>('home')
  const [activeAction, setActiveAction] = useState<Action | null>(null)
  const [selectedDoc, setSelectedDoc] = useState<MockDoc | null>(null)
  const [fallbackDoc, setFallbackDoc] = useState<MockDoc | null>(null)
  const [selectedCounterpartyId, setSelectedCounterpartyId] = useState<string | null>(null)
  const [selectedCounterpartyDocs, setSelectedCounterpartyDocs] = useState<MockDoc[]>([])
  const [isLoadingAreas, setIsLoadingAreas] = useState(false)
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [auditPrompt, setAuditPrompt] = useState('')
  const [findings, setFindings] = useState<Finding[]>([])
  const [insertedIds, setInsertedIds] = useState<Set<string>>(new Set())
  const [selectedActions, setSelectedActions] = useState<Record<string, string | null>>({})
  const [insertValidation, setInsertValidation] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isInserting, setIsInserting] = useState(false)
  const [rerunComplete, setRerunComplete] = useState(false)
  const [resolvedCount, setResolvedCount] = useState(0)

  // Use a ref so the loading effect always sees the latest isRerun value
  const isRerunRef = useRef(false)

  // Loading view state
  const [steps, setSteps] = useState<AgentStep[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  function goHome() {
    setView('home')
    setActiveAction(null)
    setSelectedDoc(null)
    setFallbackDoc(null)
    setSelectedAreas([])
    setAuditPrompt('')
    setFindings([])
    setSteps([])
    setCurrentStepIndex(0)
    setSelectedCounterpartyId(null)
    setSelectedCounterpartyDocs([])
    setInsertedIds(new Set())
    setSelectedActions({})
    setInsertValidation(false)
    setIsInserting(false)
    setRerunComplete(false)
    setResolvedCount(0)
    isRerunRef.current = false
  }

  function startLoading(action: Action, doc: MockDoc | null, areaIds: string[], fallbackDocArg?: MockDoc | null) {
    const newSteps = buildSteps(action, doc, areaIds, fallbackDocArg)
    setSteps(newSteps)
    setCurrentStepIndex(0)
    setView('loading')
  }

  function handleActionSelect(action: Action) {
    setActiveAction(action)
    setSelectedDoc(null)
    setFallbackDoc(null)
    setSelectedAreas([])
    setAuditPrompt('')

    if (action === 'coverage') {
      startLoading('coverage', null, [])
    } else if (action === 'audit') {
      setView('audit-config')
    } else {
      setView('select-doc')
    }
  }

  function handleCounterpartySelect(counterpartyId: string) {
    setActiveAction('counterparty')
    setSelectedCounterpartyId(counterpartyId)
    setSelectedDoc(null)
    setSelectedCounterpartyDocs([])
    setView('select-doc')
  }

  function handleDocSelect(doc: MockDoc) {
    if (!doc.id) return
    setSelectedDoc(doc)
  }

  function handleNext() {
    if (!activeAction) return
    if (activeAction === 'fallback') {
      if (!selectedDoc || !fallbackDoc) return
      startLoading('fallback', selectedDoc, [], fallbackDoc)
      return
    }
    if (activeAction !== 'counterparty' && !selectedDoc) return
    if (activeAction === 'benchmark' || activeAction === 'definitions') {
      startLoading(activeAction, selectedDoc, [])
    } else if (activeAction === 'counterparty') {
      const syntheticDoc: MockDoc = selectedCounterpartyDocs.length === 1
        ? selectedCounterpartyDocs[0]
        : { id: 'multi', title: `${selectedCounterpartyDocs.length} previous documents`, date: '' }
      startLoading('counterparty', syntheticDoc, [])
    } else if (activeAction === 'clause') {
      setSelectedAreas([])
      setIsLoadingAreas(true)
      setView('select-areas')
      setTimeout(() => setIsLoadingAreas(false), 1000)
    }
  }

  function handleRunComparison() {
    if (!activeAction) return
    startLoading(activeAction, selectedDoc, selectedAreas)
  }

  function handleRunAudit() {
    startLoading('audit', null, selectedAreas)
  }

  function handleRerunAnalysis() {
    setResolvedCount(insertedIds.size)
    setInsertedIds(new Set())
    setIsInserting(false)
    isRerunRef.current = true
    startLoading(activeAction!, selectedDoc, selectedAreas)
  }

  function handleBack() {
    switch (view) {
      case 'select-doc': return goHome()
      case 'select-areas': return setView('select-doc')
      case 'audit-config': return goHome()
      case 'results': return goHome()
    }
  }

  // Animate steps when in loading view
  useEffect(() => {
    if (view !== 'loading' || steps.length === 0) return

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = prev + 1
        if (next >= steps.length) {
          clearInterval(interval)
          setTimeout(() => {
            if (isRerunRef.current) {
              isRerunRef.current = false
              setFindings([])
              setRerunComplete(true)
            } else {
              let resultFindings: Finding[]
              if (activeAction === 'fallback') {
                resultFindings = [...fallbackFindings]
              } else if (activeAction === 'benchmark' || activeAction === 'counterparty' || activeAction === 'definitions') {
                resultFindings = [...benchmarkFindings]
              } else if (activeAction === 'coverage') {
                resultFindings = [...coverageFindings]
              } else {
                const base = selectedAreas.length > 0
                  ? mockFindings.filter((f) => selectedAreas.includes(f.areaId))
                  : mockFindings
                resultFindings = [...base]
              }
              const order = { high: 0, medium: 1, low: 2 }
              resultFindings.sort((a, b) => order[a.severity] - order[b.severity])
              setFindings(resultFindings)
              setSelectedActions({})
              setInsertValidation(false)
            }
            setView('results')
          }, 400)
          return prev
        }
        return next
      })
    }, 700)

    return () => clearInterval(interval)
  }, [view, steps.length, activeAction, selectedAreas])

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

  const actionLabel = activeAction ? actionLabels[activeAction] : ''
  const canNext = activeAction === 'counterparty'
    ? selectedCounterpartyDocs.length > 0
    : activeAction === 'fallback'
      ? selectedDoc !== null && selectedDoc.id !== '' && fallbackDoc !== null && fallbackDoc.id !== ''
      : selectedDoc !== null && selectedDoc.id !== ''
  const canRun = selectedAreas.length > 0
  const canRunAudit = selectedAreas.length > 0 || auditPrompt.trim().length > 0
  const showBack = view === 'select-doc' || view === 'select-areas' || view === 'audit-config' || view === 'results'
  const actionableFindings = findings.filter((f) => f.severity !== 'low')
  const allFixed = actionableFindings.length > 0 && insertedIds.size >= actionableFindings.length
  const counterpartyName = selectedCounterpartyId
    ? (counterparties.find((cp) => cp.id === selectedCounterpartyId)?.name ?? null)
    : null
  const showDocInHeader = view !== 'home' && view !== 'select-doc' &&
    (activeAction === 'counterparty' ? !!counterpartyName : !!(selectedDoc?.id)|| activeAction === 'fallback')

  function headerTitle() {
    if (view === 'home') return 'Review'
    return actionLabel
  }

  function headerDescription() {
    if (view === 'results' && rerunComplete) return 'All issues resolved — your document is fully aligned.'
    switch (view) {
      case 'home': return 'Choose the type of review you\'d like to run.'
      case 'select-doc':
        if (activeAction === 'benchmark') return 'Select a standard document to benchmark against.'
        if (activeAction === 'counterparty') return 'Select a previous document with this counterparty.'
        if (activeAction === 'definitions') return 'Select the document to compare definitions with.'
        if (activeAction === 'fallback') return 'Select your standard and fallback documents.'
        return 'Select the document to compare clauses with.'
      case 'select-areas':
        return 'Select the clauses you\'d like to compare.'
      case 'audit-config': return 'Select areas to review or describe what you need.'
      case 'loading': return 'Running analysis…'
      case 'results': {
        const n = findings.length
        const issues = actionableFindings.filter((f) => !insertedIds.has(f.id)).length
        const issueNote = issues > 0 ? ` · ${issues} need${issues === 1 ? 's' : ''} attention` : ''
        if (activeAction === 'benchmark' || activeAction === 'counterparty') return `${n} area${n !== 1 ? 's' : ''} assessed${issueNote}.`
        if (activeAction === 'coverage') return `${n} area${n !== 1 ? 's' : ''} assessed${issueNote}.`
        if (activeAction === 'clause') return `${n} clause${n !== 1 ? 's' : ''} assessed${issueNote}.`
        if (activeAction === 'definitions') return `${n} definition${n !== 1 ? 's' : ''} assessed${issueNote}.`
        if (activeAction === 'fallback') return `${n} area${n !== 1 ? 's' : ''} assessed against your positions${issueNote}.`
        return `${n} area${n !== 1 ? 's' : ''} assessed${issueNote}.`
      }
    }
  }

  return (
    <aside className="flex h-full w-1/3 shrink-0 flex-col bg-sidebar border-l border-border">

      {/* ── Header ── */}
      <div className="shrink-0 border-b border-border px-4 py-4 space-y-2">
        <div className="flex items-start gap-2">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 -ml-1"
              onClick={handleBack}
              aria-label="Back"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
          )}
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-foreground flex-1 min-w-0 truncate">
                {headerTitle()}
              </h1>
              {view === 'results' && (
                <Button variant="outline" size="icon" className="shrink-0 h-7 w-7" aria-label="Export findings">
                  <Download className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-snug">
              {headerDescription()}
            </p>
          </div>
        </div>
        {showDocInHeader && (
          <div className="space-y-1" style={{ paddingLeft: showBack ? '2.25rem' : undefined }}>
            {activeAction === 'fallback' ? (
              <>
                {selectedDoc?.id && (
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Standard: </span>
                    <span className="text-xs text-foreground truncate">{selectedDoc.title}</span>
                  </div>
                )}
                {fallbackDoc?.id && (
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Fallback: </span>
                    <span className="text-xs text-foreground truncate">{fallbackDoc.title}</span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="text-xs text-muted-foreground truncate">
                  {activeAction === 'counterparty' ? counterpartyName : selectedDoc!.title}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Scrollable body ── */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {view === 'home' && (
          <ActionSelector
            onSelect={handleActionSelect}
            onCounterpartySelect={handleCounterpartySelect}
          />
        )}

        {view === 'select-doc' && activeAction === 'counterparty' && selectedCounterpartyId && (
          <CounterpartyDocSelector
            counterpartyId={selectedCounterpartyId}
            selectedDocs={selectedCounterpartyDocs}
            onDocsChange={setSelectedCounterpartyDocs}
          />
        )}

        {view === 'select-doc' && activeAction === 'fallback' && (
          <PositionDocSelector
            standardDoc={selectedDoc}
            fallbackDoc={fallbackDoc}
            onStandardSelect={(doc) => { if (doc.id) setSelectedDoc(doc); else setSelectedDoc(null) }}
            onFallbackSelect={(doc) => { if (doc.id) setFallbackDoc(doc); else setFallbackDoc(null) }}
          />
        )}

        {view === 'select-doc' && activeAction !== 'counterparty' && activeAction !== 'fallback' && (
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

        {view === 'audit-config' && (
          <AuditConfig
            selectedAreas={selectedAreas}
            onChange={setSelectedAreas}
            prompt={auditPrompt}
            onPromptChange={setAuditPrompt}
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

        {view === 'results' && !rerunComplete && (
          <div className="space-y-2">
            {findings.map((finding, i) => (
              <FindingCard
                key={finding.id}
                finding={finding}
                defaultOpen={i === 0}
                isInserted={insertedIds.has(finding.id)}
                onInserted={() => setInsertedIds(prev => new Set(prev).add(finding.id))}
                selectedAction={selectedActions[finding.id] ?? null}
                onActionSelect={(id) => {
                  setSelectedActions(prev => ({ ...prev, [finding.id]: id }))
                  setInsertValidation(false)
                }}
                showValidation={insertValidation}
                trafficLight={activeAction === 'fallback'}
              />
            ))}
          </div>
        )}

        {view === 'results' && rerunComplete && (
          <div className="flex flex-col items-center gap-5 py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 border border-green-200">
              <ShieldCheck className="h-7 w-7 text-green-600" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold text-foreground">Fully aligned</p>
              <p className="text-sm text-muted-foreground leading-snug">
                Your document is fully aligned with{' '}
                {selectedDoc && <span className="font-medium text-foreground">"{selectedDoc.title}"</span>}.
              </p>
            </div>
            <div className="w-full rounded-md border border-border bg-card divide-y divide-border text-left">
              <div className="flex items-center justify-between px-3 py-2.5 text-sm">
                <span className="text-muted-foreground">Health score</span>
                <span className="font-medium text-green-600">100 / 100</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 text-sm">
                <span className="text-muted-foreground">Issues remaining</span>
                <span className="font-medium text-foreground">0</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 text-sm">
                <span className="text-muted-foreground">Issues resolved</span>
                <span className="font-medium text-foreground">{resolvedCount}</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 text-sm">
                <span className="text-muted-foreground">Issues already aligned</span>
                <span className="font-medium text-green-600">{findings.filter((f) => f.severity === 'low').length}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Results action bar ── */}
      {view === 'results' && insertValidation && (() => {
        const alreadyInserted = findings.filter((f) => insertedIds.has(f.id)).length
        const remaining = findings.filter((f) => !insertedIds.has(f.id)).length
        const msg = alreadyInserted > 0
          ? `${alreadyInserted} fix${alreadyInserted !== 1 ? 'es' : ''} already inserted. Select a resolution for the remaining ${remaining} issue${remaining !== 1 ? 's' : ''} to insert them.`
          : `Please select a resolution for each issue before inserting.`
        return (
          <div className="shrink-0 border-t border-amber-200 bg-amber-50 px-4 py-2">
            <p className="text-xs text-amber-700">{msg}</p>
          </div>
        )
      })()}
      {view === 'results' && (
        <div className="shrink-0 border-t border-border px-4 py-3 flex gap-2">
          {rerunComplete ? (
            <Button variant="outline" className="w-full">
              Export report
            </Button>
          ) : allFixed ? (
            <Button className="w-full gap-2" onClick={handleRerunAnalysis}>
              <RotateCcw className="h-3.5 w-3.5" />
              Run analysis again
            </Button>
          ) : (
            <>
              <Button variant="outline" className="flex-1">
                Save as Draft
              </Button>
              <Button
                className="flex-1 gap-1.5"
                disabled={isInserting}
                onClick={() => {
                  const unresolved = actionableFindings.filter(
                    (f) => !insertedIds.has(f.id) && !selectedActions[f.id]
                  )
                  if (unresolved.length > 0) {
                    setInsertValidation(true)
                    return
                  }
                  setInsertValidation(false)
                  setIsInserting(true)
                  setTimeout(() => {
                    setIsInserting(false)
                    setInsertedIds(new Set(actionableFindings.map((f) => f.id)))
                  }, 2000)
                }}
              >
                {isInserting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {isInserting ? 'Inserting…' : 'Insert changes'}
              </Button>
            </>
          )}
        </div>
      )}

      {/* ── Sticky footer ── */}
      <div className={cn(
        'shrink-0 border-t border-border px-4 py-3 flex flex-col gap-3',
        messages.length > 0 && 'max-h-1/2 overflow-hidden'
      )}>
        {view === 'select-doc' && (
          <Button className="w-full" disabled={!canNext} onClick={handleNext}>
            Next
          </Button>
        )}
        {view === 'select-areas' && (
          <Button className="w-full" disabled={!canRun} onClick={handleRunComparison}>
            Run comparison {canRun ? `(${selectedAreas.length})` : ''}
          </Button>
        )}
        {view === 'audit-config' && (
          <Button className="w-full" disabled={!canRunAudit} onClick={handleRunAudit}>
            Run audit
          </Button>
        )}
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
