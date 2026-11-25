import { readJsonBody, setNoStoreHeaders } from './_lib/auth.js'
import { isSupabaseConfigured, supabaseFetch } from './_lib/supabase.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req, res) {
  setNoStoreHeaders(res)

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  if (!isSupabaseConfigured()) {
    return res.status(503).json({
      error: 'Supabase is not configured.',
      unconfigured: true,
    })
  }

  const body = await readJsonBody(req)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''

  if (!email || email.length > 150 || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' })
  }

  try {
    await supabaseFetch('newsletter_subscribers', {
      method: 'POST',
      body: { email },
      prefer: 'resolution=ignore-duplicates',
    })
    return res.status(201).json({ subscribed: true })
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to save subscription.' })
  }
}
