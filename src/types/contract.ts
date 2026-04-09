export type ItemType = 'clause' | 'definition'
export type ItemSource = 'personal' | 'company' | 'ai'

export interface ContractItem {
  id: string
  type: ItemType
  title: string
  preview: string
  source: ItemSource
}
