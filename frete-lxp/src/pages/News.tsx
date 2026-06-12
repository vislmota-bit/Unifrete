import { useState } from 'react'
import { ExternalLink, Clock } from 'lucide-react'
import { clsx } from 'clsx'
import { Badge } from '@/components/ui'
import { MediaPlayer } from '@/components/media/MediaPlayer'
import { MOCK_NEWS } from '@/store/mockData'
import type { News as NewsItem } from '@/types'

type Category = 'all' | 'company' | 'market' | 'law' | 'tip'

const CATEGORY_LABEL: Record<string, { label: string; badge: 'blue' | 'warning' | 'danger' | 'success' }> = {
  company: { label: 'Empresa',    badge: 'blue'    },
  market:  { label: 'Mercado',    badge: 'warning' },
  law:     { label: 'Legislação', badge: 'danger'  },
  tip:     { label: 'Dica',       badge: 'success' },
}

const CONTENT_TYPE_LABEL: Record<string, string> = {
  video: '🎬 Vídeo',
  audio: '🎧 Áudio',
  pdf:   '📄 PDF',
  doc:   '📝 Documento',
}

function NewsCard({ item, onOpen }: { item: NewsItem; onOpen: (item: NewsItem) => void }) {
  const cat = CATEGORY_LABEL[item.category]
  return (
    <button
      onClick={() => onOpen(item)}
      className="w-full text-left flex gap-3 p-4 border border-gray-100 rounded-xl bg-white hover:shadow-md hover:border-gray-200 transition-all duration-150"
    >
      <div
        className={clsx(
          'w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0',
          item.category === 'company' ? 'bg-brand-light' :
          item.category === 'market'  ? 'bg-warning-light' :
          item.category === 'law'     ? 'bg-danger-light' :
          'bg-success-light',
        )}
      >
        {item.emoji}
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={cat.badge}>{cat.label}</Badge>
          {item.mandatory && <Badge variant="danger">Leitura obrigatória</Badge>}
        </div>
        <p className="font-heading font-bold text-gray-800 text-sm leading-snug line-clamp-2">
          {item.title}
        </p>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.summary}</p>
        <div className="flex items-center gap-3 pt-0.5">
          <span className="text-[10px] px-1.5 py-px rounded border bg-gray-50 text-gray-500 border-gray-200">
            {CONTENT_TYPE_LABEL[item.contentType]}
          </span>
          <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
            <Clock className="w-3 h-3" />{item.readingMinutes} min
          </span>
          <span className="text-[10px] text-gray-400 ml-auto">
            {new Date(item.publishedAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>
    </button>
  )
}

function NewsModal({ item, onClose }: { item: NewsItem; onClose: () => void }) {
  const cat = CATEGORY_LABEL[item.category]
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-start gap-3">
          <div className={clsx(
            'w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0',
            item.category === 'company' ? 'bg-brand-light' :
            item.category === 'market'  ? 'bg-warning-light' :
            item.category === 'law'     ? 'bg-danger-light' : 'bg-success-light',
          )}>
            {item.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge variant={cat.badge}>{cat.label}</Badge>
              {item.mandatory && <Badge variant="danger">Leitura obrigatória</Badge>}
            </div>
            <h2 className="font-heading font-bold text-gray-800 text-base leading-snug">
              {item.title}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(item.publishedAt).toLocaleDateString('pt-BR')} · {item.readingMinutes} min
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">{item.summary}</p>

          {item.contentUrl ? (
            <MediaPlayer
              contentType={item.contentType}
              contentUrl={item.contentUrl}
              title={item.title}
            />
          ) : (
            <div className="bg-gray-50 rounded-xl p-8 text-center text-sm text-gray-400">
              Conteúdo não disponível
            </div>
          )}

          {item.contentUrl && (
            <a
              href={item.contentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-brand hover:text-brand-dark transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Abrir em nova aba
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function News() {
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [selected, setSelected] = useState<NewsItem | null>(null)

  const filtered = activeCategory === 'all'
    ? MOCK_NEWS
    : MOCK_NEWS.filter((n) => n.category === activeCategory)

  const mandatory = MOCK_NEWS.filter((n) => n.mandatory)

  const tabs: { key: Category; label: string }[] = [
    { key: 'all',     label: 'Todas'      },
    { key: 'company', label: 'Empresa'    },
    { key: 'market',  label: 'Mercado'    },
    { key: 'law',     label: 'Legislação' },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading font-bold text-gray-800 text-xl">Novidades</h1>
        <p className="text-gray-400 text-sm mt-0.5">Fique por dentro da Fretebras e do mercado de logística.</p>
      </div>

      {/* Banner de leituras obrigatórias */}
      {mandatory.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-danger-light rounded-xl border border-danger/20">
          <span className="text-xl">⚠️</span>
          <div className="flex-1">
            <p className="text-sm font-body font-medium text-danger">
              {mandatory.length} {mandatory.length === 1 ? 'leitura obrigatória pendente' : 'leituras obrigatórias pendentes'}
            </p>
            <p className="text-xs text-danger/70">{mandatory.map((n) => n.title).join(' · ')}</p>
          </div>
        </div>
      )}

      {/* Tabs de categoria */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={clsx(
              'px-3 py-1.5 rounded-md text-xs font-body font-medium transition-all',
              activeCategory === key
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-400 hover:text-gray-600',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Lista de notícias */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <NewsCard key={item.id} item={item} onOpen={setSelected} />
        ))}
      </div>

      {/* Modal de leitura */}
      {selected && (
        <NewsModal item={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
