import { cn } from '@/lib/utils'

interface RoadHeroProps {
  height?: number
  title?: string
  subtitle?: string
  className?: string
  children?: React.ReactNode
}

export default function RoadHero({
  height = 280,
  title,
  subtitle,
  className,
  children,
}: RoadHeroProps) {
  return (
    <div
      className={cn('relative overflow-hidden bg-navy flex items-center', className)}
      style={{ minHeight: height }}
    >
      {/* Animated SVG road */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 800 280"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sky gradient */}
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#001833" />
            <stop offset="100%" stopColor="#003366" />
          </linearGradient>
          <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a2a3a" />
            <stop offset="100%" stopColor="#0a1520" />
          </linearGradient>
        </defs>
        <rect width="800" height="280" fill="url(#skyGrad)" />

        {/* Road surface */}
        <polygon points="350,140 450,140 800,280 0,280" fill="url(#roadGrad)" />

        {/* Road edges */}
        <line x1="350" y1="140" x2="0" y2="280" stroke="#00AEEF" strokeWidth="1.5" strokeOpacity="0.4" />
        <line x1="450" y1="140" x2="800" y2="280" stroke="#00AEEF" strokeWidth="1.5" strokeOpacity="0.4" />

        {/* Center dashed lines */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const progress = i / 6
          const x1 = 390 + progress * 10
          const y1 = 140 + progress * 140 / 6
          const x2 = 410 + progress * 10
          const y2 = 140 + (progress + 0.1) * 140 / 6
          const w = 1 + progress * 3
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#F5B800"
              strokeWidth={w}
              strokeDasharray="8 8"
              strokeOpacity="0.8"
              className="animate-dash"
              style={{ animationDelay: `${i * 0.28}s` }}
            />
          )
        })}

        {/* Lane lines left */}
        {[0, 1, 2, 3, 4].map((i) => {
          const progress = i / 4
          const x1 = 370 - progress * 40
          const y1 = 145 + progress * 130
          const x2 = 380 - progress * 40
          const y2 = 150 + progress * 130
          return (
            <line
              key={`l${i}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#ffffff"
              strokeWidth={0.5 + progress}
              strokeDasharray="6 10"
              strokeOpacity="0.25"
              className="animate-dash"
              style={{ animationDelay: `${i * 0.4}s` }}
            />
          )
        })}

        {/* Lane lines right */}
        {[0, 1, 2, 3, 4].map((i) => {
          const progress = i / 4
          const x1 = 430 + progress * 40
          const y1 = 145 + progress * 130
          const x2 = 420 + progress * 40
          const y2 = 150 + progress * 130
          return (
            <line
              key={`r${i}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#ffffff"
              strokeWidth={0.5 + progress}
              strokeDasharray="6 10"
              strokeOpacity="0.25"
              className="animate-dash"
              style={{ animationDelay: `${i * 0.4}s` }}
            />
          )
        })}

        {/* Pulsing destination circles */}
        <circle cx="400" cy="138" r="5" fill="#00AEEF" opacity="0.9" className="animate-pulse-ring" />
        <circle cx="400" cy="138" r="12" fill="none" stroke="#00AEEF" strokeWidth="1" opacity="0.4" className="animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
        <circle cx="400" cy="138" r="20" fill="none" stroke="#00AEEF" strokeWidth="0.5" opacity="0.2" className="animate-pulse-ring" style={{ animationDelay: '1s' }} />

        {/* Stars/lights */}
        {[
          [120, 40], [200, 25], [320, 60], [500, 30], [620, 50], [720, 35], [760, 70],
          [160, 80], [260, 45], [580, 65], [680, 25],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="1.5" fill="#ffffff" opacity={0.3 + (i % 3) * 0.2} />
        ))}
      </svg>

      {/* Content */}
      <div className="relative z-10 w-full px-8 py-10">
        {title && (
          <h1 className="font-heading text-white text-3xl md:text-4xl font-bold mb-2 drop-shadow">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-blue-200 text-lg font-medium drop-shadow">{subtitle}</p>
        )}
        {children}
      </div>
    </div>
  )
}
