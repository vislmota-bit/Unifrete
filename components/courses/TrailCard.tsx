import Link from 'next/link'
import { Clock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TrailCardProps {
  id: string
  titulo: string
  descricao?: string
  diretoria?: string
  facilitador?: string
  xpTotal: number
  progress?: number
  moduleCount?: number
  className?: string
}

const dirColors: Record<string, string> = {
  'Tecnologia': 'bg-blue-100 text-blue-700',
  'Marketplace': 'bg-purple-100 text-purple-700',
  'Fintech': 'bg-green-100 text-green-700',
  'Produto': 'bg-orange-100 text-orange-700',
  'Gente e Gestão': 'bg-pink-100 text-pink-700',
  'Broker': 'bg-yellow-100 text-yellow-700',
}

export default function TrailCard({
  id, titulo, descricao, diretoria, facilitador, xpTotal, progress = 0, moduleCount, className,
}: TrailCardProps) {
  return (
    <Link href={`/app/trilhas/${id}`}>
      <div
        className={cn(
          'bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-primary/20 transition-all group cursor-pointer',
          className
        )}
      >
        {/* Cover */}
        <div className="relative h-36 bg-navy overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 144" preserveAspectRatio="xMidYMid slice">
            <rect width="320" height="144" fill="#001833" />
            <polygon points="145,72 175,72 320,144 0,144" fill="#002244" />
            <line x1="155" y1="72" x2="0" y2="144" stroke="#00AEEF" strokeWidth="1" strokeOpacity="0.4" />
            <line x1="165" y1="72" x2="320" y2="144" stroke="#00AEEF" strokeWidth="1" strokeOpacity="0.4" />
            {[0,1,2,3,4].map((i) => (
              <line key={i} x1={155 + i * 3} y1={72 + i * 14} x2={160 + i * 3} y2={78 + i * 14}
                stroke="#F5B800" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.7" />
            ))}
            <circle cx="160" cy="70" r="4" fill="#00AEEF" opacity="0.8" />
          </svg>
          {diretoria && (
            <span className={cn('absolute top-3 left-3 text-xs font-semibold px-2 py-0.5 rounded-full', dirColors[diretoria] ?? 'bg-gray-100 text-gray-600')}>
              {diretoria}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          <h3 className="font-heading font-bold text-text-primary text-base leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
            {titulo}
          </h3>
          {descricao && (
            <p className="text-xs text-text-secondary line-clamp-2 mb-3">{descricao}</p>
          )}

          {/* Progress bar */}
          {progress > 0 && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-text-secondary mb-1">
                <span>Progresso</span>
                <span className="font-medium text-primary">{progress}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-text-secondary">
            <div className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="font-bold text-primary">{xpTotal} XP</span>
            </div>
            {moduleCount && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{moduleCount} módulos</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
