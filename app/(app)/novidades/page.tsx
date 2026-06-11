'use client'

import { useState, useEffect } from 'react'
import FilterPills from '@/components/ui/FilterPills'
import NewsCard from '@/components/news/NewsCard'
import NewsRow from '@/components/news/NewsRow'

const CAT_OPTIONS = [
  { value: 'todos', label: 'Todos' },
  { value: 'interno', label: 'Interno' },
  { value: 'logistica', label: 'Logística' },
  { value: 'tech', label: 'Tech' },
  { value: 'mercado', label: 'Mercado' },
  { value: 'rh', label: 'RH' },
  { value: 'regulatorio', label: 'Regulatório' },
]

interface Novidade {
  id: string
  titulo: string
  descricao: string | null
  categoria: string
  tempo_leitura_min: number
  url_externa: string | null
  destaque: boolean
  publicado_em: string
  autor: string | null
}

export default function NovidadesPage() {
  const [cat, setCat] = useState('todos')
  const [novidades, setNovidades] = useState<Novidade[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/news')
      .then((r) => r.json())
      .then((d) => { setNovidades(d ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = cat === 'todos' ? novidades : novidades.filter((n) => n.categoria === cat)
  const featured = filtered.filter((n) => n.destaque)
  const list = filtered.filter((n) => !n.destaque)

  return (
    <div className="px-4 md:px-6 py-6 pb-10">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-text-primary text-2xl mb-1">Novidades</h1>
        <p className="text-text-secondary text-sm">Fique por dentro do que acontece na frete.com e no setor</p>
      </div>

      <FilterPills options={CAT_OPTIONS} active={cat} onChange={setCat} className="mb-6" />

      {loading ? (
        <div className="text-center py-10 text-text-secondary text-sm">Carregando...</div>
      ) : (
        <>
          {/* Featured cards */}
          {featured.length > 0 && (
            <section className="mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {featured.map((n) => (
                  <NewsCard
                    key={n.id}
                    id={n.id}
                    titulo={n.titulo}
                    descricao={n.descricao ?? undefined}
                    categoria={n.categoria}
                    tempoLeitura={n.tempo_leitura_min}
                    urlExterna={n.url_externa ?? undefined}
                    publicadoEm={n.publicado_em}
                    autor={n.autor ?? undefined}
                    destaque
                  />
                ))}
              </div>
            </section>
          )}

          {/* List */}
          {list.length > 0 && (
            <div className="space-y-2">
              {list.map((n) => (
                <NewsRow
                  key={n.id}
                  id={n.id}
                  titulo={n.titulo}
                  categoria={n.categoria}
                  tempoLeitura={n.tempo_leitura_min}
                  publicadoEm={n.publicado_em}
                  urlExterna={n.url_externa ?? undefined}
                />
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">📰</div>
              <p className="font-semibold text-text-primary mb-1">Nenhuma novidade</p>
              <p className="text-text-secondary text-sm">Volte mais tarde para novos conteúdos</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
