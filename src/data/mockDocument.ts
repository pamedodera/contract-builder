// ─── Types ────────────────────────────────────────────────────────────────────

export type PlainNode = { type: 'text'; text: string }
export type TermNode  = { type: 'term'; termId: string; text: string }
export type InlineNode = PlainNode | TermNode
export type RichText = InlineNode[]

export type ParagraphBlock  = { type: 'paragraph'; content: RichText }
export type NumberedClause  = { type: 'clause'; number: string; content: RichText; subclauses?: NumberedClause[] }
export type DefinitionEntry = { type: 'definition'; termId: string; term: string; content: RichText }

export type SectionBlock = ParagraphBlock | NumberedClause | DefinitionEntry

export type DocumentBlock =
  | { type: 'title'; text: string }
  | { type: 'parties'; client: string; clientDesc: string; provider: string; providerDesc: string; date: string }
  | { type: 'recitals'; items: RichText[] }
  | { type: 'section'; id: string; number: string; title: string; blocks: SectionBlock[] }
  | { type: 'signature-block'; client: string; provider: string }

export interface ContractDocument {
  title: string
  ref: string
  definitions: Record<string, string>
  blocks: DocumentBlock[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const t = (text: string): PlainNode => ({ type: 'text', text })
const d = (termId: string, text: string): TermNode => ({ type: 'term', termId, text })

// ─── Document ─────────────────────────────────────────────────────────────────

export const mockDocument: ContractDocument = {
  title: 'PROFESSIONAL SERVICES AGREEMENT',
  ref: 'NAP-MCG-2024-001',
  definitions: {
    'agreement': 'Agreement',
    'business-day': 'Business Day',
    'commencement-date': 'Commencement Date',
    'confidential-information': 'Confidential Information',
    'fees': 'Fees',
    'force-majeure-event': 'Force Majeure Event',
    'intellectual-property-rights': 'Intellectual Property Rights',
    'services': 'Services',
    'term': 'Term',
    'working-materials': 'Working Materials',
  },
  blocks: [
    {
      type: 'title',
      text: 'PROFESSIONAL SERVICES AGREEMENT',
    },
    {
      type: 'parties',
      date: '1 April 2024',
      client: 'Meridian Capital Group Ltd',
      clientDesc: 'a company incorporated in England and Wales (Company No. 04821963), whose registered office is at 14 Bishopsgate, London EC2N 4AJ ("the Client")',
      provider: 'Nexus Advisory Partners LLP',
      providerDesc: 'a limited liability partnership registered in England and Wales (OC Number: OC389201), whose registered office is at 3 Aldgate Square, London EC3A 1AX ("the Service Provider")',
    },
    {
      type: 'recitals',
      items: [
        [t('The Service Provider carries on business as a provider of financial and strategic advisory services.')],
        [t('The Client wishes to engage the Service Provider to provide the '), d('services', 'Services'), t(' on the terms of this '), d('agreement', 'Agreement'), t('.')],
        [t('The parties have agreed to enter into this '), d('agreement', 'Agreement'), t(' to record the terms of that engagement.')],
      ],
    },

    // ── Section 1: Definitions ─────────────────────────────────────────────────
    {
      type: 'section',
      id: 'definitions',
      number: '1',
      title: 'Definitions',
      blocks: [
        {
          type: 'paragraph',
          content: [t('In this Agreement, the following expressions have the following meanings unless the context requires otherwise:')],
        },
        {
          type: 'definition',
          termId: 'agreement',
          term: 'Agreement',
          content: [t('this Professional Services Agreement together with all Schedules and any written amendments agreed between the parties.')],
        },
        {
          type: 'definition',
          termId: 'business-day',
          term: 'Business Day',
          content: [t('a day other than Saturday, Sunday, or a public holiday in England and Wales on which clearing banks in the City of London are open for business.')],
        },
        {
          type: 'definition',
          termId: 'commencement-date',
          term: 'Commencement Date',
          content: [t('1 April 2024.')],
        },
        {
          type: 'definition',
          termId: 'confidential-information',
          term: 'Confidential Information',
          content: [t('any information disclosed by one party to the other (whether before or after the date of this '), d('agreement', 'Agreement'), t(') that is designated as confidential or that ought reasonably to be understood as confidential given the nature of the information and the circumstances of disclosure, including business plans, client data, financial information, pricing, and technical know-how.')],
        },
        {
          type: 'definition',
          termId: 'fees',
          term: 'Fees',
          content: [t('the fees payable by the Client to the Service Provider as set out in Schedule 2, as may be varied by written agreement between the parties from time to time.')],
        },
        {
          type: 'definition',
          termId: 'force-majeure-event',
          term: 'Force Majeure Event',
          content: [t('any circumstance beyond a party\'s reasonable control, including acts of God, fire, flood, earthquake, governmental action or regulation, public health emergencies, pandemic, epidemic, or supply chain disruption.')],
        },
        {
          type: 'definition',
          termId: 'intellectual-property-rights',
          term: 'Intellectual Property Rights',
          content: [t('patents, copyright, trade marks, design rights, database rights, rights in confidential information, and all other intellectual or industrial property rights wherever in the world subsisting, whether registered or unregistered, together with all applications and rights to apply for any of the foregoing.')],
        },
        {
          type: 'definition',
          termId: 'services',
          term: 'Services',
          content: [t('the financial advisory and professional services described in Schedule 1, as may be varied by written agreement between the parties.')],
        },
        {
          type: 'definition',
          termId: 'term',
          term: 'Term',
          content: [t('the period beginning on the '), d('commencement-date', 'Commencement Date'), t(' and ending on termination of this '), d('agreement', 'Agreement'), t(' in accordance with clause 8.')],
        },
        {
          type: 'definition',
          termId: 'working-materials',
          term: 'Working Materials',
          content: [t('all documents, reports, data, models, analyses, presentations and other materials created by the Service Provider specifically in the course of performing the '), d('services', 'Services'), t(' under this '), d('agreement', 'Agreement'), t('.')],
        },
      ],
    },

    // ── Section 2: Services ────────────────────────────────────────────────────
    {
      type: 'section',
      id: 'services',
      number: '2',
      title: 'Services',
      blocks: [
        {
          type: 'clause',
          number: '2.1',
          content: [t('The Service Provider shall perform the '), d('services', 'Services'), t(' with reasonable skill and care during the '), d('term', 'Term'), t(' and in accordance with all applicable laws and regulations.')],
        },
        {
          type: 'clause',
          number: '2.2',
          content: [t('The Service Provider shall allocate a named engagement lead and such qualified personnel as are reasonably necessary for the performance of the '), d('services', 'Services'), t('. The Service Provider may substitute personnel provided that any replacement is of equivalent experience and seniority.')],
        },
        {
          type: 'clause',
          number: '2.3',
          content: [t('The Client shall provide the Service Provider with timely access to its relevant personnel, data, systems, and premises, and such cooperation as is reasonably necessary to enable the Service Provider to perform the '), d('services', 'Services'), t('. The Client acknowledges that any delay in providing such access or cooperation may affect the Service Provider\'s ability to meet agreed timescales.')],
        },
        {
          type: 'clause',
          number: '2.4',
          content: [t('Any material change to the scope of '), d('services', 'Services'), t(' shall be agreed in writing by the parties and may result in an adjustment to the '), d('fees', 'Fees'), t(' and timetable.')],
        },
      ],
    },

    // ── Section 3: Fees and Payment ────────────────────────────────────────────
    {
      type: 'section',
      id: 'payment-terms',
      number: '3',
      title: 'Fees and Payment',
      blocks: [
        {
          type: 'clause',
          number: '3.1',
          content: [t('The Client shall pay the '), d('fees', 'Fees'), t(' within 30 days of receipt of a valid invoice from the Service Provider (the "Payment Due Date").')],
        },
        {
          type: 'clause',
          number: '3.2',
          content: [t('The Service Provider shall issue invoices on the first '), d('business-day', 'Business Day'), t(' of each calendar month in respect of '), d('services', 'Services'), t(' performed during the preceding calendar month.')],
        },
        {
          type: 'clause',
          number: '3.3',
          content: [t('Without prejudice to any other right or remedy, where any sum remains unpaid after the Payment Due Date, interest shall accrue on the outstanding amount at the rate of 2 per cent per month, compounding monthly, from the Payment Due Date until the date of actual payment in full.')],
        },
        {
          type: 'clause',
          number: '3.4',
          content: [t('All '), d('fees', 'Fees'), t(' are stated exclusive of value added tax. Where value added tax is chargeable, it shall be charged additionally at the prevailing rate and shall be payable by the Client against receipt of a valid VAT invoice.')],
        },
        {
          type: 'clause',
          number: '3.5',
          content: [t('The Service Provider shall be entitled to reasonable reimbursement of out-of-pocket expenses properly and necessarily incurred in the performance of the '), d('services', 'Services'), t(', provided that such expenses are pre-approved in writing by the Client and supported by appropriate receipts.')],
        },
      ],
    },

    // ── Section 4: Intellectual Property ──────────────────────────────────────
    {
      type: 'section',
      id: 'ip-ownership',
      number: '4',
      title: 'Intellectual Property',
      blocks: [
        {
          type: 'clause',
          number: '4.1',
          content: [t('Subject to clause 4.2 and full payment of all '), d('fees', 'Fees'), t(' due under this '), d('agreement', 'Agreement'), t(', all '), d('intellectual-property-rights', 'Intellectual Property Rights'), t(' in the '), d('working-materials', 'Working Materials'), t(' shall upon creation vest in and be assigned absolutely to the Client.')],
        },
        {
          type: 'clause',
          number: '4.2',
          content: [t('The Service Provider retains all '), d('intellectual-property-rights', 'Intellectual Property Rights'), t(' in its pre-existing methodologies, tools, frameworks, templates and know-how not created specifically for or under this '), d('agreement', 'Agreement'), t(' ("Pre-existing IP"). The Service Provider hereby grants the Client a non-exclusive, royalty-free, irrevocable licence to use the Pre-existing IP solely to the extent incorporated in or necessary to derive benefit from the '), d('working-materials', 'Working Materials'), t('.')],
        },
        {
          type: 'clause',
          number: '4.3',
          content: [t('Each party shall execute such documents and take such further steps as the other party may reasonably require to perfect the assignments and licences contemplated by this clause 4, at the requesting party\'s cost.')],
        },
        {
          type: 'clause',
          number: '4.4',
          content: [t('Each party warrants to the other that it owns or has the right to use all '), d('intellectual-property-rights', 'Intellectual Property Rights'), t(' in materials it provides to the other party in connection with this '), d('agreement', 'Agreement'), t(', and that such use will not infringe the rights of any third party.')],
        },
      ],
    },

    // ── Section 5: Confidentiality ─────────────────────────────────────────────
    {
      type: 'section',
      id: 'confidentiality',
      number: '5',
      title: 'Confidentiality',
      blocks: [
        {
          type: 'clause',
          number: '5.1',
          content: [t('Each party undertakes to keep confidential and not to disclose the other party\'s '), d('confidential-information', 'Confidential Information'), t(' to any person, except those of its employees, officers, agents and professional advisers who need to know such '), d('confidential-information', 'Confidential Information'), t(' for the purposes of performing its obligations under this '), d('agreement', 'Agreement'), t(', and who are bound by equivalent obligations of confidentiality.')],
        },
        {
          type: 'clause',
          number: '5.2',
          content: [t('The obligations in clause 5.1 shall not apply to '), d('confidential-information', 'Confidential Information'), t(' that:')],
          subclauses: [
            { type: 'clause', number: '(a)', content: [t('is or becomes publicly known other than through any act or omission of the receiving party;')] },
            { type: 'clause', number: '(b)', content: [t('was in the receiving party\'s lawful possession before the disclosure;')] },
            { type: 'clause', number: '(c)', content: [t('is independently developed by the receiving party without reference to the disclosing party\'s '), d('confidential-information', 'Confidential Information'), t('; or')] },
            { type: 'clause', number: '(d)', content: [t('the receiving party is required to disclose by law, regulation, or order of a competent authority, provided that (where practicable and lawful) the receiving party gives prior written notice to the disclosing party.')] },
          ],
        },
        {
          type: 'clause',
          number: '5.3',
          content: [t('The obligations in this clause 5 shall survive termination of this '), d('agreement', 'Agreement'), t(' for a period of two years from the date of termination.')],
        },
      ],
    },

    // ── Section 6: Limitation of Liability ────────────────────────────────────
    {
      type: 'section',
      id: 'liability-cap',
      number: '6',
      title: 'Limitation of Liability',
      blocks: [
        {
          type: 'clause',
          number: '6.1',
          content: [t('Neither party shall be liable to the other for any indirect, special or consequential loss or damage, including loss of profits, loss of revenue, loss of anticipated savings, loss of business, loss of goodwill, or loss or corruption of data, howsoever arising under or in connection with this '), d('agreement', 'Agreement'), t(', whether in contract, tort (including negligence), or otherwise.')],
        },
        {
          type: 'clause',
          number: '6.2',
          content: [t('Subject to clause 6.3, each party\'s aggregate liability to the other under or in connection with this '), d('agreement', 'Agreement'), t(', whether in contract, tort (including negligence), or otherwise, shall not exceed the total '), d('fees', 'Fees'), t(' paid or payable under this '), d('agreement', 'Agreement'), t(' in the twelve months preceding the event or series of connected events giving rise to the claim.')],
        },
        {
          type: 'clause',
          number: '6.3',
          content: [t('Nothing in this '), d('agreement', 'Agreement'), t(' shall limit or exclude either party\'s liability for death or personal injury caused by its negligence, fraud or fraudulent misrepresentation, or any other liability that cannot be lawfully excluded or limited.')],
        },
      ],
    },

    // ── Section 7: Force Majeure ───────────────────────────────────────────────
    {
      type: 'section',
      id: 'force-majeure',
      number: '7',
      title: 'Force Majeure',
      blocks: [
        {
          type: 'clause',
          number: '7.1',
          content: [t('A party shall not be in breach of this '), d('agreement', 'Agreement'), t(' or otherwise liable for any failure or delay in performing its obligations to the extent that such failure or delay is caused by a '), d('force-majeure-event', 'Force Majeure Event'), t(', provided that the affected party notifies the other party in writing as soon as reasonably practicable.')],
        },
        {
          type: 'clause',
          number: '7.2',
          content: [t('The affected party shall use all reasonable endeavours to mitigate the effect of the '), d('force-majeure-event', 'Force Majeure Event'), t(' on the performance of its obligations and to resume performance as soon as reasonably practicable after the '), d('force-majeure-event', 'Force Majeure Event'), t(' ceases.')],
        },
        {
          type: 'clause',
          number: '7.3',
          content: [t('If a '), d('force-majeure-event', 'Force Majeure Event'), t(' prevents a party from performing its material obligations under this '), d('agreement', 'Agreement'), t(' for a continuous period in excess of 90 days, either party may terminate this '), d('agreement', 'Agreement'), t(' by giving 14 days\' written notice to the other, without liability to the other party.')],
        },
      ],
    },

    // ── Section 8: Termination ─────────────────────────────────────────────────
    {
      type: 'section',
      id: 'termination',
      number: '8',
      title: 'Termination',
      blocks: [
        {
          type: 'clause',
          number: '8.1',
          content: [t('Either party may terminate this '), d('agreement', 'Agreement'), t(' for convenience by giving not less than 30 days\' written notice to the other party.')],
        },
        {
          type: 'clause',
          number: '8.2',
          content: [t('Either party may terminate this '), d('agreement', 'Agreement'), t(' with immediate effect by written notice if:')],
          subclauses: [
            {
              type: 'clause',
              number: '(a)',
              content: [t('the other party commits a material breach of this '), d('agreement', 'Agreement'), t(' and (where that breach is capable of remedy) fails to remedy it within 15 '), d('business-day', 'Business Days'), t(' of receiving written notice requiring it to do so; or')],
            },
            {
              type: 'clause',
              number: '(b)',
              content: [t('the other party becomes insolvent, enters into administration, is wound up, makes a composition or arrangement with its creditors, or has a receiver or administrator appointed over all or part of its assets.')],
            },
          ],
        },
        {
          type: 'clause',
          number: '8.3',
          content: [t('On termination of this '), d('agreement', 'Agreement'), t(' for any reason: (a) the Client shall promptly pay all '), d('fees', 'Fees'), t(' accrued up to and including the date of termination; and (b) clauses 4, 5, 6, 9, and 10 shall survive termination and continue in full force and effect.')],
        },
        {
          type: 'clause',
          number: '8.4',
          content: [t('Termination of this '), d('agreement', 'Agreement'), t(' shall not affect any rights or remedies that have accrued to either party prior to the date of termination.')],
        },
      ],
    },

    // ── Section 9: Governing Law ───────────────────────────────────────────────
    {
      type: 'section',
      id: 'governing-law',
      number: '9',
      title: 'Governing Law',
      blocks: [
        {
          type: 'clause',
          number: '9.1',
          content: [t('This '), d('agreement', 'Agreement'), t(' and any dispute or claim (including non-contractual disputes or claims) arising out of or in connection with it or its subject matter or formation shall be governed by and construed in accordance with the law of England and Wales.')],
        },
        {
          type: 'clause',
          number: '9.2',
          content: [t('Each party irrevocably agrees that the courts of England and Wales shall have non-exclusive jurisdiction to settle any dispute or claim (including non-contractual disputes or claims) arising out of or in connection with this '), d('agreement', 'Agreement'), t(' or its subject matter or formation.')],
        },
      ],
    },

    // ── Section 10: Dispute Resolution ────────────────────────────────────────
    {
      type: 'section',
      id: 'dispute-resolution',
      number: '10',
      title: 'Dispute Resolution',
      blocks: [
        {
          type: 'clause',
          number: '10.1',
          content: [t('If any dispute arises between the parties in connection with this '), d('agreement', 'Agreement'), t(', the parties shall attempt to resolve it by good faith negotiation between their respective senior representatives within 20 '), d('business-day', 'Business Days'), t(' of one party giving written notice to the other identifying the nature of the dispute.')],
        },
        {
          type: 'clause',
          number: '10.2',
          content: [t('If the dispute is not resolved pursuant to clause 10.1 within the time stated, either party may refer the dispute to arbitration administered by the London Court of International Arbitration (LCIA) under its rules from time to time in force. The seat of arbitration shall be London. The language of the arbitral proceedings shall be English. Disputes with a value below £500,000 shall be determined by a sole arbitrator; disputes at or above £500,000 shall be determined by a tribunal of three arbitrators.')],
        },
        {
          type: 'clause',
          number: '10.3',
          content: [t('Nothing in this clause 10 shall prevent either party from seeking urgent injunctive or other interim relief from any court of competent jurisdiction.')],
        },
      ],
    },

    // ── Section 11: General ────────────────────────────────────────────────────
    {
      type: 'section',
      id: 'general',
      number: '11',
      title: 'General',
      blocks: [
        {
          type: 'clause',
          number: '11.1',
          content: [t('Entire Agreement. This '), d('agreement', 'Agreement'), t(' constitutes the entire agreement between the parties relating to its subject matter and supersedes all prior negotiations, representations, warranties, understandings and agreements between the parties in relation to that subject matter. Each party acknowledges that in entering into this '), d('agreement', 'Agreement'), t(' it has not relied on any representation or warranty not expressly set out in it.')],
        },
        {
          type: 'clause',
          number: '11.2',
          content: [t('Variation. No amendment or variation of this '), d('agreement', 'Agreement'), t(' shall be effective unless it is in writing and signed by the duly authorised representatives of both parties.')],
        },
        {
          type: 'clause',
          number: '11.3',
          content: [t('Notices. Any notice given under this '), d('agreement', 'Agreement'), t(' shall be in writing and shall be delivered by hand, sent by pre-paid first class post, or sent by email with read-receipt confirmation to the address of the relevant party as specified in this '), d('agreement', 'Agreement'), t('. Notices shall be deemed received: (a) if delivered by hand, on the date of delivery; (b) if sent by post, two '), d('business-day', 'Business Days'), t(' after the date of posting; or (c) if sent by email, at the time of transmission.')],
        },
        {
          type: 'clause',
          number: '11.4',
          content: [t('Severance. If any provision or part-provision of this '), d('agreement', 'Agreement'), t(' is or becomes invalid, illegal or unenforceable, it shall be deemed deleted, but that shall not affect the validity and enforceability of the rest of this '), d('agreement', 'Agreement'), t('. The parties shall negotiate in good faith to replace any deleted provision with a valid provision that achieves, as nearly as possible, the same commercial effect.')],
        },
        {
          type: 'clause',
          number: '11.5',
          content: [t('Counterparts. This '), d('agreement', 'Agreement'), t(' may be executed in any number of counterparts, each of which when executed shall constitute an original, and all counterparts together shall constitute one and the same instrument. A counterpart executed by electronic signature shall be as effective as a counterpart executed by hand.')],
        },
        {
          type: 'clause',
          number: '11.6',
          content: [t('No Partnership. Nothing in this '), d('agreement', 'Agreement'), t(' is intended to, or shall be deemed to, establish any partnership or joint venture between any of the parties, constitute any party the agent of another party, or authorise any party to make or enter into any commitments on behalf of any other party.')],
        },
        {
          type: 'clause',
          number: '11.7',
          content: [t('Third Party Rights. This '), d('agreement', 'Agreement'), t(' does not give rise to any rights under the Contracts (Rights of Third Parties) Act 1999 to enforce any term of this '), d('agreement', 'Agreement'), t('.')],
        },
      ],
    },

    // ── Signature Block ────────────────────────────────────────────────────────
    {
      type: 'signature-block',
      client: 'Meridian Capital Group Ltd',
      provider: 'Nexus Advisory Partners LLP',
    },
  ],
}
