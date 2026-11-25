import {
  COOKIE_NAME,
  buildCookieHeader,
  isHttpsRequest,
  setNoStoreHeaders,
} from '../_lib/auth.js'

export default function handler(req, res) {
  setNoStoreHeaders(res)

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const expiredCookie = buildCookieHeader(COOKIE_NAME, '', {
    maxAge: 0,
    httpOnly: true,
    secure: isHttpsRequest(req),
    sameSite: 'Strict',
    path: '/',
  })

  res.setHeader('Set-Cookie', expiredCookie)
  return res.status(200).json({ authenticated: false })
}
