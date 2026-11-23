import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Check, Mail, Phone, Zap } from 'lucide-react'
import SplitPillCTA from '../components/SplitPillCTA'
import { ASSETS } from '../data/assets'
import { BLOG_POSTS, CONTACT, PATCH_TYPES, REVIEWS, STYLE_CATEGORIES } from '../data/siteData'

const ROUTE_CONTENT = {
  '/make-your-own-patches': {
    eyebrow: 'ONLINE PATCH BUILDER',
    title: 'Create Your Custom Patches',
    subtitle: 'Pick your patch style, dimensions, backing, and quantity. Add directly to your cart or request a free digital proof from our artists.',
    image: ASSETS.miscPatchStyles,
  },
  '/rush-patches': {
    eyebrow: 'FAST TURNAROUND',
    title: 'Rush Custom Patches in 5–10 Days',
    subtitle: 'Need custom embroidered patches on a tight event or uniform deadline? Select expedited rush production with free shipping.',
    image: ASSETS.miscPatchStyles,
    rush: true,
  },
  '/options': {
    eyebrow: 'CUSTOMIZATION OPTIONS',
    title: 'Backings, Borders, Threads & Add-ons',
    subtitle: 'Customize every stitch: Merrowed or hot-cut borders, iron-on, Velcro hook-and-loop, peel-and-stick, metallic/neon threads, and more.',
    image: ASSETS.variety1,
  },
  '/how-to-iron-on-patches': {
    eyebrow: 'APPLICATION GUIDE',
    title: 'How to Iron On a Patch',
    subtitle: 'Prep, place, press — apply heat-seal iron-on patches cleanly to jackets, caps, backpacks, and uniforms in about three minutes.',
    image: ASSETS.bumperIronOn,
  },
  '/reviews': {
    eyebrow: 'VERIFIED FEEDBACK',
    title: 'Customer Reviews',
    subtitle: 'Rated 4.8/5 across thousands of orders for sports teams, military units, fire departments, and brands since 2003.',
    image: ASSETS.home35,
  },
  '/gallery': {
    eyebrow: 'PORTFOLIO',
    title: 'Custom Patch Gallery',
    subtitle: 'Explore real samples crafted across embroidered, woven, PVC, printed, name, and leather patch styles.',
    image: ASSETS.home35,
  },
  '/faq': {
    eyebrow: 'FREQUENTLY ASKED QUESTIONS',
    title: 'Custom Patch FAQs',
    subtitle: 'Everything you need to know about minimum orders, free proofs, turnaround, and shipping.',
    image: ASSETS.designProcess,
  },
  '/contact': {
    eyebrow: 'GET IN TOUCH',
    title: 'Contact Patches4Less',
    subtitle: 'Reach our Ocala, Florida patch specialists by phone, email, or message.',
    image: ASSETS.lowPricesWhite,
  },
  '/about': {
    eyebrow: 'SINCE 2003',
    title: 'About Patches4Less.com',
    subtitle: 'Over twenty years crafting millions of custom patches for military units, first responders, Fortune 500 brands, and clubs.',
    image: ASSETS.step3Patch,
  },
}

export default function CatalogPage({ onAddToCart }) {
  const { pathname } = useLocation()
  const [selectedType, setSelectedType] = useState('embroidered')
  const [hatStyle, setHatStyle] = useState('Richardson 112 Trucker')
  const [hatQty, setHatQty] = useState(24)

  const patchProduct = PATCH_TYPES.find((t) => t.href === pathname)
  const styleItem = STYLE_CATEGORIES.flatMap((c) => c.items).find((s) => s.href === pathname)
  const routeInfo = ROUTE_CONTENT[pathname]

  const title = patchProduct?.fullName || styleItem?.name || routeInfo?.title || 'Custom Patches'
  const subtitle =
    patchProduct?.description ||
    styleItem?.desc ||
    routeInfo?.subtitle ||
    'Custom-designed patches with free artwork, free revisions, no setup fees, and free continental US shipping.'
  const eyebrow = patchProduct
    ? `STARTING FROM ${patchProduct.fromPrice} · MIN ${patchProduct.minQty} PATCHES`
    : routeInfo?.eyebrow || 'CUSTOM PATCHES'
  const heroImg = patchProduct?.image || routeInfo?.image || ASSETS.miscPatchStyles

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Header Banner */}
      <section className="stitched-card overflow-hidden rounded-3xl bg-white p-8 shadow-lg sm:p-10 dark:bg-neutral-800">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="inline-flex items-center gap-1.5 font-heading text-xs font-black tracking-widest text-accent-600 uppercase dark:text-accent-400">
              {routeInfo?.rush && <Zap className="size-3.5 fill-current" />}
              {eyebrow}
            </p>
            <h1 className="mt-2 font-heading text-4xl font-black text-primary-800 uppercase sm:text-5xl dark:text-white">
              {title}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-neutral-600 sm:text-lg dark:text-neutral-300">
              {subtitle}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <SplitPillCTA />
              <Link
                to="/pricing"
                className="font-heading text-sm font-bold text-primary-700 uppercase underline decoration-primary-300 underline-offset-4 hover:text-primary-600 dark:text-primary-300"
              >
                See full pricing →
              </Link>
            </div>
          </div>

          <div className="md:col-span-5">
            <img
              src={heroImg}
              alt={title}
              className="mx-auto max-h-64 w-auto rounded-2xl object-contain drop-shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Hat Builder Section for /hat-patches */}
      {pathname === '/hat-patches' && (
        <section id="patched-hats-heading" className="mt-10 rounded-3xl bg-primary-800 p-8 text-white shadow-xl">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
            <div className="md:col-span-6">
              <img src={ASSETS.hatHero} alt="Patched hats" className="mx-auto w-full max-w-md drop-shadow-xl" />
            </div>
            <div className="md:col-span-6">
              <h2 className="font-heading text-3xl font-black uppercase">Configure Patched Hats (From $20)</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-primary-100">Hat Style</label>
                  <select
                    value={hatStyle}
                    onChange={(e) => setHatStyle(e.target.value)}
                    className="w-full rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-neutral-900"
                  >
                    <option>Richardson 112 Trucker</option>
                    <option>Low-Profile Cotton Twill Cap</option>
                    <option>Camo Mesh Trucker</option>
                    <option>Performance Rope Cap</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-primary-100">Quantity</label>
                  <input
                    type="number"
                    min={12}
                    value={hatQty}
                    onChange={(e) => setHatQty(Math.max(12, Number(e.target.value) || 12))}
                    className="w-32 rounded-xl bg-white px-4 py-2 text-sm font-bold text-neutral-900"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onAddToCart({
                      id: `hat-${hatStyle}-${hatQty}`,
                      title: `${hatStyle} w/ Custom Patch`,
                      specs: 'Patched Hat Bundle · Free Setup',
                      qty: hatQty,
                      unitPrice: 20,
                      totalPrice: hatQty * 20,
                    })
                  }
                  className="cursor-pointer rounded-full bg-accent px-7 py-3 font-heading text-lg font-black text-white uppercase shadow-md hover:bg-accent-600"
                >
                  Add {hatQty} Hats to Cart (${(hatQty * 20).toFixed(2)})
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick Builder Add-to-Cart */}
      <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {PATCH_TYPES.map((type) => (
          <div
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`stitched-card cursor-pointer rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5 dark:bg-neutral-800 ${
              selectedType === type.id ? 'ring-2 ring-accent' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <img src={type.image} alt={type.name} className="size-16 rounded-xl object-cover shadow-xs" />
              <div>
                <h3 className="font-heading text-xl font-bold text-primary-800 uppercase dark:text-white">
                  {type.fullName}
                </h3>
                <p className="text-sm font-bold text-accent-600">From {type.fromPrice} / patch</p>
                <p className="text-xs text-neutral-500">Turnaround: {type.turnaround}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">{type.tagline}</p>
            <div className="mt-4 flex items-center justify-between">
              <Link
                to={type.href}
                className="text-xs font-bold text-primary-700 underline dark:text-primary-300"
              >
                View details
              </Link>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onAddToCart({
                    id: `sample-${type.id}`,
                    title: `${type.fullName} (3" × 100)`,
                    specs: `Minimum order ${type.minQty} · Free proof & shipping`,
                    qty: 100,
                    unitPrice: Number(type.fromPrice.replace('$', '')) * 3,
                    totalPrice: Number(type.fromPrice.replace('$', '')) * 300,
                  })
                }}
                className="cursor-pointer rounded-full bg-primary-600 px-4 py-1.5 font-heading text-xs font-bold text-white uppercase hover:bg-primary-700"
              >
                Quick Add 100
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Contextual Reviews / Blog / Contact Help */}
      {pathname.startsWith('/blog') && (
        <section className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <article key={post.slug} className="stitched-card rounded-2xl bg-white p-5 shadow-sm dark:bg-neutral-800">
              <img src={post.image} alt={post.title} className="aspect-video w-full rounded-xl object-cover" />
              <p className="mt-3 text-xs font-semibold text-primary-700 dark:text-primary-300">{post.date}</p>
              <h3 className="mt-1 font-heading text-xl font-bold text-neutral-900 dark:text-white">{post.title}</h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{post.excerpt}</p>
            </article>
          ))}
        </section>
      )}

      {pathname === '/reviews' && (
        <section className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <article key={r.author} className="stitched-card rounded-2xl bg-white p-6 shadow-sm dark:bg-neutral-800">
              <p className="text-base text-neutral-700 dark:text-neutral-200">{r.quote}</p>
              <p className="mt-4 font-heading font-bold text-primary-800 dark:text-white">{r.author}</p>
            </article>
          ))}
        </section>
      )}

      <section className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-primary-900 px-6 py-5 text-white">
        <div className="flex items-center gap-3">
          <Check className="size-5 text-accent" />
          <span className="font-heading text-lg font-bold uppercase">
            Questions? Call {CONTACT.phone} or email {CONTACT.email}
          </span>
        </div>
        <div className="flex gap-3">
          <a href={CONTACT.phoneHref} className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 font-heading text-sm font-bold text-white no-underline">
            <Phone className="size-4" /> Call Now
          </a>
          <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 font-heading text-sm font-bold text-white no-underline">
            <Mail className="size-4" /> Email Us
          </a>
        </div>
      </section>
    </main>
  )
}
