import { useMemo, useState } from 'react'
import { Check, CheckCircle2, Mail, Phone, Upload, X } from 'lucide-react'
import { CONTACT, PATCH_TYPES } from '../data/siteData'

const DIMENSIONS = ['0.50', '1.00', '1.50', '2.00', '2.50', '3.00', '3.50', '4.00', '4.50', '5.00', '6.00', '7.00', '8.00', '10.00', '12.00']
const QUICK_SIZES = ['2', '2.5', '3', '3.5', '4']
const QUICK_QTYS = [10, 25, 50, 100, 250, 500, 1000]

const BACKINGS = [
  { id: 'no-backing', label: 'No Backing', note: 'Standard sew-on' },
  { id: 'pvc', label: 'PVC', note: 'Free' },
  { id: 'iron-on', label: 'Iron On', note: 'Heat seal' },
  { id: 'peel-stick', label: 'Peel & Stick', note: 'Temporary' },
  { id: 'velcro', label: 'Velcro', note: 'Hook & Loop' },
  { id: 'magnet', label: 'Magnet', note: 'Magnetic hold' },
  { id: 'button-loop', label: 'Button Loop', note: 'Uniform loop' },
  { id: 'safety-pin', label: 'Safety Pin', note: 'Pin back' },
  { id: 'clutch-pin', label: 'Clutch Pin', note: 'Butterfly clutch' },
  { id: 'key-ring', label: 'Key Ring', note: 'Keychain loop' },
]

const ADDONS = [
  'Glow-in-the-dark Thread',
  'Metallic Thread',
  'Neon Thread',
  'Plastic Pouch',
  'Individual Packaging',
]

export default function QuotePage() {
  const [patchType, setPatchType] = useState('embroidered')
  const [width, setWidth] = useState('3.00')
  const [height, setHeight] = useState('3.00')
  const [coverage, setCoverage] = useState('75%')
  const [border, setBorder] = useState('Merrowed')
  const [backing, setBacking] = useState('iron-on')
  const [addons, setAddons] = useState([])
  const [qty, setQty] = useState(100)
  const [files, setFiles] = useState([])
  const [notes, setNotes] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [inHandsDate, setInHandsDate] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const avgSize = useMemo(() => {
    const val = (Number(width) + Number(height)) / 2
    return val.toFixed(2)
  }, [width, height])

  const toggleAddon = (name) => {
    setAddons((prev) => (prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]))
  }

  const handleFiles = (fileList) => {
    if (!fileList) return
    const incoming = Array.from(fileList).map((f) => ({
      name: f.name,
      sizeKb: Math.max(1, Math.round(f.size / 1024)),
    }))
    setFiles((prev) => [...prev, ...incoming])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim()) return
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <h1 className="font-heading text-4xl font-black text-primary-800 uppercase sm:text-5xl dark:text-white">
          Free Quote
        </h1>
        <p className="mt-2 text-lg text-neutral-600 dark:text-neutral-300">
          We’ll send a proof and price estimate. You only pay after you approve.
        </p>
      </div>

      {submitted ? (
        <div className="stitched-card rounded-3xl bg-white p-10 text-center shadow-lg dark:bg-neutral-800">
          <CheckCircle2 className="mx-auto size-14 text-primary-600 dark:text-primary-400" />
          <h2 className="mt-4 font-heading text-3xl font-black text-primary-800 uppercase dark:text-white">
            Quote Request Received!
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-neutral-600 dark:text-neutral-300">
            Thank you, <strong>{fullName}</strong>! Our design team is preparing your digital proof and estimate for{' '}
            <strong>
              {qty} × {avgSize}&quot; {patchType}
            </strong>{' '}
            patches and will send it to <strong>{email}</strong> within 1–2 business days.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-6 cursor-pointer rounded-full bg-accent px-7 py-3 font-heading text-base font-bold text-white uppercase hover:bg-accent-600"
          >
            Submit Another Quote
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <form onSubmit={handleSubmit} className="space-y-8 lg:col-span-8">
            {/* Step 1: Patch Type */}
            <section className="stitched-card rounded-3xl bg-white p-6 shadow-sm sm:p-8 dark:bg-neutral-800">
              <h2 className="font-heading text-2xl font-bold text-primary-800 uppercase dark:text-white">
                1. Patch Type
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {PATCH_TYPES.map((type) => {
                  const selected = patchType === type.id
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setPatchType(type.id)}
                      className={`cursor-pointer rounded-2xl border-2 p-3 text-left transition ${
                        selected
                          ? 'border-accent bg-accent/5 ring-2 ring-accent/30'
                          : 'border-neutral-200 hover:border-primary-300 dark:border-neutral-700'
                      }`}
                    >
                      <img src={type.image} alt={type.name} className="mx-auto aspect-square w-20 rounded-xl object-cover" />
                      <p className="mt-2 text-center font-heading text-base font-bold text-primary-800 uppercase dark:text-white">
                        {type.name}
                      </p>
                      <p className="text-center text-xs text-neutral-500">from {type.fromPrice}</p>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Step 2: Patch Size */}
            <section className="stitched-card rounded-3xl bg-white p-6 shadow-sm sm:p-8 dark:bg-neutral-800">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-heading text-2xl font-bold text-primary-800 uppercase dark:text-white">
                  2. Patch Size
                </h2>
                <span className="rounded-full bg-primary-50 px-3 py-1 text-sm font-bold text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                  Calculated Size: {avgSize}&quot;
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-bold">Width (inches)</label>
                  <select
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
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
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
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
                      const val = Number(s).toFixed(2)
                      setWidth(val)
                      setHeight(val)
                    }}
                    className={`cursor-pointer rounded-full border px-3.5 py-1 text-sm font-bold transition ${
                      Number(width) === Number(s) && Number(height) === Number(s)
                        ? 'border-primary-600 bg-primary-600 text-white'
                        : 'border-neutral-300 hover:bg-primary-50 dark:border-neutral-700 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {s}&quot;
                  </button>
                ))}
              </div>
            </section>

            {/* Step 3 & 4: Coverage + Border */}
            <section className="stitched-card rounded-3xl bg-white p-6 shadow-sm sm:p-8 dark:bg-neutral-800">
              {patchType === 'embroidered' && (
                <div className="mb-7">
                  <h2 className="font-heading text-2xl font-bold text-primary-800 uppercase dark:text-white">
                    3. Embroidery Coverage
                  </h2>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {['50%', '75%', '100%'].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setCoverage(pct)}
                        className={`cursor-pointer rounded-xl border-2 py-3 font-heading text-lg font-bold transition ${
                          coverage === pct
                            ? 'border-primary-600 bg-primary-50 text-primary-800 dark:bg-primary-900 dark:text-white'
                            : 'border-neutral-200 dark:border-neutral-700'
                        }`}
                      >
                        {pct}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <h2 className="font-heading text-2xl font-bold text-primary-800 uppercase dark:text-white">
                {patchType === 'embroidered' ? '4. Border' : '3. Border'}
              </h2>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { name: 'Merrowed', note: 'Recommended — classic stitched edge' },
                  { name: 'Hot Cut', note: 'Laser cut for irregular/custom shapes' },
                ].map((b) => (
                  <button
                    key={b.name}
                    type="button"
                    onClick={() => setBorder(b.name)}
                    className={`cursor-pointer rounded-xl border-2 p-4 text-left transition ${
                      border === b.name
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/60'
                        : 'border-neutral-200 dark:border-neutral-700'
                    }`}
                  >
                    <p className="font-heading text-lg font-bold text-primary-800 dark:text-white">{b.name}</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300">{b.note}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Step 5: Backing */}
            <section className="stitched-card rounded-3xl bg-white p-6 shadow-sm sm:p-8 dark:bg-neutral-800">
              <h2 className="font-heading text-2xl font-bold text-primary-800 uppercase dark:text-white">
                5. Backing
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
                {BACKINGS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBacking(b.id)}
                    className={`cursor-pointer rounded-xl border-2 p-3 text-left transition ${
                      backing === b.id
                        ? 'border-accent bg-accent/5'
                        : 'border-neutral-200 hover:border-primary-300 dark:border-neutral-700'
                    }`}
                  >
                    <p className="font-heading text-sm font-bold text-primary-800 uppercase dark:text-white">{b.label}</p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{b.note}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Step 6 & 7: Add-ons & Quantity */}
            <section className="stitched-card rounded-3xl bg-white p-6 shadow-sm sm:p-8 dark:bg-neutral-800">
              <h2 className="font-heading text-2xl font-bold text-primary-800 uppercase dark:text-white">
                6. Add-ons
              </h2>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {ADDONS.map((addon) => {
                  const checked = addons.includes(addon)
                  return (
                    <button
                      key={addon}
                      type="button"
                      onClick={() => toggleAddon(addon)}
                      className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        checked
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : 'border-neutral-300 hover:bg-primary-50 dark:border-neutral-700 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {checked && <Check className="size-3.5" />}
                      {addon}
                    </button>
                  )
                })}
              </div>

              <div className="mt-7">
                <h2 className="font-heading text-2xl font-bold text-primary-800 uppercase dark:text-white">
                  7. Quantity
                </h2>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <input
                    type="number"
                    min={10}
                    max={50000}
                    value={qty}
                    onChange={(e) => setQty(Math.max(10, Number(e.target.value) || 10))}
                    className="w-32 rounded-xl border border-neutral-300 bg-white px-3.5 py-2 font-heading text-lg font-bold dark:border-neutral-700 dark:bg-neutral-900"
                  />
                  <div className="flex flex-wrap gap-2">
                    {QUICK_QTYS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setQty(q)}
                        className={`cursor-pointer rounded-full border px-3.5 py-1 text-sm font-bold ${
                          qty === q
                            ? 'border-accent bg-accent text-white'
                            : 'border-neutral-300 hover:bg-primary-50 dark:border-neutral-700'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Step 8 & 9: Artwork Upload & Design Details */}
            <section className="stitched-card rounded-3xl bg-white p-6 shadow-sm sm:p-8 dark:bg-neutral-800">
              <h2 className="font-heading text-2xl font-bold text-primary-800 uppercase dark:text-white">
                8. Artwork Upload
              </h2>
              <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary-300 bg-primary-50/40 p-8 text-center transition hover:bg-primary-50 dark:border-primary-700 dark:bg-primary-950/40">
                <Upload className="size-9 text-primary-600 dark:text-primary-300" />
                <span className="mt-2 font-heading text-lg font-bold text-primary-800 dark:text-white">
                  Drop your design or click to browse
                </span>
                <span className="mt-1 text-xs text-neutral-500">
                  JPG, PNG, GIF, PDF, AI, EPS, SVG, PSD, up to 25MB
                </span>
                <input
                  type="file"
                  multiple
                  className="sr-only"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </label>

              {files.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {files.map((f, i) => (
                    <li key={`${f.name}-${i}`} className="flex items-center justify-between rounded-lg bg-neutral-100 px-3 py-1.5 text-sm dark:bg-neutral-700">
                      <span>
                        {f.name} <span className="text-xs text-neutral-500">({f.sizeKb} KB)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                        className="text-neutral-400 hover:text-red-500"
                      >
                        <X className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-6">
                <label htmlFor="design-notes" className="block font-heading text-2xl font-bold text-primary-800 uppercase dark:text-white">
                  9. Design Details &amp; Special Instructions
                </label>
                <textarea
                  id="design-notes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell us about colors, text changes, thread preferences, or anything else our artists should know..."
                  className="mt-2 w-full rounded-xl border border-neutral-300 bg-white p-3.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                />
              </div>
            </section>

            {/* Step 10: Contact Details */}
            <section className="stitched-card rounded-3xl bg-white p-6 shadow-sm sm:p-8 dark:bg-neutral-800">
              <h2 className="font-heading text-2xl font-bold text-primary-800 uppercase dark:text-white">
                10. Contact Details
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-bold">Full Name *</label>
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
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
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold">Company or Organization</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-bold">In-Hands Date (optional)</label>
                  <input
                    type="date"
                    value={inHandsDate}
                    onChange={(e) => setInHandsDate(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm sm:w-64 dark:border-neutral-700 dark:bg-neutral-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-7 w-full cursor-pointer rounded-full bg-accent py-4 font-heading text-xl font-black tracking-wide text-white uppercase shadow-lg transition hover:bg-accent-600"
              >
                GET MY FREE QUOTE →
              </button>
            </section>
          </form>

          {/* Sticky Right Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:col-span-4">
            <div className="stitched-card rounded-3xl bg-white p-6 shadow-md dark:bg-neutral-800">
              <h2 className="font-heading text-2xl font-black text-primary-800 uppercase dark:text-white">
                WHAT TO EXPECT
              </h2>
              <ol className="mt-5 space-y-5">
                {[
                  {
                    n: 1,
                    title: 'We draw your proof',
                    desc: '1–2 business days by an artist, never automated.',
                  },
                  {
                    n: 2,
                    title: 'Revisions are free',
                    desc: 'Unlimited changes until approved.',
                  },
                  {
                    n: 3,
                    title: 'No obligation',
                    desc: 'You pay only after approving your proof.',
                  },
                ].map((item) => (
                  <li key={item.n} className="flex items-start gap-3.5">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent font-heading text-base font-black text-white">
                      {item.n}
                    </span>
                    <div>
                      <p className="font-heading text-lg font-bold text-primary-800 dark:text-white">
                        {item.title}
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-3xl bg-primary-800 p-6 text-white shadow-md">
              <h3 className="font-heading text-xl font-black uppercase">NEED HELP?</h3>
              <p className="mt-1 text-sm text-primary-100">
                Talk directly with a patch specialist in Ocala, Florida.
              </p>
              <div className="mt-4 space-y-2.5 text-sm font-bold">
                <a href={CONTACT.phoneHref} className="flex items-center gap-2.5 text-white no-underline hover:text-accent-300">
                  <Phone className="size-4 text-accent" />
                  {CONTACT.phone}
                </a>
                <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2.5 text-white no-underline hover:text-accent-300">
                  <Mail className="size-4 text-accent" />
                  {CONTACT.email}
                </a>
              </div>
            </div>
          </aside>
        </div>
      )}
    </main>
  )
}
