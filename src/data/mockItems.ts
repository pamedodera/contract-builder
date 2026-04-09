import type { ContractItem } from '../types/contract'

export const mockItems: ContractItem[] = [
  {
    id: '1',
    type: 'clause',
    title: 'Limitation of Liability',
    preview:
      'In no event shall either party be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with this agreement.',
    source: 'company',
  },
  {
    id: '2',
    type: 'definition',
    title: 'Affiliate',
    preview:
      '"Affiliate" means any entity that directly or indirectly controls, is controlled by, or is under common control with a party to this agreement.',
    source: 'company',
  },
  {
    id: '3',
    type: 'clause',
    title: 'Governing Law',
    preview:
      'This agreement shall be governed by and construed in accordance with the laws of England and Wales, without regard to its conflict of law provisions.',
    source: 'personal',
  },
  {
    id: '4',
    type: 'clause',
    title: 'Confidentiality',
    preview:
      'Each party agrees to keep confidential all non-public information disclosed by the other party and to use such information solely for the purposes of this agreement.',
    source: 'personal',
  },
  {
    id: '5',
    type: 'definition',
    title: 'Intellectual Property',
    preview:
      '"Intellectual Property" means all patents, trademarks, copyrights, trade secrets, and other proprietary rights, whether registered or unregistered.',
    source: 'company',
  },
  {
    id: '6',
    type: 'clause',
    title: 'Force Majeure',
    preview:
      'Neither party shall be in breach of this agreement to the extent that performance of obligations is prevented by circumstances beyond its reasonable control.',
    source: 'personal',
  },
  {
    id: '7',
    type: 'definition',
    title: 'Confidential Information',
    preview:
      '"Confidential Information" means all information disclosed by one party to the other that is designated as confidential or that reasonably should be understood to be confidential.',
    source: 'personal',
  },
  {
    id: '8',
    type: 'clause',
    title: 'Entire Agreement',
    preview:
      'This agreement constitutes the entire agreement between the parties with respect to its subject matter and supersedes all prior agreements, representations, and understandings.',
    source: 'company',
  },
  {
    id: '9',
    type: 'clause',
    title: 'Dispute Resolution',
    preview:
      'Any dispute arising out of or in connection with this agreement shall be referred to and finally resolved by arbitration under the LCIA Rules.',
    source: 'personal',
  },
  {
    id: '10',
    type: 'definition',
    title: 'Business Day',
    preview:
      '"Business Day" means any day other than a Saturday, Sunday, or public holiday in England on which banks in London are open for business.',
    source: 'company',
  },
  {
    id: '11',
    type: 'clause',
    title: 'Assignment',
    preview:
      'Neither party may assign or transfer any of its rights or obligations under this agreement without the prior written consent of the other party, not to be unreasonably withheld.',
    source: 'company',
  },
  {
    id: '12',
    type: 'definition',
    title: 'Material Adverse Change',
    preview:
      '"Material Adverse Change" means any event, circumstance, or change that has had, or is reasonably likely to have, a material adverse effect on the business or financial condition of a party.',
    source: 'personal',
  },
]

export const aiSuggestedItems: ContractItem[] = [
  {
    id: 'ai-1',
    type: 'clause',
    title: 'Data Protection',
    preview:
      'Each party shall comply with applicable data protection legislation and shall process personal data only in accordance with the other party\'s documented instructions.',
    source: 'ai',
  },
  {
    id: 'ai-2',
    type: 'definition',
    title: 'Processing',
    preview:
      '"Processing" has the meaning given to it in the UK GDPR, and "process" and "processed" shall be construed accordingly.',
    source: 'ai',
  },
]
