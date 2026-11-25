import { readJsonBody, requireAdmin, setNoStoreHeaders } from './_lib/auth.js'
import { isSupabaseConfigured, supabaseFetch } from './_lib/supabase.js'

export default async function handler(req, res) {
  setNoStoreHeaders(res)

  if (!isSupabaseConfigured()) {
    return res.status(503).json({
      error: 'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment variables.',
      unconfigured: true,
    })
  }

  // PUBLIC: Read live order builder catalog configuration
  if (req.method === 'GET') {
    try {
      const rows = await supabaseFetch('catalog_config', {
        method: 'GET',
        query: 'select=config&id=eq.default&limit=1',
      })
      const config = Array.isArray(rows) && rows[0]?.config ? rows[0].config : null
      return res.status(200).json({ config })
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Failed to load catalog config.' })
    }
  }

  // ADMIN-ONLY: Update catalog configuration
  if (req.method === 'PUT') {
    const auth = requireAdmin(req)
    if (!auth.ok) {
      return res.status(auth.status).json({ error: auth.error })
    }

    const body = await readJsonBody(req)
    const config = body?.config
    if (
      !config ||
      !Array.isArray(config.patchTypes) ||
      !Array.isArray(config.borders) ||
      !Array.isArray(config.backings) ||
      !Array.isArray(config.upgrades)
    ) {
      return res.status(400).json({ error: 'Invalid catalog configuration payload.' })
    }

    try {
      await supabaseFetch('catalog_config', {
        method: 'POST',
        body: { id: 'default', config },
        prefer: 'resolution=merge-duplicates,return=representation',
      })
      return res.status(200).json({ config })
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Failed to save catalog config.' })
    }
  }

  res.setHeader('Allow', 'GET, PUT')
  return res.status(405).json({ error: 'Method not allowed.' })
}
