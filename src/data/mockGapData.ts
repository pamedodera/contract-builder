export interface MockDoc {
  id: string
  title: string
  date: string
}

export interface ComparisonArea {
  id: string
  label: string
  reason: string
}

export interface Finding {
  id: string
  areaId: string
  areaLabel: string
  severity: 'high' | 'medium' | 'low'
  summary: string
  detail: string
}

export const iManageDocs: MockDoc[] = [
  { id: 'im1', title: 'Clifford Chance NDA 2024', date: '12 Mar 2024' },
  { id: 'im2', title: 'Allen & Overy Service Agreement Template', date: '5 Jan 2024' },
  { id: 'im3', title: 'Linklaters Employment Framework', date: '20 Nov 2023' },
  { id: 'im4', title: 'Freshfields Shareholders Agreement v3', date: '8 Sep 2023' },
  { id: 'im5', title: 'Norton Rose Loan Facility Agreement', date: '14 Jun 2023' },
]

export const libraryDocs: MockDoc[] = [
  { id: 'lib1', title: 'My NDA Template', date: '1 Feb 2024' },
  { id: 'lib2', title: 'Standard Service Agreement', date: '15 Dec 2023' },
  { id: 'lib3', title: 'Employment Contract Base', date: '3 Oct 2023' },
  { id: 'lib4', title: 'Precedent Loan Agreement', date: '22 Aug 2023' },
]

export const comparisonAreas: ComparisonArea[] = [
  { id: 'payment-terms', label: 'Payment Terms', reason: 'Common source of disputes — term lengths often differ between parties' },
  { id: 'liability-cap', label: 'Liability Cap', reason: 'Caps vary widely; mismatches create unintended exposure' },
  { id: 'termination', label: 'Termination Rights', reason: 'Material differences in notice periods and trigger events are common' },
  { id: 'governing-law', label: 'Governing Law', reason: 'Jurisdiction choice affects enforceability and dispute resolution' },
  { id: 'ip-ownership', label: 'IP Ownership', reason: 'Often overlooked; precedents frequently include broader assignments' },
  { id: 'confidentiality', label: 'Confidentiality', reason: 'Definition scope and duration often narrower in older precedents' },
  { id: 'force-majeure', label: 'Force Majeure', reason: 'Post-pandemic precedents include significantly broader trigger lists' },
  { id: 'dispute-resolution', label: 'Dispute Resolution', reason: 'Arbitration vs litigation clauses affect cost and speed significantly' },
]

export const mockFindings: Finding[] = [
  {
    id: 'f1', areaId: 'payment-terms', areaLabel: 'Payment Terms', severity: 'high',
    summary: 'Your draft uses 30-day payment terms; the precedent specifies 14 days with a 2% late fee.',
    detail: 'The precedent document sets a 14-day payment cycle with an automatic 2% per month late payment fee. Your current draft does not include a late payment mechanism. This gap could significantly delay cash flow and leave you without a contractual remedy for late payment. Recommend tightening the payment schedule and adding a late payment clause.',
  },
  {
    id: 'f2', areaId: 'liability-cap', areaLabel: 'Liability Cap', severity: 'high',
    summary: 'Liability cap in your draft is uncapped; precedent caps at 12 months\' fees.',
    detail: 'The precedent document limits aggregate liability to the total fees paid in the 12 months preceding the claim. Your draft contains no cap on liability, exposing your client to unlimited claims. This is a significant commercial risk. Strong recommendation to introduce a mutual liability cap mirroring the precedent.',
  },
  {
    id: 'f3', areaId: 'termination', areaLabel: 'Termination Rights', severity: 'medium',
    summary: 'Notice period is 30 days in your draft vs 60 days in the precedent.',
    detail: 'The precedent requires 60 days written notice for termination for convenience, and specifies that notice must be sent by recorded delivery. Your draft allows 30-day notice by email. The shorter period and informal delivery method may disadvantage your client if the counterparty terminates during a critical project phase.',
  },
  {
    id: 'f4', areaId: 'governing-law', areaLabel: 'Governing Law', severity: 'low',
    summary: 'Both documents select English law; jurisdiction clauses differ slightly.',
    detail: 'Both documents are governed by English law. However, the precedent specifies exclusive jurisdiction of the English courts, while your draft uses non-exclusive jurisdiction. This distinction matters if the counterparty operates in multiple jurisdictions, as non-exclusive jurisdiction could allow parallel proceedings elsewhere.',
  },
  {
    id: 'f5', areaId: 'ip-ownership', areaLabel: 'IP Ownership', severity: 'medium',
    summary: 'Precedent includes a broad IP assignment; your draft is silent on background IP.',
    detail: 'The precedent document includes an explicit assignment of all foreground IP created under the contract and addresses background IP licences. Your draft does not distinguish between background and foreground IP, which creates ambiguity about what the client owns at the end of the engagement. Recommend adding an IP schedule.',
  },
  {
    id: 'f6', areaId: 'confidentiality', areaLabel: 'Confidentiality', severity: 'medium',
    summary: 'Your confidentiality obligation survives 2 years; precedent has 5-year survival.',
    detail: 'Post-termination confidentiality in your draft lasts 2 years, whereas the precedent extends obligations for 5 years. For sensitive commercial arrangements, 2 years may be insufficient to protect genuinely sensitive information. Consider aligning with the precedent or negotiating a tiered survival period based on information sensitivity.',
  },
  {
    id: 'f7', areaId: 'force-majeure', areaLabel: 'Force Majeure', severity: 'low',
    summary: 'Precedent includes pandemic and supply chain events; your draft uses a narrower definition.',
    detail: 'Post-pandemic drafting standards include explicit references to public health emergencies, government-mandated closures, and supply chain disruptions as force majeure events. Your draft uses a generic "events beyond reasonable control" formulation. Recommend updating to the expanded list from the precedent to avoid disputes about scope.',
  },
  {
    id: 'f8', areaId: 'dispute-resolution', areaLabel: 'Dispute Resolution', severity: 'medium',
    summary: 'Precedent requires ICC arbitration; your draft defaults to court litigation.',
    detail: 'The precedent specifies ICC arbitration in London as the mandatory dispute resolution mechanism, with a three-member tribunal for disputes above £500k. Your draft is silent on dispute resolution, which defaults to court litigation. For international counterparties, arbitration is generally preferred for enforceability under the New York Convention.',
  },
]
