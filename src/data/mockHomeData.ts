export interface DocItem {
  id: string
  label: string
  text: string
}

export interface PrecedentAlternative {
  id: string
  sourceDoc: string
  sourceDate: string
  text: string
  whyItWorks: string
}

export interface UndefinedTerm {
  term: string
  definition: string
  source: 'library' | 'ai'
  sourceDoc?: string
}

export const undefinedTermsByAlternative: Record<string, UndefinedTerm[]> = {
  'cl1-a': [
    {
      term: 'Consequential Loss',
      definition: 'any loss of profits, loss of revenue, loss of data, loss of goodwill, or indirect or special loss of any kind, howsoever arising and whether or not foreseeable.',
      source: 'ai',
    },
  ],
  'cl1-c': [
    {
      term: 'Wilful Misconduct',
      definition: 'an intentional act or omission carried out with knowledge of, or reckless disregard for, the likely adverse consequences of such act or omission.',
      source: 'library',
      sourceDoc: 'Clifford Chance NDA 2024',
    },
  ],
  'cl2-b': [
    {
      term: 'Initial Term',
      definition: 'the period of [●] months commencing on the Effective Date, as specified in the Order Form.',
      source: 'ai',
    },
  ],
  'cl3-a': [
    {
      term: 'Public Health Emergency',
      definition: 'any epidemic, pandemic, outbreak of infectious disease or other public health crisis declared by a competent governmental or international authority, including the World Health Organisation.',
      source: 'ai',
    },
    {
      term: 'Supply Chain Disruption',
      definition: 'any material interruption to the supply of goods, materials or services required for performance of this Agreement, caused by circumstances beyond the affected party\'s reasonable control.',
      source: 'ai',
    },
  ],
  'cl5-a': [
    {
      term: 'Foreground IP',
      definition: 'all intellectual property rights created, developed or first reduced to practice by or on behalf of the Service Provider specifically in the course of performing the Services under this Agreement.',
      source: 'library',
      sourceDoc: 'Linklaters Employment Framework',
    },
    {
      term: 'Background IP',
      definition: 'all intellectual property rights owned or controlled by a party prior to the Effective Date or developed by that party independently of and without reference to this Agreement.',
      source: 'library',
      sourceDoc: 'Linklaters Employment Framework',
    },
  ],
  'def2-a': [
    {
      term: 'Disclosing Party',
      definition: 'the party disclosing its Confidential Information to the other party pursuant to this Agreement.',
      source: 'library',
      sourceDoc: 'My NDA Template',
    },
    {
      term: 'Receiving Party',
      definition: 'the party receiving Confidential Information from the Disclosing Party pursuant to this Agreement.',
      source: 'library',
      sourceDoc: 'My NDA Template',
    },
  ],
  'def4-a': [
    {
      term: 'Utility Models',
      definition: 'registered rights in technical innovations that, like patents, confer exclusive rights over an invention but are typically granted with less stringent examination requirements and for a shorter duration.',
      source: 'ai',
    },
  ],
}

export const mockClauses: DocItem[] = [
  {
    id: 'cl1',
    label: 'Limitation of Liability',
    text: 'Neither party shall be liable to the other for any indirect or consequential loss arising out of or in connection with this Agreement.',
  },
  {
    id: 'cl2',
    label: 'Termination for Convenience',
    text: 'Either party may terminate this Agreement at any time on 30 days\' written notice to the other party.',
  },
  {
    id: 'cl3',
    label: 'Force Majeure',
    text: 'Neither party shall be in breach of this Agreement or liable for any failure or delay in performance of its obligations to the extent caused by events beyond its reasonable control.',
  },
  {
    id: 'cl4',
    label: 'Confidentiality',
    text: 'Each party agrees to keep confidential all information received from the other party and not to disclose it to any third party without prior written consent.',
  },
  {
    id: 'cl5',
    label: 'Intellectual Property',
    text: 'All intellectual property rights in any materials created by the Service Provider in the performance of the Services shall vest in the Client upon payment of all fees.',
  },
]

export const mockDefinitions: DocItem[] = [
  {
    id: 'def1',
    label: 'Business Day',
    text: 'a day other than Saturday or Sunday on which banks are open for business in the City of London.',
  },
  {
    id: 'def2',
    label: 'Confidential Information',
    text: 'any information disclosed by one party to the other that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information.',
  },
  {
    id: 'def3',
    label: 'Intellectual Property Rights',
    text: 'patents, rights to inventions, copyright and related rights, trade marks, trade names and domain names, rights in get-up, goodwill and the right to sue for passing off, and all other intellectual property rights.',
  },
  {
    id: 'def4',
    label: 'Services',
    text: 'the services to be provided by the Service Provider as more particularly described in Schedule 1 to this Agreement.',
  },
]

export const precedentAlternatives: Record<string, PrecedentAlternative[]> = {
  cl1: [
    {
      id: 'cl1-a',
      sourceDoc: 'Clifford Chance NDA 2024',
      sourceDate: '12 Mar 2024',
      text: 'In no event shall either party be liable for any loss of profits, loss of revenue, loss of data, or any indirect, special, incidental or consequential damages, whether arising in contract, tort or otherwise, even if advised of the possibility of such damages.',
      whyItWorks: 'Explicitly enumerates the excluded loss types (profits, revenue, data), reducing ambiguity about what "consequential" covers. Suitable where you want a clear, comprehensive exclusion list.',
    },
    {
      id: 'cl1-b',
      sourceDoc: 'Allen & Overy Service Agreement Template',
      sourceDate: '5 Jan 2024',
      text: 'Each party\'s total aggregate liability under or in connection with this Agreement, whether in contract, tort (including negligence) or otherwise, shall not exceed the total fees paid or payable in the 12 months preceding the event giving rise to the claim.',
      whyItWorks: 'Pairs the exclusion with a financial cap tied to contract value. A strong market-standard formulation that provides mutual protection and a predictable ceiling for both parties.',
    },
    {
      id: 'cl1-c',
      sourceDoc: 'Norton Rose Loan Facility Agreement',
      sourceDate: '14 Jun 2023',
      text: 'Neither party excludes or limits its liability for death or personal injury caused by negligence, fraud or fraudulent misrepresentation, or any other liability which cannot be excluded by law. Subject to the foregoing, neither party shall be liable for any indirect or consequential loss.',
      whyItWorks: 'Includes mandatory carve-outs for non-excludable liability before the general exclusion. Best practice for enforceability — courts are less likely to strike down a limitation clause that expressly preserves statutory rights.',
    },
  ],
  cl2: [
    {
      id: 'cl2-a',
      sourceDoc: 'Standard Service Agreement',
      sourceDate: '15 Dec 2023',
      text: 'Either party may terminate this Agreement for convenience on not less than 60 days\' written notice, provided that any work in progress shall be completed and paid for in full before the termination date.',
      whyItWorks: 'Extends the notice period to 60 days and includes a work-in-progress protection clause. Preferred for longer-term service engagements where an abrupt exit would leave work incomplete.',
    },
    {
      id: 'cl2-b',
      sourceDoc: 'Freshfields Shareholders Agreement v3',
      sourceDate: '8 Sep 2023',
      text: 'The Client may terminate this Agreement on 30 days\' written notice. The Service Provider may not terminate for convenience during the Initial Term. After the Initial Term, the Service Provider may terminate on 60 days\' written notice.',
      whyItWorks: 'Provides asymmetric termination rights: the client can exit more easily while the supplier is locked in for the initial period. Useful when the client wants flexibility but needs the supplier committed.',
    },
  ],
  cl3: [
    {
      id: 'cl3-a',
      sourceDoc: 'My NDA Template',
      sourceDate: '1 Feb 2024',
      text: 'A party shall not be in breach of this Agreement if its failure to perform is caused by circumstances beyond its reasonable control, including acts of God, governmental action, public health emergencies, pandemic, supply chain disruption, or industrial action.',
      whyItWorks: 'Post-pandemic formulation that explicitly includes public health emergencies and supply chain disruption. More comprehensive than pre-2020 precedents and reflects current market expectation.',
    },
    {
      id: 'cl3-b',
      sourceDoc: 'Allen & Overy Service Agreement Template',
      sourceDate: '5 Jan 2024',
      text: 'If a party is prevented from or delayed in performing its obligations by force majeure, it must notify the other party promptly. If the force majeure event continues for more than 90 days, either party may terminate by written notice without liability.',
      whyItWorks: 'Adds a long-stop termination right after 90 days of sustained force majeure. Provides an exit mechanism for prolonged disruption, which pure force majeure clauses often lack.',
    },
  ],
  cl4: [
    {
      id: 'cl4-a',
      sourceDoc: 'Clifford Chance NDA 2024',
      sourceDate: '12 Mar 2024',
      text: 'Each party shall: (a) keep the other party\'s Confidential Information strictly confidential; (b) not disclose it to any person except those who need to know it to perform this Agreement; and (c) ensure that each person to whom it is disclosed is aware of and complies with the obligations in this clause.',
      whyItWorks: 'Structured as an enumerated list with a "need to know" standard and downstream compliance obligation. Cleaner drafting that clearly flows the obligation to sub-recipients.',
    },
    {
      id: 'cl4-b',
      sourceDoc: 'Standard Service Agreement',
      sourceDate: '15 Dec 2023',
      text: 'The confidentiality obligations in this clause shall survive termination of this Agreement for a period of 5 years, except in respect of trade secrets, which shall be protected indefinitely.',
      whyItWorks: 'Includes an indefinite protection period for trade secrets, which a fixed-term clause would leave unprotected after expiry. Best practice for agreements covering genuinely sensitive commercial information.',
    },
  ],
  cl5: [
    {
      id: 'cl5-a',
      sourceDoc: 'Linklaters Employment Framework',
      sourceDate: '20 Nov 2023',
      text: 'All intellectual property created by the Service Provider in the performance of the Services ("Foreground IP") shall, upon creation, automatically vest in and be assigned to the Client. The Service Provider retains ownership of all pre-existing intellectual property ("Background IP") and grants the Client a non-exclusive licence to use Background IP to the extent necessary to use the Foreground IP.',
      whyItWorks: 'Distinguishes foreground IP (assigned to client) from background IP (licensed). This is the market standard for professional services agreements and avoids disputes about what was "pre-existing" at the time of delivery.',
    },
    {
      id: 'cl5-b',
      sourceDoc: 'Precedent Loan Agreement',
      sourceDate: '22 Aug 2023',
      text: 'The Service Provider grants the Client a perpetual, irrevocable, royalty-free, non-exclusive licence to use any intellectual property developed under this Agreement. Ownership shall remain with the Service Provider.',
      whyItWorks: 'Retains IP ownership with the supplier while giving the client broad usage rights. Preferred in technology engagements where the supplier wants to reuse components across multiple clients.',
    },
  ],
  def1: [
    {
      id: 'def1-a',
      sourceDoc: 'Allen & Overy Service Agreement Template',
      sourceDate: '5 Jan 2024',
      text: 'a day (other than a Saturday, Sunday or public holiday in England and Wales) when banks in London are open for business.',
      whyItWorks: 'Explicitly excludes public holidays in addition to weekends. A cleaner formulation that avoids ambiguity on bank holidays, which can matter in payment and notice clause timing.',
    },
    {
      id: 'def1-b',
      sourceDoc: 'Clifford Chance NDA 2024',
      sourceDate: '12 Mar 2024',
      text: 'any day other than a Saturday, Sunday or a day on which banks are authorised or required by law to be closed in the place where a relevant payment or notice is to be made or given.',
      whyItWorks: 'Ties the definition to the location of the payment or notice rather than a fixed jurisdiction. More flexible for cross-border agreements where both parties may be in different jurisdictions.',
    },
  ],
  def2: [
    {
      id: 'def2-a',
      sourceDoc: 'My NDA Template',
      sourceDate: '1 Feb 2024',
      text: 'all information disclosed by the Disclosing Party to the Receiving Party in connection with this Agreement, whether disclosed orally, in writing, electronically or by any other means, including but not limited to technical, financial, commercial, operational and strategic information.',
      whyItWorks: 'Broad, catch-all definition covering all mediums of disclosure. Best for NDAs where the parties intend to share information across multiple formats and want maximum protection.',
    },
    {
      id: 'def2-b',
      sourceDoc: 'Linklaters Employment Framework',
      sourceDate: '20 Nov 2023',
      text: 'information that is: (a) marked as "confidential" or "proprietary" at the time of disclosure; or (b) disclosed orally and identified as confidential at the time of disclosure and confirmed in writing within 5 Business Days; but excludes information that is in the public domain through no breach of this Agreement.',
      whyItWorks: 'Requires marking or notice for information to be protected. Narrower and easier to administer than a broad definition — useful where the parties want to be intentional about what they protect.',
    },
  ],
  def3: [
    {
      id: 'def3-a',
      sourceDoc: 'Standard Service Agreement',
      sourceDate: '15 Dec 2023',
      text: 'the services described in Schedule 1, together with any additional services agreed in writing by the parties from time to time.',
      whyItWorks: 'Includes a mechanism for expanding scope by agreement. More flexible than a closed definition — avoids the need to amend the main agreement each time the scope is varied.',
    },
    {
      id: 'def3-b',
      sourceDoc: 'Allen & Overy Service Agreement Template',
      sourceDate: '5 Jan 2024',
      text: 'the services set out in Schedule 1 (Scope of Services), as may be amended by a written change order signed by both parties.',
      whyItWorks: 'Explicitly requires a signed change order for scope amendments. Stronger governance than a general "agreed in writing" formulation — reduces the risk of scope creep and disputed variations.',
    },
  ],
  def4: [
    {
      id: 'def4-a',
      sourceDoc: 'Clifford Chance NDA 2024',
      sourceDate: '12 Mar 2024',
      text: 'all intellectual property rights wherever in the world arising, whether registered or unregistered (and including applications for registration), including patents, utility models, trade marks, service marks, trade names, domain names, copyrights, database rights, design rights, rights in confidential information and know-how.',
      whyItWorks: 'Comprehensive enumerated list covering registered and unregistered rights globally. The gold standard formulation for agreements where IP ownership is material to the commercial deal.',
    },
    {
      id: 'def4-b',
      sourceDoc: 'Standard Service Agreement',
      sourceDate: '15 Dec 2023',
      text: 'patents, copyright, trade marks, design rights and any other intellectual property rights of any nature in any jurisdiction.',
      whyItWorks: 'A shorter, less exhaustive formulation that covers the main categories without over-engineering. Suitable for straightforward commercial agreements where a lengthy IP definition would be disproportionate.',
    },
  ],
}

export type GapType = 'Placeholders' | 'Bracketed text' | 'Comments' | 'Underlining' | 'Underscoring' | 'Highlighting'

export const gapTypeList: GapType[] = [
  'Placeholders',
  'Bracketed text',
  'Comments',
  'Underlining',
  'Underscoring',
  'Highlighting',
]

export interface Gap {
  id: string
  type: GapType
  clauseRef: string
  text: string
  suggestedFix: string
}

export const mockGaps: Gap[] = [
  {
    id: 'g1',
    type: 'Placeholders',
    clauseRef: 'Clause 1.1',
    text: '[INSERT FULL LEGAL NAME OF PARTY]',
    suggestedFix: 'Insert the full registered legal name of the contracting party as it appears on the company register.',
  },
  {
    id: 'g2',
    type: 'Bracketed text',
    clauseRef: 'Clause 3.1',
    text: '[●] days after the date of invoice',
    suggestedFix: 'Specify the payment period. Market standard for professional services is 30 days; consider 14 days for smaller engagements.',
  },
  {
    id: 'g3',
    type: 'Placeholders',
    clauseRef: 'Recitals',
    text: '[DATE]',
    suggestedFix: 'Insert the agreement commencement date. Ensure this matches the date in the signature block.',
  },
  {
    id: 'g4',
    type: 'Bracketed text',
    clauseRef: 'Clause 5.2',
    text: '[AMOUNT] or [X]% of total fees',
    suggestedFix: 'Specify the maximum aggregate liability cap. Typically set at 100–200% of total fees paid in the preceding 12 months.',
  },
  {
    id: 'g5',
    type: 'Comments',
    clauseRef: 'Clause 8.1',
    text: 'TODO: confirm with legal whether mutual indemnity is acceptable',
    suggestedFix: 'Resolve internal comment and finalise the indemnity position before sending to counterparty.',
  },
  {
    id: 'g6',
    type: 'Bracketed text',
    clauseRef: 'Schedule 1',
    text: '[INSERT DETAILED DESCRIPTION OF SERVICES]',
    suggestedFix: 'Add a sufficiently detailed description of services to Schedule 1. Vague scope descriptions are a common source of disputes.',
  },
  {
    id: 'g7',
    type: 'Highlighting',
    clauseRef: 'Clause 12.3',
    text: 'Highlighted — data retention period pending GDPR review',
    suggestedFix: 'Confirm the data retention period with your DPO and insert a specific duration (e.g., 6 years from the end of the engagement).',
  },
  {
    id: 'g8',
    type: 'Placeholders',
    clauseRef: 'Signature Block',
    text: '[AUTHORISED SIGNATORY NAME AND TITLE]',
    suggestedFix: 'Insert the name and title of the authorised signatory. Confirm they have authority to bind the company to this agreement.',
  },
  {
    id: 'g9',
    type: 'Bracketed text',
    clauseRef: 'Clause 10.3',
    text: '[X] years after termination',
    suggestedFix: 'Insert the post-termination confidentiality period. Standard range is 2–5 years; 5 years is recommended for sensitive commercial arrangements.',
  },
  {
    id: 'g10',
    type: 'Comments',
    clauseRef: 'Clause 14.2',
    text: 'NB: check whether arbitration seat needs to be updated if governing law changes',
    suggestedFix: 'Review the arbitration seat in light of the agreed governing law and update if required (e.g., New York seat for New York governing law).',
  },
]
