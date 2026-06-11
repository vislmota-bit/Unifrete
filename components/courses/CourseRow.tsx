import Link from 'next/link'
import { Play, FileText, Headphones, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CourseRowProps {
  id: string
  trailId: string
  titulo: string
  formato: 'video' | 'pdf' | 'podcast'
  duracao?: number
  xp: number
  concluido?: boolean
  obrigatorio?: boolean
  locked?: boolean
}

const formatConfig = {
  video: { icon: Play, label: 'Vídeo', color: 'text-blue-500 bg-blue-50' },
  pdf: { icon: FileText, label: 'PDF', color: 'text-orange-500 bg-orange-50' },
  podcast: { icon: Headphones, label: 'Podcast', color: 'text-purple-500 bg-purple-50' },
}

export default function CourseRow({
  id, trailId, titulo, formato, duracao, xp, concluido, obrigatorio, locked,
}: CourseRowProps) {
  const fmt = formatConfig[formato]
  const Icon = fmt.icon

  return (
    <Link href={locked ? '#' : `/app/trilhas/${trailId}/modulos/${id}`}>
      <div
        className={cn(
          'flex items-center gap-3 p-3 rounded-xl border transition-all',
          locked
            ? 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed'
            : concluido
            ? 'bg-success/5 border-success/20 hover:border-success/40'
            : 'bg-white border-gray-100 hover:border-primary/30 hover:shadow-sm cursor-pointer'
        )}
      >
        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', fmt.color)}>
          <Icon className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <p className={cn('font-medium text-sm truncate', concluido ? 'text-text-secondary line-through' : 'text-text-primary')}>
            {titulo}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-text-secondary">{fmt.label}</span>
            {duracao && <span className="text-xs text-text-secondary">{duracao} min</span>}
            {obrigatorio && (
              <span className="text-xs font-semibold text-orange px-1.5 py-0.5 bg-orange/10 rounded-full">Obrigatório</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {concluido ? (
            <Check className="w-5 h-5 text-success" />
          ) : (
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              +{xp} XP
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
