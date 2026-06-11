'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'

interface VideoPlayerProps {
  url: string
  moduloId: string
  initialProgress?: number
  onProgress?: (pct: number) => void
}

export default function VideoPlayer({ url, moduloId, initialProgress = 0, onProgress }: VideoPlayerProps) {
  const { data: session } = useSession()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [pct, setPct] = useState(initialProgress)
  const lastSavedRef = useRef(initialProgress)
  const saveTimerRef = useRef<NodeJS.Timeout>()

  const saveProgress = async (currentPct: number) => {
    if (!session?.user || Math.abs(currentPct - lastSavedRef.current) < 2) return
    lastSavedRef.current = currentPct
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduloId, pctAssistido: currentPct }),
      })
      onProgress?.(currentPct)
    } catch {}
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      if (!video.duration) return
      const currentPct = Math.round((video.currentTime / video.duration) * 100)
      setPct(currentPct)

      clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(() => saveProgress(currentPct), 10000)
    }

    const handleEnded = () => {
      saveProgress(100)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
      clearTimeout(saveTimerRef.current)
    }
  }, [moduloId])

  // If URL is YouTube or external, use iframe
  const isExternal = url.includes('youtube') || url.includes('vimeo') || url.startsWith('http')

  return (
    <div className="relative w-full bg-black rounded-xl overflow-hidden aspect-video">
      {isExternal ? (
        <iframe
          src={url}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video
          ref={videoRef}
          src={url}
          controls
          className="w-full h-full"
          style={{ backgroundColor: '#000' }}
        />
      )}

      {/* Progress indicator overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
        <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
