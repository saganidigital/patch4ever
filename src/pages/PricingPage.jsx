import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Hexagon, RectangleHorizontal, Shield, Circle } from 'lucide-react'
import {
  EMBROIDERED_COVERAGE_TABLES,
  EMBROIDERED_QTY_TIERS,
  EMBROIDERED_SIZES,
  LEATHER_QTY_TIERS,
  LEATHER_SIZES,
  LEATHER_VARIANTS,
  NAME_QTY_TIERS,
  NAME_SIZES,
  NAME_ROWS,
  PRINTED_ROWS,
  PVC_2D_ROWS,
  PVC_3D_ROWS,
  PVC_QTY_TIERS,
  PVC_SIZES,
  WOVEN_ROWS,
  lookupUnitPrice,
} from '../data/pricingData'
import { PATCH_TYPES } from '../data/siteData'

const SHAPES = [
  { id: 'rectangle', label: 'Rectangle', icon: RectangleHorizontal, radius: '1rem' },
  { id: 'oval', label: 'Oval', icon: Circle, radius: '9999px' },
  { id: 'shield', label: 'Shield', icon: Shield, radius: '1rem 1rem 4rem 4rem' },
  { id: 'hexagon', label: 'Hexagon', icon: Hexagon, radius: '1.5rem' },
]

function PriceTable({ title, tiers, sizes, rows }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-primary-100 bg-white shadow-sm dark:border-primary-800 dark:bg-neutral-800">
      <div className="border-b border-primary-100 bg-primary-50/70 px-5 py-3 dark:border-primary-800 dark:bg-primary-950/60">
        <p className="font-heading text-base font-bold text-primary-800 uppercase dark:text-primary-200">{title}</p>
      </div>
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-xs font-bold text-neutral-500 uppercase dark:border-neutral-700">
            <th className="px-4 py-3">Size</th>
            {tiers.map((t) => (
              <th key={t} className="px-3 py-3 text-right">
                {t}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
          {sizes.map((size) => (
            <tr key={size} className="hover:bg-primary-50/40 dark:hover:bg-white/5">
              <td className="px-4 py-2.5 font-heading font-bold text-primary-800 dark:text-primary-200">
                {size} Inch
              </td>
              {rows[size].map((price, idx) => (
                <td key={idx} className="px-3 py-2.5 text-right tabular-nums">
                  ${price.toFixed(2)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function PricingPage({ onAddToCart }) {
  const [shape, setShape] = useState('rectangle')
  const [patchType, setPatchType] = useState('embroidered')
  const [coverage, setCoverage] = useState('minimum')
  const [size, setSize] = useState(3)
  const [qty, setQty] = useState(100)

  const [embTab, setEmbTab] = useState('minimum')
  const [pvcTab, setPvcTab] = useState('2d')
  const [leatherTab, setLeatherTab] = useState('faux-engraved')

  const unitPrice = useMemo(
    () => lookupUnitPrice({ patchType, coverage, sizeInches: size, qty }),
    [patchType, coverage, size, qty],
  )
  const total = unitPrice * qty
  const currentShape = SHAPES.find((s) => s.id === shape) || SHAPES[0]

  const handleStartOrder = () => {
    onAddToCart({
      id: `${patchType}-${shape}-${size}-${qty}-${coverage}`,
      title: `${patchType.toUpperCase()} Custom Patches`,
      specs: `${size}" ${shape} · ${patchType === 'embroidered' ? `${coverage} coverage` : 'standard finish'}`,
      qty,
      unitPrice,
      totalPrice: total,
    })
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <h1 className="font-heading text-5xl font-black text-primary-800 uppercase sm:text-6xl dark:text-white">
          PATCH PRICING
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-neutral-600 dark:text-neutral-300">
          Prices for every patch type, size and quantity. The more patches you order, the less each one costs.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {[
            'FREE ARTWORK & DESIGN',
            'FREE SETUP',
            'UP TO 7 THREAD COLORS',
            'FREE SHIPPING† (WITHIN THE CONTINENTAL U.S.)',
          ].map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 font-heading text-xs font-bold tracking-wider text-primary-800 uppercase shadow-xs ring-1 ring-primary-200 dark:bg-neutral-800 dark:text-primary-200 dark:ring-primary-800"
            >
              <Check className="size-3.5 text-accent" />
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Interactive PRICE A PATCH Calculator */}
      <section aria-label="PRICE A PATCH" className="price-calc mt-10 rounded-3xl bg-white p-6 shadow-xl sm:p-8 dark:bg-primary-950">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Left Visual Stage */}
          <div className="lg:col-span-5">
            <div className="price-calc-stage relative flex min-h-64 flex-col items-center justify-center p-6">
              <div
                data-material={patchType}
                className="relative grid place-items-center px-6 py-4 text-white shadow-xl transition-all duration-300"
                style={{
                  width: `${Math.min(240, Math.max(105, 85 + size * 22))}px`,
                  height: `${Math.min(180, Math.max(85, 68 + size * 16))}px`,
                  borderRadius: currentShape.radius,
                }}
              >
                <div
                  className="pointer-events-none absolute inset-1.5 border-2 border-dashed border-white/60"
                  style={{ borderRadius: currentShape.radius }}
                />
                <span className="font-heading text-lg font-black tracking-wider uppercase drop-shadow">
                  {size}&quot; {patchType}
                </span>
              </div>

              <div className="mt-5 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 shadow-sm dark:bg-neutral-900/90">
                {SHAPES.map((s) => {
                  const Icon = s.icon
                  const active = shape === s.id
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setShape(s.id)}
                      aria-pressed={active}
                      title={s.label}
                      className={`grid size-8 cursor-pointer place-items-center rounded-full transition ${
                        active ? 'bg-primary-600 text-white' : 'text-primary-700 hover:bg-primary-50 dark:text-primary-200'
                      }`}
                    >
                      <Icon className="size-4" />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Calculator Controls */}
          <div className="space-y-5 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-heading text-2xl font-black text-primary-800 uppercase dark:text-white">
                PRICE A PATCH
              </h2>
              <span className="text-xs font-bold text-neutral-500">Live Table Pricing</span>
            </div>

            {/* Type Pills */}
            <div className="flex flex-wrap gap-2">
              {PATCH_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setPatchType(t.id)}
                  aria-pressed={patchType === t.id}
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 font-heading text-sm font-bold uppercase transition ${
                    patchType === t.id
                      ? 'bg-primary-600 text-white shadow'
                      : 'bg-primary-50 text-primary-800 hover:bg-primary-100 dark:bg-white/10 dark:text-primary-100'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>

            {/* Coverage Switcher */}
            {patchType === 'embroidered' && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-heading text-xs font-bold text-neutral-500 uppercase">Coverage:</span>
                {['minimum', 'moderate', 'full'].map((cov) => (
                  <button
                    key={cov}
                    type="button"
                    onClick={() => setCoverage(cov)}
                    className={`cursor-pointer rounded-full border border-dashed px-3.5 py-1 font-heading text-xs font-bold uppercase transition ${
                      coverage === cov
                        ? 'border-transparent bg-primary-600 text-white'
                        : 'border-primary-300 text-primary-800 hover:bg-primary-50 dark:text-primary-200'
                    }`}
                  >
                    {cov}
                  </button>
                ))}
              </div>
            )}

            {/* Sliders */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="font-heading text-sm font-bold text-neutral-500 uppercase">SIZE</label>
                  <span className="font-heading text-xl font-black text-primary-800 dark:text-white">{size}&quot;</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={7}
                  step={0.5}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="font-heading text-sm font-bold text-neutral-500 uppercase">QTY</label>
                  <span className="font-heading text-xl font-black text-primary-800 dark:text-white">{qty}</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={2000}
                  step={10}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>
            </div>

            {/* Live Total + CTA */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-dashed border-primary-200 pt-4 dark:border-primary-800">
              <div>
                <p className="font-heading text-3xl font-black text-primary-800 dark:text-white">
                  ${total.toFixed(2)}
                </p>
                <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                  ${unitPrice.toFixed(2)} each × {qty}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleStartOrder}
                  className="cursor-pointer rounded-full bg-accent px-6 py-3 font-heading text-base font-black text-white uppercase shadow-md transition hover:bg-accent-600"
                >
                  START THIS ORDER
                </button>
                <Link
                  to="/quote"
                  className="rounded-full bg-primary-700 px-6 py-3 font-heading text-base font-bold text-white uppercase no-underline transition hover:bg-primary-800"
                >
                  GET A PROOF
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Jump Nav */}
      <nav aria-label="Price tables by patch type" className="mt-10 flex flex-wrap justify-center gap-2">
        {PATCH_TYPES.map((t) => (
          <a
            key={t.id}
            href={`#${t.id}-pricing`}
            className="rounded-xl bg-white px-4 py-2 font-heading text-sm font-bold text-primary-800 uppercase no-underline shadow-xs ring-1 ring-primary-200 hover:bg-primary-50 dark:bg-neutral-800 dark:text-primary-200 dark:ring-primary-800"
          >
            {t.name} <span className="text-accent-600">from {t.fromPrice}</span>
          </a>
        ))}
      </nav>

      {/* Full Pricing Tables */}
      <div className="mt-12 space-y-14">
        <section id="embroidered-pricing">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-heading text-3xl font-bold text-primary-800 dark:text-white">
                Embroidered Patch Pricing
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                Embroidered patches start at <strong>$0.47</strong> each. Minimum 10 per design. Delivered in 14 to 22 days after approval and payment.
              </p>
            </div>
            <div className="flex gap-2">
              {[
                ['minimum', 'Minimum'],
                ['moderate', 'Moderate'],
                ['full', 'Full'],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setEmbTab(id)}
                  className={`cursor-pointer rounded-full px-4 py-1.5 font-heading text-sm font-bold uppercase ${
                    embTab === id ? 'bg-primary-600 text-white' : 'bg-white text-primary-800 dark:bg-neutral-800 dark:text-primary-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <PriceTable
            title={`${embTab.charAt(0).toUpperCase() + embTab.slice(1)} Embroidered Patch Pricing`}
            tiers={EMBROIDERED_QTY_TIERS}
            sizes={EMBROIDERED_SIZES}
            rows={EMBROIDERED_COVERAGE_TABLES[embTab]}
          />
        </section>

        <section id="woven-pricing">
          <h2 className="font-heading text-3xl font-bold text-primary-800 dark:text-white">Woven Patch Pricing</h2>
          <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-300">
            Woven patches start at <strong>$0.67</strong> each. Minimum 10 per design. Delivered in 4 to 6 weeks.
          </p>
          <PriceTable
            title="Woven patch prices per patch, by size and quantity"
            tiers={EMBROIDERED_QTY_TIERS}
            sizes={EMBROIDERED_SIZES}
            rows={WOVEN_ROWS}
          />
        </section>

        <section id="pvc-pricing">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-heading text-3xl font-bold text-primary-800 dark:text-white">PVC Patch Pricing</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                PVC patches start at <strong>$0.93</strong> each. Minimum 50 per design. Delivered in 3 to 5 weeks.
              </p>
            </div>
            <div className="flex gap-2">
              {['2d', '3d'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPvcTab(mode)}
                  className={`cursor-pointer rounded-full px-4 py-1.5 font-heading text-sm font-bold uppercase ${
                    pvcTab === mode ? 'bg-primary-600 text-white' : 'bg-white text-primary-800 dark:bg-neutral-800 dark:text-primary-200'
                  }`}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <PriceTable
            title={`${pvcTab.toUpperCase()} PVC Patches`}
            tiers={PVC_QTY_TIERS}
            sizes={PVC_SIZES}
            rows={pvcTab === '2d' ? PVC_2D_ROWS : PVC_3D_ROWS}
          />
        </section>

        <section id="printed-pricing">
          <h2 className="font-heading text-3xl font-bold text-primary-800 dark:text-white">Printed Patch Pricing</h2>
          <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-300">
            Printed patches start at <strong>$1.26</strong> each. Minimum 10 per design. Delivered in 3 to 5 weeks.
          </p>
          <PriceTable
            title="Printed patch prices per patch, by size and quantity"
            tiers={EMBROIDERED_QTY_TIERS}
            sizes={EMBROIDERED_SIZES}
            rows={PRINTED_ROWS}
          />
        </section>

        <section id="name-pricing">
          <h2 className="font-heading text-3xl font-bold text-primary-800 dark:text-white">Name Patch Pricing</h2>
          <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-300">
            Name patches start at <strong>$1.85</strong> each. Minimum 10 per design. Delivered in 2 to 3 weeks.
          </p>
          <PriceTable
            title="Name patch prices per patch, by size and quantity"
            tiers={NAME_QTY_TIERS}
            sizes={NAME_SIZES}
            rows={NAME_ROWS}
          />
        </section>

        <section id="leather-pricing">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-heading text-3xl font-bold text-primary-800 dark:text-white">
                Leather Patch Pricing
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                Leather patches start at <strong>$0.75</strong> each. Minimum 25 per design. Delivered in 2 to 3 weeks.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(LEATHER_VARIANTS).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setLeatherTab(key)}
                  className={`cursor-pointer rounded-full px-3 py-1 font-heading text-xs font-bold uppercase ${
                    leatherTab === key ? 'bg-primary-600 text-white' : 'bg-white text-primary-800 dark:bg-neutral-800 dark:text-primary-200'
                  }`}
                >
                  {key.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
          <PriceTable
            title={LEATHER_VARIANTS[leatherTab].label}
            tiers={LEATHER_QTY_TIERS}
            sizes={LEATHER_SIZES}
            rows={LEATHER_VARIANTS[leatherTab].rows}
          />
        </section>
      </div>
    </main>
  )
}
