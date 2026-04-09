import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MockDoc } from '@/data/mockGapData'

interface DropZoneProps {
  onDocSelect: (doc: MockDoc) => void
}

export function DropZone({ onDocSelect }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onDocSelect({ id: 'upload', title: file.name, date: 'Just now' })
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onDocSelect({ id: 'upload', title: file.name, date: 'Just now' })
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 py-6 text-center transition-colors',
        isDragging
          ? 'border-foreground bg-accent'
          : 'border-border hover:border-foreground/30 hover:bg-accent/50'
      )}
    >
      <Upload className="h-5 w-5 text-muted-foreground" />
      <div>
        <p className="text-sm font-medium text-foreground">Drop a file here</p>
        <p className="text-xs text-muted-foreground">or click to browse</p>
      </div>
      <input ref={inputRef} type="file" className="hidden" onChange={handleChange} />
    </div>
  )
}
