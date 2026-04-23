import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface InsertButtonProps {
  label?: string
  onInsert: () => void
  onInsertWithComments?: () => void
  size?: 'default' | 'sm'
  disabled?: boolean
}

export function InsertButton({ label = 'Insert edit', onInsert, onInsertWithComments, size = 'default', disabled }: InsertButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center shrink-0">
      <Button
        variant="default"
        size={size}
        className="rounded-r-none"
        onClick={onInsert}
        disabled={disabled}
      >
        {label}
      </Button>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className={buttonVariants({
            variant: 'default',
            size,
            className: 'rounded-l-none border-l border-primary-foreground/20 px-2',
          })}
          aria-label="More insert options"
          disabled={disabled}
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </PopoverTrigger>
        <PopoverContent align="end" className="w-52 p-1">
          <Button
            variant="ghost"
            size="default"
            className="w-full justify-start"
            onClick={() => { onInsertWithComments?.(); setOpen(false) }}
          >
            Insert with comments
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}
