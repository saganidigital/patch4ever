import { Link } from 'react-router-dom'

export default function SplitPillCTA({ size = 'md', className = '' }) {
  const isCompact = size === 'sm'
  const outerRing = isCompact
    ? 'inline-flex items-stretch rounded-full bg-white/15 p-1 shadow-md'
    : 'inline-flex items-stretch rounded-full bg-white/15 p-1 shadow-lg ring-1 ring-white/25'

  const leftPad = isCompact ? 'pl-4 pr-6 py-1.5 text-sm' : 'pl-6 pr-8 py-2 text-lg sm:text-xl'
  const rightPad = isCompact ? 'pl-6 pr-4 py-1.5 text-sm' : 'pl-8 pr-6 py-2 text-lg sm:text-xl'
  const orSize = isCompact ? 'size-7 text-[11px]' : 'size-9 text-xs sm:text-sm'

  return (
    <div className={`relative inline-flex items-center ${outerRing} ${className}`}>
      <Link
        to="/make-your-own-patches"
        title="Order Now: Start Your Custom Patch Project"
        className={`cursor-pointer rounded-l-full bg-accent font-heading font-black uppercase tracking-wide text-white no-underline transition hover:bg-accent-600 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white ${leftPad}`}
      >
        ORDER NOW
      </Link>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-1/2 z-10 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent-400 font-heading font-black uppercase text-white ring-4 ring-white/45 shadow-sm ${orSize}`}
      >
        OR
      </span>
      <Link
        to="/quote"
        title="Get a Proof: Personalize Your Patch and Receive a Custom Estimate"
        className={`cursor-pointer rounded-r-full bg-primary font-heading font-black uppercase tracking-wide text-white no-underline transition hover:bg-primary-600 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white ${rightPad}`}
      >
        GET A PROOF
      </Link>
    </div>
  )
}
