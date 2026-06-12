import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Zap, Edit2 } from 'lucide-react'
import { Button, Card, Badge } from '@/components/ui'
import { useAdminStore } from '@/store/adminStore'

export default function AdminCourses() {
  const navigate = useNavigate()
  const { courses } = useAdminStore()
  const [search, setSearch] = useState('')

  const filtered = courses.filter((c) =>
    !search || c.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-gray-800 text-2xl">Cursos</h1>
          <p className="text-gray-400 text-sm mt-0.5">Gerencie os cursos da plataforma.</p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/admin/courses/new')}
        >
          Novo curso
        </Button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar curso..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition font-body"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((c) => (
          <Card key={c.id} className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-heading font-bold text-lg overflow-hidden"
              style={{ background: c.bannerColor }}
            >
              {c.bannerUrl
                ? <img src={c.bannerUrl} alt="" className="w-full h-full object-cover" />
                : c.title.charAt(0)
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="font-body font-medium text-gray-800 text-sm truncate">{c.title}</p>
                <Badge variant={c.status === 'published' ? 'success' : 'gray'} dot>
                  {c.status === 'published' ? 'Publicado' : 'Rascunho'}
                </Badge>
                <Badge variant={c.type === 'mandatory' ? 'danger' : 'blue'}>
                  {c.type === 'mandatory' ? 'Obrigatório' : 'Opcional'}
                </Badge>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1 text-xs text-brand font-medium">
                  <Zap className="w-3 h-3" />{c.xpReward} XP
                </span>
                {c.tags.slice(0, 3).map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 bg-brand-light text-brand-dark rounded-md border border-brand/20">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => navigate(`/admin/courses/new`)}
              className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </Card>
        ))}
      </div>
    </div>
  )
}
