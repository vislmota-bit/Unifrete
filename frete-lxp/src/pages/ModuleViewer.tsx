import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Zap, CheckCircle, Lock } from 'lucide-react'
import { clsx } from 'clsx'
import { Button, Badge, ProgressBar } from '@/components/ui'
import { useContentStore } from '@/store/contentStore'
import { MediaPlayer } from '@/components/media/MediaPlayer'
import { MOCK_TRAILS } from '@/store/mockData'

const CONTENT_TYPE_LABEL: Record<string, { label: string; color: string }> = {
  video: { label: '🎬 Vídeo',       color: 'bg-blue-50  text-blue-700  border-blue-200' },
  audio: { label: '🎧 Áudio',       color: 'bg-purple-50 text-purple-700 border-purple-200' },
  pdf:   { label: '📄 PDF',         color: 'bg-red-50   text-red-700   border-red-200' },
  doc:   { label: '📝 Documento',   color: 'bg-green-50 text-green-700 border-green-200' },
}

export default function ModuleViewer() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const navigate = useNavigate()
  const { entries } = useContentStore()

  // Encontra o módulo nos dados mock
  const allModules = MOCK_TRAILS.flatMap((t) =>
    t.modules.map((m) => ({ ...m, trailId: t.id, trailTitle: t.title }))
  )
  const mockModule = allModules.find((m) => m.id === moduleId)
  const contentEntry = entries.find((e) => e.moduleId === moduleId)

  if (!mockModule || !contentEntry) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <p className="text-gray-400">Módulo não encontrado.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </div>
    )
  }

  const isLocked = mockModule.status === 'locked'
  const typeInfo = CONTENT_TYPE_LABEL[contentEntry.contentType]

  // Módulos da mesma trilha para o painel lateral
  const trail = MOCK_TRAILS.find((t) => t.id === mockModule.trailId)!
  const trailModules = trail.modules

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* Topbar do viewer */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
        <span className="text-gray-200">/</span>
        <span className="text-sm text-gray-400">{mockModule.trailTitle}</span>
        <span className="text-gray-200">/</span>
        <span className="text-sm font-body font-medium text-gray-800 truncate">{mockModule.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Coluna principal: player + info */}
        <div className="lg:col-span-2 space-y-4">

          {/* Player ou aviso de bloqueado */}
          {isLocked ? (
            <div className="w-full rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center gap-3 py-20">
              <Lock className="w-10 h-10 text-gray-300" />
              <p className="text-sm font-body font-medium text-gray-500">Módulo bloqueado</p>
              <p className="text-xs text-gray-400">Conclua o módulo anterior para desbloquear.</p>
            </div>
          ) : (
            <MediaPlayer
              contentType={contentEntry.contentType}
              contentUrl={contentEntry.contentUrl}
              title={mockModule.title}
            />
          )}

          {/* Info do módulo */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 flex-wrap">
              <div className="flex-1">
                <h1 className="font-heading font-bold text-gray-800 text-xl leading-tight">
                  {mockModule.title}
                </h1>
                <p className="text-gray-500 text-sm mt-1">{mockModule.trailTitle}</p>
              </div>
              {mockModule.status === 'completed' && (
                <Badge variant="success" dot>Concluído</Badge>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border', typeInfo.color)}>
                {typeInfo.label}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3.5 h-3.5" />{mockModule.duration} min
              </span>
              <span className="flex items-center gap-1 text-xs text-brand font-medium">
                <Zap className="w-3.5 h-3.5" />+{mockModule.xpReward} XP
              </span>
            </div>

            {contentEntry.description && (
              <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                {contentEntry.description}
              </p>
            )}

            {mockModule.status === 'active' && mockModule.progress !== undefined && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Progresso</span>
                  <span>{mockModule.progress}%</span>
                </div>
                <ProgressBar value={mockModule.progress} color="blue" size="md" />
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: módulos da trilha */}
        <div className="space-y-3">
          <h2 className="font-heading font-bold text-gray-800 text-sm">
            Módulos — {trail.title}
          </h2>
          <div className="space-y-2">
            {trailModules.map((m, idx) => {
              const isThis = m.id === moduleId
              const entry  = entries.find((e) => e.moduleId === m.id)
              const tInfo  = entry ? CONTENT_TYPE_LABEL[entry.contentType] : null
              return (
                <button
                  key={m.id}
                  onClick={() => m.status !== 'locked' && navigate(`/module/${m.id}`)}
                  disabled={m.status === 'locked'}
                  className={clsx(
                    'w-full text-left flex items-center gap-3 p-3 rounded-lg border transition-all',
                    isThis
                      ? 'border-brand/30 bg-brand-light'
                      : m.status === 'locked'
                      ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                      : 'border-gray-100 bg-white hover:shadow-sm cursor-pointer',
                  )}
                >
                  {/* Ícone de status */}
                  <div className={clsx(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0',
                    m.status === 'completed' ? 'bg-success text-white' :
                    m.status === 'active'    ? 'bg-brand text-white' :
                    'bg-gray-200 text-gray-400',
                  )}>
                    {m.status === 'completed' ? <CheckCircle className="w-3.5 h-3.5" /> :
                     m.status === 'locked'    ? <Lock className="w-3 h-3" /> :
                     idx + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={clsx(
                      'text-xs font-body font-medium truncate',
                      isThis ? 'text-brand-dark' : 'text-gray-800',
                    )}>
                      {m.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {tInfo && (
                        <span className={clsx('text-[10px] px-1.5 py-px rounded border', tInfo.color)}>
                          {tInfo.label.split(' ')[0]} {tInfo.label.split(' ')[1]}
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400">{m.duration} min</span>
                    </div>
                  </div>

                  {m.status === 'active' && m.progress !== undefined && (
                    <span className="text-xs font-body font-medium text-brand flex-shrink-0">
                      {m.progress}%
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
