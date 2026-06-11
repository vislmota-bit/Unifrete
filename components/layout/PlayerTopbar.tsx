'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface PlayerTopbarProps {
  trailTitle: string
  trailId: string
  moduleTitle: string
  progress: number
}

export default function PlayerTopbar({ trailTitle, trailId, moduleTitle, progress }: PlayerTopbarProps) {
  const r = 18
  const circumference = 2 * Math.PI * r
  const dashOffset = circumference - (progress / 100) * circumference

  return (
    <header className="bg-navy text-white h-14 flex items-center px-4 gap-4 sticky top-0 z-40 shadow-lg">
      <Link
        href={`/app/trilhas/${trailId}`}
        className="flex items-center gap-2 hover:bg-white/10 rounded-lg p-1.5 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </Link>

      <div className="flex-1 min-w-0">
        <p className="text-xs text-white/50 truncate">{trailTitle}</p>
        <p className="text-sm font-medium text-white truncate">{moduleTitle}</p>
      </div>

      {/* SVG progress ring */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <svg width="44" height="44" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r={r} fill="none" stroke="#ffffff20" strokeWidth="3" />
          <circle
            cx="22"
            cy="22"
            r={r}
            fill="none"
            stroke="#00AEEF"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform="rotate(-90 22 22)"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
          <text x="22" y="26" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
            {progress}%
          </text>
        </svg>
      </div>
    </header>
  )
}
