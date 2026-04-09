export const AGREEMENT_TYPES = [
  'NDA',
  'Service Agreement',
  'Employment',
  'Shareholders',
  'Loan Agreement',
] as const

export type AgreementType = (typeof AGREEMENT_TYPES)[number]

// agreement type → item IDs to suggest (from mockItems)
export const suggestionMap: Record<AgreementType, string[]> = {
  'NDA':               ['4', '7', '3', '8'],   // Confidentiality, Conf. Info, Governing Law, Entire Agreement
  'Service Agreement': ['1', '3', '9', '6'],   // Limitation of Liability, Governing Law, Dispute Resolution, Force Majeure
  'Employment':        ['3', '11', '8', '9'],  // Governing Law, Assignment, Entire Agreement, Dispute Resolution
  'Shareholders':      ['2', '5', '8', '12'],  // Affiliate, IP, Entire Agreement, MAC
  'Loan Agreement':    ['3', '8', '12', '6'],  // Governing Law, Entire Agreement, MAC, Force Majeure
}

// canned AI responses — reference agreement type + how many items are in draft
export const chatResponses: Record<AgreementType | 'default', (draftCount: number) => string> = {
  'NDA': (n) =>
    `For an NDA${n ? ` — looking at your ${n} selected item${n > 1 ? 's' : ''}` : ''} — I'd also recommend adding a **Non-Solicitation** clause and a **Term & Termination** clause to define how long the confidentiality obligations last.`,
  'Service Agreement': (n) =>
    `Your selection${n ? ` of ${n} item${n > 1 ? 's' : ''}` : ''} is a solid foundation. A **Service Level Agreement** clause and an **Intellectual Property Assignment** clause would strengthen this further.`,
  'Employment': (n) =>
    `Good progress${n ? ` with ${n} item${n > 1 ? 's' : ''}` : ''}. For an employment contract I'd suggest adding a **Non-Compete** clause and a **Garden Leave** provision to protect the employer during the notice period.`,
  'Shareholders': (n) =>
    `For a shareholders agreement${n ? ` (${n} item${n > 1 ? 's' : ''} so far)` : ''}, consider adding **Drag-Along** and **Tag-Along** rights, and a **Pre-emption on Transfer** clause.`,
  'Loan Agreement': (n) =>
    `This looks solid${n ? ` with ${n} item${n > 1 ? 's' : ''}` : ''}. You may want to add a **Representations & Warranties** clause and an **Events of Default** clause to protect the lender.`,
  'default': (n) =>
    `Based on what you've added${n ? ` (${n} item${n > 1 ? 's' : ''})` : ''}, I can give more targeted suggestions once you select the agreement type above.`,
}
