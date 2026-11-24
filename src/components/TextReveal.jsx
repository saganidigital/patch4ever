import { useEffect, useRef, useState } from 'react'

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useInViewOnce({
  immediate = false,
  threshold = 0.12,
  rootMargin = '0px 0px -48px 0px',
} = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(() => prefersReducedMotion())

  useEffect(() => {
    if (isVisible) return

    if (immediate) {
      let raf2
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setIsVisible(true))
      })
      return () => {
        cancelAnimationFrame(raf1)
        if (raf2) cancelAnimationFrame(raf2)
      }
    }

    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [immediate, isVisible, threshold, rootMargin])

  return { ref, isVisible }
}

/**
 * Splits a display heading into words that rise smoothly out of an invisible baseline mask.
 * Screen readers read the full phrase via aria-label while visual spans are aria-hidden.
 */
export function MaskedText({
  as: Tag = 'h2',
  text,
  delay = 0,
  wordStep = 48,
  immediate = false,
  className = '',
}) {
  const { ref, isVisible } = useInViewOnce({ immediate })
  const words = text.split(' ')

  return (
    <Tag
      ref={ref}
      aria-label={text}
      className={`${className} ${isVisible ? 'is-revealed' : ''}`.trim()}
    >
      {words.map((word, idx) => (
        <span key={`${word}-${idx}`} aria-hidden="true" className="reveal-word-mask">
          <span
            className="reveal-word"
            style={{ transitionDelay: `${delay + idx * wordStep}ms` }}
          >
            {word}
          </span>
          {idx < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </Tag>
  )
}

const VARIANT_CLASS = {
  'blur-up': 'reveal-blur-up',
  'fade-up': 'reveal-fade-up',
  'scale-up': 'reveal-scale-up',
  'stitch-line': 'reveal-stitch-line',
}

/**
 * Staggered scroll-reveal wrapper for paragraphs, dashed stitch lines, cards, and CTAs.
 */
export function RevealBlock({
  as: Tag = 'div',
  variant = 'blur-up',
  delay = 0,
  immediate = false,
  className = '',
  children,
  ...rest
}) {
  const { ref, isVisible } = useInViewOnce({ immediate })
  const variantCls = VARIANT_CLASS[variant] || 'reveal-fade-up'

  return (
    <Tag
      ref={ref}
      className={`${variantCls} ${isVisible ? 'is-revealed' : ''} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
