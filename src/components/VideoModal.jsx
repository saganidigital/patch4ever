import { useEffect } from 'react'
import { X } from 'lucide-react'

const YOUTUBE_ID_RE = /^[a-zA-Z0-9_-]{11}$/

export default function VideoModal({ video, onClose }) {
  useEffect(() => {
    if (!video) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [video, onClose])

  if (!video || !YOUTUBE_ID_RE.test(String(video.youtubeId || ''))) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={video.title}>
      <div className="fixed inset-0 bg-black/75 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl bg-primary-950 shadow-2xl ring-2 ring-white/20">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 text-white">
          <h3 className="font-heading text-lg font-bold uppercase tracking-wide">{video.title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 items-center justify-center rounded-md text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="Close video"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="aspect-video w-full bg-black">
          <iframe
            className="size-full"
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sandbox="allow-scripts allow-same-origin allow-presentation"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}
