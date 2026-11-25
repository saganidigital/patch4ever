// Server-side Supabase PostgREST helper (uses native fetch, zero extra dependencies)

export const VALID_ORDER_STATUSES = [
  'proof-pending',
  'proof-sent',
  'approved',
  'in-production',
  'shipped',
  'completed',
  'cancelled',
]

export function isSupabaseConfigured() {
  const url = process.env.SUPABASE_URL?.trim()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  return Boolean(url && key && /^https?:\/\//i.test(url))
}

export async function supabaseFetch(tablePath, { method = 'GET', body, query = '', prefer } = {}) {
  const baseUrl = process.env.SUPABASE_URL.trim().replace(/\/+$/, '')
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY.trim()
  const qs = query ? (query.startsWith('?') ? query : `?${query}`) : ''
  const url = `${baseUrl}/rest/v1/${tablePath}${qs}`

  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    Accept: 'application/json',
  }
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  if (prefer) {
    headers.Prefer = prefer
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!res.ok) {
    const err = new Error(
      (data && typeof data === 'object' && (data.message || data.error_description || data.hint)) ||
        `Supabase request failed (${res.status})`,
    )
    err.status = res.status
    err.details = data
    throw err
  }

  return data
}

function cleanStr(val, maxLen, fallback = '') {
  if (typeof val !== 'string') return fallback
  return val.trim().slice(0, maxLen)
}

function clampNum(val, min, max, fallback) {
  const n = Number(val)
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, n))
}

export function mapOrderToRow(data) {
  const qty = Math.round(clampNum(data?.qty, 1, 1000000, 10))
  const unitPrice = Number(clampNum(data?.unitPrice, 0, 10000, 0).toFixed(2))
  const totalPrice = Number(clampNum(data?.totalPrice, 0, 10000000, unitPrice * qty).toFixed(2))
  const status = VALID_ORDER_STATUSES.includes(data?.status) ? data.status : 'proof-pending'

  return {
    source: cleanStr(data?.source, 40, 'Order Page') || 'Order Page',
    status,
    patch_type: cleanStr(data?.patchType, 40, 'embroidered') || 'embroidered',
    shape: cleanStr(data?.shape, 60, 'Custom') || 'Custom',
    width: cleanStr(String(data?.width ?? '3.00'), 16, '3.00'),
    height: cleanStr(String(data?.height ?? '3.00'), 16, '3.00'),
    size: Number(clampNum(data?.size, 0.5, 24, 3).toFixed(2)),
    coverage: cleanStr(data?.coverage, 80, 'Standard') || 'Standard',
    border: cleanStr(data?.border, 60, 'Merrowed Border') || 'Merrowed Border',
    backing: cleanStr(data?.backing, 60, 'No Backing (Sew-On)') || 'No Backing (Sew-On)',
    upgrades: Array.isArray(data?.upgrades)
      ? data.upgrades.slice(0, 10).map((u) => cleanStr(String(u), 80)).filter(Boolean)
      : [],
    qty,
    rush: Boolean(data?.rush),
    unit_price: unitPrice,
    total_price: totalPrice,
    customer_name: cleanStr(data?.customerName, 100),
    email: cleanStr(data?.email, 150).toLowerCase(),
    phone: cleanStr(data?.phone, 30),
    company: cleanStr(data?.company, 120),
    address: cleanStr(data?.address, 250),
    in_hands_date: cleanStr(data?.inHandsDate, 30),
    artwork_name: cleanStr(data?.artworkName, 180, 'No file uploaded') || 'No file uploaded',
    notes: cleanStr(data?.notes, 2000),
    admin_notes: cleanStr(data?.adminNotes, 2000),
  }
}

export function mapRowToOrder(row) {
  if (!row || typeof row !== 'object') return null
  return {
    id: row.id,
    source: row.source || 'Order Page',
    createdAt: row.created_at || new Date().toISOString(),
    status: row.status || 'proof-pending',
    patchType: row.patch_type || 'embroidered',
    shape: row.shape || 'Custom',
    width: row.width || '3.00',
    height: row.height || '3.00',
    size: Number(row.size ?? 3),
    coverage: row.coverage || 'Standard',
    border: row.border || 'Merrowed Border',
    backing: row.backing || 'No Backing (Sew-On)',
    upgrades: Array.isArray(row.upgrades) ? row.upgrades : [],
    qty: Number(row.qty ?? 10),
    rush: Boolean(row.rush),
    unitPrice: Number(row.unit_price ?? 0),
    totalPrice: Number(row.total_price ?? 0),
    customerName: row.customer_name || '',
    email: row.email || '',
    phone: row.phone || '',
    company: row.company || '',
    address: row.address || '',
    inHandsDate: row.in_hands_date || '',
    artworkName: row.artwork_name || 'No file uploaded',
    notes: row.notes || '',
    adminNotes: row.admin_notes || '',
  }
}
