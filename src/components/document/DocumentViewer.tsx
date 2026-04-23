import { useState, useEffect, useRef } from 'react'
import { MessageSquare, Pencil } from 'lucide-react'
import type { RichText, SectionBlock, DocumentBlock, NumberedClause } from '@/data/mockDocument'
import { mockDocument } from '@/data/mockDocument'
import { cn } from '@/lib/utils'

export interface InsertedEdit {
  id: string
  original: string
  edited: string
  comment?: string
}

interface DocumentViewerProps {
  onTermClick?: (termId: string) => void
  onAskContext?: (text: string) => void
  onEditContext?: (text: string) => void
  onSelectionChange?: (text: string) => void
  insertedEdits?: InsertedEdit[]
  goToEditId?: string | null
  highlightedSectionId?: string | null
}

function renderInline(
  nodes: RichText,
  onTermClick?: (termId: string) => void,
  insertedEdits?: InsertedEdit[],
  onCommentToggle?: (id: string) => void,
  openCommentId?: string | null,
) {
  return nodes.map((node, i) => {
    if (node.type === 'text') {
      if (insertedEdits) {
        for (const edit of insertedEdits) {
          const idx = node.text.indexOf(edit.original)
          if (idx !== -1) {
            return (
              <span key={i}>
                {idx > 0 && node.text.slice(0, idx)}
                <mark
                  id={`edit-${edit.id}`}
                  className="bg-amber-100 not-italic rounded-sm"
                >
                  {edit.edited}
                </mark>
                {edit.comment && (
                  <button
                    type="button"
                    className="relative ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 hover:bg-amber-500 transition-colors align-middle -translate-y-0.5"
                    onClick={(e) => { e.stopPropagation(); onCommentToggle?.(edit.id) }}
                    aria-label="View comment"
                  >
                    <MessageSquare className="h-2.5 w-2.5 text-white" />
                    {openCommentId === edit.id && (
                      <div
                        className="absolute left-0 top-5 z-50 w-64 rounded-lg border border-border bg-popover p-3 text-left shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <p className="text-xs font-medium text-foreground mb-1">Comment</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{edit.comment}</p>
                      </div>
                    )}
                  </button>
                )}
                {node.text.slice(idx + edit.original.length)}
              </span>
            )
          }
        }
      }
      return <span key={i}>{node.text}</span>
    }
    return (
      <span
        key={i}
        className="underline decoration-dotted underline-offset-2 cursor-pointer hover:decoration-solid"
        style={{ textDecorationColor: 'oklch(0.5 0.05 258)' }}
        onClick={() => onTermClick?.(node.termId)}
      >
        {node.text}
      </span>
    )
  })
}

function renderSubclauses(subclauses: NumberedClause[], onTermClick?: (termId: string) => void, insertedEdits?: InsertedEdit[], onCommentToggle?: (id: string) => void, openCommentId?: string | null) {
  return (
    <div className="pl-6 mt-1.5 space-y-1.5">
      {subclauses.map((sub) => (
        <div key={sub.number} className="flex gap-3 text-sm leading-relaxed">
          <span className="shrink-0 text-muted-foreground w-6">{sub.number}</span>
          <span>{renderInline(sub.content, onTermClick, insertedEdits, onCommentToggle, openCommentId)}</span>
        </div>
      ))}
    </div>
  )
}

function renderSectionBlock(block: SectionBlock, onTermClick?: (termId: string) => void, insertedEdits?: InsertedEdit[], onCommentToggle?: (id: string) => void, openCommentId?: string | null) {
  if (block.type === 'paragraph') {
    return (
      <p className="mb-3 text-sm leading-relaxed text-foreground">
        {renderInline(block.content, onTermClick, insertedEdits, onCommentToggle, openCommentId)}
      </p>
    )
  }

  if (block.type === 'definition') {
    return (
      <p className="mb-3 text-sm leading-relaxed">
        <span className="font-semibold">"{block.term}"</span>
        <span className="text-muted-foreground"> means </span>
        <span>{renderInline(block.content, onTermClick, insertedEdits, onCommentToggle, openCommentId)}</span>
      </p>
    )
  }

  if (block.type === 'clause') {
    return (
      <div className="mb-3">
        <div className="flex gap-3 text-sm leading-relaxed">
          <span className="shrink-0 font-medium text-foreground w-8">{block.number}</span>
          <span className="flex-1">{renderInline(block.content, onTermClick, insertedEdits, onCommentToggle, openCommentId)}</span>
        </div>
        {block.subclauses && renderSubclauses(block.subclauses, onTermClick, insertedEdits, onCommentToggle, openCommentId)}
      </div>
    )
  }

  return null
}

function renderBlock(block: DocumentBlock, onTermClick?: (termId: string) => void, insertedEdits?: InsertedEdit[], highlightedSectionId?: string | null, onCommentToggle?: (id: string) => void, openCommentId?: string | null) {
  if (block.type === 'title') {
    return (
      <div key="title" className="text-center mb-10">
        <h1 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">
          {block.text}
        </h1>
      </div>
    )
  }

  if (block.type === 'parties') {
    return (
      <div key="parties" className="mb-8 text-sm leading-relaxed space-y-4">
        <p className="text-muted-foreground">
          <span className="text-foreground font-medium">THIS AGREEMENT</span> is made on{' '}
          <span className="font-medium">{block.date}</span>
        </p>
        <p className="font-medium text-foreground uppercase text-xs tracking-wide">Between:</p>
        <div className="space-y-3 pl-4 border-l-2 border-border">
          <div>
            <p className="font-semibold text-foreground">{block.client}</p>
            <p className="text-muted-foreground text-sm mt-0.5">{block.clientDesc}</p>
          </div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">and</p>
          <div>
            <p className="font-semibold text-foreground">{block.provider}</p>
            <p className="text-muted-foreground text-sm mt-0.5">{block.providerDesc}</p>
          </div>
        </div>
        <p className="text-muted-foreground">
          Each a <span className="font-medium text-foreground">"party"</span> and together the{' '}
          <span className="font-medium text-foreground">"parties"</span>.
        </p>
      </div>
    )
  }

  if (block.type === 'recitals') {
    return (
      <div key="recitals" className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Background
        </h2>
        <div className="space-y-2 text-sm leading-relaxed">
          {block.items.map((item, i) => {
            const letter = String.fromCharCode(65 + i)
            return (
              <div key={i} className="flex gap-3">
                <span className="shrink-0 font-medium text-foreground">{letter}.</span>
                <span>{renderInline(item, onTermClick, insertedEdits, onCommentToggle, openCommentId)}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (block.type === 'section') {
    return (
      <section
        key={block.id}
        id={block.id}
        className={cn(
          'mb-2 rounded-lg transition-colors duration-700',
          highlightedSectionId === block.id && 'bg-amber-50'
        )}
      >
        <h2 className="text-xs font-semibold uppercase tracking-wide border-b border-border pb-2 mt-8 mb-4 text-foreground">
          {block.number}.{'  '}{block.title}
        </h2>
        <div>
          {block.blocks.map((b, i) => (
            <div key={i}>{renderSectionBlock(b, onTermClick, insertedEdits, onCommentToggle, openCommentId)}</div>
          ))}
        </div>
      </section>
    )
  }

  if (block.type === 'signature-block') {
    return (
      <div key="signature-block" className="mt-12 pt-8 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8 text-center">
          Executed as an Agreement
        </h2>
        <div className="grid grid-cols-2 gap-12">
          {[
            { label: 'Signed for and on behalf of', name: block.client, role: 'the Client' },
            { label: 'Signed for and on behalf of', name: block.provider, role: 'the Service Provider' },
          ].map((sig) => (
            <div key={sig.role} className="space-y-6">
              <div>
                <p className="text-xs text-muted-foreground">{sig.label}</p>
                <p className="text-sm font-semibold text-foreground mt-0.5">{sig.name}</p>
                <p className="text-xs text-muted-foreground">({sig.role})</p>
              </div>
              {['Signature', 'Name', 'Title', 'Date'].map((field) => (
                <div key={field}>
                  <div className="border-b border-border h-8" />
                  <p className="text-xs text-muted-foreground mt-1">{field}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}

export function DocumentViewer({ onTermClick, onAskContext, onEditContext, onSelectionChange, insertedEdits, goToEditId, highlightedSectionId }: DocumentViewerProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; text: string } | null>(null)
  const [openCommentId, setOpenCommentId] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  function handleCommentToggle(id: string) {
    setOpenCommentId(prev => prev === id ? null : id)
  }

  useEffect(() => {
    function handleSelectionChange() {
      const text = window.getSelection()?.toString().trim() ?? ''
      onSelectionChange?.(text)
    }
    document.addEventListener('selectionchange', handleSelectionChange)
    return () => document.removeEventListener('selectionchange', handleSelectionChange)
  }, [onSelectionChange])

  useEffect(() => {
    if (!goToEditId) return
    requestAnimationFrame(() => {
      const container = scrollContainerRef.current
      // Try the highlighted mark first, fall back to the section element by its id
      const el = document.getElementById(`edit-${goToEditId}`) ?? document.getElementById(goToEditId)
      if (!container || !el) return
      const containerRect = container.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      const targetScrollTop = container.scrollTop + (elRect.top - containerRect.top) - containerRect.height / 2 + elRect.height / 2
      container.scrollTo({ top: targetScrollTop, behavior: 'smooth' })
    })
  }, [goToEditId])

  useEffect(() => {
    if (!contextMenu) return
    function dismiss() { setContextMenu(null) }
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setContextMenu(null) }
    document.addEventListener('click', dismiss)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', dismiss)
      document.removeEventListener('keydown', onKey)
    }
  }, [!!contextMenu]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleContextMenu(e: React.MouseEvent) {
    const selection = window.getSelection()
    const text = selection?.toString().trim() ?? ''
    if (!text) return
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, text })
  }

  return (
    <div ref={scrollContainerRef} className="w-full h-full overflow-y-auto bg-muted/30" onContextMenu={handleContextMenu}>
      <div className="mx-3 my-3 px-12 py-8 bg-card shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Ref: {mockDocument.ref}</p>
          <p className="text-xs text-muted-foreground">CONFIDENTIAL</p>
        </div>
        {mockDocument.blocks.map((block, i) => (
          <div key={i} onClick={() => setOpenCommentId(null)}>
            {renderBlock(block, onTermClick, insertedEdits, highlightedSectionId, handleCommentToggle, openCommentId)}
          </div>
        ))}
      </div>

      {contextMenu && (
        <div
          className="fixed z-50 min-w-[120px] overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-md py-1"
          style={{ top: contextMenu.y + 4, left: contextMenu.x + 4 }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="flex w-full items-center gap-2.5 px-3 py-1.5 text-sm hover:bg-accent transition-colors"
            onClick={() => { onAskContext?.(contextMenu.text); setContextMenu(null) }}
          >
            <MessageSquare className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            Ask
          </button>
          <div className="h-px bg-border mx-1" />
          <button
            className="flex w-full items-center gap-2.5 px-3 py-1.5 text-sm hover:bg-accent transition-colors"
            onClick={() => { onEditContext?.(contextMenu.text); setContextMenu(null) }}
          >
            <Pencil className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            Edit
          </button>
        </div>
      )}
    </div>
  )
}
