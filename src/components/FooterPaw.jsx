import { useEffect, useRef } from 'react'
import { ASSETS } from '../data/assets'

const EDGE_ZONE = 200
const PAW_WIDTH = 360
const PAW_HEIGHT = 113
const COOLDOWN_MS = 1100

const canSwipe = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function FooterPaw({ footerRef }) {
  const pawElRef = useRef(null)
  const nextAllowedRef = useRef(0)

  useEffect(() => {
    const footerEl = footerRef?.current
    const pawUrl = ASSETS.footerPaw
    if (!footerEl || !pawUrl) return

    // Preload paw image when footer approaches viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting) && canSwipe()) {
          const img = new Image()
          img.src = pawUrl
          observer.disconnect()
        }
      },
      { rootMargin: '800px 0px' },
    )
    observer.observe(footerEl)

    const getOrCreatePaw = () => {
      if (pawElRef.current) return pawElRef.current
      const el = document.createElement('div')
      el.className = 'footer-paw'
      el.setAttribute('aria-hidden', 'true')
      el.style.left = `-${PAW_WIDTH}px`
      el.style.top = '0px'
      const img = document.createElement('img')
      img.src = pawUrl
      img.alt = ''
      img.width = PAW_WIDTH
      img.height = PAW_HEIGHT
      el.appendChild(img)
      document.body.appendChild(el)
      pawElRef.current = el
      return el
    }

    const onMouseMove = (e) => {
      if (!canSwipe()) return
      const now = performance.now()
      if (now < nextAllowedRef.current) return

      const side =
        e.clientX < EDGE_ZONE
          ? 'left'
          : e.clientX > window.innerWidth - EDGE_ZONE
            ? 'right'
            : null

      if (!side) return

      nextAllowedRef.current = now + COOLDOWN_MS

      const isLeft = side === 'left'
      const distFromEdge = isLeft ? e.clientX : window.innerWidth - e.clientX
      const reach = Math.min(340, Math.max(220, distFromEdge + 50))
      const top = Math.min(Math.max(e.clientY - PAW_HEIGHT / 2, 8), window.innerHeight - PAW_HEIGHT - 8)

      const pawEl = getOrCreatePaw()
      pawEl.style.top = `${top}px`
      pawEl.style.left = isLeft ? `-${PAW_WIDTH}px` : 'auto'
      pawEl.style.right = isLeft ? 'auto' : `-${PAW_WIDTH}px`
      pawEl.classList.toggle('footer-paw-right', !isLeft)
      pawEl.style.transformOrigin = isLeft ? '0% 50%' : '100% 50%'

      const dir = isLeft ? 1 : -1
      pawEl.animate(
        [
          { transform: 'translateX(0) rotate(0deg)' },
          {
            transform: `translateX(${dir * reach}px) rotate(${dir * -8}deg)`,
            offset: 0.2,
            easing: 'cubic-bezier(0.2, 0.9, 0.3, 1.2)',
          },
          {
            transform: `translateX(${dir * reach * 0.94}px) rotate(${dir * 10}deg)`,
            offset: 0.34,
            easing: 'cubic-bezier(0.5, 0, 0.5, 1)',
          },
          {
            transform: `translateX(${dir * reach * 0.8}px) rotate(${dir * -4}deg)`,
            offset: 0.48,
            easing: 'cubic-bezier(0.2, 0.9, 0.3, 1.2)',
          },
          {
            transform: `translateX(${dir * reach}px) rotate(${dir * 9}deg)`,
            offset: 0.6,
            easing: 'cubic-bezier(0.5, 0, 0.75, 0)',
          },
          { transform: 'translateX(0) rotate(0deg)' },
        ],
        { duration: 620 },
      )
    }

    footerEl.addEventListener('mousemove', onMouseMove, { passive: true })

    return () => {
      observer.disconnect()
      footerEl.removeEventListener('mousemove', onMouseMove)
      if (pawElRef.current) {
        pawElRef.current.remove()
        pawElRef.current = null
      }
    }
  }, [footerRef])

  return null
}
