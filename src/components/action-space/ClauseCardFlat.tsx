export function ClauseCardFlat({ showRedline = true }: { showRedline?: boolean }) {
  return (
    <div className="text-foreground text-[16px] leading-[26px] flex flex-col gap-4 px-3 py-3">

      {/* Clause title + source link */}
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold leading-[22px]">Letters of Credit – Authorisation</span>
        <a
          href="#"
          className="text-[12px] text-primary leading-[16px] underline underline-offset-2 hover:opacity-80 transition-opacity w-fit"
        >
          Facility Agreement, Clause 7.1
        </a>
      </div>

      {/* Contract text */}
      <div className="flex flex-col gap-3">
        <p>
          <span>
            {'(a) Each Borrower irrevocably and unconditionally authorises the Issuing Bank to pay any claim made or purported to be made under a Letter of Credit requested by it (or requested by the Parent on its behalf) '}
          </span>
          {showRedline && (
            <span className="line-through text-[#f9221a]">
              and which appears on its face to be in order
            </span>
          )}
          {showRedline && <span>{' '}</span>}
          <span className={showRedline ? 'underline text-[#267d7d]' : ''}>
            provided that such claim strictly complies with the terms and conditions of the relevant Letter of Credit and the Issuing Bank is not aware of manifest fraud in relation to such claim
          </span>
          <span>{" (in this Clause\u200f\u00a07, a \u2018claim\u2019)."}</span>
        </p>
        <p>
          {'(b) The Issuing Bank shall, as soon as reasonably practicable after receiving a claim, provide notice of such claim to the relevant Borrower and the Agent. The relevant Borrower shall not be entitled to require the Issuing Bank to investigate the validity of any claim or to take any action in connection with the relevant Letter of Credit other than as expressly set out in this Agreement.'}
        </p>
        <p>
          {'(c) Each Borrower shall reimburse the Issuing Bank on demand for any amount paid by the Issuing Bank under or in connection with a Letter of Credit requested by it (or requested by the Parent on its behalf), together with interest on such amount at the rate and for the period determined in accordance with Clause\u200f\u00a08 ('}
          <span className="italic">Interest on Letter of Credit reimbursement amounts</span>
          {').'}
        </p>
        <p>
          {'(d) The obligations of each Borrower under this Clause\u200f\u00a07 are absolute and unconditional and shall not be affected by any circumstance whatsoever, including any amendment, extension or waiver of or in respect of any Letter of Credit, any failure or delay in making demand under any Letter of Credit, or the existence of any dispute between any party to this Agreement and any beneficiary of a Letter of Credit.'}
        </p>
      </div>

    </div>
  )
}
