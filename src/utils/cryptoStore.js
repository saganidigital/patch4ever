// Web Crypto AES-GCM 256-bit encrypted wrapper for browser localStorage

const SALT_KEY = 'p4e-storage-salt-v1'
const SEED_KEY = 'p4e-storage-seed-v1'

function toBase64(bytes) {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function fromBase64(b64) {
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

function getOrCreateRandomBase64(storageKey, byteLength) {
  const existing = localStorage.getItem(storageKey)
  if (existing) return existing
  const buf = new Uint8Array(byteLength)
  crypto.getRandomValues(buf)
  const b64 = toBase64(buf)
  localStorage.setItem(storageKey, b64)
  return b64
}

async function deriveAesGcmKey() {
  const saltB64 = getOrCreateRandomBase64(SALT_KEY, 16)
  const seedB64 = getOrCreateRandomBase64(SEED_KEY, 32)
  const salt = fromBase64(saltB64)
  const material = new TextEncoder().encode(`${seedB64}:${window.location.origin}`)

  const baseKey = await crypto.subtle.importKey('raw', material, 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

function hasWebCrypto() {
  return typeof window !== 'undefined' && Boolean(window.crypto && window.crypto.subtle)
}

export async function setEncryptedItem(key, value) {
  const serialized = JSON.stringify(value)
  if (!hasWebCrypto()) {
    localStorage.setItem(key, serialized)
    return
  }

  const aesKey = await deriveAesGcmKey()
  const iv = new Uint8Array(12)
  crypto.getRandomValues(iv)
  const encoded = new TextEncoder().encode(serialized)
  const cipherBuffer = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, encoded)

  const envelope = {
    v: 2,
    alg: 'AES-GCM-256',
    iv: toBase64(iv),
    data: toBase64(new Uint8Array(cipherBuffer)),
  }
  localStorage.setItem(key, JSON.stringify(envelope))
}

export async function getEncryptedItem(key) {
  const raw = localStorage.getItem(key)
  if (!raw) return null

  const parsed = JSON.parse(raw)
  if (parsed && parsed.v === 2 && parsed.alg === 'AES-GCM-256' && parsed.iv && parsed.data) {
    if (!hasWebCrypto()) return null
    const aesKey = await deriveAesGcmKey()
    const iv = fromBase64(parsed.iv)
    const cipherBytes = fromBase64(parsed.data)
    const plainBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, aesKey, cipherBytes)
    const plainText = new TextDecoder().decode(plainBuffer)
    return JSON.parse(plainText)
  }

  return parsed
}
