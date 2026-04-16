import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type Source =
  | { type: 'precedent'; name: string }
  | { type: 'ai' }

const definitions: {
  id: string
  label: string
  description: string
  source: Source
}[] = [
  {
    id: 'environmental-laws',
    label: 'Environmental Laws',
    description:
      'all applicable laws, regulations, and standards relating to pollution, contamination, waste and environmental protection.',
    source: { type: 'precedent', name: 'APLMA Term Loan 2023' },
  },
  {
    id: 'hazardous-substances',
    label: 'Hazardous Substances',
    description:
      'any substances regulated as hazardous, toxic, or harmful to the environment or human health.',
    source: { type: 'ai' },
  },
  {
    id: 'remediation',
    label: 'Remediation',
    description:
      'actions to investigate, manage, or remove contamination to comply with the law.',
    source: { type: 'precedent', name: 'LMA Real Estate Finance 2022' },
  },
  {
    id: 'force-majeure',
    label: 'Force Majeure',
    description:
      "events beyond a Party's reasonable control that prevent performance without causing financial hardship.",
    source: { type: 'ai' },
  },
]

function SourceBadge({ source }: { source: Source }) {
  const baseClass = 'bg-muted border-transparent text-muted-foreground font-normal'

  if (source.type === 'precedent') {
    return (
      <Badge
        variant="secondary"
        render={<button type="button" />}
        className={cn(baseClass, 'cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors')}
      >
        {source.name}
      </Badge>
    )
  }
  return (
    <Badge variant="secondary" className={baseClass}>
      AI Generated
    </Badge>
  )
}

export function ClauseCard() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(definitions.map((d) => [d.id, true]))
  )

  const allChecked = definitions.every((d) => checked[d.id])
  const checkedCount = definitions.filter((d) => checked[d.id]).length

  function toggleSelectAll() {
    const next = !allChecked
    setChecked(Object.fromEntries(definitions.map((d) => [d.id, next])))
  }

  function toggleCheck(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const insertSummary =
    checkedCount === 0
      ? '1 clause to insert'
      : `1 clause and ${checkedCount} ${checkedCount === 1 ? 'definition' : 'definitions'} to insert`

  return (
    <div className="rounded-2xl border border-border overflow-hidden text-foreground text-[16px] leading-[26px]">

      {/* Header — clause title + source link */}
      <div className="bg-muted px-3 py-2.5 flex flex-col gap-0.5">
        <span className="font-semibold leading-[22px]">Letters of Credit – Authorisation</span>
        <a
          href="#"
          className="text-[12px] text-primary leading-[16px] underline underline-offset-2 hover:opacity-80 transition-opacity w-fit"
        >
          Facility Agreement, Clause 7.1
        </a>
      </div>

      {/* Contract text */}
      <div className="bg-background border-t border-border px-3 pt-3 pb-2">
        <p>
          <span>
            {'(a) Each Borrower irrevocably and unconditionally authorises the Issuing Bank to pay any claim made or purported to be made under a Letter of Credit requested by it (or requested by the Parent on its behalf) '}
          </span>
          <span className="line-through text-[#f9221a]">
            and which appears on its face to be in order
          </span>
          <span>{' '}</span>
          <span className="underline text-[#267d7d]">
            provided that such claim strictly complies with the terms and conditions of the relevant Letter of Credit and the Issuing Bank is not aware of manifest fraud in relation to such claim
          </span>
          <span>{" (in this Clause\u200f\u00a07, a \u2018claim\u2019)."}</span>
        </p>
      </div>

      {/* Reason for change */}
      <div className="bg-background px-3 pt-2 pb-3">
        <div className="rounded border border-border bg-[#d3d9eb] px-3 py-2.5 flex flex-col gap-1">
          <p className="text-[14px] font-medium leading-[20px] text-muted-foreground">Reason for change</p>
          <p className="font-normal">
            These changes would narrow the Borrower's authorisation without materially departing from market-standard LMA risk allocation, while providing protection against defective or fraudulent claims.
          </p>
        </div>
      </div>

      {/* Definitions */}
      <div className="bg-background border-t border-border px-3 pt-3 pb-3">

        {/* Heading row + description */}
        <div className="flex items-start gap-3">
          <div className="flex-1 flex flex-col gap-1">
            <p className="text-[14px] font-semibold leading-[20px] text-muted-foreground">Definitions</p>
            <p className="text-[14px] text-muted-foreground leading-[20px]">
              The following definitions resolve terms introduced by this clause. AI-drafted ones are a first draft — review them on the document after inserting.
            </p>
          </div>
          <div className="shrink-0">
            <Button
              variant="ghost"
              size="xs"
              onClick={toggleSelectAll}

            >
              {allChecked ? 'Deselect all' : 'Select all'}
            </Button>
          </div>

        </div>

        {/* Definition items */}
        <div className="flex flex-col mt-3">
          {definitions.map((def, i) => (
            <div
              key={def.id}
              className={cn(
                'grid grid-cols-4 gap-x-3 py-3',
                i < definitions.length - 1 && 'border-b border-border'
              )}
            >
              {/* Left — 3/4: checkbox + label + description */}
              <div className="col-span-3 flex items-start gap-2">
                <Checkbox
                  checked={checked[def.id]}
                  onCheckedChange={() => toggleCheck(def.id)}
                  className="mt-1"
                />
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="font-medium leading-[22px]">{def.label}</span>
                  <p className="text-[14px] text-muted-foreground leading-[20px]">
                    {def.description}
                  </p>
                </div>
              </div>
              {/* Right — 1/4: badge */}
              <div className="col-span-1 flex justify-end pt-0.5">
                <SourceBadge source={def.source} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-background border-t border-border px-3 py-2.5 flex items-center gap-3">
        {/* Left: summary + hint */}
        <div className="flex-1 flex flex-col gap-1">
          <p className="text-[14px] font-medium text-foreground leading-[20px]">
            {insertSummary}
          </p>
          <p className="text-[14px] text-muted-foreground leading-[20px]">
            Edit will be inserted as plain text
          </p>
        </div>
        {/* Right: button group */}
        <div className="flex items-center shrink-0">
          <Button variant="default" size="default" className="rounded-r-none">
            Insert edit
          </Button>
          <Popover open={menuOpen} onOpenChange={setMenuOpen}>
            <PopoverTrigger
              className={buttonVariants({ variant: 'default', size: 'default', className: 'rounded-l-none border-l border-primary-foreground/20 px-2' })}
              aria-label="More insert options"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </PopoverTrigger>
            <PopoverContent align="end" className="w-52 p-1">
              <Button variant="ghost" size="default" className="w-full justify-start">
                Insert with comments
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>

    </div>
  )
}
