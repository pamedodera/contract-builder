import { useState } from 'react'
import { ArrowLeft, Building2, BookOpen, FileText, ChevronDown, ChevronRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChatInput } from '@/components/sidebar/ChatInput'
import { DropZone } from './DropZone'
import { iManageDocs, libraryDocs, type MockDoc } from '@/data/mockReviewData'
import { cn } from '@/lib/utils'

interface LinkedDocsPageProps {
  selectedDocs: MockDoc[]
  onToggle: (doc: MockDoc) => void
  onBack: () => void
}

type Source = 'imanage' | 'library' | 'upload'

export function LinkedDocsPage({ selectedDocs, onToggle, onBack }: LinkedDocsPageProps) {
  const [openSource, setOpenSource] = useState<Source | null>('imanage')

  function toggle(source: Source) {
    setOpenSource((prev) => (prev === source ? null : source))
  }

  const isSelected = (doc: MockDoc) => selectedDocs.some((d) => d.id === doc.id)

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="shrink-0 flex items-center gap-2 border-b border-border px-3 py-2.5">
        <Button variant="ghost" size="icon-sm" onClick={onBack} aria-label="Back">
          <ArrowLeft />
        </Button>
        <span className="text-sm font-medium text-foreground">Linked Documents</span>
        {selectedDocs.length > 0 && (
          <span className="ml-auto text-xs text-muted-foreground">{selectedDocs.length} selected</span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 min-h-0">

        {/* iManage */}
        <div className="rounded-md border border-border bg-card overflow-hidden">
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
                <MultiDocRow key={doc.id} doc={doc} selected={isSelected(doc)} onToggle={onToggle} />
              ))}
            </div>
          )}
        </div>

        {/* Your Library */}
        <div className="rounded-md border border-border bg-card overflow-hidden">
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
                <MultiDocRow key={doc.id} doc={doc} selected={isSelected(doc)} onToggle={onToggle} />
              ))}
            </div>
          )}
        </div>

        {/* Upload */}
        <div className="rounded-md border border-border bg-card overflow-hidden">
          <button
            onClick={() => toggle('upload')}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left hover:bg-accent transition-colors"
          >
            <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="flex-1 text-sm font-medium">Upload</span>
            {openSource === 'upload'
              ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
          </button>
          {openSource === 'upload' && (
            <div className="border-t border-border p-3">
              <DropZone onDocSelect={(doc) => { if (doc.id) onToggle({ ...doc, id: `upload-${Date.now()}` }) }} />
            </div>
          )}
        </div>

      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-border px-3 py-3 space-y-2">
        {selectedDocs.length > 0 && (
          <Button className="w-full" onClick={onBack}>
            {selectedDocs.length === 1 ? 'Link document' : `Link ${selectedDocs.length} documents`}
          </Button>
        )}
        <ChatInput onSend={() => {}} />
      </div>

    </div>
  )
}

function MultiDocRow({ doc, selected, onToggle }: { doc: MockDoc; selected: boolean; onToggle: (d: MockDoc) => void }) {
  return (
    <button
      onClick={() => onToggle(doc)}
      className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-accent transition-colors"
    >
      <div className={cn(
        'h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-colors',
        selected ? 'bg-foreground border-foreground' : 'border-border bg-card'
      )}>
        {selected && <Check className="h-2.5 w-2.5 text-background" strokeWidth={3} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm truncate text-foreground">{doc.title}</p>
        <p className="text-xs text-muted-foreground">{doc.date}</p>
      </div>
    </button>
  )
}
