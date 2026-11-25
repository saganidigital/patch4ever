// Persistent localStorage store for Patch4Ever Orders & Order Page Categories

const ORDERS_KEY = 'p4e-orders-v1'
const CATALOG_KEY = 'p4e-catalog-config-v1'

export const ORDER_STATUSES = [
  { id: 'proof-pending', label: 'Proof Pending', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300' },
  { id: 'proof-sent', label: 'Proof Sent', badge: 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300' },
  { id: 'approved', label: 'Approved', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300' },
  { id: 'in-production', label: 'In Production', badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300' },
  { id: 'shipped', label: 'Shipped', badge: 'bg-primary-100 text-primary-800 dark:bg-primary-500/20 dark:text-primary-200' },
  { id: 'completed', label: 'Completed', badge: 'bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200' },
  { id: 'cancelled', label: 'Cancelled', badge: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300' },
]

export const DEFAULT_CATALOG_CONFIG = {
  patchTypes: [
    { id: 'embroidered', name: 'Embroidered', enabled: true, minQty: 10, turnaround: '14–22 days', rushAvailable: true, rushFeePerPatch: 0.45 },
    { id: 'woven', name: 'Woven', enabled: true, minQty: 10, turnaround: '4–6 weeks', rushAvailable: false, rushFeePerPatch: 0 },
    { id: 'pvc', name: 'PVC', enabled: true, minQty: 50, turnaround: '3–5 weeks', rushAvailable: false, rushFeePerPatch: 0 },
    { id: 'printed', name: 'Printed', enabled: true, minQty: 10, turnaround: '3–5 weeks', rushAvailable: false, rushFeePerPatch: 0 },
    { id: 'name', name: 'Name', enabled: true, minQty: 10, turnaround: '2–3 weeks', rushAvailable: false, rushFeePerPatch: 0 },
    { id: 'leather', name: 'Leather', enabled: true, minQty: 25, turnaround: '2–3 weeks', rushAvailable: false, rushFeePerPatch: 0 },
  ],
  borders: [
    { id: 'merrowed', name: 'Merrowed Border', note: 'Classic stitched overlock edge (Recommended)', pricePerPatch: 0, enabled: true },
    { id: 'hot-cut', name: 'Hot Cut / Laser Cut', note: 'Crisp heat-sealed edge for custom die-cut shapes', pricePerPatch: 0, enabled: true },
  ],
  backings: [
    { id: 'no-backing', name: 'No Backing (Sew-On)', note: 'Standard cloth backing', pricePerPatch: 0, enabled: true },
    { id: 'pvc', name: 'PVC Backing', note: 'Stiffens patch cleanly (Free)', pricePerPatch: 0, enabled: true },
    { id: 'iron-on', name: 'Iron-On (Heat Seal)', note: 'Easy heat-press application', pricePerPatch: 0.15, enabled: true },
    { id: 'peel-stick', name: 'Peel & Stick', note: 'Temporary adhesive backing', pricePerPatch: 0.15, enabled: true },
    { id: 'velcro', name: 'Velcro (Hook & Loop)', note: 'Both hook & loop sides included', pricePerPatch: 0.45, enabled: true },
    { id: 'magnet', name: 'Magnet Backing', note: 'Removable magnetic hold', pricePerPatch: 0.50, enabled: true },
    { id: 'button-loop', name: 'Button Loop', note: 'Top loop for uniform buttons', pricePerPatch: 0.20, enabled: true },
    { id: 'safety-pin', name: 'Safety Pin', note: 'Attached pin back', pricePerPatch: 0.25, enabled: true },
    { id: 'clutch-pin', name: 'Clutch Pin', note: 'Butterfly clutch lapel pin', pricePerPatch: 0.35, enabled: true },
    { id: 'key-ring', name: 'Key Ring', note: 'Keychain loop hardware', pricePerPatch: 0.40, enabled: true },
  ],
  upgrades: [
    { id: 'glow-thread', name: 'Glow-in-the-dark Thread', pricePerPatch: 0.25, enabled: true },
    { id: 'metallic-thread', name: 'Metallic Gold / Silver Thread', pricePerPatch: 0.20, enabled: true },
    { id: 'neon-thread', name: 'Neon Thread', pricePerPatch: 0.15, enabled: true },
    { id: 'poly-bag', name: 'Individual Poly Bag', pricePerPatch: 0.10, enabled: true },
    { id: 'backing-card', name: 'Custom Backing Card', pricePerPatch: 0.35, enabled: true },
  ],
}

const SEED_ORDERS = [
  {
    id: 'P4E-1048',
    source: 'Order Page',
    createdAt: '2026-11-25T14:20:00Z',
    status: 'proof-pending',
    patchType: 'embroidered',
    shape: 'Shield',
    width: '3.50',
    height: '3.50',
    size: 3.5,
    coverage: 'full',
    border: 'Merrowed Border',
    backing: 'Iron-On (Heat Seal)',
    upgrades: ['Metallic Gold / Silver Thread'],
    qty: 200,
    rush: true,
    unitPrice: 2.85,
    totalPrice: 570.0,
    customerName: 'Capt. Marcus Vance',
    email: 'mvance@ocalafire.gov',
    phone: '352-555-0194',
    company: 'Ocala Fire Rescue Station 4',
    address: '410 SE Broadway St, Ocala, FL 34471',
    inHandsDate: '2026-12-04',
    artworkName: 'station4-crest-vector.ai',
    notes: 'Match Pantone 186C red on outer merrowed border and gold metallic on Maltese cross.',
    adminNotes: 'Assigned to artist #2 for priority rush proof.',
  },
  {
    id: 'P4E-1047',
    source: 'Order Page',
    createdAt: '2026-11-24T18:05:00Z',
    status: 'in-production',
    patchType: 'pvc',
    shape: 'Die-Cut Custom',
    width: '3.00',
    height: '2.50',
    size: 2.75,
    coverage: '3D',
    border: 'Hot Cut / Laser Cut',
    backing: 'Velcro (Hook & Loop)',
    upgrades: ['Glow-in-the-dark Thread'],
    qty: 250,
    rush: false,
    unitPrice: 3.66,
    totalPrice: 915.0,
    customerName: 'Devon Kowalski',
    email: 'devon@nighthawkairsoft.com',
    phone: '407-555-0148',
    company: 'Night Hawks Squadron 5',
    address: '892 Tactical Way, Orlando, FL 32801',
    inHandsDate: '2026-12-20',
    artworkName: 'night-hawks-owl-3d.png',
    notes: '3D molded owl eyes with glow fill, coyote brown hook-and-loop backing.',
    adminNotes: 'Mold approved by customer on Nov 24.',
  },
  {
    id: 'P4E-1046',
    source: 'Order Page',
    createdAt: '2026-11-24T11:42:00Z',
    status: 'proof-sent',
    patchType: 'leather',
    shape: 'Hexagon',
    width: '2.50',
    height: '2.50',
    size: 2.5,
    coverage: 'Faux Leather · Laser Engraved',
    border: 'Hot Cut / Laser Cut',
    backing: 'Iron-On (Heat Seal)',
    upgrades: [],
    qty: 100,
    rush: false,
    unitPrice: 3.50,
    totalPrice: 350.0,
    customerName: 'Hannah Brooks',
    email: 'hannah@ironwoodroasters.co',
    phone: '512-555-0182',
    company: 'Ironwood Coffee Roasters',
    address: '1204 S Congress Ave, Austin, TX 78704',
    inHandsDate: '2026-12-15',
    artworkName: 'ironwood-anvil-badge.svg',
    notes: 'Dark saddle brown faux leather for Richardson 112 trucker hats.',
    adminNotes: 'Proof v1 emailed — awaiting final sign-off.',
  },
  {
    id: 'P4E-1045',
    source: 'Order Page',
    createdAt: '2026-11-23T16:15:00Z',
    status: 'approved',
    patchType: 'woven',
    shape: 'Circle / Oval',
    width: '3.00',
    height: '3.00',
    size: 3.0,
    coverage: 'Standard Fine Weave',
    border: 'Merrowed Border',
    backing: 'No Backing (Sew-On)',
    upgrades: ['Individual Poly Bag'],
    qty: 500,
    rush: false,
    unitPrice: 1.54,
    totalPrice: 770.0,
    customerName: 'Priya Patel',
    email: 'priya@cosmicscouts.org',
    phone: '650-555-0129',
    company: 'Cosmic Scouts STEM Camp',
    address: '450 Discovery Blvd, San Jose, CA 95110',
    inHandsDate: '2026-12-30',
    artworkName: 'cosmic-scouts-2048.pdf',
    notes: 'Fine lettering around outer ring — woven chosen for crisp legibility.',
    adminNotes: 'Approved & paid. Queued for loom batch #14.',
  },
  {
    id: 'P4E-1044',
    source: 'Order Page',
    createdAt: '2026-11-22T09:30:00Z',
    status: 'shipped',
    patchType: 'printed',
    shape: 'Rectangle',
    width: '4.00',
    height: '3.00',
    size: 3.5,
    coverage: 'Full-Color Dye Sublimation',
    border: 'Merrowed Border',
    backing: 'Iron-On (Heat Seal)',
    upgrades: ['Custom Backing Card'],
    qty: 100,
    rush: false,
    unitPrice: 4.30,
    totalPrice: 430.0,
    customerName: 'Liam O’Connor',
    email: 'liam@mountainrescuesrt.org',
    phone: '303-555-0166',
    company: 'Mountain Rescue SRT',
    address: '77 Alpine Ridge Rd, Boulder, CO 80302',
    inHandsDate: '2026-12-01',
    artworkName: 'mountain-srt-photo.png',
    notes: 'Photorealistic sunset gradient behind peak + crisp black merrowed border.',
    adminNotes: 'Shipped via UPS Ground — Tracking #1Z999AA10123456784.',
  },
  {
    id: 'P4E-1043',
    source: 'Order Page',
    createdAt: '2026-11-21T13:50:00Z',
    status: 'completed',
    patchType: 'name',
    shape: 'Rectangle',
    width: '4.00',
    height: '1.50',
    size: 2.75,
    coverage: 'Standard Name Twill',
    border: 'Merrowed Border',
    backing: 'Velcro (Hook & Loop)',
    upgrades: [],
    qty: 50,
    rush: false,
    unitPrice: 3.14,
    totalPrice: 157.0,
    customerName: 'Carlos Mendez',
    email: 'carlos@apexautogroup.com',
    phone: '813-555-0171',
    company: 'Apex Motorsport Garage',
    address: '2200 Pit Lane, Tampa, FL 33605',
    inHandsDate: '2026-11-28',
    artworkName: 'crew-names-roster.csv',
    notes: 'Navy twill background, white block script, orange merrowed edge.',
    adminNotes: 'Delivered and confirmed by customer (5-star review).',
  },
  {
    id: 'P4E-1042',
    source: 'Free Quote',
    createdAt: '2026-11-20T17:10:00Z',
    status: 'proof-pending',
    patchType: 'embroidered',
    shape: 'Circle / Oval',
    width: '3.00',
    height: '3.00',
    size: 3.0,
    coverage: 'moderate',
    border: 'Merrowed Border',
    backing: 'PVC Backing',
    upgrades: [],
    qty: 300,
    rush: false,
    unitPrice: 1.36,
    totalPrice: 408.0,
    customerName: 'Rachel Kim',
    email: 'rachel@bayarearunclub.com',
    phone: '415-555-0133',
    company: 'Bay Area Trail Runners',
    address: '300 Embarcadero, San Francisco, CA 94105',
    inHandsDate: '2026-12-18',
    artworkName: 'trail-club-sketch.jpg',
    notes: 'Submitted rough napkin sketch — please clean up typography.',
    adminNotes: '',
  },
]

export function loadOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // ignore storage errors
  }
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(SEED_ORDERS))
  } catch {
    // ignore
  }
  return SEED_ORDERS
}

export function saveOrders(orders) {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  } catch {
    // ignore
  }
}

export function createOrder(orderData) {
  const existing = loadOrders()
  const maxNum = existing.reduce((max, o) => {
    const n = Number(String(o.id || '').replace(/\D/g, ''))
    return Number.isFinite(n) && n > max ? n : max
  }, 1048)

  const newOrder = {
    id: `P4E-${maxNum + 1}`,
    createdAt: new Date().toISOString(),
    status: 'proof-pending',
    adminNotes: '',
    ...orderData,
  }
  const updated = [newOrder, ...existing]
  saveOrders(updated)
  return newOrder
}

export function updateOrder(orderId, patch) {
  const updated = loadOrders().map((o) => (o.id === orderId ? { ...o, ...patch } : o))
  saveOrders(updated)
  return updated
}

export function deleteOrder(orderId) {
  const updated = loadOrders().filter((o) => o.id !== orderId)
  saveOrders(updated)
  return updated
}

export function loadCatalogConfig() {
  try {
    const raw = localStorage.getItem(CATALOG_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return DEFAULT_CATALOG_CONFIG
}

export function saveCatalogConfig(config) {
  try {
    localStorage.setItem(CATALOG_KEY, JSON.stringify(config))
  } catch {
    // ignore
  }
}

export function resetCatalogConfig() {
  saveCatalogConfig(DEFAULT_CATALOG_CONFIG)
  return DEFAULT_CATALOG_CONFIG
}

export function exportOrdersCsv(orders) {
  const headers = [
    'Order ID',
    'Date',
    'Source',
    'Status',
    'Patch Category',
    'Shape',
    'Size',
    'Coverage/Finish',
    'Border',
    'Backing',
    'Upgrades',
    'Qty',
    'Rush',
    'Unit Price',
    'Total Price',
    'Customer',
    'Email',
    'Phone',
    'Company',
  ]
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const rows = orders.map((o) =>
    [
      o.id,
      new Date(o.createdAt).toLocaleDateString(),
      o.source || 'Order Page',
      o.status,
      o.patchType,
      o.shape,
      `${o.width}"x${o.height}"`,
      o.coverage,
      o.border,
      o.backing,
      (o.upgrades || []).join('; '),
      o.qty,
      o.rush ? 'Yes' : 'No',
      o.unitPrice.toFixed(2),
      o.totalPrice.toFixed(2),
      o.customerName,
      o.email,
      o.phone,
      o.company,
    ]
      .map(esc)
      .join(','),
  )
  const csv = [headers.map(esc).join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `patch4ever-orders-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
