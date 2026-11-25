import {
  readJsonBody,
  requireAdmin,
  setNoStoreHeaders,
} from './_lib/auth.js'
import {
  VALID_ORDER_STATUSES,
  isSupabaseConfigured,
  mapOrderToRow,
  mapRowToOrder,
  supabaseFetch,
} from './_lib/supabase.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ORDER_ID_RE = /^P4E-\d{1,12}$/

function getQueryId(req) {
  if (req?.query?.id) return String(req.query.id)
  try {
    const parsed = new URL(req.url || '/', 'http://localhost')
    return parsed.searchParams.get('id') || ''
  } catch {
    return ''
  }
}

export default async function handler(req, res) {
  setNoStoreHeaders(res)

  if (!isSupabaseConfigured()) {
    return res.status(503).json({
      error: 'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment variables.',
      unconfigured: true,
    })
  }

  // PUBLIC: Create a new customer order or free quote
  if (req.method === 'POST') {
    const body = await readJsonBody(req)
    const row = mapOrderToRow(body)

    if (!row.customer_name || !EMAIL_RE.test(row.email)) {
      return res.status(400).json({ error: 'Valid customer name and email are required.' })
    }

    try {
      const inserted = await supabaseFetch('orders', {
        method: 'POST',
        body: row,
        prefer: 'return=representation',
      })
      const created = Array.isArray(inserted) ? mapRowToOrder(inserted[0]) : mapRowToOrder(inserted)
      return res.status(201).json({ order: created })
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Failed to save order.' })
    }
  }

  // ADMIN-ONLY: GET, PATCH, DELETE
  const auth = requireAdmin(req)
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error })
  }

  if (req.method === 'GET') {
    try {
      const rows = await supabaseFetch('orders', {
        method: 'GET',
        query: 'select=*&order=created_at.desc',
      })
      const orders = Array.isArray(rows) ? rows.map(mapRowToOrder) : []
      return res.status(200).json({ orders })
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Failed to load orders.' })
    }
  }

  if (req.method === 'PATCH') {
    const id = getQueryId(req)
    if (!ORDER_ID_RE.test(id)) {
      return res.status(400).json({ error: 'Invalid or missing order id.' })
    }
    const body = await readJsonBody(req)
    const patch = {}
    if (body?.status !== undefined) {
      if (!VALID_ORDER_STATUSES.includes(body.status)) {
        return res.status(400).json({ error: 'Invalid order status.' })
      }
      patch.status = body.status
    }
    if (typeof body?.adminNotes === 'string') {
      patch.admin_notes = body.adminNotes.trim().slice(0, 2000)
    }
    if (Object.keys(patch).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update.' })
    }

    try {
      const updated = await supabaseFetch('orders', {
        method: 'PATCH',
        query: `id=eq.${encodeURIComponent(id)}`,
        body: patch,
        prefer: 'return=representation',
      })
      const order = Array.isArray(updated) ? mapRowToOrder(updated[0]) : mapRowToOrder(updated)
      return res.status(200).json({ order })
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Failed to update order.' })
    }
  }

  if (req.method === 'DELETE') {
    const id = getQueryId(req)
    if (!ORDER_ID_RE.test(id)) {
      return res.status(400).json({ error: 'Invalid or missing order id.' })
    }
    try {
      await supabaseFetch('orders', {
        method: 'DELETE',
        query: `id=eq.${encodeURIComponent(id)}`,
      })
      return res.status(200).json({ deleted: id })
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Failed to delete order.' })
    }
  }

  res.setHeader('Allow', 'GET, POST, PATCH, DELETE')
  return res.status(405).json({ error: 'Method not allowed.' })
}
