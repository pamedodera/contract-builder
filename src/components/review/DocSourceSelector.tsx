import { useState } from 'react'
import { Building2, BookOpen, ChevronDown, ChevronRight, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DropZone } from './DropZone'
import { iManageDocs, libraryDocs, type MockDoc } from '@/data/mockReviewData'

interface DocSourceSelectorProps {
  selectedDoc: MockDoc | null
  onDocSelect: (doc: MockDoc) => void
}

type Source = 'imanage' | 'library'

export function DocSourceSelector({ selectedDoc, onDocSelect }: DocSourceSelectorProps) {
  const [openSource, setOpenSource] = useState<Source | null>(null)

  function toggle(source: Source) {
    setOpenSource((prev) => (prev === source ? null : source))
  }

  return (
    <div className="space-y-2">
      {/* iManage */}
      <div className="rounded-md border border-border overflow-hidden">
        <button
          onClick={() => toggle('imanage')}
          className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left hover:bg-accent transition-colors"
        >
          <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 text-sm font-medium">iManage</span>
          {openSource === 'imanage'
            ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
        </button>
        {openSource === 'imanage' && (
          <div className="border-t border-border divide-y divide-border">
            {iManageDocs.map((doc) => (
              <DocRow
                key={doc.id}
                doc={doc}
                selected={selectedDoc?.id === doc.id}
                onSelect={onDocSelect}
              />
            ))}
          </div>
        )}
      </div>

      {/* Library */}
      <div className="rounded-md border border-border overflow-hidden">
        <button
          onClick={() => toggle('library')}
          className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left hover:bg-accent transition-colors"
        >
          <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="flex-1 text-sm font-medium">Your Library</span>
          {openSource === 'library'
            ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
        </button>
        {openSource === 'library' && (
          <div className="border-t border-border divide-y divide-border">
            {libraryDocs.map((doc) => (
              <DocRow
                key={doc.id}
                doc={doc}
                selected={selectedDoc?.id === doc.id}
                onSelect={onDocSelect}
              />
            ))}
          </div>
        )}
      </div>

      {/* Upload — always expanded */}
      <div className="rounded-md border border-border overflow-hidden">
        <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-border">
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="text-sm font-medium">Upload</span>
        </div>
        <div className="p-3">
          {selectedDoc?.id === 'upload' ? (
            <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
              <span className="text-sm text-foreground truncate">{selectedDoc.title}</span>
              <button
                onClick={() => onDocSelect({ id: '', title: '', date: '' })}
                className="text-xs text-muted-foreground hover:text-foreground ml-2 shrink-0"
              >
                Change
              </button>
            </div>
          ) : (
            <DropZone onDocSelect={onDocSelect} />
          )}
        </div>
      </div>
    </div>
  )
}

function DocRow({ doc, selected, onSelect }: { doc: MockDoc; selected: boolean; onSelect: (d: MockDoc) => void }) {
  return (
    <button
      onClick={() => onSelect(doc)}
      className={cn(
        'flex w-full items-start gap-2 px-3 py-2 text-left transition-colors hover:bg-accent',
        selected && 'bg-accent'
      )}
    >
      <div className="min-w-0 flex-1">
        <p className={cn('text-sm truncate', selected ? 'font-medium text-foreground' : 'text-foreground')}>{doc.title}</p>
        <p className="text-xs text-muted-foreground">{doc.date}</p>
      </div>
      {selected && <span className="text-xs font-medium text-foreground shrink-0 mt-0.5">✓</span>}
    </button>
  )
}
