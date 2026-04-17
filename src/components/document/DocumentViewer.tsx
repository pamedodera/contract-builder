import { useState, useEffect } from 'react'
import { MessageSquare, Pencil } from 'lucide-react'
import type { RichText, SectionBlock, DocumentBlock, NumberedClause } from '@/data/mockDocument'
import { mockDocument } from '@/data/mockDocument'

interface DocumentViewerProps {
  onTermClick?: (termId: string) => void
  onAskContext?: (text: string) => void
  onEditContext?: (text: string) => void
}

function renderInline(nodes: RichText, onTermClick?: (termId: string) => void) {
  return nodes.map((node, i) => {
    if (node.type === 'text') {
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

function renderSubclauses(subclauses: NumberedClause[], onTermClick?: (termId: string) => void) {
  return (
    <div className="pl-6 mt-1.5 space-y-1.5">
      {subclauses.map((sub) => (
        <div key={sub.number} className="flex gap-3 text-sm leading-relaxed">
          <span className="shrink-0 text-muted-foreground w-6">{sub.number}</span>
          <span>{renderInline(sub.content, onTermClick)}</span>
        </div>
      ))}
    </div>
  )
}

function renderSectionBlock(block: SectionBlock, onTermClick?: (termId: string) => void) {
  if (block.type === 'paragraph') {
    return (
      <p className="mb-3 text-sm leading-relaxed text-foreground">
        {renderInline(block.content, onTermClick)}
      </p>
    )
  }

  if (block.type === 'definition') {
    return (
      <p className="mb-3 text-sm leading-relaxed">
        <span className="font-semibold">"{block.term}"</span>
        <span className="text-muted-foreground"> means </span>
        <span>{renderInline(block.content, onTermClick)}</span>
      </p>
    )
  }

  if (block.type === 'clause') {
    return (
      <div className="mb-3">
        <div className="flex gap-3 text-sm leading-relaxed">
          <span className="shrink-0 font-medium text-foreground w-8">{block.number}</span>
          <span className="flex-1">{renderInline(block.content, onTermClick)}</span>
        </div>
        {block.subclauses && renderSubclauses(block.subclauses, onTermClick)}
      </div>
    )
  }

  return null
}

function renderBlock(block: DocumentBlock, onTermClick?: (termId: string) => void) {
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
                <span>{renderInline(item, onTermClick)}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (block.type === 'section') {
    return (
      <section key={block.id} id={block.id} className="mb-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide border-b border-border pb-2 mt-8 mb-4 text-foreground">
          {block.number}.{'  '}{block.title}
        </h2>
        <div>
          {block.blocks.map((b, i) => (
            <div key={i}>{renderSectionBlock(b, onTermClick)}</div>
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

export function DocumentViewer({ onTermClick, onAskContext, onEditContext }: DocumentViewerProps) {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; text: string } | null>(null)

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
    <div className="w-full h-full overflow-y-auto bg-muted/30" onContextMenu={handleContextMenu}>
      <div className="mx-3 my-3 px-12 py-8 bg-card shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Ref: {mockDocument.ref}</p>
          <p className="text-xs text-muted-foreground">CONFIDENTIAL</p>
        </div>
        {mockDocument.blocks.map((block, i) => (
          <div key={i}>{renderBlock(block, onTermClick)}</div>
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
