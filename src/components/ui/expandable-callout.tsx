import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

interface ExpandableCalloutProps {
  title: string
  body: string
  defaultExpanded?: boolean
}

export function ExpandableCallout({ title, body, defaultExpanded = false }: ExpandableCalloutProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <div className="rounded border border-border bg-[#d3d9eb] px-3 py-2.5 flex flex-col gap-1">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-3 text-left w-full"
      >
        <p className="flex-1 text-[16px] font-medium leading-[20px] text-muted-foreground">{title}</p>
        {expanded
          ? <ChevronUp className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          : <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        }
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p className="text-[16px] leading-[20px] pt-1">{body}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
