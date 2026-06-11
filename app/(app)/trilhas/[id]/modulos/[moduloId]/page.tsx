'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { FileText, Headphones, CheckCircle, Loader2 } from 'lucide-react'
import PlayerTopbar from '@/components/layout/PlayerTopbar'
import VideoPlayer from '@/components/courses/VideoPlayer'
import ModuleSidebar from '@/components/courses/ModuleSidebar'
import { cn } from '@/lib/utils'

interface ModuloData {
  id: string
  titulo: string
  formato: string
  url_conteudo: string | null
  descricao: string | null
  xp: number
  duracao_min: number | null
}

interface TrilhaData {
  id: string
  titulo: string
  modulos: ModuloData[]
}

export default function PlayerPage() {
  const params = useParams()
  const { id: trailId, moduloId } = params as { id: string; moduloId: string }

  const [trilha, setTrilha] = useState<TrilhaData | null>(null)
  const [modulo, setModulo] = useState<ModuloData | null>(null)
  const [progress, setProgress] = useState(0)
  const [marked, setMarked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [trailRes, moduloRes, progressRes] = await Promise.all([
        fetch(`/api/trails/${trailId}`),
        fetch(`/api/modules/${moduloId}`),
        fetch(`/api/progress/${moduloId}`),
      ])
      if (trailRes.ok) setTrilha(await trailRes.json())
      if (moduloRes.ok) setModulo(await moduloRes.json())
      if (progressRes.ok) {
        const p = await progressRes.json()
        setProgress(p.pct_assistido ?? 0)
        setMarked(p.concluido ?? false)
      }
      setLoading(false)
    }
    fetchData()
  }, [trailId, moduloId])

  const handleMarkRead = async () => {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moduloId, pctAssistido: 100 }),
    })
    setProgress(100)
    setMarked(true)
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  const sections = trilha
    ? [{ title: trilha.titulo, modules: trilha.modulos.map((m) => ({
        id: m.id,
        titulo: m.titulo,
        formato: m.formato,
        duracao: m.duracao_min ?? undefined,
        concluido: false,
        locked: false,
        ordem: 0,
      })) }]
    : []

  return (
    <div className="flex flex-col h-full">
      <PlayerTopbar
        trailTitle={trilha?.titulo ?? ''}
        trailId={trailId}
        moduleTitle={modulo?.titulo ?? ''}
        progress={progress}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {modulo?.formato === 'video' && modulo.url_conteudo && (
            <VideoPlayer
              url={modulo.url_conteudo}
              moduloId={moduloId}
              initialProgress={progress}
              onProgress={setProgress}
            />
          )}

          {modulo?.formato === 'pdf' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
              <FileText className="w-16 h-16 text-orange-400 mx-auto mb-4" />
              <h3 className="font-heading font-bold text-text-primary text-xl mb-2">{modulo.titulo}</h3>
              {modulo.url_conteudo ? (
                <a
                  href={modulo.url_conteudo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-medium hover:underline"
                >
                  Abrir PDF ↗
                </a>
              ) : (
                <p className="text-text-secondary">PDF em breve.</p>
              )}
            </div>
          )}

          {modulo?.formato === 'podcast' && modulo.url_conteudo && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <Headphones className="w-10 h-10 text-purple-500" />
                <div>
                  <h3 className="font-heading font-bold text-text-primary text-lg">{modulo.titulo}</h3>
                  {modulo.duracao_min && <p className="text-sm text-text-secondary">{modulo.duracao_min} min</p>}
                </div>
              </div>
              <audio controls src={modulo.url_conteudo} className="w-full" />
            </div>
          )}

          {/* Description */}
          {modulo?.descricao && (
            <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-heading font-bold text-text-primary text-base mb-2">Sobre este módulo</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{modulo.descricao}</p>
            </div>
          )}

          {/* Mark as read (for PDF/podcast) */}
          {modulo?.formato !== 'video' && !marked && (
            <button
              onClick={handleMarkRead}
              className="mt-4 w-full bg-success text-white py-3 rounded-xl font-semibold hover:bg-success/90 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Marcar como Concluído (+{modulo?.xp ?? 0} XP)
            </button>
          )}

          {marked && (
            <div className={cn('mt-4 bg-success/10 border border-success/20 rounded-xl p-4 flex items-center gap-3')}>
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
              <div>
                <p className="text-success font-semibold text-sm">Módulo Concluído!</p>
                <p className="text-success/70 text-xs">+{modulo?.xp ?? 0} XP adicionados ao seu perfil</p>
              </div>
            </div>
          )}
        </div>

        {/* Module sidebar */}
        {trilha && (
          <ModuleSidebar
            trailId={trailId}
            sections={sections}
            currentModuleId={moduloId}
          />
        )}
      </div>
    </div>
  )
}
