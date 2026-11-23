import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ChevronDown,
  ChevronRight,
  Home,
  Mail,
  Menu,
  Moon,
  Phone,
  ShoppingCart,
  Sun,
  X,
  Zap,
} from 'lucide-react'
import Logo from './Logo'
import SplitPillCTA from './SplitPillCTA'
import StyleIcon from './StyleIcon'
import { CONTACT, EXPLORE_LINKS, PATCH_TYPES, STYLE_CATEGORIES } from '../data/siteData'

export default function Header({ darkMode, onToggleDark, cartCount, onOpenCart }) {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const [activeMenu, setActiveMenu] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mobileAccordion, setMobileAccordion] = useState('PRODUCTS')
  const closeTimerRef = useRef(null)

  useEffect(() => {
    setActiveMenu(null)
    setDrawerOpen(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 520)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openMenu = (name) => {
    clearTimeout(closeTimerRef.current)
    setActiveMenu(name)
  }

  const scheduleClose = () => {
    clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => setActiveMenu(null), 150)
  }

  return (
    <>
      <header className={`relative z-30 select-none ${isHome ? '' : 'bg-primary-900'}`}>
        {/* Top Utility Bar (44px) */}
        <section className="relative z-20 bg-white text-sm shadow-sm dark:bg-primary-950">
          <div className="mx-auto flex h-11 max-w-7xl items-center justify-between px-4 sm:px-6">
            <nav aria-label="Breadcrumbs" className="flex items-center gap-2">
              <Link
                to="/"
                className="inline-flex size-9 items-center justify-center rounded-md text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-primary-700 dark:text-neutral-300 dark:hover:bg-white/10"
                title="Custom Patches Home"
              >
                <Home className="size-5" />
                <span className="sr-only">Custom Patches</span>
              </Link>
              {!isHome && (
                <span className="hidden items-center gap-1.5 text-xs font-semibold text-neutral-500 sm:flex dark:text-neutral-400">
                  <ChevronRight className="size-3.5" />
                  <span className="capitalize text-primary-700 dark:text-primary-300">
                    {pathname.replace(/^\//, '').replace(/-/g, ' ').replace(/\/$/, '')}
                  </span>
                </span>
              )}
            </nav>

            <nav aria-label="Utility" className="flex items-center gap-1 sm:gap-3">
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-md px-2 text-primary-700 transition-colors hover:bg-neutral-100 dark:text-white dark:hover:bg-white/10"
              >
                <Mail className="size-5 shrink-0" />
                <span className="text-[15px] font-bold max-lg:sr-only">{CONTACT.email}</span>
              </a>

              <a
                href={CONTACT.phoneHref}
                className="inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-md px-2 text-primary-700 transition-colors hover:bg-neutral-100 dark:text-white dark:hover:bg-white/10"
              >
                <Phone className="size-5 shrink-0" />
                <span className="text-[15px] font-bold max-sm:sr-only">{CONTACT.phone}</span>
              </a>

              <button
                type="button"
                onClick={onOpenCart}
                title="View cart"
                className="relative inline-flex size-10 cursor-pointer items-center justify-center rounded-md text-primary-700 transition-colors hover:bg-neutral-100 dark:text-white dark:hover:bg-white/10"
              >
                <ShoppingCart className="size-5" />
                {cartCount > 0 && (
                  <span className="absolute right-0.5 top-0.5 grid min-w-4.5 place-items-center rounded-full bg-accent px-1 text-[11px] font-black leading-4 text-white">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={onToggleDark}
                title={darkMode ? 'Turn on light mode' : 'Turn on dark mode'}
                aria-label={darkMode ? 'Turn on light mode' : 'Turn on dark mode'}
                className="inline-flex size-10 cursor-pointer items-center justify-center rounded-md bg-neutral-100 text-primary-700 transition-colors hover:bg-neutral-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
              >
                {darkMode ? <Moon className="size-5" /> : <Sun className="size-5" />}
              </button>
            </nav>
          </div>
        </section>

        {/* Main Navigation Bar (71px) */}
        <section
          className={`relative z-20 shadow-sm backdrop-blur-sm ${
            isHome ? 'bg-teal-500/10' : 'bg-primary-800/95'
          }`}
        >
          <div className="mx-auto flex h-[71px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
            <Link to="/" className="flex min-h-11 shrink-0 items-center rounded-md" aria-label="Patch4Ever home">
              <Logo className="h-8 w-auto text-white sm:h-10" />
            </Link>

            {/* Desktop Center Links */}
            <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex xl:gap-1">
              {/* PRODUCTS */}
              <div
                className="relative"
                onMouseEnter={() => openMenu('PRODUCTS')}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  onClick={() => setActiveMenu(activeMenu === 'PRODUCTS' ? null : 'PRODUCTS')}
                  aria-expanded={activeMenu === 'PRODUCTS'}
                  className="inline-flex h-11 cursor-pointer items-center gap-1 rounded-md px-3 font-heading text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
                >
                  PRODUCTS <ChevronDown className={`size-4 transition-transform ${activeMenu === 'PRODUCTS' ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* STYLES */}
              <div
                className="relative"
                onMouseEnter={() => openMenu('STYLES')}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  onClick={() => setActiveMenu(activeMenu === 'STYLES' ? null : 'STYLES')}
                  aria-expanded={activeMenu === 'STYLES'}
                  className="inline-flex h-11 cursor-pointer items-center gap-1 rounded-md px-3 font-heading text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
                >
                  STYLES <ChevronDown className={`size-4 transition-transform ${activeMenu === 'STYLES' ? 'rotate-180' : ''}`} />
                </button>
              </div>

              <Link
                to="/options"
                className="inline-flex h-11 items-center rounded-md px-3 font-heading text-base font-bold uppercase tracking-wide text-white no-underline transition-colors hover:bg-white/10"
              >
                OPTIONS
              </Link>

              <Link
                to="/rush-patches"
                className="inline-flex h-11 items-center gap-1.5 rounded-md px-3 font-heading text-base font-bold uppercase tracking-wide text-white no-underline transition-colors hover:bg-white/10"
              >
                <Zap className="size-4 fill-accent text-accent" />
                RUSH PATCHES
              </Link>

              <Link
                to="/pricing"
                className="inline-flex h-11 items-center rounded-md px-3 font-heading text-base font-bold uppercase tracking-wide text-white no-underline transition-colors hover:bg-white/10"
              >
                PRICING
              </Link>

              {/* EXPLORE */}
              <div
                className="relative"
                onMouseEnter={() => openMenu('EXPLORE')}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  onClick={() => setActiveMenu(activeMenu === 'EXPLORE' ? null : 'EXPLORE')}
                  aria-expanded={activeMenu === 'EXPLORE'}
                  className="inline-flex h-11 cursor-pointer items-center gap-1 rounded-md px-3 font-heading text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
                >
                  EXPLORE <ChevronDown className={`size-4 transition-transform ${activeMenu === 'EXPLORE' ? 'rotate-180' : ''}`} />
                </button>

                {activeMenu === 'EXPLORE' && (
                  <div
                    onMouseEnter={() => openMenu('EXPLORE')}
                    onMouseLeave={scheduleClose}
                    className="absolute right-0 top-full z-40 mt-2 w-60 rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-black/10 dark:bg-neutral-900 dark:ring-white/10"
                  >
                    {EXPLORE_LINKS.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="flex min-h-10 items-center rounded-lg px-3 py-1.5 font-heading text-lg leading-tight text-primary-700 no-underline transition-colors hover:bg-primary-50 dark:text-primary-100 dark:hover:bg-white/10"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            <div className="flex items-center gap-2.5">
              <div className="hidden sm:block">
                <SplitPillCTA size="sm" />
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
                className="inline-flex size-11 cursor-pointer items-center justify-center rounded-md border-2 border-white/40 bg-white/5 text-white transition-colors hover:bg-white/15 lg:hidden"
              >
                <Menu className="size-6" />
              </button>
            </div>
          </div>

          {/* Mega Dropdown: PRODUCTS */}
          {activeMenu === 'PRODUCTS' && (
            <div
              onMouseEnter={() => openMenu('PRODUCTS')}
              onMouseLeave={scheduleClose}
              className="absolute inset-x-0 top-full z-40 mx-auto max-w-6xl px-4 pt-2"
            >
              <div className="products-menu-panel rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/10 dark:bg-neutral-900 dark:ring-white/10">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                  {PATCH_TYPES.map((type) => (
                    <Link
                      key={type.id}
                      to={type.href}
                      className="group relative flex flex-col items-center rounded-2xl p-3 text-center no-underline transition-colors hover:bg-primary-50 dark:hover:bg-white/5"
                    >
                      <div className="relative mb-3 w-full">
                        {type.badge && (
                          <span
                            className={`absolute -top-2 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white shadow ${
                              type.badgeTone === 'accent' ? 'bg-accent' : 'bg-primary-600'
                            }`}
                          >
                            {type.badge}
                          </span>
                        )}
                        <div className="mx-auto aspect-square w-28 overflow-hidden rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-primary-200 dark:bg-neutral-800 dark:ring-primary-800">
                          <img src={type.image} alt={type.fullName} className="size-full object-contain transition-transform group-hover:scale-105" />
                        </div>
                        <span className="product-menu-tag">from {type.fromPrice}</span>
                      </div>
                      <span className="mt-2 font-heading text-base font-bold uppercase text-primary-800 dark:text-primary-100">
                        {type.fullName}
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-primary-100 pt-4 dark:border-primary-800">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Starting prices are per patch at the highest quantity tier.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to="/options"
                      className="inline-flex min-h-10 items-center rounded-md px-3 font-heading text-base font-bold uppercase tracking-wide text-primary-700 no-underline hover:bg-primary-50 dark:text-primary-100 dark:hover:bg-white/10"
                    >
                      Backings, borders &amp; more →
                    </Link>
                    <Link
                      to="/pricing"
                      className="inline-flex min-h-10 items-center rounded-md bg-primary-50 px-3 font-heading text-base font-bold uppercase tracking-wide text-primary-700 no-underline hover:bg-primary-100 dark:bg-primary-900 dark:text-primary-100"
                    >
                      Full pricing →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mega Dropdown: STYLES */}
          {activeMenu === 'STYLES' && (
            <div
              onMouseEnter={() => openMenu('STYLES')}
              onMouseLeave={scheduleClose}
              className="absolute inset-x-0 top-full z-40 mx-auto max-w-6xl px-4 pt-2"
            >
              <div className="products-menu-panel rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/10 dark:bg-neutral-900 dark:ring-white/10">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {STYLE_CATEGORIES.map((cat) => (
                    <div key={cat.heading}>
                      <h3 className="mb-2 border-b border-primary-100 pb-1.5 font-heading text-sm font-black uppercase tracking-wider text-accent-600 dark:border-primary-800 dark:text-accent-400">
                        {cat.heading}
                      </h3>
                      <ul className="space-y-1">
                        {cat.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              to={item.href}
                              className="group flex items-start gap-2.5 rounded-lg px-2 py-1.5 no-underline transition-colors hover:bg-primary-50 dark:hover:bg-white/10"
                            >
                              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-200">
                                <StyleIcon name={item.icon} className="size-3.5" />
                              </span>
                              <span>
                                <span className="block text-sm font-bold text-primary-800 group-hover:text-primary-600 dark:text-primary-100">
                                  {item.name}
                                </span>
                                <span className="block text-xs leading-snug text-neutral-500 dark:text-neutral-400">
                                  {item.desc}
                                </span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Rush Patches Announcement Strip (40px) */}
        <Link
          to="/rush-patches"
          className="group relative z-10 flex h-10 items-center justify-center gap-x-2.5 overflow-hidden border-y border-white/15 bg-primary-950/55 px-4 text-sm whitespace-nowrap text-white no-underline backdrop-blur-sm transition-colors hover:bg-primary-950/75"
        >
          <span className="rounded-full bg-accent px-2 py-0.5 font-heading text-[11px] font-black uppercase tracking-wider text-white">
            NEW
          </span>
          <span className="inline-flex items-center gap-1 font-heading text-sm font-bold uppercase tracking-wide text-white">
            <Zap className="size-3.5 fill-accent text-accent" />
            RUSH PATCHES
          </span>
          <span className="hidden text-white/90 sm:inline">Embroidered patches in 5–10 days.</span>
          <span className="font-semibold underline decoration-white/60 underline-offset-4 group-hover:decoration-white">
            See rush options →
          </span>
        </Link>
      </header>

      {/* Sticky Scroll Header */}
      <div
        className={`fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-primary-900/95 shadow-lg shadow-primary-950/30 backdrop-blur-md transition-all duration-200 dark:bg-primary-950/95 ${
          scrolled ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-center" aria-label="Patch4Ever home">
            <Logo className="h-8 w-auto text-white" />
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="hidden md:block">
              <SplitPillCTA size="sm" />
            </div>
            <button
              type="button"
              onClick={onOpenCart}
              title="View cart"
              className="relative inline-flex size-10 cursor-pointer items-center justify-center rounded-md text-white transition-colors hover:bg-white/10"
            >
              <ShoppingCart className="size-5" />
              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 grid min-w-4.5 place-items-center rounded-full bg-accent px-1 text-[11px] font-black leading-4 text-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border-2 border-white/35 bg-white/5 px-3 font-heading text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/15"
            >
              <Menu className="size-4" />
              MENU
            </button>
          </div>
        </div>
      </div>

      {/* Slide-out Menu Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setDrawerOpen(false)} />
          <div className="relative z-10 flex h-full w-full max-w-sm flex-col overflow-y-auto bg-primary-900 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <Logo className="h-8 w-auto text-white" />
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-md text-white/80 hover:bg-white/10"
                aria-label="Close navigation menu"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="my-5 flex justify-center">
              <SplitPillCTA size="sm" />
            </div>

            <nav className="space-y-2">
              <div>
                <button
                  type="button"
                  onClick={() => setMobileAccordion(mobileAccordion === 'PRODUCTS' ? '' : 'PRODUCTS')}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 font-heading text-lg font-bold uppercase hover:bg-white/10"
                >
                  PRODUCTS <ChevronDown className={`size-4 transition ${mobileAccordion === 'PRODUCTS' ? 'rotate-180' : ''}`} />
                </button>
                {mobileAccordion === 'PRODUCTS' && (
                  <div className="mt-1 space-y-1 pl-3">
                    {PATCH_TYPES.map((t) => (
                      <Link
                        key={t.id}
                        to={t.href}
                        className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-primary-100 no-underline hover:bg-white/10"
                      >
                        <span>{t.fullName}</span>
                        <span className="text-xs font-bold text-accent-300">from {t.fromPrice}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setMobileAccordion(mobileAccordion === 'STYLES' ? '' : 'STYLES')}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 font-heading text-lg font-bold uppercase hover:bg-white/10"
                >
                  STYLES <ChevronDown className={`size-4 transition ${mobileAccordion === 'STYLES' ? 'rotate-180' : ''}`} />
                </button>
                {mobileAccordion === 'STYLES' && (
                  <div className="mt-1 grid grid-cols-2 gap-1 pl-3">
                    {STYLE_CATEGORIES.flatMap((c) => c.items).map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="rounded-md px-2 py-1.5 text-xs text-primary-100 no-underline hover:bg-white/10"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/options" className="block rounded-lg px-3 py-2.5 font-heading text-lg font-bold uppercase text-white no-underline hover:bg-white/10">
                OPTIONS
              </Link>
              <Link to="/rush-patches" className="flex items-center gap-2 rounded-lg px-3 py-2.5 font-heading text-lg font-bold uppercase text-white no-underline hover:bg-white/10">
                <Zap className="size-4 fill-accent text-accent" /> RUSH PATCHES
              </Link>
              <Link to="/pricing" className="block rounded-lg px-3 py-2.5 font-heading text-lg font-bold uppercase text-white no-underline hover:bg-white/10">
                PRICING
              </Link>

              <div className="border-t border-white/15 pt-2">
                {EXPLORE_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="block rounded-lg px-3 py-2 text-sm text-primary-100 no-underline hover:bg-white/10"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="mt-auto space-y-2 border-t border-white/15 pt-4 text-xs text-primary-100">
              <p>{CONTACT.phone}</p>
              <p>{CONTACT.email}</p>
              <p>{CONTACT.hours}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
