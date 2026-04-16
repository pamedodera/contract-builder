import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { Paperclip, BookOpen, ArrowUp, FileText, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const defaultPrompts = [
  { id: 'p1', label: 'Pull limitation of liability clause', prompt: 'Pull a limitation of liability clause for a SaaS agreement from Vault' },
  { id: 'p2', label: 'Identify risks', prompt: 'What are the key risks in this clause for my client?' },
  { id: 'p3', label: 'Suggest alternatives', prompt: 'Suggest three alternative formulations for this clause.' },
  { id: 'p6', label: 'Find any Unused Terms', prompt: 'Identify any defined terms in the draft that are not actually used in any clause.' },
  { id: 'p7', label: 'Find Undefined Terms', prompt: 'Identify any terms used in the draft that have not been defined.' },
  { id: 'p8', label: 'Find cascading issues', prompt: 'Identify any clauses that may create cascading obligations or conflicts with other clauses in the draft.' },
]

export type SavedPrompt = { id: string; label: string; prompt: string }

interface ChatInputProps {
  onSend: (text: string) => void
  placeholder?: string
  rows?: number
  inputRef?: React.RefObject<HTMLTextAreaElement | null>
  attachedFiles?: string[]
  onRemoveFile?: (index: number) => void
  savedPrompts?: SavedPrompt[]
}

export function ChatInput({ onSend, placeholder = 'Ask the AI assistant…', rows = 1, inputRef, attachedFiles = [], onRemoveFile, savedPrompts = [] }: ChatInputProps) {
  const [value, setValue] = useState('')
  const [promptOpen, setPromptOpen] = useState(false)
  const [overflowOpen, setOverflowOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const [highlighted, setHighlighted] = useState(false)
  const [visibleCount, setVisibleCount] = useState(attachedFiles.length)
  const internalRef = useRef<HTMLTextAreaElement>(null)
  const textareaRef = inputRef ?? internalRef
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const prevLengthRef = useRef(attachedFiles.length)

  // Auto-focus on mount when files are already attached (e.g. after transitioning from another mode)
  useEffect(() => {
    if (attachedFiles.length > 0) textareaRef.current?.focus()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Pulse a highlight ring when a new file is added
  useEffect(() => {
    if (attachedFiles.length > prevLengthRef.current) {
      setHighlighted(true)
      const t = setTimeout(() => setHighlighted(false), 700)
      prevLengthRef.current = attachedFiles.length
      return () => clearTimeout(t)
    }
    prevLengthRef.current = attachedFiles.length
  }, [attachedFiles.length])

  // Compute how many chips fit in the visible container using a hidden measurement layer
  useLayoutEffect(() => {
    const container = containerRef.current
    const measure = measureRef.current
    if (!container || !measure || attachedFiles.length === 0) {
      setVisibleCount(attachedFiles.length)
      return
    }

    const chipEls = Array.from(measure.querySelectorAll('[data-chip]')) as HTMLElement[]
    const GAP = 6 // gap-1.5 = 6px
    const OVERFLOW_BTN_W = 40
    const containerW = container.clientWidth

    let usedW = 0
    let count = 0

    for (let i = 0; i < chipEls.length; i++) {
      const chipW = chipEls[i].offsetWidth + (i > 0 ? GAP : 0)
      const remaining = attachedFiles.length - count - 1
      const extraW = remaining > 0 ? GAP + OVERFLOW_BTN_W : 0
      if (usedW + chipW + extraW <= containerW) {
        usedW += chipW
        count++
      } else {
        break
      }
    }

    setVisibleCount(Math.max(1, count))
  }, [attachedFiles])

  function applyPrompt(prompt: string) {
    setValue(prompt)
    setPromptOpen(false)
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

  const overflowCount = attachedFiles.length - visibleCount

  return (
    // layout: outer border box expands smoothly as the chips section appears — like the create button expanding
    <motion.div
      layout
      transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
      className={cn(
        'rounded-md border bg-background transition-colors duration-300',
        focused ? 'border-ring ring-1 ring-ring/30' : 'border-input',
        highlighted && !focused && 'border-ring ring-2 ring-ring/50'
      )}
    >
      {/* Textarea row */}
      <div className="flex items-center gap-1 p-2">
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

        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" disabled aria-label="Attach documents">
          <Paperclip className="h-3.5 w-3.5" />
        </Button>

        <Popover open={promptOpen} onOpenChange={setPromptOpen}>
          <PopoverTrigger
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="Saved Prompts"
          >
            <BookOpen className="h-3.5 w-3.5" />
          </PopoverTrigger>
          <PopoverContent side="top" align="end" className="w-64 p-1">
            <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Saved Prompts</p>
            {savedPrompts.length > 0 && (
              <>
                <div className="space-y-0.5">
                  {savedPrompts.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => applyPrompt(item.prompt)}
                      className="w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <div className="my-1 h-px bg-border" />
              </>
            )}
            <div className="space-y-0.5">
              {defaultPrompts.map((item) => (
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

      {/* Attached files section
          AnimatePresence without initial={false} so the animation plays on first mount
          (i.e. when the user lands in chat after uploading a document) */}
      <AnimatePresence>
        {attachedFiles.length > 0 && (
          // clipPath wipes the section into view from the bottom — the "create button" reveal
          <motion.div
            initial={{ clipPath: 'inset(0 100% 0 0 round 6px)', opacity: 0 }}
            animate={{ clipPath: 'inset(0 0% 0 0 round 6px)', opacity: 1 }}
            exit={{ clipPath: 'inset(0 100% 0 0 round 6px)', opacity: 0 }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
          >
            <div className="border-t border-input px-2 pb-2 pt-1.5">
              <div className="relative">
                {/* Hidden measurement layer */}
                <div
                  ref={measureRef}
                  className="absolute top-0 left-0 w-full invisible flex gap-1.5 pointer-events-none"
                  aria-hidden="true"
                >
                  {attachedFiles.map((file, i) => (
                    <div key={i} data-chip className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-1 shrink-0">
                      <FileText className="h-3.5 w-3.5 shrink-0" />
                      <span className="text-xs max-w-[120px] truncate whitespace-nowrap">{file}</span>
                      <div className="h-3 w-3 ml-0.5 shrink-0" />
                    </div>
                  ))}
                </div>

                {/* Visible chip row — each chip springs in with a stagger */}
                <div ref={containerRef} className="flex items-center gap-1.5">
                  {attachedFiles.slice(0, visibleCount).map((file, i) => (
                    <motion.div
                      key={file + i}
                      initial={{ opacity: 0, scale: 0.85, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ type: 'spring', bounce: 0.35, delay: 0.08 + i * 0.07 }}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 shrink-0"
                    >
                      <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="text-xs text-foreground max-w-[120px] truncate">{file}</span>
                      <button
                        type="button"
                        onClick={() => onRemoveFile?.(i)}
                        className="ml-0.5 text-muted-foreground hover:text-foreground transition-colors shrink-0"
                        aria-label={`Remove ${file}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.div>
                  ))}

                  {overflowCount > 0 && (
                    <Popover open={overflowOpen} onOpenChange={setOverflowOpen}>
                      <PopoverTrigger className="inline-flex items-center rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors shrink-0">
                        +{overflowCount}
                      </PopoverTrigger>
                      <PopoverContent side="top" align="end" className="w-56 p-1">
                        <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Attached Files</p>
                        {attachedFiles.slice(visibleCount).map((file, i) => (
                          <div key={file + i} className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent group">
                            <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            <span className="flex-1 text-sm truncate">{file}</span>
                            <button
                              type="button"
                              onClick={() => { onRemoveFile?.(visibleCount + i); setOverflowOpen(false) }}
                              className="text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                              aria-label={`Remove ${file}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
