import { Building2, BookOpen, FileText, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { DropZone } from './DropZone'
import { iManageDocs, libraryDocs, type MockDoc } from '@/data/mockReviewData'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PositionDocSelectorProps {
  standardDoc: MockDoc | null
  fallbackDoc: MockDoc | null
  onStandardSelect: (doc: MockDoc) => void
  onFallbackSelect: (doc: MockDoc) => void
}

type Source = 'imanage' | 'library' | 'upload'

export function PositionDocSelector({ standardDoc, fallbackDoc, onStandardSelect, onFallbackSelect }: PositionDocSelectorProps) {
  return (
    <div>
      <PositionSection
        label="Standard document"
        description="Your preferred position"
        selectedDoc={standardDoc}
        onDocSelect={onStandardSelect}
      />
      <div className="my-4 border-t border-border" />
      <PositionSection
        label="Fallback document"
        description="Your minimum acceptable position"
        selectedDoc={fallbackDoc}
        onDocSelect={onFallbackSelect}
      />
    </div>
  )
}

function PositionSection({
  label,
  description,
  selectedDoc,
  onDocSelect,
}: {
  label: string
  description: string
  selectedDoc: MockDoc | null
  onDocSelect: (doc: MockDoc) => void
}) {
  const [activeSource, setActiveSource] = useState<Source>('imanage')

  const docs = activeSource === 'imanage' ? iManageDocs : libraryDocs

  function handleSelectChange(value: string | null) {
    if (!value) return
    const doc = docs.find((d) => d.id === value)
    if (doc) onDocSelect(doc)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        {selectedDoc?.id && (
          <div className="flex items-center gap-1 text-xs text-green-600 font-medium shrink-0">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Selected
          </div>
        )}
      </div>

      {selectedDoc?.id ? (
        <div className="flex items-center justify-between rounded-md border border-green-200 bg-green-50 px-3 py-2">
          <span className="text-sm text-foreground truncate">{selectedDoc.title}</span>
          <button
            onClick={() => onDocSelect({ id: '', title: '', date: '' })}
            className="text-xs text-muted-foreground hover:text-foreground ml-2 shrink-0"
          >
            Change
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Source button group */}
          <div className="flex rounded-md border border-border overflow-hidden">
            <SourceTab icon={Building2} label="iManage" active={activeSource === 'imanage'} onClick={() => setActiveSource('imanage')} />
            <SourceTab icon={BookOpen} label="Library" active={activeSource === 'library'} onClick={() => setActiveSource('library')} bordered />
            <SourceTab icon={FileText} label="Upload" active={activeSource === 'upload'} onClick={() => setActiveSource('upload')} bordered />
          </div>

          {/* Source content */}
          {(activeSource === 'imanage' || activeSource === 'library') && (
            <Select onValueChange={handleSelectChange} value={selectedDoc?.id ?? ''}>
              <SelectTrigger className="w-full h-9 text-sm">
                <SelectValue placeholder="Select a document…" />
              </SelectTrigger>
              <SelectContent>
                {docs.map((doc) => (
                  <SelectItem key={doc.id} value={doc.id}>
                    <span className="flex w-full items-center justify-between gap-3">
                      <span className="truncate">{doc.title}</span>
                      <span className="text-xs text-muted-foreground shrink-0">{doc.date}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {activeSource === 'upload' && (
            <div className="rounded-md border border-border p-3">
              <DropZone onDocSelect={onDocSelect} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SourceTab({
  icon: Icon,
  label,
  active,
  onClick,
  bordered,
}: {
  icon: React.ElementType
  label: string
  active: boolean
  onClick: () => void
  bordered?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-1 items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium transition-colors',
        bordered && 'border-l border-border',
        active
          ? 'bg-foreground text-background'
          : 'bg-card text-muted-foreground hover:bg-accent hover:text-foreground'
      )}
    >
      <Icon className="h-3 w-3 shrink-0" />
      {label}
    </button>
  )
}
