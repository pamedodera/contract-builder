import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Message {
  id: string
  role: 'user' | 'ai'
  text: string
}

interface ChatThreadProps {
  messages: Message[]
}

function renderText(text: string) {
  // Bold **text** → <strong>
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  )
}

export function ChatThread({ messages }: ChatThreadProps) {
  if (messages.length === 0) return null

  return (
    <div className="space-y-3 pb-2">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={cn('flex gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}
        >
          {msg.role === 'ai' && (
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
              <Sparkles className="h-3 w-3 text-muted-foreground" />
            </div>
          )}
          <div
            className={cn(
              'max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed',
              msg.role === 'user'
                ? 'bg-foreground text-background rounded-tr-sm'
                : 'bg-muted text-foreground rounded-tl-sm'
            )}
          >
            {renderText(msg.text)}
          </div>
        </div>
      ))}
    </div>
  )
}
