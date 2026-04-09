export interface MockDoc {
  id: string
  title: string
  date: string
}

export interface Counterparty {
  id: string
  name: string
  previousDocs: MockDoc[]
}

export const counterparties: Counterparty[] = [
  {
    id: 'accenture',
    name: 'Accenture',
    previousDocs: [
      { id: 'cp1a', title: 'Accenture Consulting Agreement 2023', date: '18 Sep 2023' },
      { id: 'cp1b', title: 'Accenture NDA 2022', date: '3 Mar 2022' },
    ],
  },
  {
    id: 'goldman',
    name: 'Goldman Sachs & Co.',
    previousDocs: [
      { id: 'cp2a', title: 'Goldman Sachs Service Agreement 2024', date: '10 Jan 2024' },
      { id: 'cp2b', title: 'Goldman Sachs Confidentiality Agreement 2023', date: '22 Jul 2023' },
      { id: 'cp2c', title: 'Goldman Sachs Loan Facility 2021', date: '5 Nov 2021' },
    ],
  },
  {
    id: 'mckinsey',
    name: 'McKinsey & Company',
    previousDocs: [
      { id: 'cp3a', title: 'McKinsey Advisory Agreement 2024', date: '14 Feb 2024' },
      { id: 'cp3b', title: 'McKinsey NDA 2023', date: '8 Jun 2023' },
    ],
  },
  {
    id: 'deloitte',
    name: 'Deloitte LLP',
    previousDocs: [
      { id: 'cp4a', title: 'Deloitte Audit Services Agreement 2023', date: '1 Apr 2023' },
      { id: 'cp4b', title: 'Deloitte Consulting Framework 2022', date: '15 Oct 2022' },
    ],
  },
  {
    id: 'hsbc',
    name: 'HSBC Holdings plc',
    previousDocs: [
      { id: 'cp5a', title: 'HSBC Facility Agreement 2024', date: '28 Mar 2024' },
      { id: 'cp5b', title: 'HSBC Master Services Agreement 2022', date: '12 Dec 2022' },
    ],
  },
]

export interface ComparisonArea {
  id: string
  label: string
  reason: string
}

export interface FindingAction {
  id: string
  label: string
}

export interface Finding {
  id: string
  areaId: string
  areaLabel: string
  severity: 'high' | 'medium' | 'low'
  summary: string
  detail: string
  actions?: FindingAction[]
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

// Used by Clause Comparison and Contract Audit
export const mockFindings: Finding[] = [
  {
    id: 'f1', areaId: 'payment-terms', areaLabel: 'Payment Terms', severity: 'high',
    summary: 'Your draft uses 30-day payment terms; the precedent specifies 14 days with a 2% late fee.',
    detail: 'The precedent document sets a 14-day payment cycle with an automatic 2% per month late payment fee. Your current draft does not include a late payment mechanism. This gap could significantly delay cash flow and leave you without a contractual remedy for late payment. Recommend tightening the payment schedule and adding a late payment clause.',
    actions: [
      { id: 'a1a', label: 'Adopt 14-day cycle with 2% monthly late fee (mirror precedent)' },
      { id: 'a1b', label: 'Keep 30-day terms and add a late payment remedy clause' },
    ],
  },
  {
    id: 'f2', areaId: 'liability-cap', areaLabel: 'Liability Cap', severity: 'high',
    summary: 'Liability cap in your draft is uncapped; precedent caps at 12 months\' fees.',
    detail: 'The precedent document limits aggregate liability to the total fees paid in the 12 months preceding the claim. Your draft contains no cap on liability, exposing your client to unlimited claims. This is a significant commercial risk. Strong recommendation to introduce a mutual liability cap mirroring the precedent.',
    actions: [
      { id: 'a2a', label: 'Cap at 12 months\' fees (mirror precedent)' },
      { id: 'a2b', label: 'Introduce alternative cap at 2× annual contract value' },
    ],
  },
  {
    id: 'f3', areaId: 'termination', areaLabel: 'Termination Rights', severity: 'medium',
    summary: 'Notice period is 30 days in your draft vs 60 days in the precedent.',
    detail: 'The precedent requires 60 days written notice for termination for convenience, and specifies that notice must be sent by recorded delivery. Your draft allows 30-day notice by email. The shorter period and informal delivery method may disadvantage your client if the counterparty terminates during a critical project phase.',
    actions: [
      { id: 'a3a', label: 'Extend to 60-day notice by recorded delivery (mirror precedent)' },
      { id: 'a3b', label: 'Keep 30-day notice, upgrade delivery method to recorded post' },
    ],
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
    actions: [
      { id: 'a5a', label: 'Add IP schedule distinguishing foreground and background rights' },
      { id: 'a5b', label: 'Add a simple broad assignment clause for all created IP' },
    ],
  },
  {
    id: 'f6', areaId: 'confidentiality', areaLabel: 'Confidentiality', severity: 'medium',
    summary: 'Your confidentiality obligation survives 2 years; precedent has 5-year survival.',
    detail: 'Post-termination confidentiality in your draft lasts 2 years, whereas the precedent extends obligations for 5 years. For sensitive commercial arrangements, 2 years may be insufficient to protect genuinely sensitive information. Consider aligning with the precedent or negotiating a tiered survival period based on information sensitivity.',
    actions: [
      { id: 'a6a', label: 'Extend post-termination survival to 5 years (mirror precedent)' },
      { id: 'a6b', label: 'Keep 2-year survival, add tiered obligations by sensitivity' },
    ],
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
    actions: [
      { id: 'a8a', label: 'Insert ICC arbitration clause with 3-member panel for disputes above £500k' },
      { id: 'a8b', label: 'Keep court litigation and add a mandatory mediation step' },
    ],
  },
]

// Used by Benchmark Comparison
export const benchmarkFindings: Finding[] = [
  {
    id: 'b1', areaId: 'payment-terms', areaLabel: 'Payment Terms', severity: 'high',
    summary: 'Payment window is 30 days; standard specifies 14 days with automatic late fee.',
    detail: 'The ISDA standard sets a 14-day payment cycle with a 2% per month late payment charge. Your draft allows 30 days with no late payment remedy. This deviation increases your exposure to payment delays and weakens your contractual position. Recommend aligning to the standard payment schedule.',
    actions: [
      { id: 'b1a', label: 'Apply 14-day standard with automatic 2% late fee' },
      { id: 'b1b', label: 'Keep 30-day terms with no late payment remedy' },
    ],
  },
  {
    id: 'b2', areaId: 'force-majeure', areaLabel: 'Force Majeure', severity: 'high',
    summary: 'Force majeure clause absent; the standard includes an explicit force majeure provision.',
    detail: 'The standard document includes a detailed force majeure clause covering natural disasters, governmental action, and public health emergencies. Your draft contains no such provision. In the event of an unforeseeable disruption, a party seeking relief may be left without a contractual basis to suspend or terminate obligations.',
    actions: [
      { id: 'b2a', label: 'Insert ISDA standard force majeure clause in full' },
      { id: 'b2b', label: 'Add a bespoke narrower force majeure provision' },
    ],
  },
  {
    id: 'b3', areaId: 'liability-cap', areaLabel: 'Liability Cap', severity: 'medium',
    summary: 'Your liability cap is set at 1× annual fees; standard recommends 2× for service agreements.',
    detail: 'The standard template sets the aggregate liability cap at two times the annual contract value, reflecting market practice for professional services. Your draft caps liability at one times annual fees. While any cap is better than none, the lower threshold may be insufficient to cover losses in the event of a significant breach.',
    actions: [
      { id: 'b3a', label: 'Increase cap to 2× annual contract value (mirror standard)' },
      { id: 'b3b', label: 'Retain 1× annual fees cap with carve-outs for wilful misconduct' },
    ],
  },
  {
    id: 'b4', areaId: 'governing-law', areaLabel: 'Governing Law', severity: 'low',
    summary: 'Governing law is aligned with the standard (English law, English courts).',
    detail: 'Both your draft and the standard select English law as the governing law and the courts of England and Wales as the exclusive forum. No deviation identified. This alignment ensures consistent interpretation and familiar enforcement procedures.',
  },
  {
    id: 'b5', areaId: 'dispute-resolution', areaLabel: 'Dispute Resolution', severity: 'low',
    summary: 'Arbitration clause matches standard wording for disputes below £500k threshold.',
    detail: 'Your dispute resolution clause mirrors the standard for claims below £500,000, directing parties to LCIA arbitration in London. For claims above this threshold, the standard recommends a three-member panel; your draft does not address this. Consider adding the escalation provision for high-value disputes.',
  },
]

// Used by Fallback Position Assessment (traffic-light: low=within standard, medium=within fallback, high=below fallback)
export const fallbackFindings: Finding[] = [
  {
    id: 'fp1', areaId: 'liability-cap', areaLabel: 'Liability Cap', severity: 'high',
    summary: 'Counterparty proposes uncapped liability; your fallback position requires a cap at 1× annual fees.',
    detail: 'Your standard position caps aggregate liability at 2× annual contract value. Your fallback accepts a minimum of 1× annual fees. The counterparty draft contains no liability cap at all, which falls below your fallback position. An uncapped exposure is commercially unacceptable and must be negotiated before signature.',
    actions: [
      { id: 'fp1a', label: 'Insist on 2× annual fees cap (standard position)' },
      { id: 'fp1b', label: 'Accept 1× annual fees cap (fallback position)' },
    ],
  },
  {
    id: 'fp2', areaId: 'termination', areaLabel: 'Termination Rights', severity: 'high',
    summary: 'Counterparty notice period is 7 days; your fallback minimum is 30 days.',
    detail: 'Your standard position requires 60 days written notice for termination for convenience. Your fallback accepts no fewer than 30 days. The counterparty proposes 7-day termination rights, which falls below your fallback threshold. This would leave insufficient time to transition services or mitigate losses on termination.',
    actions: [
      { id: 'fp2a', label: 'Require 60-day notice (standard position)' },
      { id: 'fp2b', label: 'Negotiate minimum 30-day notice (fallback position)' },
    ],
  },
  {
    id: 'fp3', areaId: 'payment-terms', areaLabel: 'Payment Terms', severity: 'medium',
    summary: 'Counterparty proposes 45-day payment terms; your standard is 30 days, fallback is 60 days.',
    detail: 'Your standard position is 30-day payment terms with a late payment remedy. Your fallback accepts up to 60 days provided a late interest clause is included. The counterparty draft proposes 45 days, which sits between your standard and fallback positions. It is acceptable at fallback, but negotiating towards 30 days is preferred.',
    actions: [
      { id: 'fp3a', label: 'Negotiate to 30-day terms (standard position)' },
      { id: 'fp3b', label: 'Accept 45-day terms with late payment interest (within fallback)' },
    ],
  },
  {
    id: 'fp4', areaId: 'confidentiality', areaLabel: 'Confidentiality', severity: 'medium',
    summary: 'Post-termination survival is 2 years; your standard is 5 years, fallback accepts 3 years.',
    detail: 'Your standard position requires post-termination confidentiality obligations to survive for 5 years. Your fallback accepts a minimum of 3 years. The counterparty draft specifies a 2-year survival period, which falls below your fallback position. Recommend negotiating up to at least 3 years to preserve your minimum acceptable position.',
    actions: [
      { id: 'fp4a', label: 'Require 5-year survival (standard position)' },
      { id: 'fp4b', label: 'Accept 3-year survival as minimum (fallback position)' },
    ],
  },
  {
    id: 'fp5', areaId: 'ip-ownership', areaLabel: 'IP Ownership', severity: 'medium',
    summary: 'IP assignment covers foreground IP only; your standard includes background IP licence.',
    detail: 'Your standard position requires an assignment of all foreground IP and a broad licence of background IP used in deliverables. Your fallback accepts foreground assignment only, provided a non-exclusive background licence is granted. The counterparty draft assigns foreground IP but is silent on background IP, which sits at the boundary of your fallback. A background licence carve-out should be requested.',
    actions: [
      { id: 'fp5a', label: 'Add background IP licence (standard position)' },
      { id: 'fp5b', label: 'Accept foreground-only assignment with retained background rights (fallback)' },
    ],
  },
  {
    id: 'fp6', areaId: 'governing-law', areaLabel: 'Governing Law', severity: 'low',
    summary: 'English law and exclusive English court jurisdiction — within your standard position.',
    detail: 'Your standard and fallback positions both require English governing law. The counterparty draft specifies English law and the exclusive jurisdiction of the courts of England and Wales. This is fully aligned with your standard position. No negotiation required on this point.',
  },
  {
    id: 'fp7', areaId: 'dispute-resolution', areaLabel: 'Dispute Resolution', severity: 'low',
    summary: 'Counterparty accepts LCIA arbitration — within your standard position.',
    detail: 'Your standard position specifies LCIA arbitration in London with a sole arbitrator for disputes below £250k and a three-member panel above. The counterparty draft mirrors this mechanism in full. This is aligned with your standard position and requires no amendment.',
  },
]

// Used by Coverage & Completeness
export const coverageFindings: Finding[] = [
  {
    id: 'c1', areaId: 'dispute-resolution', areaLabel: 'Dispute Resolution', severity: 'high',
    summary: 'No dispute resolution mechanism found in the document.',
    detail: 'The document contains no clause specifying how disputes between the parties should be resolved. Without an express mechanism, parties default to court litigation, which may be slower and more expensive than arbitration or mediation. A dispute resolution clause is strongly recommended for any commercial agreement.',
    actions: [
      { id: 'c1a', label: 'Insert ICC arbitration clause (London seat)' },
      { id: 'c1b', label: 'Add exclusive English court jurisdiction clause' },
    ],
  },
  {
    id: 'c2', areaId: 'ip-ownership', areaLabel: 'IP Ownership', severity: 'high',
    summary: 'IP ownership clause is absent; essential for technology and services agreements.',
    detail: 'The document does not address the ownership of intellectual property created under the agreement. This creates significant ambiguity about who owns deliverables, work product, or any software developed during the engagement. An IP clause covering both foreground and background rights is strongly recommended.',
    actions: [
      { id: 'c2a', label: 'Add IP schedule with foreground and background rights split' },
      { id: 'c2b', label: 'Add a simple work-for-hire assignment of all created IP' },
    ],
  },
  {
    id: 'c3', areaId: 'force-majeure', areaLabel: 'Force Majeure', severity: 'medium',
    summary: 'Force majeure clause present but limited — does not cover public health emergencies.',
    detail: 'The document includes a force majeure clause using a generic "events beyond reasonable control" formulation. Post-pandemic market practice now typically includes explicit reference to public health emergencies, government-mandated closures, and supply chain disruptions. The current drafting may be insufficient to cover these scenarios.',
    actions: [
      { id: 'c3a', label: 'Update to include public health emergencies and supply chain disruptions' },
      { id: 'c3b', label: 'Keep current generic formulation with a non-exhaustive list added' },
    ],
  },
  {
    id: 'c4', areaId: 'payment-terms', areaLabel: 'Payment Terms', severity: 'low',
    summary: 'Payment terms are present and clearly defined.',
    detail: 'The document includes a payment clause specifying the invoice cycle, payment due date, and accepted payment methods. The terms are clearly drafted and consistent with commercial practice. No gaps identified in this area.',
  },
  {
    id: 'c5', areaId: 'governing-law', areaLabel: 'Governing Law', severity: 'low',
    summary: 'Governing law specified — English law, courts of England and Wales.',
    detail: 'The document includes a governing law and jurisdiction clause selecting English law and the exclusive jurisdiction of the courts of England and Wales. This is clearly drafted and appropriate for a commercial agreement between UK-based parties.',
  },
  {
    id: 'c6', areaId: 'confidentiality', areaLabel: 'Confidentiality', severity: 'low',
    summary: 'Confidentiality clause present with standard mutual obligations.',
    detail: 'The document includes a mutual confidentiality clause covering both parties\' obligations. The definition of confidential information is reasonably broad, and the clause includes standard carve-outs for publicly available information and legally compelled disclosure. Post-termination survival period is two years, which is on the shorter end for sensitive arrangements.',
  },
]
