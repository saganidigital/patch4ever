import crypto from 'node:crypto'

export const COOKIE_NAME = 'p4e_admin_token'

const RATE_WINDOW_MS = 15 * 60 * 1000
const MAX_FAILED_ATTEMPTS = 5
const failedAttemptsByIp = new Map()

export function setNoStoreHeaders(res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('X-Content-Type-Options', 'nosniff')
}

export function isHttpsRequest(req) {
  const proto = String(req?.headers?.['x-forwarded-proto'] || '').toLowerCase()
  return process.env.NODE_ENV === 'production' || proto === 'https'
}

export function parseCookies(req) {
  const header = req?.headers?.cookie
  if (!header || typeof header !== 'string') return {}
  const cookies = {}
  for (const part of header.split(';')) {
    const idx = part.indexOf('=')
    if (idx === -1) continue
    const key = part.slice(0, idx).trim()
    const val = part.slice(idx + 1).trim()
    if (!key) continue
    try {
      cookies[key] = decodeURIComponent(val)
    } catch {
      cookies[key] = val
    }
  }
  return cookies
}

export function buildCookieHeader(
  name,
  value,
  { maxAge, httpOnly = true, secure = false, sameSite = 'Strict', path = '/' } = {},
) {
  const parts = [`${name}=${encodeURIComponent(value)}`, `Path=${path}`, `SameSite=${sameSite}`]
  if (typeof maxAge === 'number') parts.push(`Max-Age=${Math.max(0, Math.floor(maxAge))}`)
  if (httpOnly) parts.push('HttpOnly')
  if (secure) parts.push('Secure')
  return parts.join('; ')
}

export function sha256Equal(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  const digestA = crypto.createHash('sha256').update(a, 'utf8').digest()
  const digestB = crypto.createHash('sha256').update(b, 'utf8').digest()
  return crypto.timingSafeEqual(digestA, digestB)
}

export function verifyPassword(password, envPassword, envPasswordHash) {
  if (typeof password !== 'string' || password.length === 0) return false

  if (typeof envPasswordHash === 'string' && envPasswordHash.trim()) {
    const match = /^scrypt\$([0-9a-f]+)\$([0-9a-f]+)$/i.exec(envPasswordHash.trim())
    if (!match) return false
    try {
      const salt = Buffer.from(match[1], 'hex')
      const expected = Buffer.from(match[2], 'hex')
      if (salt.length < 8 || expected.length < 16) return false
      const derived = crypto.scryptSync(password, salt, expected.length)
      return derived.length === expected.length && crypto.timingSafeEqual(derived, expected)
    } catch {
      return false
    }
  }

  if (typeof envPassword === 'string' && envPassword.length > 0) {
    return sha256Equal(password, envPassword)
  }

  return false
}

export function hashPasswordScrypt(password) {
  const salt = crypto.randomBytes(16)
  const key = crypto.scryptSync(password, salt, 64)
  return `scrypt$${salt.toString('hex')}$${key.toString('hex')}`
}

export function signSessionToken(payload, secret) {
  if (!secret || typeof secret !== 'string') {
    throw new Error('Missing session secret')
  }
  const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  const signature = crypto.createHmac('sha256', secret).update(encodedPayload).digest('base64url')
  return `${encodedPayload}.${signature}`
}

export function verifySessionToken(token, secret) {
  if (!token || typeof token !== 'string' || !secret || typeof secret !== 'string') {
    return null
  }
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [encodedPayload, providedSig] = parts
  if (!encodedPayload || !providedSig) return null

  const expectedSig = crypto.createHmac('sha256', secret).update(encodedPayload).digest('base64url')
  const bufProvided = Buffer.from(providedSig, 'utf8')
  const bufExpected = Buffer.from(expectedSig, 'utf8')
  if (bufProvided.length !== bufExpected.length || !crypto.timingSafeEqual(bufProvided, bufExpected)) {
    return null
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'))
    if (!payload || typeof payload.exp !== 'number' || payload.exp <= Date.now()) {
      return null
    }
    return payload
  } catch {
    return null
  }
}

export function isAuthConfigured() {
  const hasEmail = Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL.trim())
  const hasPassword = Boolean(
    (process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_PASSWORD_HASH.trim()) ||
      (process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length > 0),
  )
  const hasSecret = Boolean(process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.length >= 16)
  return hasEmail && hasPassword && hasSecret
}

export function getClientIp(req) {
  const forwarded = req?.headers?.['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim()
  }
  return req?.socket?.remoteAddress || 'unknown'
}

function pruneAttempts(ip, now) {
  const timestamps = failedAttemptsByIp.get(ip) || []
  const recent = timestamps.filter((ts) => now - ts < RATE_WINDOW_MS)
  if (recent.length > 0) failedAttemptsByIp.set(ip, recent)
  else failedAttemptsByIp.delete(ip)
  return recent
}

export function checkRateLimit(ip, now = Date.now()) {
  const recent = pruneAttempts(ip, now)
  if (recent.length >= MAX_FAILED_ATTEMPTS) {
    const oldest = recent[0]
    const retryAfterMs = Math.max(1000, RATE_WINDOW_MS - (now - oldest))
    return { blocked: true, retryAfterSeconds: Math.ceil(retryAfterMs / 1000) }
  }
  return { blocked: false, retryAfterSeconds: 0 }
}

export function recordFailedAttempt(ip, now = Date.now()) {
  const recent = pruneAttempts(ip, now)
  recent.push(now)
  failedAttemptsByIp.set(ip, recent)
}

export function clearFailedAttempts(ip) {
  failedAttemptsByIp.delete(ip)
}

export async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }
  if (typeof req.on !== 'function') return {}
  return new Promise((resolve) => {
    let raw = ''
    let aborted = false
    req.on('data', (chunk) => {
      if (aborted) return
      raw += chunk
      if (raw.length > 32768) {
        aborted = true
        resolve({})
      }
    })
    req.on('end', () => {
      if (aborted || !raw) {
        resolve({})
        return
      }
      try {
        resolve(JSON.parse(raw))
      } catch {
        resolve({})
      }
    })
    req.on('error', () => resolve({}))
  })
}
