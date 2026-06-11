'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import FilterPills from '@/components/ui/FilterPills'
import CourseRow from '@/components/courses/CourseRow'

const FORMAT_OPTIONS = [
  { value: 'todos', label: 'Todos' },
  { value: 'video', label: 'Vídeo' },
  { value: 'pdf', label: 'PDF' },
  { value: 'podcast', label: 'Podcast' },
]

const DIR_OPTIONS = [
  { value: 'todos', label: 'Todas' },
  { value: 'Gente e Gestão', label: 'Gente e Gestão' },
  { value: 'Tecnologia', label: 'Tecnologia' },
  { value: 'Marketplace', label: 'Marketplace' },
  { value: 'Fintech', label: 'Fintech' },
  { value: 'Produto', label: 'Produto' },
  { value: 'Broker', label: 'Broker' },
]

interface Modulo {
  id: string
  trilha_id: string
  titulo: string
  formato: string
  duracao_min: number | null
  xp: number
  obrigatorio: boolean
  trilhas?: { diretoria: string | null }
}

export default function ExplorarPage() {
  const [search, setSearch] = useState('')
  const [format, setFormat] = useState('todos')
  const [dir, setDir] = useState('todos')
  const [modulos, setModulos] = useState<Modulo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/modules')
      .then((r) => r.json())
      .then((data) => { setModulos(data ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = modulos.filter((m) => {
    const matchSearch = !search || m.titulo.toLowerCase().includes(search.toLowerCase())
    const matchFormat = format === 'todos' || m.formato === format
    const matchDir = dir === 'todos' || m.trilhas?.diretoria === dir
    return matchSearch && matchFormat && matchDir
  })

  return (
    <div className="px-4 md:px-6 py-6 pb-10">
      <div className="mb-6">
        <h1 className="font-heading font-bold text-text-primary text-2xl mb-1">Explorar</h1>
        <p className="text-text-secondary text-sm">Catálogo completo de cursos e conteúdos</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          type="text"
          placeholder="Buscar cursos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary"
        />
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <div>
          <p className="text-xs font-medium text-text-secondary mb-2">Formato</p>
          <FilterPills options={FORMAT_OPTIONS} active={format} onChange={setFormat} />
        </div>
        <div>
          <p className="text-xs font-medium text-text-secondary mb-2">Diretoria</p>
          <FilterPills options={DIR_OPTIONS} active={dir} onChange={setDir} />
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-text-secondary">{filtered.length} cursos encontrados</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-text-secondary text-sm">Carregando...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-semibold text-text-primary mb-1">Nenhum resultado</p>
          <p className="text-text-secondary text-sm">Tente outros filtros ou termos de busca</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((m) => (
            <CourseRow
              key={m.id}
              id={m.id}
              trailId={m.trilha_id}
              titulo={m.titulo}
              formato={m.formato as any}
              duracao={m.duracao_min ?? undefined}
              xp={m.xp}
              obrigatorio={m.obrigatorio}
            />
          ))}
        </div>
      )}
    </div>
  )
}
