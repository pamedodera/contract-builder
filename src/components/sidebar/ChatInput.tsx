import { useState, useRef } from 'react'
import { Paperclip, BookOpen, ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const promptLibrary = [
  { id: 'p2', label: 'Identify risks', prompt: 'What are the key risks in this clause for my client?' },
  { id: 'p3', label: 'Suggest alternatives', prompt: 'Suggest three alternative formulations for this clause.' },
  { id: 'p6', label: 'Find any Unused Terms', prompt: 'Identify any defined terms in the draft that are not actually used in any clause.' },
  { id: 'p7', label: 'Find Undefined Terms', prompt: 'Identify any terms used in the draft that have not been defined.' },
  { id: 'p8', label: 'Find cascading issues', prompt: 'Identify any clauses that may create cascading obligations or conflicts with other clauses in the draft.' },
]

interface ChatInputProps {
  onSend: (text: string) => void
  placeholder?: string
  rows?: number
  inputRef?: React.RefObject<HTMLTextAreaElement | null>
}

export function ChatInput({ onSend, placeholder = 'Ask the AI assistant…', rows = 1, inputRef }: ChatInputProps) {
  const [value, setValue] = useState('')
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const internalRef = useRef<HTMLTextAreaElement>(null)
  const textareaRef = inputRef ?? internalRef

  function applyPrompt(prompt: string) {
    setValue(prompt)
    setPopoverOpen(false)
    textareaRef.current?.focus()
  }

  function handleSend() {
    const text = value.trim()
    if (!text) return
    onSend(text)
    setValue('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1 rounded-md border border-input bg-background p-2 transition-colors',
        focused && 'border-ring ring-1 ring-ring/30'
      )}
    >
      {/* Input — grows to fill available space */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        rows={rows}
        className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />

      {/* Buttons — right side */}
      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" disabled aria-label="Attach documents">
        <Paperclip className="h-3.5 w-3.5" />
      </Button>

      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label="Prompt library"
        >
          <BookOpen className="h-3.5 w-3.5" />
        </PopoverTrigger>
        <PopoverContent side="top" align="end" className="w-64 p-1">
          <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Prompt library</p>
          <div className="space-y-0.5">
            {promptLibrary.map((item) => (
              <button
                key={item.id}
                onClick={() => applyPrompt(item.prompt)}
                className="w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Button
        size="icon"
        className="h-7 w-7 shrink-0"
        disabled={value.trim() === ''}
        onClick={handleSend}
        aria-label="Send message"
      >
        <ArrowUp className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
