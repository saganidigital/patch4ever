import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react'
import Logo from './Logo'
import FooterPaw from './FooterPaw'
import { ASSETS } from '../data/assets'
import { CONTACT, FOOTER_LINKS } from '../data/siteData'

export default function Footer() {
  const footerRef = useRef(null)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <div className="relative z-10">
      {/* Bright Orange Newsletter Signup Bar */}
      <section className="bg-accent-600 py-5 text-white shadow-inner">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 px-4 sm:flex-row sm:gap-6">
          <h2 className="font-heading text-2xl font-black tracking-tight text-white sm:text-3xl">
            Sign up to get BIG DISCOUNTS!
          </h2>

          {subscribed ? (
            <div className="rounded-lg bg-primary-800 px-5 py-2.5 text-sm font-bold text-white shadow">
              Thanks for subscribing! Watch your inbox for exclusive patch discounts.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md items-stretch overflow-hidden rounded-lg bg-white shadow-md">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="min-w-0 flex-1 bg-white px-4 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex cursor-pointer items-center gap-2 bg-primary-600 px-5 py-2.5 font-heading text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-primary-700"
              >
                <Send className="size-4" />
                SIGN UP
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Diagonal Merrow Stitch Trim */}
      <div className="footer-merrow" aria-hidden="true" />

      {/* Main Deep Teal Footer */}
      <footer ref={footerRef} className="site-footer relative w-full select-none bg-primary-800 text-white dark:bg-primary-950">
        <FooterPaw footerRef={footerRef} />
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-12">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
            {/* Brand & Contact */}
            <div className="lg:col-span-4">
              <Link to="/" aria-label="Homepage" className="inline-block">
                <Logo className="h-9 w-auto text-white" />
              </Link>
              <p className="mt-2 text-sm font-semibold text-primary-100">
                Custom patches at incredibly low prices!
              </p>

              <ul className="mt-5 space-y-2.5 text-sm text-white/90">
                <li>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="inline-flex items-center gap-2.5 text-white no-underline hover:text-accent-300"
                  >
                    <Mail className="size-4 shrink-0 text-white/80" />
                    <span>{CONTACT.email}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={CONTACT.phoneHref}
                    className="inline-flex items-center gap-2.5 text-white no-underline hover:text-accent-300"
                  >
                    <Phone className="size-4 shrink-0 text-white/80" />
                    <span>{CONTACT.phone}</span>
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="size-4 shrink-0 text-white/80" />
                  <span>{CONTACT.hours}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-white/80" />
                  <span>{CONTACT.address}</span>
                </li>
              </ul>
            </div>

            {/* ADDITIONAL LINKS */}
            <nav aria-label="Additional Links" className="lg:col-span-3">
              <h3 className="mb-3 font-heading text-sm font-bold uppercase tracking-wider text-white">
                ADDITIONAL LINKS
              </h3>
              <ul className="space-y-2 text-sm">
                {FOOTER_LINKS.additional.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="text-primary-100 no-underline underline-offset-4 hover:text-white hover:underline hover:decoration-accent-400"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* ABOUT */}
            <nav aria-label="About" className="lg:col-span-2">
              <h3 className="mb-3 font-heading text-sm font-bold uppercase tracking-wider text-white">
                ABOUT
              </h3>
              <ul className="space-y-2 text-sm">
                {FOOTER_LINKS.about.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="text-primary-100 no-underline underline-offset-4 hover:text-white hover:underline hover:decoration-accent-400"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* HELP */}
            <nav aria-label="Help" className="lg:col-span-2">
              <h3 className="mb-3 font-heading text-sm font-bold uppercase tracking-wider text-white">
                HELP
              </h3>
              <ul className="space-y-2 text-sm">
                {FOOTER_LINKS.help.map((item) => (
                  <li key={item.href}>
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-100 no-underline underline-offset-4 hover:text-white hover:underline hover:decoration-accent-400"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        to={item.href}
                        className="text-primary-100 no-underline underline-offset-4 hover:text-white hover:underline hover:decoration-accent-400"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Social Icons */}
            <div className="flex items-start gap-3 lg:col-span-1 lg:justify-end">
              <a
                href="https://www.facebook.com/Patches4Less"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="grid size-8 place-items-center rounded-full bg-white text-primary-800 transition hover:bg-accent hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
                  <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.6V4.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V11H7.7v3h2.6v8h3.2z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/patches4less"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid size-8 place-items-center rounded-lg text-white transition hover:text-accent-300"
              >
                <svg viewBox="0 0 24 24" className="size-6 stroke-current fill-none" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@Patches4Less"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Youtube"
                className="grid size-8 place-items-center text-white transition hover:text-accent-300"
              >
                <svg viewBox="0 0 24 24" className="size-6 fill-current" aria-hidden="true">
                  <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.2 5 12 5 12 5h0s-4.2 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5C2 14.4 2.2 16 2.2 16s.2 1.4.8 2c.8.8 1.8.8 2.2.9 1.6.1 6.8.1 6.8.1s4.2 0 7-.1c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM9.9 14.6V9.3l5.3 2.7-5.3 2.6z" />
                </svg>
              </a>
              <a
                href="https://x.com/patches4less"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="grid size-8 place-items-center text-white transition hover:text-accent-300"
              >
                <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
                  <path d="M18.2 3h3l-6.6 7.5L22.4 21h-6.1l-4.8-6.3L6 21H3l7-8L2.6 3h6.2l4.3 5.7L18.2 3zm-1.1 16.2h1.7L7.9 4.7H6.1l11 14.5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Divider + Copyright + BBB + Legal */}
          <div className="mt-10 border-t border-white/15 pt-8">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex flex-wrap items-center gap-5">
                <p className="text-xs text-primary-100">
                  Copyright © 2003 - 2026 &nbsp;{' '}
                  <a
                    href="https://www.tjmpromos.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-white no-underline hover:underline"
                  >
                    TJM Promos, Inc.
                  </a>{' '}
                  All Rights Reserved
                </p>
                <a
                  href="https://www.bbb.org/us/fl/ocala/profile/wearable-promotional-products/tjm-promos-inc-0733-225617490#bbbseal"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="TJM Promos, Inc., Wearable Promotional Products, Ocala, FL"
                  className="inline-block rounded bg-white/95 p-0.5 shadow"
                >
                  <img
                    src={ASSETS.bbbSeal}
                    alt="TJM Promos, Inc., Promotional Products, Ocala, FL"
                    className="h-11 w-auto"
                  />
                </a>
              </div>

              <div className="flex items-center gap-5 text-xs">
                <Link to="/policies/terms-and-conditions" className="text-primary-100 no-underline hover:text-white hover:underline">
                  Terms &amp; Conditions
                </Link>
                <Link to="/policies/privacy-policy" className="text-primary-100 no-underline hover:text-white hover:underline">
                  Privacy Policy
                </Link>
              </div>
            </div>

            <div className="mt-6 space-y-2 text-[11px] leading-relaxed text-primary-200/85">
              <p>
                All symbols, logos, and slogans depicted on this site are registered trademarks of their respective owners. By submitting designs to TJM Promos, Inc., the purchasing party warrants that they have or have had the legal right to reproduce or have reproduced any logo or other image associated with their order. Images on this site are samples used for illustrative purposes only and are not for sale.
              </p>
              <p>† Free shipping is only throughout the continental United States</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
