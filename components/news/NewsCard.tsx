import Link from 'next/link'
import { Clock, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NewsCardProps {
  id: string
  titulo: string
  descricao?: string
  categoria: string
  tempoLeitura: number
  urlExterna?: string
  publicadoEm: string
  autor?: string
  destaque?: boolean
}

const catColors: Record<string, string> = {
  interno: 'bg-primary/10 text-primary',
  logistica: 'bg-blue-100 text-blue-700',
  rh: 'bg-pink-100 text-pink-700',
  tech: 'bg-purple-100 text-purple-700',
  mercado: 'bg-green-100 text-green-700',
  regulatorio: 'bg-orange-100 text-orange-700',
}

const catLabels: Record<string, string> = {
  interno: 'Interno',
  logistica: 'Logística',
  rh: 'RH',
  tech: 'Tecnologia',
  mercado: 'Mercado',
  regulatorio: 'Regulatório',
}

export default function NewsCard({
  id, titulo, descricao, categoria, tempoLeitura, urlExterna, publicadoEm, autor, destaque,
}: NewsCardProps) {
  const href = urlExterna ?? `/app/novidades/${id}`

  return (
    <Link href={href} target={urlExterna ? '_blank' : undefined} rel={urlExterna ? 'noopener noreferrer' : undefined}>
      <div className={cn(
        'bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-primary/20 transition-all group',
        destaque ? 'shadow-sm' : ''
      )}>
        {/* Cover */}
        <div className={cn('bg-navy relative overflow-hidden', destaque ? 'h-48' : 'h-32')}>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 192" preserveAspectRatio="xMidYMid slice">
            <rect width="400" height="192" fill="#001833" />
            <polygon points="180,96 220,96 400,192 0,192" fill="#002244" />
            <line x1="185" y1="96" x2="0" y2="192" stroke="#00AEEF" strokeWidth="1" strokeOpacity="0.4" />
            <line x1="215" y1="96" x2="400" y2="192" stroke="#00AEEF" strokeWidth="1" strokeOpacity="0.4" />
            {[0,1,2,3].map((i) => (
              <line key={i} x1={196 + i * 3} y1={96 + i * 24} x2={202 + i * 3} y2={102 + i * 24}
                stroke="#F5B800" strokeWidth="1.5" strokeDasharray="5 5" strokeOpacity="0.8" />
            ))}
            <circle cx="200" cy="94" r="4" fill="#00AEEF" opacity="0.9" />
          </svg>
          <span className={cn('absolute top-3 left-3 text-xs font-semibold px-2 py-0.5 rounded-full', catColors[categoria] ?? 'bg-gray-100 text-gray-600')}>
            {catLabels[categoria] ?? categoria}
          </span>
          {urlExterna && <ExternalLink className="absolute top-3 right-3 w-4 h-4 text-white/60" />}
        </div>

        {/* Body */}
        <div className="p-4">
          <h3 className="font-heading font-bold text-text-primary text-sm leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
            {titulo}
          </h3>
          {descricao && (
            <p className="text-xs text-text-secondary line-clamp-2 mb-3">{descricao}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-text-secondary">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{tempoLeitura} min de leitura</span>
            </div>
            {autor && <span>• {autor}</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}
