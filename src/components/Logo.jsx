export default function Logo({ className = 'h-8 w-auto text-white sm:h-10' }) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 font-heading font-bold leading-none tracking-[-0.02em] select-none ${className}`}
      style={{ fontSize: '2.05rem' }}
      aria-label="Patch4Ever"
    >
      <span>Patch</span>
      <svg
        aria-hidden="true"
        className="mx-0.5 h-[0.95em] w-[0.95em] shrink-0 text-accent"
        viewBox="203.43 0 74.74 74.75"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="m240.8 0c-20.64 0-37.37 16.73-37.37 37.37s16.73 37.37 37.37 37.37 37.37-16.73 37.37-37.37-16.73-37.37-37.37-37.37zm2.89 69.61c-.95.08-1.91.14-2.89.14-17.85 0-32.37-14.52-32.37-32.37 0-8.65 3.37-16.78 9.48-22.89s13.91-9.33 22.36-9.47l-22.99 40.18v10.33h26.41v14.09zm0-24.06h-15.07l15.07-27.83zm12.43 20.34v-10.36h6.48v-9.98h-6.48v-36.69c10.15 5.47 17.06 16.2 17.06 28.51s-6.91 23.04-17.06 28.51z"
          className="fill-current"
        />
      </svg>
      <span>Ever</span>
    </span>
  )
}
