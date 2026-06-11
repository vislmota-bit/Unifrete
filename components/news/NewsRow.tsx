import Link from 'next/link'
import { Clock, ExternalLink, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NewsRowProps {
  id: string
  titulo: string
  categoria: string
  tempoLeitura: number
  publicadoEm: string
  urlExterna?: string
}

const catColors: Record<string, string> = {
  interno: 'text-primary bg-primary/10',
  logistica: 'text-blue-600 bg-blue-50',
  rh: 'text-pink-600 bg-pink-50',
  tech: 'text-purple-600 bg-purple-50',
  mercado: 'text-green-600 bg-green-50',
  regulatorio: 'text-orange-600 bg-orange-50',
}

const catLabels: Record<string, string> = {
  interno: 'Interno',
  logistica: 'Logística',
  rh: 'RH',
  tech: 'Tech',
  mercado: 'Mercado',
  regulatorio: 'Regulatório',
}

export default function NewsRow({ id, titulo, categoria, tempoLeitura, publicadoEm, urlExterna }: NewsRowProps) {
  const href = urlExterna ?? `/app/novidades/${id}`
  const date = new Date(publicadoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })

  return (
    <Link href={href} target={urlExterna ? '_blank' : undefined} rel={urlExterna ? 'noopener noreferrer' : undefined}>
      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-primary/20 hover:shadow-sm transition-all group">
        <div className="w-9 h-9 bg-navy/10 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="w-4 h-4 text-navy" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-text-primary truncate group-hover:text-primary transition-colors">
            {titulo}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={cn('text-xs font-semibold px-1.5 py-0.5 rounded-full', catColors[categoria] ?? 'bg-gray-100 text-gray-600')}>
              {catLabels[categoria] ?? categoria}
            </span>
            <span className="text-xs text-text-secondary flex items-center gap-1">
              <Clock className="w-3 h-3" />{tempoLeitura} min
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-text-secondary">{date}</span>
          {urlExterna && <ExternalLink className="w-3.5 h-3.5 text-text-secondary" />}
        </div>
      </div>
    </Link>
  )
}
