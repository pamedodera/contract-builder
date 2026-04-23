import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { Paperclip, ArrowUp, FileText, X, Loader2, Quote } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export type SavedPrompt = { id: string; label: string; prompt: string }

function ContextChip({
  text,
  index,
  skipAnimation,
  onRemove,
}: {
  text: string
  index: number
  skipAnimation?: boolean
  onRemove: () => void
}) {
  const entryProps = skipAnimation
    ? {}
    : { initial: { opacity: 0, scale: 0.85, y: 4 } }
  return (
    <motion.div
      {...entryProps}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 4 }}
      transition={{ type: 'spring', bounce: 0.35, delay: skipAnimation ? 0 : 0.05 + index * 0.06 }}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 shrink-0 max-w-[240px]"
    >
      <Quote className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <span className="text-xs text-foreground truncate">{text}</span>
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Remove context"
      >
        <X className="h-3 w-3" />
      </button>
    </motion.div>
  )
}

// Chip with a spinner in place of the remove button while the file is uploading.
// Once upload completes the spinner crossfades into the X button.
function FileChip({
  file,
  index,
  isUploading,
  onRemove,
}: {
  file: string
  index: number
  isUploading: boolean
  onRemove: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', bounce: 0.35, delay: 0.08 + index * 0.07 }}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2 py-1 shrink-0"
    >
      <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <span className="text-xs text-foreground max-w-[120px] truncate">{file}</span>
      <AnimatePresence mode="wait" initial={false}>
        {isUploading ? (
          <motion.span
            key="spinner"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.15 }}
            className="ml-0.5 shrink-0 flex items-center"
          >
            <Loader2 className="h-3 w-3 text-muted-foreground animate-spin" />
          </motion.span>
        ) : (
          <motion.button
            key="remove"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.15 }}
            type="button"
            onClick={onRemove}
            className="ml-0.5 shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={`Remove ${file}`}
          >
            <X className="h-3 w-3" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

interface ChatInputProps {
  onSend: (text: string) => void
  placeholder?: string
  rows?: number
  inputRef?: React.RefObject<HTMLTextAreaElement | null>
  attachedFiles?: string[]
  onRemoveFile?: (index: number) => void
  promptToApply?: { text: string; v: number } | null
  uploadingFile?: string
  isDragActive?: boolean
  contextChips?: { id: string; text: string; skipAnimation?: boolean }[]
  onRemoveContextChip?: (id: string) => void
}

export function ChatInput({ onSend, placeholder = 'Ask the AI assistant…', rows = 1, inputRef, attachedFiles = [], onRemoveFile, promptToApply, uploadingFile, isDragActive, contextChips = [], onRemoveContextChip }: ChatInputProps) {
  const [value, setValue] = useState('')
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

  // Apply a prompt selected from the header popover
  useEffect(() => {
    if (promptToApply) {
      setValue(promptToApply.text)
      textareaRef.current?.focus()
    }
  }, [promptToApply]) // eslint-disable-line react-hooks/exhaustive-deps

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
        highlighted && !focused && 'border-ring ring-2 ring-ring/50',
        isDragActive && !focused && 'border-ring ring-2 ring-ring/40'
      )}
    >
      {/* Attached files + context section — above textarea
          AnimatePresence without initial={false} so the animation plays on first mount */}
      <AnimatePresence>
        {(attachedFiles.length > 0 || contextChips.length > 0) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.25, 0, 0, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="border-b border-input px-2 pt-2 pb-1.5 flex flex-col gap-1.5">
              {attachedFiles.length > 0 && (
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
                      <FileChip
                        key={file + i}
                        file={file}
                        index={i}
                        isUploading={uploadingFile === file}
                        onRemove={() => onRemoveFile?.(i)}
                      />
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
              )}

              {contextChips.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  <AnimatePresence>
                    {contextChips.map((chip, i) => (
                      <ContextChip
                        key={chip.id}
                        text={chip.text}
                        index={i}
                        skipAnimation={chip.skipAnimation}
                        onRemove={() => onRemoveContextChip?.(chip.id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

    </motion.div>
  )
}
