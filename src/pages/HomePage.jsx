import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  ExternalLink,
  Mail,
  Phone,
  Play,
  Star,
  Zap,
} from 'lucide-react'
import SplitPillCTA from '../components/SplitPillCTA'
import StyleIcon from '../components/StyleIcon'
import { ASSETS } from '../data/assets'
import {
  ALL_PATCH_STYLES_ALPHA,
  BLOG_POSTS,
  CONTACT,
  PATCH_TYPES,
  PROCESS_STEPS,
  PURPOSES,
  REVIEWS,
  TRUSTED_CLIENTS,
  VALUE_PROPS,
  WHY_CHOOSE_ROWS,
} from '../data/siteData'

function FiveStars({ className = 'size-5 fill-accent text-accent' }) {
  return (
    <div className="flex items-center gap-0.5" aria-label="Rated 5 out of 5">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className={className} />
      ))}
    </div>
  )
}

export default function HomePage({ onOpenVideo }) {
  const featuredPost = BLOG_POSTS[0]
  const secondaryPosts = BLOG_POSTS.slice(1)

  return (
    <main id="content" className="relative overflow-x-clip">
      {/* SECTION 1: Hero Banner + BUILD YOUR PERFECT PATCH 6-Card Grid */}
      <div className="relative isolate -mt-[calc(6rem+var(--below-main-nav-height,2.5rem))] overflow-x-clip pt-[calc(6rem+var(--below-main-nav-height,2.5rem))] pb-14">
        {/* Background photo + teal gradient overlay */}
        <img
          src={ASSETS.wallOPatches}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 size-full object-cover object-left-top"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-b from-primary-950/75 via-primary-800/80 to-primary-600/90 backdrop-blur-[2px] dark:from-primary-950/80 dark:to-primary-950/95"
        />

        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:pt-10">
          {/* 2-Column Hero Grid */}
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-6">
              <h1 className="m-0 font-heading text-[clamp(2.75rem,4.5vw,4.25rem)] leading-[0.94] font-bold tracking-[-0.01em] text-white drop-shadow-[0_2px_10px_rgb(0_0_0/0.35)]">
                <span className="block">Custom patches.</span>
                <span className="block">Big impact.</span>
                <span className="hero-deadline-underline mt-1 text-accent">Even on a deadline.</span>
              </h1>

              <p className="mt-7 max-w-lg text-lg leading-relaxed text-white/95 sm:text-xl">
                Bring your team, brand or next big event to life with custom patches made just for you.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                <Link
                  to="/make-your-own-patches"
                  className="hero-cta inline-flex min-h-14 items-center justify-center gap-2 rounded-md bg-accent px-6 font-heading text-xl font-bold text-white no-underline shadow-lg transition-colors hover:bg-accent-600"
                >
                  Create Your Patches
                  <ArrowRight className="hero-cta-arrow size-5" />
                </Link>

                <Link
                  to="/rush-patches"
                  className="hero-cta-rush inline-flex min-h-14 items-center justify-center gap-2.5 rounded-md bg-white px-6 font-heading text-xl font-bold text-primary-900 no-underline shadow-lg transition-colors hover:bg-primary-50"
                >
                  <Zap className="hero-cta-bolt size-5 fill-accent text-accent" />
                  Need them fast?
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="drop-shadow-[0_22px_24px_rgba(0,0,0,0.45)]">
                <img
                  src={ASSETS.miscPatchStyles}
                  alt="A pile of custom patches: a round 'The Distinguished Gentleman's Ride' patch, an orange spiral, a red shield with a golden eagle crest, a knight's helmet on red and black, and a white stitched bunny face."
                  title="Various Custom Patch Styles"
                  style={
                    ASSETS.maskPatchStyles
                      ? {
                          WebkitMaskImage: `url(${ASSETS.maskPatchStyles})`,
                          maskImage: `url(${ASSETS.maskPatchStyles})`,
                        }
                      : undefined
                  }
                  className="patch-cutout-mask mx-auto h-auto w-full max-w-md lg:max-w-[40rem]"
                />
              </div>
            </div>
          </div>

          {/* Rule-flanked Divider Heading */}
          <h2 className="mt-10 flex items-center gap-4 font-heading text-base font-medium tracking-[0.14em] whitespace-nowrap text-white uppercase sm:gap-6 sm:text-xl sm:tracking-[0.2em] lg:text-2xl before:h-px before:flex-1 before:bg-white/40 after:h-px after:flex-1 after:bg-white/40">
            BUILD YOUR PERFECT PATCH
          </h2>

          {/* 6 Stitched Patch Type Cards */}
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {PATCH_TYPES.map((type) => (
              <Link key={type.id} to={type.href} className="patch-type-link group">
                <div
                  className="patch-type-patch mx-auto aspect-square w-full max-w-[186px]"
                  style={{ transform: `rotate(${type.tilt})` }}
                >
                  <img
                    src={type.image}
                    alt={`${type.name} patches`}
                    className="size-full rounded-xl object-cover"
                  />
                  <span className="patch-type-tag">As low as {type.fromPrice}</span>
                </div>
                <span className="mt-5 block font-heading text-2xl font-bold tracking-tight text-white">
                  {type.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: Value Proposition Trust Strip */}
      <section className="relative z-10 bg-neutral-50 shadow-md dark:bg-neutral-800">
        <ul className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-x-8 gap-y-2 px-4 py-3 text-center font-heading text-base font-bold text-primary-600 sm:flex-row sm:flex-wrap sm:text-lg xl:gap-x-10 2xl:text-xl dark:text-white">
          {VALUE_PROPS.map((label) => (
            <li key={label} className="flex items-center gap-2.5 whitespace-nowrap">
              <Star className="size-5 shrink-0 fill-accent-600 text-accent-600 dark:fill-accent-400 dark:text-accent-400" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* SECTION 3: Welcome to Patch4Ever! + Video + Choose Your Patch Type */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6">
        <div className="mb-10 flex justify-center drop-shadow-md">
          <img
            src={ASSETS.home35}
            alt="A row of six embroidered patches, each representing different fictional motifs and organizations including Ruby The Hatchet, The Walking Dead, Force Security, AIM-9M, Chabelly Fire Dept., and U.S. Forest Service"
            style={
              ASSETS.maskHome35
                ? {
                    WebkitMaskImage: `url(${ASSETS.maskHome35})`,
                    maskImage: `url(${ASSETS.maskHome35})`,
                  }
                : undefined
            }
            className="patch-cutout-mask h-auto w-full max-w-2xl"
          />
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* Left Column */}
          <div className="lg:col-span-6">
            <h2 className="m-0 font-heading text-5xl leading-none font-black text-primary-700 md:text-6xl dark:text-primary-300">
              Welcome to Patch4Ever!
            </h2>
            <p className="mt-2 font-heading text-3xl font-bold text-primary-600 dark:text-primary-400">
              Custom patches since 2003
            </p>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-neutral-700 dark:text-neutral-200">
              <p>
                We make custom patches for sports teams, businesses, fire and police departments, military units, scout troops, motorcycle clubs and events. Choose from{' '}
                <Link to="/embroidered-patches" className="font-semibold text-primary-700 underline decoration-primary-300 underline-offset-4 hover:text-primary-600 dark:text-primary-300">
                  custom embroidered patches
                </Link>
                ,{' '}
                <Link to="/iron-on-patches" className="font-semibold text-primary-700 underline decoration-primary-300 underline-offset-4 hover:text-primary-600 dark:text-primary-300">
                  iron-on patches
                </Link>
                , woven, PVC, printed and leather. Put them where you need them, from{' '}
                <Link to="/jacket-patches" className="font-semibold text-primary-700 underline decoration-primary-300 underline-offset-4 hover:text-primary-600 dark:text-primary-300">
                  custom jacket patches
                </Link>{' '}
                to{' '}
                <Link to="/velcro-patches" className="font-semibold text-primary-700 underline decoration-primary-300 underline-offset-4 hover:text-primary-600 dark:text-primary-300">
                  custom velcro patches
                </Link>{' '}
                you can move between uniforms and gear.
              </p>
              <p>
                Every order starts with a free proof, and you can ask for changes until it looks right. You pay only after you approve it. Embroidered orders start at 10 patches, and shipping is free in the continental US.
              </p>
            </div>

            <div className="mt-7 border-t border-dashed border-primary-200 pt-6 dark:border-primary-800">
              <p className="mb-4 font-heading text-xl font-bold text-primary-800 dark:text-white">
                Send us your design and get a free proof.
              </p>
              <SplitPillCTA />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8 lg:col-span-6">
            {/* Tilted Stitched YouTube Video Card */}
            <div>
              <button
                type="button"
                onClick={() =>
                  onOpenVideo({
                    youtubeId: 'I-k7gbA-3UU',
                    title: 'How to Order Custom Patches Online',
                  })
                }
                className="group relative block w-full cursor-pointer overflow-hidden rounded-3xl bg-primary-800 p-2.5 text-left shadow-xl transition-transform duration-300 hover:rotate-0 -rotate-1"
              >
                <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-white/35">
                  <img
                    src={ASSETS.ytThumb}
                    alt="How to order custom patches online"
                    className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/15 transition-colors group-hover:bg-black/25">
                    <span className="grid h-12 w-16 place-items-center rounded-xl bg-red-600 text-white shadow-lg transition-transform group-hover:scale-110">
                      <Play className="size-6 fill-current" />
                    </span>
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() =>
                  onOpenVideo({
                    youtubeId: 'I-k7gbA-3UU',
                    title: 'How to Order Custom Patches Online',
                  })
                }
                className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-neutral-700 hover:text-primary-700 dark:text-neutral-200 dark:hover:text-primary-300"
              >
                <span className="grid size-5 place-items-center rounded-full bg-accent text-white">
                  <Play className="size-3 fill-current" />
                </span>
                How to order custom patches online · 3:07
              </button>
            </div>

            {/* CHOOSE YOUR PATCH TYPE Card */}
            <div className="stitched-card rounded-3xl bg-white p-6 shadow-md sm:p-7 dark:bg-neutral-800">
              <h3 className="font-heading text-xl font-bold text-primary-800 uppercase dark:text-primary-200">
                CHOOSE YOUR PATCH TYPE
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[PATCH_TYPES[0], PATCH_TYPES[1], PATCH_TYPES[2], PATCH_TYPES[3], PATCH_TYPES[5], PATCH_TYPES[4]].map(
                  (type) => (
                    <Link
                      key={type.id}
                      to={type.href}
                      className="group flex items-center gap-3 rounded-2xl p-1.5 no-underline transition-colors hover:bg-primary-50 dark:hover:bg-white/5"
                    >
                      <img
                        src={type.image}
                        alt={type.name}
                        className="size-12 shrink-0 rounded-xl bg-white object-cover shadow-xs ring-1 ring-neutral-900/10 sm:size-14"
                      />
                      <div>
                        <span className="block font-heading text-base font-bold leading-tight text-primary-800 group-hover:text-primary-600 dark:text-white">
                          {type.name}
                        </span>
                        <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                          from {type.fromPrice}
                        </span>
                      </div>
                    </Link>
                  ),
                )}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-dashed border-primary-100 pt-4 text-sm text-neutral-600 dark:border-primary-800 dark:text-neutral-300">
                <span>Starting prices are for bulk orders.</span>
                <Link
                  to="/pricing"
                  className="font-semibold text-primary-700 underline decoration-primary-300 underline-offset-4 hover:decoration-primary-600 dark:text-primary-300"
                >
                  Compare all prices
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Patched Hats Promo Band */}
      <aside className="hats-promo">
        <div className="hats-promo-band">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12">
            <div className="relative -mt-14 lg:col-span-6 lg:-my-12">
              <img
                src={ASSETS.hatHero}
                alt="Three caps with custom patches on the front: a teal and navy trucker with a round Helena Field School patch, a camo trucker with a Sentinel Rising Texas Hunt patch, and a khaki cap with a Dubois County Bombers patch."
                className="hats-promo-photo mx-auto h-auto w-full max-w-xl"
              />
              <div className="hats-promo-stamp">
                <span className="block font-heading text-[11px] font-bold tracking-wider text-primary-700 uppercase">
                  HATS FROM
                </span>
                <span className="block font-heading text-3xl leading-none font-black text-primary-800">
                  $20
                </span>
              </div>
            </div>

            <div className="text-center lg:col-span-6 lg:text-left">
              <h2 className="font-heading text-5xl leading-[0.95] font-black text-balance text-white uppercase md:text-6xl">
                YOUR PATCH. YOUR HATS. ONE ORDER.
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-primary-50 lg:mx-0">
                Add caps and trucker hats to the same cart as your patches. Pick a style, a color and how many you need, and check out once.
              </p>
              <Link
                to="/hat-patches#patched-hats-heading"
                className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-white/30 bg-accent px-8 py-2.5 font-heading text-xl font-bold text-white uppercase no-underline shadow-lg transition hover:bg-accent-600"
              >
                SHOP HATS →
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* SECTION 5: We Make Custom Patches for Every Purpose + FIND YOUR PATCH STYLE */}
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="m-0 font-heading text-4xl leading-tight font-bold text-balance text-primary md:text-5xl dark:text-accent">
            We Make Custom Patches for Every Purpose
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-700 sm:text-lg dark:text-neutral-300">
            Custom patches are incredibly versatile, perfect for enhancing team identity, boosting business branding, decorating uniforms, commemorating events, or encouraging unity in military units, motorcycle clubs, and more. At Patch4Ever.com, we specialize in creating personalized patches for every need. From design to delivery, we make it easy to bring your vision to life.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* Left 4 Purpose Feature Blocks */}
          <div className="space-y-8 lg:col-span-6">
            {PURPOSES.map((item) => (
              <div key={item.title} className="flex items-start gap-5">
                <img
                  src={item.image}
                  alt=""
                  className="size-16 shrink-0 object-contain"
                />
                <div>
                  <h3 className="font-heading text-2xl leading-tight font-bold text-primary-700 dark:text-primary-300">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right FIND YOUR PATCH STYLE Card */}
          <div className="lg:col-span-6">
            <div className="stitched-card rounded-3xl bg-white p-6 shadow-md sm:p-8 dark:bg-neutral-800">
              <h3 className="font-heading text-2xl font-bold text-primary-800 uppercase dark:text-primary-200">
                FIND YOUR PATCH STYLE
              </h3>

              <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
                {ALL_PATCH_STYLES_ALPHA.map((style) => (
                  <Link
                    key={style.href}
                    to={style.href}
                    className="group -mx-2 flex items-center gap-3 rounded-xl px-2 py-1.5 font-semibold text-neutral-900 no-underline transition hover:bg-primary-50 dark:text-neutral-100 dark:hover:bg-white/5"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-50 text-primary-700 transition group-hover:bg-primary-600 group-hover:text-white dark:bg-primary-900 dark:text-primary-200">
                      <StyleIcon name={style.icon} className="size-4" />
                    </span>
                    <span className="text-sm sm:text-[15px]">{style.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Eclectic 5-patch divider graphic */}
        <div className="mt-14 flex justify-center drop-shadow-md">
          <img
            src={ASSETS.home4}
            alt="A collection of five eclectic patches including Kickback Baker, Gwar, and El-Creepo"
            style={
              ASSETS.maskHome4
                ? {
                    WebkitMaskImage: `url(${ASSETS.maskHome4})`,
                    maskImage: `url(${ASSETS.maskHome4})`,
                  }
                : undefined
            }
            className="patch-cutout-mask h-auto w-full max-w-lg"
          />
        </div>
      </section>

      {/* SECTION 6: Ordering Custom Patches is as easy as 1-2-3! */}
      <section className="bg-white py-20 shadow-sm md:py-24 dark:bg-neutral-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="m-0 font-heading text-4xl leading-tight font-bold text-balance text-primary md:text-5xl dark:text-accent">
              Ordering Custom Patches is as easy as 1-2-3!
            </h2>
            <p className="mt-4 text-base leading-relaxed text-neutral-700 sm:text-lg dark:text-neutral-300">
              At Patch4Ever.com, we pride ourselves on making the process of ordering custom patches as simple and straightforward as possible. In just three easy steps, you&apos;ll be on your way to receiving your own unique, high-quality patches.
            </p>
          </div>

          <div className="ordering-steps mt-14 grid grid-cols-1 gap-10 md:grid-cols-3">
            {PROCESS_STEPS.map((step) => (
              <div key={step.num} className="relative z-10 flex flex-col">
                <div className="relative" style={{ transform: `rotate(${step.tilt})` }}>
                  <span className="absolute -left-3 -top-4 z-20 grid size-11 place-items-center rounded-full bg-accent font-heading text-2xl font-black text-white shadow-md ring-4 ring-white dark:ring-neutral-900">
                    {step.num}
                  </span>
                  <img
                    src={step.image}
                    alt={step.alt}
                    className="aspect-[16/10] w-full rounded-2xl bg-neutral-900 object-cover shadow-[0_2px_4px_rgba(0,0,0,0.08),0_20px_36px_-18px_rgba(0,0,0,0.45)] ring-4 ring-white dark:ring-neutral-800"
                  />
                </div>
                <h3 className="mt-7 font-heading text-2xl leading-tight font-bold text-primary-700 dark:text-white">
                  <span className="block">{step.headingPrefix}</span>
                  <span>{step.title}</span>
                </h3>
                <p className="mt-2.5 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <p className="mb-4 font-heading text-xl font-bold text-neutral-900 dark:text-white">
              Start with step one today.
            </p>
            <SplitPillCTA />
          </div>
        </div>
      </section>

      {/* SECTION 7: 100% Quality Guarantee Full-Width Teal Banner */}
      <aside className="guarantee-banner-bg overflow-x-clip border-y-4 border-primary-800 py-12 text-white md:py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:px-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <h2 className="font-heading text-3xl leading-tight font-bold text-balance drop-shadow-md md:text-4xl">
              Every Custom Patch We Make is Backed by Our Outstanding Customer Service and{' '}
              <span className="text-accent">100% Quality Guarantee</span>
            </h2>
            <p className="mt-3 text-base text-primary-50">
              If you have questions, feel free to contact us via our contact form, email us, or call us toll-free.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={CONTACT.phoneHref}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-heading text-lg font-semibold tracking-wide text-white no-underline shadow-md transition hover:bg-accent-600"
              >
                <Phone className="size-4" />
                {CONTACT.phone}
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-5 py-2.5 font-heading text-lg font-semibold tracking-wide text-white no-underline transition hover:bg-white/20"
              >
                <Mail className="size-4" />
                {CONTACT.email}
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-5 py-2.5 font-heading text-lg font-semibold tracking-wide text-white no-underline transition hover:bg-white/20"
              >
                Contact form
              </Link>
            </div>
          </div>

          <div className="md:col-span-4">
            <img
              src={ASSETS.lowPricesWhite}
              alt="Low Prices Guaranteed Every Day"
              title="At Patch4Ever.com we always guarantee the lowest price"
              className="guarantee-badge mx-auto w-52 drop-shadow-xl md:w-64"
            />
          </div>
        </div>
      </aside>

      {/* SECTION 8: Why Choose Patch4Ever.com? */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="m-0 text-center font-heading text-4xl leading-tight font-bold text-balance text-primary md:text-5xl dark:text-accent">
          Why Choose Patch4Ever.com?
        </h2>

        <div className="mt-12 space-y-16">
          {WHY_CHOOSE_ROWS.map((row, idx) => {
            const isEven = idx % 2 === 1
            return (
              <div
                key={row.title}
                className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12"
              >
                <div className={`md:col-span-5 ${isEven ? 'md:order-2' : ''}`}>
                  <img
                    src={row.image}
                    alt={row.alt}
                    style={{ transform: `rotate(${isEven ? '3deg' : '-3deg'})` }}
                    className="mx-auto w-64 rounded-2xl bg-white p-2 shadow-[0_2px_4px_rgba(0,0,0,0.08),0_20px_36px_-18px_rgba(0,0,0,0.45)] md:w-full max-w-[330px] dark:bg-neutral-800"
                  />
                </div>
                <div className={`md:col-span-7 ${isEven ? 'md:order-1' : ''}`}>
                  <h3 className="font-heading text-3xl leading-tight font-bold text-primary-700 dark:text-primary-300">
                    {row.title}
                  </h3>
                  <div className="mt-4 space-y-3 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {row.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* SECTION 9: What Our Customers Say (Trustpilot Grid) */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
        <div className="text-center">
          <h2 className="font-heading text-4xl leading-tight font-bold text-balance text-primary md:text-5xl dark:text-accent">
            What Our Customers Say
          </h2>
          <p className="mt-2 text-base text-neutral-600 dark:text-neutral-300">
            Don&apos;t just take our word for it.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((review) => (
            <article
              key={review.author}
              className="stitched-card flex flex-col justify-between rounded-2xl bg-white p-7 shadow-md dark:bg-neutral-800"
            >
              <div>
                <FiveStars className="size-4 fill-accent text-accent" />
                <p className="mt-4 text-base leading-relaxed text-neutral-700 dark:text-neutral-200">
                  {review.quote}
                </p>
              </div>
              <div className="mt-5">
                <p className="font-heading text-base font-bold text-primary-800 dark:text-white">
                  {review.author}
                </p>
                <a
                  href={review.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-800 no-underline transition hover:bg-primary-100 dark:bg-primary-900 dark:text-primary-200"
                >
                  Trustpilot
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/reviews"
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary-700 px-7 py-3 font-heading text-lg font-bold text-white uppercase no-underline shadow-md transition hover:bg-primary-800"
          >
            READ MORE CUSTOMER REVIEWS →
          </Link>
        </div>
      </section>

      {/* SECTION 10: TRUSTED WITH CUSTOM PATCHES SINCE 2003 + Hang-Tag Price Card */}
      <section className="relative isolate overflow-clip bg-primary-800 py-20 text-white md:py-24 dark:bg-primary-950">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="font-heading text-4xl leading-[1.02] font-black tracking-tight text-balance uppercase sm:text-5xl">
              TRUSTED WITH CUSTOM PATCHES SINCE <span className="text-accent">2003</span>
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-primary-100 sm:text-lg">
              Every order is drawn by our artists, proofed before it is stitched, and backed by a guarantee. Here is what that means, and what it costs.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[
                {
                  title: 'Free artwork & proofs',
                  desc: 'Our artists draw your patch and revise it free until you approve it.',
                },
                {
                  title: 'No setup fees',
                  desc: 'On most orders, what you see is what you pay.',
                },
                {
                  title: 'Free shipping',
                  desc: 'On every order in the continental U.S.',
                },
                {
                  title: '100% quality guarantee',
                  desc: 'On every patch we make.',
                },
              ].map((feat) => (
                <div key={feat.title} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent text-white">
                    <Check className="size-3.5 stroke-[3]" />
                  </span>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white">{feat.title}</h3>
                    <p className="mt-0.5 text-sm leading-relaxed text-primary-100/90">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                to="/quote"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-accent px-7 py-3 font-heading text-lg font-black tracking-wide text-white uppercase no-underline shadow-lg transition hover:bg-accent-600"
              >
                GET A FREE PROOF
              </Link>
              <div className="flex items-center gap-2.5">
                <FiveStars className="size-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-white">4.8/5 Google Reviews</span>
              </div>
            </div>
          </div>

          {/* Right Hang-Tag Spec Card */}
          <div className="lg:col-span-5">
            <div className="hang-tag-card mx-auto max-w-md rounded-3xl bg-white px-7 pb-8 pt-10 text-neutral-800 shadow-2xl dark:bg-neutral-800 dark:text-neutral-100">
              {/* Punched Tag Hole */}
              <div
                aria-hidden="true"
                className="mx-auto mb-4 size-4 rounded-full bg-primary-800 shadow-inner dark:bg-primary-950"
              />

              <div className="border-b border-neutral-100 pb-6 text-center dark:border-neutral-700">
                <p className="font-heading text-xs font-bold tracking-widest text-primary-700 uppercase dark:text-primary-300">
                  EMBROIDERED FROM
                </p>
                <p className="mt-1 font-heading text-6xl leading-none font-black text-primary-800 dark:text-white">
                  $0.47
                </p>
                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                  a patch · smallest size, highest quantity
                </p>
                <Link
                  to="/pricing"
                  className="mt-3 inline-block text-sm font-bold text-primary-700 underline decoration-primary-300 decoration-2 underline-offset-4 hover:decoration-primary-600 dark:text-primary-300"
                >
                  See pricing
                </Link>
              </div>

              <dl className="mt-5 divide-y divide-neutral-100 text-sm dark:divide-neutral-700">
                <div className="grid grid-cols-12 gap-2 py-3">
                  <dt className="col-span-5 font-heading text-xs font-bold tracking-wider text-accent-600 uppercase dark:text-accent-400">
                    TURNAROUND
                  </dt>
                  <dd className="col-span-7 space-y-0.5 text-neutral-700 dark:text-neutral-200">
                    <div>
                      Embroidered <strong className="font-bold">14-22 days</strong>
                    </div>
                    <div>
                      Woven <strong className="font-bold">4-6 weeks</strong>
                    </div>
                    <div>
                      Printed or PVC <strong className="font-bold">3-5 weeks</strong>
                    </div>
                  </dd>
                </div>
                <div className="grid grid-cols-12 gap-2 py-3">
                  <dt className="col-span-5 font-heading text-xs font-bold tracking-wider text-accent-600 uppercase dark:text-accent-400">
                    MINIMUM ORDER
                  </dt>
                  <dd className="col-span-7 font-bold">10 patches</dd>
                </div>
                <div className="grid grid-cols-12 gap-2 py-3">
                  <dt className="col-span-5 font-heading text-xs font-bold tracking-wider text-accent-600 uppercase dark:text-accent-400">
                    LOCATION
                  </dt>
                  <dd className="col-span-7 font-bold">Ocala, Florida, USA</dd>
                </div>
                <div className="grid grid-cols-12 gap-2 py-3">
                  <dt className="col-span-5 font-heading text-xs font-bold tracking-wider text-accent-600 uppercase dark:text-accent-400">
                    EXPERIENCE
                  </dt>
                  <dd className="col-span-7 font-bold">20+ years in business</dd>
                </div>
                <div className="grid grid-cols-12 gap-2 py-3">
                  <dt className="col-span-5 font-heading text-xs font-bold tracking-wider text-accent-600 uppercase dark:text-accent-400">
                    SPECIALTY
                  </dt>
                  <dd className="col-span-7 font-bold">Military &amp; businesses</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11: Trusted by Top Organizations (Infinite Marquee) */}
      <section className="overflow-hidden bg-white py-20 shadow-sm xl:py-24 dark:bg-neutral-800/50">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-4xl leading-tight font-bold text-balance text-primary md:text-5xl dark:text-accent">
            Trusted by Top Organizations
          </h2>
          <p className="mt-3 text-base text-neutral-600 sm:text-lg dark:text-neutral-300">
            From sports teams and businesses to military units and event organizers, we’re the go-to source for high-quality custom patches.
          </p>
        </div>

        <div className="marquee-wrapper mt-12 overflow-hidden py-4">
          <div className="marquee-track">
            {[...TRUSTED_CLIENTS, ...TRUSTED_CLIENTS].map((client, idx) => (
              <div
                key={`${client.name}-${idx}`}
                className="client-patch"
                style={{ transform: `rotate(${client.tilt})` }}
              >
                <span className="client-patch-stitch" aria-hidden="true" />
                <img
                  src={client.src}
                  alt={`${client.name} logo`}
                  className="max-h-16 w-auto max-w-[8.5rem] object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 12: HOW TO IRON ON A PATCH Video Banner */}
      <aside className="relative isolate flex min-h-[320px] items-center overflow-clip bg-primary-950 text-white">
        <img
          src={ASSETS.bumperIronOn}
          alt="An embroidered mountain patch on a denim jacket beside an iron, a pressing cloth, and spools of thread"
          className="absolute inset-0 -z-20 size-full object-cover object-right"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-r from-primary-950 via-primary-950/90 to-primary-950/20"
        />
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="font-heading text-4xl font-black tracking-tight text-white uppercase sm:text-5xl">
            HOW TO IRON ON A PATCH
          </h2>
          <p className="mt-2 max-w-lg text-base text-primary-100 sm:text-lg">
            Prep, place, press — the whole process in about three minutes.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              to="/how-to-iron-on-patches"
              className="inline-flex min-h-12 items-center gap-3 rounded-full bg-accent px-7 py-2.5 font-heading text-lg font-bold tracking-wide text-white uppercase no-underline shadow-lg transition hover:bg-accent-600"
            >
              <Play className="size-4 fill-current" />
              WATCH THE VIDEO <span className="text-sm font-normal opacity-90">3:02</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* SECTION 13: The Latest Posts From Our Blog */}
      <aside className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="font-heading text-3xl font-bold text-primary-800 sm:text-4xl dark:text-white">
            The Latest Posts From Our Blog
          </h2>
          <Link
            to="/blog/"
            className="font-heading text-base font-bold tracking-wider text-accent-600 uppercase no-underline hover:text-accent-700 dark:text-accent-400"
          >
            ALL ARTICLES →
          </Link>
        </div>

        {/* Featured Post */}
        <article className="mt-8 grid grid-cols-1 items-center gap-8 md:grid-cols-12">
          <Link to={featuredPost.href} className="block md:col-span-7">
            <img
              src={featuredPost.image}
              alt={featuredPost.title}
              className="aspect-[16/9] w-full rounded-2xl bg-white object-cover p-1.5 shadow-lg ring-1 ring-black/5 dark:bg-neutral-800"
            />
          </Link>
          <div className="md:col-span-5">
            <p className="text-sm font-semibold text-primary-700 dark:text-primary-300">
              {featuredPost.date} · {featuredPost.author}
            </p>
            <h3 className="mt-2 font-heading text-3xl leading-tight font-bold text-neutral-900 dark:text-white">
              <Link to={featuredPost.href} className="no-underline hover:text-primary-700 dark:hover:text-primary-300">
                {featuredPost.title}
              </Link>
            </h3>
            <p className="mt-3 text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
              {featuredPost.excerpt}
            </p>
            <Link
              to={featuredPost.href}
              className="mt-4 inline-flex items-center gap-1.5 font-heading text-sm font-bold tracking-wider text-accent-600 uppercase no-underline hover:text-accent-700 dark:text-accent-400"
            >
              READ ARTICLE →
            </Link>
          </div>
        </article>

        {/* Secondary Posts */}
        <div className="mt-12 grid grid-cols-1 gap-8 border-t border-dashed border-primary-200 pt-10 md:grid-cols-2 dark:border-primary-800">
          {secondaryPosts.map((post) => (
            <article key={post.slug} className="flex items-start gap-5">
              <Link to={post.href} className="shrink-0">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-28 w-44 rounded-xl bg-white object-cover p-1 shadow-md sm:w-52 dark:bg-neutral-800"
                />
              </Link>
              <div>
                <p className="text-xs font-semibold text-primary-700 dark:text-primary-300">{post.date}</p>
                <h3 className="mt-1 font-heading text-xl leading-snug font-bold text-neutral-900 dark:text-white">
                  <Link to={post.href} className="no-underline hover:text-primary-700 dark:hover:text-primary-300">
                    {post.title}
                  </Link>
                </h3>
                <Link
                  to={post.href}
                  className="mt-2 inline-flex items-center gap-1 font-heading text-xs font-bold tracking-wider text-accent-600 uppercase no-underline hover:text-accent-700 dark:text-accent-400"
                >
                  READ ARTICLE →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </aside>
    </main>
  )
}
