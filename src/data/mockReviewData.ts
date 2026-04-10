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
    summary: 'Your draft uses 30-day payment terms; the precedent specifies 14 days.',
    detail: 'The precedent document sets a 14-day payment cycle. Your current draft allows 30 days, which is slower than market practice for professional services agreements and could delay cash flow. Both drafts include a 2% per month late payment remedy, so only the payment window needs to be negotiated.',
    actions: [
      { id: 'a1a', label: 'Shorten to 14-day payment cycle (mirror precedent)' },
      { id: 'a1b', label: 'Keep 30-day terms — acceptable given the existing late payment remedy' },
    ],
  },
  {
    id: 'f2', areaId: 'liability-cap', areaLabel: 'Liability Cap', severity: 'high',
    summary: 'Your liability cap is 12 months\' fees; precedent uses 2× annual contract value.',
    detail: 'Your draft caps aggregate liability at the total fees paid in the 12 months preceding the claim. The precedent uses a cap of two times the annual contract value, which provides broader protection in longer-term or high-value engagements where fees paid to date may be low relative to the exposure. Consider whether the 12-month lookback adequately covers your risk profile.',
    actions: [
      { id: 'a2a', label: 'Increase cap to 2× annual contract value (mirror precedent)' },
      { id: 'a2b', label: 'Retain 12-month fees cap — acceptable for shorter engagements' },
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
    summary: 'IP assignment in your draft is conditional on full payment; precedent assigns on creation.',
    detail: 'Your draft assigns intellectual property rights in the Working Materials to the Client "subject to payment in full of all Fees due." The precedent assigns IP on creation unconditionally, reducing the risk of disputes about ownership during the engagement. A conditional assignment could leave the Client without clear title to deliverables if a payment dispute arises mid-project.',
    actions: [
      { id: 'a5a', label: 'Remove the payment condition — assign IP on creation (mirror precedent)' },
      { id: 'a5b', label: 'Keep payment condition but add an interim licence pending full payment' },
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
    summary: 'Force majeure definitions are aligned; both include pandemic and supply chain events.',
    detail: 'Both your draft and the precedent explicitly include public health emergencies, pandemic events, and supply chain disruptions in the force majeure definition. The definitions are substantively equivalent. One minor difference: the precedent includes "cyber incidents and IT infrastructure failure" as a named trigger, which your draft does not. This is worth considering for technology-dependent engagements.',
  },
  {
    id: 'f8', areaId: 'dispute-resolution', areaLabel: 'Dispute Resolution', severity: 'medium',
    summary: 'Your draft uses LCIA arbitration; the precedent specifies ICC — both are valid but diverge.',
    detail: 'Your draft specifies LCIA arbitration in London, while the precedent uses ICC arbitration. Both are internationally recognised, but ICC awards are generally considered to have stronger global enforceability under the New York Convention and may be preferred if the counterparty operates across multiple jurisdictions. The arbitrator tier thresholds (sole arbitrator below £500k, three-member panel above) are consistent between both drafts.',
    actions: [
      { id: 'a8a', label: 'Switch to ICC arbitration (mirror precedent — broader international enforceability)' },
      { id: 'a8b', label: 'Retain LCIA — preferred for London-seated disputes between UK-based parties' },
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
    id: 'c1', areaId: 'dispute-resolution', areaLabel: 'Dispute Resolution', severity: 'low',
    summary: 'LCIA arbitration clause present — well-drafted with tiered tribunal provisions.',
    detail: 'The document includes a comprehensive dispute resolution clause (clause 10) providing for a mandatory senior representative negotiation phase (20 Business Days) before referral to LCIA arbitration. The clause correctly tiers the tribunal by dispute value: sole arbitrator below £500,000 and a three-member panel above. The seat and language are both specified. No gaps identified.',
  },
  {
    id: 'c2', areaId: 'ip-ownership', areaLabel: 'IP Ownership', severity: 'low',
    summary: 'IP ownership comprehensively covered — foreground assignment and background IP licence both present.',
    detail: 'Clause 4 addresses IP ownership in full. Working Materials (foreground IP) are assigned to the Client upon payment in full (clause 4.1). Pre-existing IP is retained by the Service Provider, with a non-exclusive royalty-free irrevocable licence granted to the Client to the extent needed to use the deliverables (clause 4.2). Both parties give IP warranties at clause 4.4. No gaps identified.',
  },
  {
    id: 'c3', areaId: 'force-majeure', areaLabel: 'Force Majeure', severity: 'low',
    summary: 'Force majeure clause present with modern broad definition including pandemic and supply chain events.',
    detail: 'The force majeure definition in clause 1 explicitly includes acts of God, fire, flood, earthquake, governmental action, public health emergencies, pandemic, epidemic, and supply chain disruption. This reflects post-pandemic market practice. Clause 7 also includes notification obligations, a mitigation duty, and a 90-day termination right. No gaps identified.',
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

// Used by Proof Issues (document consistency and proofing errors)
export const proofFindings: Finding[] = [
  {
    id: 'pf1', areaId: 'schedules', areaLabel: 'Missing Schedule', severity: 'high',
    summary: 'Schedule 1 (scope of Services) is referenced in the definitions but not yet attached.',
    detail: 'The definition of "Services" in clause 1 and the definition of "Working Materials" both refer to Schedule 1 as the document setting out the scope of services. Schedule 1 is not currently attached. Without it, the scope of the Service Provider\'s obligations is undefined, rendering the agreement commercially incomplete and potentially unenforceable as to its core subject matter.',
    actions: [
      { id: 'pf1a', label: 'Attach a completed Schedule 1 defining the scope of Services' },
      { id: 'pf1b', label: 'Add a placeholder Schedule 1 with a note to complete before signing' },
    ],
  },
  {
    id: 'pf2', areaId: 'schedules', areaLabel: 'Missing Schedule', severity: 'high',
    summary: 'Schedule 2 (Fees) is referenced in the definitions but has not been attached.',
    detail: 'The definition of "Fees" in clause 1 states that fees are "as set out in Schedule 2." Schedule 2 is not currently attached to the document. Without it, the Client\'s payment obligation lacks a defined amount, making clause 3 (Fees and Payment) unenforceable. The agreement should not be executed until Schedule 2 is completed and attached.',
    actions: [
      { id: 'pf2a', label: 'Attach a completed Schedule 2 setting out the Fees' },
      { id: 'pf2b', label: 'Add a placeholder Schedule 2 with a note to complete before signing' },
    ],
  },
  {
    id: 'pf3', areaId: 'cross-references', areaLabel: 'Broken Cross-Reference', severity: 'medium',
    summary: 'Clause 8.3 lists surviving clauses as "4, 5, 6, 9, and 10" — clause 7 (Force Majeure) is omitted.',
    detail: 'Clause 8.3(b) specifies that clauses 4, 5, 6, 9, and 10 survive termination. It is likely that clause 7 (Force Majeure) was also intended to survive, as the 90-day termination right in clause 7.3 arises precisely in the context of the agreement ending. The omission of clause 7 from the survival list may be a drafting oversight.',
    actions: [
      { id: 'pf3a', label: 'Add clause 7 to the survival list in clause 8.3(b)' },
      { id: 'pf3b', label: 'Confirm clause 7 intentionally excluded from survival — leave as is' },
    ],
  },
  {
    id: 'pf4', areaId: 'party-names', areaLabel: 'Inconsistent Party Reference', severity: 'medium',
    summary: 'Clause 4.2 uses "Pre-existing IP" without defining it in clause 1 (Definitions).',
    detail: 'Clause 4.2 introduces and uses the term "Pre-existing IP" as a defined term (it appears in quotation marks), but no definition of "Pre-existing IP" appears in clause 1 (Definitions). The term is explained descriptively in clause 4.2 itself, but for consistency and to avoid ambiguity, it should be added to the definitions section.',
    actions: [
      { id: 'pf4a', label: 'Add "Pre-existing IP" as a defined term in clause 1 (Definitions)' },
      { id: 'pf4b', label: 'Remove quotation marks from "Pre-existing IP" in clause 4.2 to treat as descriptive, not defined' },
    ],
  },
  {
    id: 'pf5', areaId: 'dates', areaLabel: 'Date Placeholder', severity: 'low',
    summary: 'The agreement date is stated as 1 April 2024 but the signature block fields are blank.',
    detail: 'The parties block sets the date of the agreement as 1 April 2024. The signature block does not yet contain executed signatures or countersigned dates. If the agreement is signed on a date different from 1 April 2024, the date in the parties block should be updated to match the actual date of execution to avoid any uncertainty about when the agreement became binding.',
    actions: [
      { id: 'pf5a', label: 'Update the parties block date to match the actual execution date' },
      { id: 'pf5b', label: 'Confirm 1 April 2024 as the agreed commencement date and retain' },
    ],
  },
  {
    id: 'pf6', areaId: 'numbering', areaLabel: 'Defined Term Mismatch', severity: 'low',
    summary: '"Nexus Advisory Partners" used informally in the background recitals without defined term capitalisation.',
    detail: 'The background recital A refers to "the Service Provider" in full, but recital B uses "the Services" correctly capitalised. However, the parties block defines the supplying party as "Nexus Advisory Partners LLP" with the defined label "the Service Provider". The recitals are consistent, but a reviewer may note that the short-form "Nexus Advisory Partners" appears uncapitalised in some email correspondence attached to the file.',
  },
]

// Used by Cascade Issues (changes with knock-on effects in other clauses)
export const cascadeFindings: Finding[] = [
  {
    id: 'cf1', areaId: 'party-names', areaLabel: 'Party Name Change', severity: 'high',
    summary: 'Renaming "Nexus Advisory Partners LLP" to "Nexus Advisory Group LLP" affects 18 instances across 8 sections.',
    detail: 'The Service Provider has notified that their firm has rebranded from "Nexus Advisory Partners LLP" to "Nexus Advisory Group LLP" following a merger. This change affects 18 instances across the parties block, recitals, clauses 4, 5, 8, 11, the definitions section, and the signature block. A global find-and-replace is required. The new registered name should be verified against Companies House records before the amendment is executed.',
    actions: [
      { id: 'cf1a', label: 'Apply global rename to "Nexus Advisory Group LLP" across all 18 instances' },
    ],
  },
  {
    id: 'cf2', areaId: 'liability-cap', areaLabel: 'Liability Cap Cascade', severity: 'high',
    summary: 'Changing the liability cap from 12 months\' fees to a fixed £250k conflicts with the risk profile in clause 4.1.',
    detail: 'A proposed amendment would replace the rolling 12-month fees cap in clause 6.2 with a fixed £250,000 ceiling. This creates an internal inconsistency with clause 4.1, which assigns all intellectual property in the Working Materials to the Client. If a deliverable causes significant loss, a £250,000 cap may be materially below the value of IP assigned. Both provisions should be reviewed together to ensure the commercial logic is preserved.',
    actions: [
      { id: 'cf2a', label: 'Retain the 12-month rolling fees cap — proportionate to engagement value' },
      { id: 'cf2b', label: 'Adopt £250k fixed cap but add an IP carve-out for high-value deliverables' },
    ],
  },
  {
    id: 'cf3', areaId: 'payment-terms', areaLabel: 'Payment Term Cascade', severity: 'medium',
    summary: 'Extending payment terms to 45 days requires updating the late interest trigger in clause 3.3.',
    detail: 'Clause 3.3 calculates late payment interest from "the Payment Due Date" which is defined in clause 3.1 as 30 days from invoice. Extending the payment period to 45 days in clause 3.1 without updating the defined "Payment Due Date" in clause 3.3 would mean interest begins accruing on day 30, a full 15 days before payment is formally overdue. Clause 3.3 must be updated in tandem.',
    actions: [
      { id: 'cf3a', label: 'Update clause 3.3 Payment Due Date reference to 45 days' },
    ],
  },
  {
    id: 'cf4', areaId: 'confidentiality', areaLabel: 'Confidentiality Period Conflict', severity: 'medium',
    summary: 'Extending confidentiality survival from 2 to 5 years may conflict with individual employee obligations.',
    detail: 'The post-termination confidentiality obligation in clause 5.3 currently survives for 2 years. A proposed extension to 5 years may create tension with the Service Provider\'s standard employee contracts, which typically cap post-employment confidentiality obligations at 2 years in line with employment law guidance on restrictive covenants. The Service Provider\'s employment counsel should confirm that a 5-year entity-level obligation can be backed by equivalent individual obligations before this amendment is agreed.',
    actions: [
      { id: 'cf4a', label: 'Extend to 5 years — subject to Service Provider confirming employee coverage' },
      { id: 'cf4b', label: 'Retain 2-year survival period to avoid downstream HR complications' },
    ],
  },
  {
    id: 'cf5', areaId: 'governing-law', areaLabel: 'Governing Law Cascade', severity: 'low',
    summary: 'Changing jurisdiction to non-exclusive Irish courts conflicts with the LCIA arbitration clause in clause 10.2.',
    detail: 'The counterparty has requested that clause 9.2 be amended to reference the courts of Ireland (non-exclusive) to accommodate their Dublin entity. However, clause 10.2 specifies London as the seat of LCIA arbitration. If governing law is changed to Irish law, the procedural law of arbitration should also be reviewed, and the LCIA clause may need to be updated to specify whether the Arbitration Act 2010 (Ireland) or the English Arbitration Act 1996 applies to the arbitral proceedings.',
    actions: [
      { id: 'cf5a', label: 'Retain English law and London LCIA seat — request counterparty use English entity' },
      { id: 'cf5b', label: 'Amend to Irish governing law and update arbitration clause accordingly' },
    ],
  },
]
