import { ClauseCard } from './ClauseCard'
import { DefinitionCard } from './DefinitionCard'
import type { ContractItem } from '@/types/contract'

interface CardListProps {
  items: ContractItem[]
  draftIds: Set<string>
  onToggle: (id: string) => void
  onDelete?: (id: string) => void
  onExplain?: (id: string) => void
  onReplace?: (id: string) => void
  compact?: boolean
  suggestedIds?: string[]
  onAddAllSuggested?: (ids: string[]) => void
}

function renderCard(
  item: ContractItem,
  draftIds: Set<string>,
  onToggle: (id: string) => void,
  onDelete?: (id: string) => void,
  onExplain?: (id: string) => void,
  onReplace?: (id: string) => void,
  compact?: boolean,
  suggested?: boolean
) {
  const props = {
    key: item.id,
    item,
    inDraft: draftIds.has(item.id),
    onToggle,
    onDelete: onDelete ? () => onDelete(item.id) : undefined,
    onExplain: onExplain ? () => onExplain(item.id) : undefined,
    onReplace: onReplace ? () => onReplace(item.id) : undefined,
    compact,
    suggested,
  }
  return item.type === 'clause' ? <ClauseCard {...props} /> : <DefinitionCard {...props} />
}

export function CardList({ items, draftIds, onToggle, onDelete, onExplain, onReplace, compact, suggestedIds, onAddAllSuggested }: CardListProps) {
  if (items.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center">
        <p className="text-xs text-muted-foreground">No items match your search.</p>
      </div>
    )
  }

  const hasSuggestions = suggestedIds && suggestedIds.length > 0
  const suggested = hasSuggestions ? items.filter((i) => suggestedIds.includes(i.id)) : []
  const rest = hasSuggestions ? items.filter((i) => !suggestedIds.includes(i.id)) : items

  return (
    <div className="space-y-4">
      {hasSuggestions && suggested.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-violet-600">AI Suggested</p>
            {onAddAllSuggested && (
              <button
                onClick={() => onAddAllSuggested(suggested.map((i) => i.id))}
                className="text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors"
              >
                Add all
              </button>
            )}
          </div>
          <div className="space-y-2">
            {suggested.map((item) => renderCard(item, draftIds, onToggle, onDelete, onExplain, onReplace, compact, true))}
          </div>
        </div>
      )}

      {rest.length > 0 && (
        <div className="space-y-2">
          {hasSuggestions && suggested.length > 0 && (
            <p className="text-xs font-medium text-muted-foreground">All components</p>
          )}
          {rest.map((item) => renderCard(item, draftIds, onToggle, onDelete, onExplain, onReplace, compact, false))}
        </div>
      )}
    </div>
  )
}
