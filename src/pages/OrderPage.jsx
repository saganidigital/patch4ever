import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Check,
  CheckCircle2,
  Circle,
  Hexagon,
  Mail,
  Phone,
  RectangleHorizontal,
  Shield,
  ShoppingCart,
  Sparkles,
  Upload,
  X,
  Zap,
} from 'lucide-react'
import { lookupUnitPrice } from '../data/pricingData'
import { CONTACT, PATCH_TYPES } from '../data/siteData'
import { createOrder, loadCatalogConfig } from '../data/orderStore'

const SHAPES = [
  { id: 'Rectangle', label: 'Rectangle', icon: RectangleHorizontal },
  { id: 'Circle / Oval', label: 'Circle / Oval', icon: Circle },
  { id: 'Shield', label: 'Shield', icon: Shield },
  { id: 'Hexagon', label: 'Hexagon', icon: Hexagon },
  { id: 'Die-Cut Custom', label: 'Die-Cut Custom', icon: Sparkles },
]

const DIMENSIONS = ['1.00', '1.50', '2.00', '2.50', '3.00', '3.50', '4.00', '4.50', '5.00', '5.50', '6.00', '6.50', '7.00']
const QUICK_SIZES = ['2.00', '2.50', '3.00', '3.50', '4.00']
const QTY_TIERS = [10, 20, 50, 100, 200, 300, 500, 1000, 2000]

export default function OrderPage({ onAddToCart }) {
  const [searchParams] = useSearchParams()
  const catalog = useMemo(() => loadCatalogConfig(), [])

  const enabledTypes = useMemo(() => {
    const enabledIds = new Set(catalog.patchTypes.filter((t) => t.enabled).map((t) => t.id))
    return PATCH_TYPES.filter((t) => enabledIds.has(t.id))
  }, [catalog])

  const initialPatch = searchParams.get('patch') || 'embroidered'
  const initialQty = Number(searchParams.get('qty')) || 100

  const [patchType, setPatchType] = useState(
    enabledTypes.some((t) => t.id === initialPatch) ? initialPatch : enabledTypes[0]?.id || 'embroidered',
  )
  const [shape, setShape] = useState('Rectangle')
  const [width, setWidth] = useState('3.00')
  const [height, setHeight] = useState('3.00')
  const [coverage, setCoverage] = useState('moderate')
  const [pvcStyle, setPvcStyle] = useState('2D')
  const [leatherStyle, setLeatherStyle] = useState('Faux Leather · Laser Engraved')
  const [borderId, setBorderId] = useState(catalog.borders.find((b) => b.enabled)?.id || 'merrowed')
  const [backingId, setBackingId] = useState('iron-on')
  const [selectedUpgrades, setSelectedUpgrades] = useState([])
  const [qty, setQty] = useState(initialQty)
  const [rush, setRush] = useState(false)

  // Artwork & customer details
  const [artworkFile, setArtworkFile] = useState(null)
  const [notes, setNotes] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [address, setAddress] = useState('')
  const [inHandsDate, setInHandsDate] = useState('')
  const [placedOrder, setPlacedOrder] = useState(null)

  const typeConfig = catalog.patchTypes.find((t) => t.id === patchType) || catalog.patchTypes[0]
  const activeBorder = catalog.borders.find((b) => b.id === borderId) || catalog.borders[0]
  const activeBacking = catalog.backings.find((b) => b.id === backingId) || catalog.backings[0]
  const enabledBorders = catalog.borders.filter((b) => b.enabled)
  const enabledBackings = catalog.backings.filter((b) => b.enabled)
  const enabledUpgrades = catalog.upgrades.filter((u) => u.enabled)

  const avgSize = useMemo(() => Number(((Number(width) + Number(height)) / 2).toFixed(2)), [width, height])

  const effectiveQty = Math.max(typeConfig?.minQty || 10, qty)

  const pricing = useMemo(() => {
    const baseUnit = lookupUnitPrice({
      patchType,
      coverage: patchType === 'embroidered' ? coverage : 'minimum',
      sizeInches: avgSize,
      qty: effectiveQty,
    })
    const pvcMultiplier = patchType === 'pvc' && pvcStyle === '3D' ? 1.18 : 1
    const leatherMultiplier = patchType === 'leather' && leatherStyle.startsWith('Genuine') ? 1.28 : 1
    const adjustedBase = Number((baseUnit * pvcMultiplier * leatherMultiplier).toFixed(2))

    const borderExtra = activeBorder?.pricePerPatch || 0
    const backingExtra = activeBacking?.pricePerPatch || 0
    const upgradesExtra = selectedUpgrades.reduce((sum, id) => {
      const upg = catalog.upgrades.find((u) => u.id === id)
      return sum + (upg ? upg.pricePerPatch : 0)
    }, 0)
    const rushExtra = rush && typeConfig?.rushAvailable ? typeConfig.rushFeePerPatch || 0.45 : 0

    const unitPrice = Number((adjustedBase + borderExtra + backingExtra + upgradesExtra + rushExtra).toFixed(2))
    const totalPrice = Number((unitPrice * effectiveQty).toFixed(2))
    return { adjustedBase, borderExtra, backingExtra, upgradesExtra, rushExtra, unitPrice, totalPrice }
  }, [patchType, coverage, pvcStyle, leatherStyle, avgSize, effectiveQty, activeBorder, activeBacking, selectedUpgrades, rush, typeConfig, catalog])

  const finishLabel =
    patchType === 'embroidered'
      ? `${coverage === 'minimum' ? '50% Minimum' : coverage === 'moderate' ? '75% Moderate' : '100% Full'} Embroidery`
      : patchType === 'pvc'
        ? `${pvcStyle} Molded PVC`
        : patchType === 'leather'
          ? leatherStyle
          : patchType === 'woven'
            ? 'Standard Fine Weave'
            : patchType === 'printed'
              ? 'Full-Color Dye Sublimation'
              : 'Standard Name Twill'

  const toggleUpgrade = (id) => {
    setSelectedUpgrades((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    setArtworkFile({ name: file.name, sizeKb: Math.max(1, Math.round(file.size / 1024)), previewUrl })
  }

  const handleAddOrderToCart = () => {
    onAddToCart({
      id: `order-${patchType}-${shape}-${width}x${height}-${backingId}-${effectiveQty}-${rush ? 'rush' : 'std'}`,
      title: `${typeConfig.name} Custom Patches`,
      specs: `${width}"×${height}" ${shape} · ${finishLabel} · ${activeBacking.name}${rush ? ' · RUSH' : ''}`,
      qty: effectiveQty,
      unitPrice: pricing.unitPrice,
      totalPrice: pricing.totalPrice,
    })
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault()
    if (!customerName.trim() || !email.trim()) return

    const upgradeNames = selectedUpgrades
      .map((id) => catalog.upgrades.find((u) => u.id === id)?.name)
      .filter(Boolean)

    const saved = createOrder({
      source: 'Order Page',
      patchType,
      shape,
      width,
      height,
      size: avgSize,
      coverage: finishLabel,
      border: activeBorder.name,
      backing: activeBacking.name,
      upgrades: upgradeNames,
      qty: effectiveQty,
      rush: Boolean(rush && typeConfig?.rushAvailable),
      unitPrice: pricing.unitPrice,
      totalPrice: pricing.totalPrice,
      customerName: customerName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: company.trim(),
      address: address.trim(),
      inHandsDate,
      artworkName: artworkFile?.name || 'No file uploaded yet',
      notes: notes.trim(),
    })

    setPlacedOrder(saved)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main id="builder" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-12">
      {/* Header Banner */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-heading text-xs font-black tracking-widest text-accent-600 uppercase dark:text-accent-400">
            CUSTOM PATCH ORDER BUILDER
          </p>
          <h1 className="mt-1 font-heading text-4xl font-black text-primary-800 uppercase sm:text-5xl dark:text-white">
            Make Your Own Custom Patches
          </h1>
          <p className="mt-2 max-w-2xl text-base text-neutral-600 sm:text-lg dark:text-neutral-300">
            Configure every detail below with live pricing. Free digital proof &amp; unlimited revisions included—nothing goes to production until you approve.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-bold text-primary-800 dark:text-primary-200">
          {['Free Artwork & Proof', 'No Setup Fees', 'Free US Shipping†'].map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 shadow-xs ring-1 ring-primary-200 dark:bg-neutral-800 dark:ring-primary-800"
            >
              <Check className="size-3.5 text-accent" />
              {badge}
            </span>
          ))}
        </div>
      </div>

      {placedOrder ? (
        <div className="stitched-card rounded-3xl bg-white p-8 text-center shadow-xl sm:p-12 dark:bg-neutral-800">
          <CheckCircle2 className="mx-auto size-16 text-primary-600 dark:text-primary-400" />
          <p className="mt-4 font-heading text-sm font-black tracking-widest text-accent uppercase">
            ORDER #{placedOrder.id} CONFIRMED
          </p>
          <h2 className="mt-1 font-heading text-4xl font-black text-primary-800 uppercase dark:text-white">
            We&apos;re Drawing Your Free Proof!
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-neutral-600 dark:text-neutral-300">
            Thank you, <strong>{placedOrder.customerName}</strong>! Your order for{' '}
            <strong>
              {placedOrder.qty} × {placedOrder.width}&quot;×{placedOrder.height}&quot; {placedOrder.patchType} patches
            </strong>{' '}
            (${placedOrder.totalPrice.toFixed(2)}) has been logged in our production queue. We&apos;ll send your digital proof to{' '}
            <strong>{placedOrder.email}</strong> within 1–2 business days.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setPlacedOrder(null)}
              className="cursor-pointer rounded-full bg-accent px-7 py-3 font-heading text-base font-black text-white uppercase shadow hover:bg-accent-600"
            >
              Build Another Patch Order
            </button>
            <Link
              to="/admin"
              className="rounded-full bg-primary-800 px-7 py-3 font-heading text-base font-bold text-white uppercase no-underline shadow hover:bg-primary-900"
            >
              View in Admin Panel →
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* LEFT COLUMN: 9-Step Order Builder */}
          <div className="space-y-7 lg:col-span-8">
            {/* Step 1: Patch Category / Type */}
            <section className="stitched-card rounded-3xl bg-white p-6 shadow-sm sm:p-8 dark:bg-neutral-800">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-heading text-2xl font-bold text-primary-800 uppercase dark:text-white">
                  1. Choose Patch Type
                </h2>
                <span className="text-xs font-semibold text-neutral-500">Min {typeConfig?.minQty || 10} patches</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {enabledTypes.map((type) => {
                  const selected = patchType === type.id
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => {
                        setPatchType(type.id)
                        const cfg = catalog.patchTypes.find((c) => c.id === type.id)
                        if (cfg && qty < cfg.minQty) setQty(cfg.minQty)
                        if (!cfg?.rushAvailable) setRush(false)
                      }}
                      className={`relative cursor-pointer rounded-2xl border-2 p-3 text-center transition ${
                        selected
                          ? 'border-accent bg-accent/5 ring-2 ring-accent/25'
                          : 'border-neutral-200 hover:border-primary-300 dark:border-neutral-700'
                      }`}
                    >
                      {type.badge && (
                        <span
                          className={`absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-0.5 font-heading text-[10px] font-black text-white uppercase ${
                            type.badgeTone === 'accent' ? 'bg-accent' : 'bg-primary-600'
                          }`}
                        >
                          {type.badge}
                        </span>
                      )}
                      <img src={type.image} alt={type.name} className="mx-auto aspect-square w-20 rounded-xl object-cover" />
                      <p className="mt-2 font-heading text-base font-bold text-primary-800 uppercase dark:text-white">
                        {type.name}
                      </p>
                      <p className="text-xs text-neutral-500">from {type.fromPrice}</p>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Step 2: Shape & Dimensions */}
            <section className="stitched-card rounded-3xl bg-white p-6 shadow-sm sm:p-8 dark:bg-neutral-800">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-heading text-2xl font-bold text-primary-800 uppercase dark:text-white">
                  2. Patch Shape &amp; Size
                </h2>
                <span className="rounded-full bg-primary-50 px-3 py-1 text-sm font-bold text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                  Priced Size: {avgSize}&quot;
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {SHAPES.map((s) => {
                  const Icon = s.icon
                  const active = shape === s.id
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setShape(s.id)}
                      className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border-2 px-3.5 py-2 font-heading text-sm font-bold uppercase transition ${
                        active
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : 'border-neutral-200 text-primary-800 hover:bg-primary-50 dark:border-neutral-700 dark:text-primary-100'
                      }`}
                    >
                      <Icon className="size-4" />
                      {s.label}
                    </button>
                  )
                })}
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-bold">Width (inches)</label>
                  <select
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                  >
                    {DIMENSIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}&quot;
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold">Height (inches)</label>
                  <select
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                  >
                    {DIMENSIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}&quot;
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-neutral-500 uppercase">Quick Pick:</span>
                {QUICK_SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setWidth(s)
                      setHeight(s)
                    }}
                    className={`cursor-pointer rounded-full border px-3.5 py-1 text-sm font-bold transition ${
                      width === s && height === s
                        ? 'border-primary-600 bg-primary-600 text-white'
                        : 'border-neutral-300 hover:bg-primary-50 dark:border-neutral-700'
                    }`}
                  >
                    {Number(s)}&quot;
                  </button>
                ))}
              </div>
            </section>

            {/* Step 3: Coverage / Finish & Border */}
            <section className="stitched-card rounded-3xl bg-white p-6 shadow-sm sm:p-8 dark:bg-neutral-800">
              {patchType === 'embroidered' && (
                <div className="mb-7">
                  <h2 className="font-heading text-2xl font-bold text-primary-800 uppercase dark:text-white">
                    3. Embroidery Coverage
                  </h2>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {[
                      { id: 'minimum', label: '50% Minimum', desc: 'Twill background visible' },
                      { id: 'moderate', label: '75% Moderate', desc: 'Balanced stitched detail' },
                      { id: 'full', label: '100% Full', desc: 'Completely stitched surface' },
                    ].map((cov) => (
                      <button
                        key={cov.id}
                        type="button"
                        onClick={() => setCoverage(cov.id)}
                        className={`cursor-pointer rounded-xl border-2 p-3.5 text-left transition ${
                          coverage === cov.id
                            ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/60'
                            : 'border-neutral-200 dark:border-neutral-700'
                        }`}
                      >
                        <p className="font-heading text-base font-bold text-primary-800 uppercase dark:text-white">
                          {cov.label}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-300">{cov.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {patchType === 'pvc' && (
                <div className="mb-7">
                  <h2 className="font-heading text-2xl font-bold text-primary-800 uppercase dark:text-white">
                    3. PVC Mold Dimension
                  </h2>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {['2D', '3D'].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setPvcStyle(mode)}
                        className={`cursor-pointer rounded-xl border-2 p-3.5 text-left transition ${
                          pvcStyle === mode
                            ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/60'
                            : 'border-neutral-200 dark:border-neutral-700'
                        }`}
                      >
                        <p className="font-heading text-lg font-bold text-primary-800 dark:text-white">{mode} Relief</p>
                        <p className="text-xs text-neutral-500">
                          {mode === '2D' ? 'Flat layered levels' : 'Sculpted contoured 3D (+18%)'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {patchType === 'leather' && (
                <div className="mb-7">
                  <h2 className="font-heading text-2xl font-bold text-primary-800 uppercase dark:text-white">
                    3. Leather Material &amp; Imprint
                  </h2>
                  <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {[
                      'Faux Leather · Laser Engraved',
                      'Faux Leather · UV Printed',
                      'Genuine Leather · Laser Engraved',
                      'Genuine Leather · Debossed',
                    ].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setLeatherStyle(opt)}
                        className={`cursor-pointer rounded-xl border-2 px-4 py-3 text-left font-heading text-sm font-bold transition ${
                          leatherStyle === opt
                            ? 'border-primary-600 bg-primary-50 text-primary-800 dark:bg-primary-900/60 dark:text-white'
                            : 'border-neutral-200 text-neutral-700 dark:border-neutral-700 dark:text-neutral-200'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <h2 className="font-heading text-2xl font-bold text-primary-800 uppercase dark:text-white">
                4. Border Style
              </h2>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {enabledBorders.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBorderId(b.id)}
                    className={`cursor-pointer rounded-xl border-2 p-4 text-left transition ${
                      borderId === b.id
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/60'
                        : 'border-neutral-200 dark:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-heading text-lg font-bold text-primary-800 dark:text-white">{b.name}</p>
                      <span className="text-xs font-bold text-primary-700 dark:text-primary-300">
                        {b.pricePerPatch > 0 ? `+$${b.pricePerPatch.toFixed(2)}/ea` : 'Free'}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-600 dark:text-neutral-300">{b.note}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Step 5: Backing Option */}
            <section className="stitched-card rounded-3xl bg-white p-6 shadow-sm sm:p-8 dark:bg-neutral-800">
              <h2 className="font-heading text-2xl font-bold text-primary-800 uppercase dark:text-white">
                5. Backing Option
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {enabledBackings.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBackingId(b.id)}
                    className={`cursor-pointer rounded-xl border-2 p-3 text-left transition ${
                      backingId === b.id
                        ? 'border-accent bg-accent/5'
                        : 'border-neutral-200 hover:border-primary-300 dark:border-neutral-700'
                    }`}
                  >
                    <p className="font-heading text-sm font-bold text-primary-800 uppercase dark:text-white">{b.name}</p>
                    <p className="mt-0.5 text-[11px] font-bold text-accent-600">
                      {b.pricePerPatch > 0 ? `+$${b.pricePerPatch.toFixed(2)}/patch` : 'Free'}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            {/* Step 6: Upgrades & Quantity + Rush */}
            <section className="stitched-card rounded-3xl bg-white p-6 shadow-sm sm:p-8 dark:bg-neutral-800">
              <h2 className="font-heading text-2xl font-bold text-primary-800 uppercase dark:text-white">
                6. Thread &amp; Packaging Upgrades
              </h2>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {enabledUpgrades.map((u) => {
                  const checked = selectedUpgrades.includes(u.id)
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => toggleUpgrade(u.id)}
                      className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        checked
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : 'border-neutral-300 hover:bg-primary-50 dark:border-neutral-700'
                      }`}
                    >
                      {checked && <Check className="size-3.5" />}
                      {u.name}{' '}
                      <span className="opacity-80">(+${u.pricePerPatch.toFixed(2)})</span>
                    </button>
                  )
                })}
              </div>

              <div className="mt-7">
                <h2 className="font-heading text-2xl font-bold text-primary-800 uppercase dark:text-white">
                  7. Quantity &amp; Turnaround
                </h2>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <input
                    type="number"
                    min={typeConfig?.minQty || 10}
                    max={50000}
                    value={effectiveQty}
                    onChange={(e) => setQty(Math.max(typeConfig?.minQty || 10, Number(e.target.value) || 10))}
                    className="w-32 rounded-xl border border-neutral-300 bg-white px-3.5 py-2 font-heading text-lg font-bold dark:border-neutral-700 dark:bg-neutral-900"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {QTY_TIERS.filter((t) => t >= (typeConfig?.minQty || 10)).map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setQty(tier)}
                        className={`cursor-pointer rounded-full border px-3.5 py-1 text-sm font-bold transition ${
                          effectiveQty === tier
                            ? 'border-accent bg-accent text-white'
                            : 'border-neutral-300 hover:bg-primary-50 dark:border-neutral-700'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                {typeConfig?.rushAvailable && (
                  <label className="mt-4 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border-2 border-accent/40 bg-accent/5 p-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={rush}
                        onChange={(e) => setRush(e.target.checked)}
                        className="size-5 accent-accent"
                      />
                      <div>
                        <p className="inline-flex items-center gap-1.5 font-heading text-base font-black text-primary-800 uppercase dark:text-white">
                          <Zap className="size-4 fill-accent text-accent" />
                          Rush Turnaround (5–10 Business Days)
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-300">
                          Expedited embroidered production &amp; priority air shipping.
                        </p>
                      </div>
                    </div>
                    <span className="font-heading text-sm font-black text-accent-600">
                      +${(typeConfig.rushFeePerPatch || 0.45).toFixed(2)}/ea
                    </span>
                  </label>
                )}
              </div>
            </section>

            {/* Step 8: Artwork Upload & Design Notes */}
            <section className="stitched-card rounded-3xl bg-white p-6 shadow-sm sm:p-8 dark:bg-neutral-800">
              <h2 className="font-heading text-2xl font-bold text-primary-800 uppercase dark:text-white">
                8. Artwork &amp; Design Notes
              </h2>
              <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary-300 bg-primary-50/40 p-7 text-center transition hover:bg-primary-50 dark:border-primary-700 dark:bg-primary-950/40">
                <Upload className="size-8 text-primary-600 dark:text-primary-300" />
                <span className="mt-2 font-heading text-lg font-bold text-primary-800 dark:text-white">
                  Upload logo, sketch, or reference image
                </span>
                <span className="mt-1 text-xs text-neutral-500">JPG, PNG, PDF, AI, EPS, SVG, PSD up to 25MB</span>
                <input type="file" className="sr-only" onChange={handleFileChange} />
              </label>

              {artworkFile && (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-neutral-100 px-3.5 py-2.5 dark:bg-neutral-700">
                  <div className="flex items-center gap-3">
                    {artworkFile.previewUrl && (
                      <img src={artworkFile.previewUrl} alt="Artwork preview" className="size-12 rounded-lg object-cover" />
                    )}
                    <div className="text-sm">
                      <p className="font-bold">{artworkFile.name}</p>
                      <p className="text-xs text-neutral-500">{artworkFile.sizeKb} KB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setArtworkFile(null)}
                    className="rounded p-1 text-neutral-400 hover:text-red-500"
                    aria-label="Remove file"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )}

              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Thread colors, Pantone codes, border color, or special instructions..."
                className="mt-4 w-full rounded-xl border border-neutral-300 bg-white p-3.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
              />
            </section>

            {/* Step 9: Customer & Shipping Info */}
            <section className="stitched-card rounded-3xl bg-white p-6 shadow-sm sm:p-8 dark:bg-neutral-800">
              <h2 className="font-heading text-2xl font-bold text-primary-800 uppercase dark:text-white">
                9. Contact &amp; Shipping Details
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-bold">Full Name *</label>
                  <input
                    required
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold">Email *</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold">Company / Organization</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Team or Brand Name"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold">Shipping Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, City, State, ZIP"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold">In-Hands Date (optional)</label>
                  <input
                    type="date"
                    value={inHandsDate}
                    onChange={(e) => setInHandsDate(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Sticky Live Order Summary */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:col-span-4">
            <div className="stitched-card rounded-3xl bg-white p-6 shadow-lg dark:bg-neutral-800">
              <p className="font-heading text-xs font-black tracking-widest text-accent-600 uppercase">
                LIVE ORDER SUMMARY
              </p>
              <h2 className="mt-1 font-heading text-2xl font-black text-primary-800 uppercase dark:text-white">
                {typeConfig?.name} Patches
              </h2>

              <dl className="mt-4 divide-y divide-neutral-100 text-sm dark:divide-neutral-700">
                <div className="flex justify-between py-2">
                  <dt className="text-neutral-500">Shape &amp; Size</dt>
                  <dd className="font-bold">
                    {shape} · {width}&quot;×{height}&quot;
                  </dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-neutral-500">Finish</dt>
                  <dd className="font-bold text-right">{finishLabel}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-neutral-500">Border</dt>
                  <dd className="font-bold">{activeBorder?.name}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-neutral-500">Backing</dt>
                  <dd className="font-bold">{activeBacking?.name}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-neutral-500">Quantity</dt>
                  <dd className="font-bold">{effectiveQty} patches</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-neutral-500">Turnaround</dt>
                  <dd className="font-bold">
                    {rush && typeConfig?.rushAvailable ? '⚡ Rush (5–10 days)' : typeConfig?.turnaround}
                  </dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-neutral-500">Shipping (US)</dt>
                  <dd className="font-bold text-primary-700 dark:text-primary-300">FREE†</dd>
                </div>
              </dl>

              <div className="mt-4 border-t-2 border-dashed border-primary-200 pt-4 dark:border-primary-700">
                <div className="flex items-baseline justify-between">
                  <span className="font-heading text-lg font-bold uppercase">Estimated Total</span>
                  <span className="font-heading text-3xl font-black text-primary-800 dark:text-white">
                    ${pricing.totalPrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-right text-xs font-semibold text-neutral-500">
                  ${pricing.unitPrice.toFixed(2)} each × {effectiveQty}
                </p>
              </div>

              <div className="mt-5 space-y-2.5">
                <button
                  type="submit"
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent py-3.5 font-heading text-lg font-black text-white uppercase shadow-lg transition hover:bg-accent-600"
                >
                  Place Order &amp; Get Free Proof →
                </button>
                <button
                  type="button"
                  onClick={handleAddOrderToCart}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-primary-600 bg-transparent py-2.5 font-heading text-base font-bold text-primary-700 uppercase transition hover:bg-primary-50 dark:border-primary-400 dark:text-primary-200 dark:hover:bg-white/10"
                >
                  <ShoppingCart className="size-4" />
                  Add to Cart
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-primary-800 p-5 text-white shadow-md">
              <p className="font-heading text-lg font-black uppercase">Need a Hand?</p>
              <div className="mt-3 space-y-2 text-sm font-bold">
                <a href={CONTACT.phoneHref} className="flex items-center gap-2 text-white no-underline hover:text-accent-300">
                  <Phone className="size-4 text-accent" />
                  {CONTACT.phone}
                </a>
                <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 text-white no-underline hover:text-accent-300">
                  <Mail className="size-4 text-accent" />
                  {CONTACT.email}
                </a>
              </div>
            </div>
          </aside>
        </form>
      )}
    </main>
  )
}
