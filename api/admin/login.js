import {
  COOKIE_NAME,
  buildCookieHeader,
  checkRateLimit,
  clearFailedAttempts,
  getClientIp,
  isAuthConfigured,
  isHttpsRequest,
  readJsonBody,
  recordFailedAttempt,
  setNoStoreHeaders,
  sha256Equal,
  signSessionToken,
  verifyPassword,
} from '../_lib/auth.js'

const SESSION_SHORT_MS = 2 * 60 * 60 * 1000
const SESSION_REMEMBER_MS = 7 * 24 * 60 * 60 * 1000

export default async function handler(req, res) {
  setNoStoreHeaders(res)

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  if (!isAuthConfigured()) {
    return res.status(503).json({
      error:
        'Admin authentication is not configured on the server. Set ADMIN_EMAIL, ADMIN_PASSWORD_HASH (or ADMIN_PASSWORD), and ADMIN_SESSION_SECRET in Vercel Environment Variables.',
    })
  }

  const ip = getClientIp(req)
  const limit = checkRateLimit(ip)
  if (limit.blocked) {
    res.setHeader('Retry-After', String(limit.retryAfterSeconds))
    return res.status(429).json({
      error: `Too many failed login attempts. Please try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minute(s).`,
    })
  }

  const body = await readJsonBody(req)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body?.password === 'string' ? body.password : ''
  const rememberMe = Boolean(body?.rememberMe)

  if (!email || !password || email.length > 256 || password.length > 256) {
    recordFailedAttempt(ip)
    return res.status(400).json({ error: 'Valid email and password are required.' })
  }

  const configuredEmail = process.env.ADMIN_EMAIL.trim().toLowerCase()
  const emailMatch = sha256Equal(email, configuredEmail)
  const passwordMatch = verifyPassword(
    password,
    process.env.ADMIN_PASSWORD,
    process.env.ADMIN_PASSWORD_HASH,
  )

  if (!emailMatch || !passwordMatch) {
    recordFailedAttempt(ip)
    await new Promise((r) => setTimeout(r, 300))
    return res.status(401).json({ error: 'Invalid email or password.' })
  }

  clearFailedAttempts(ip)

  const ttlMs = rememberMe ? SESSION_REMEMBER_MS : SESSION_SHORT_MS
  const token = signSessionToken(
    {
      sub: process.env.ADMIN_EMAIL.trim(),
      role: 'admin',
      iat: Date.now(),
      exp: Date.now() + ttlMs,
    },
    process.env.ADMIN_SESSION_SECRET,
  )

  const cookie = buildCookieHeader(COOKIE_NAME, token, {
    maxAge: Math.floor(ttlMs / 1000),
    httpOnly: true,
    secure: isHttpsRequest(req),
    sameSite: 'Strict',
    path: '/',
  })

  res.setHeader('Set-Cookie', cookie)
  return res.status(200).json({
    authenticated: true,
    email: process.env.ADMIN_EMAIL.trim(),
  })
}
