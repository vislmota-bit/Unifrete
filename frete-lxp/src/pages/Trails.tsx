import { CheckCircle, Play, Lock, ArrowRight, Clock, Layers } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { Button, Badge, Card, ProgressBar } from '@/components/ui'
import { useTrailsStore } from '@/store/trailsStore'
import { useContentStore } from '@/store/contentStore'
import type { Trail, TrailModule } from '@/types'

const CONTENT_TYPE_LABEL: Record<string, string> = {
  video: '🎬 Vídeo',
  audio: '🎧 Áudio',
  pdf:   '📄 PDF',
  doc:   '📝 Documento',
}

// ── Hero da trilha ativa ──────────────────────────────────────────────────────
function ActiveTrailHero({ trail }: { trail: Trail }) {
  const done  = trail.modules.filter((m) => m.status === 'completed').length
  const total = trail.modules.length

  return (
    <Card className="bg-navy border-0 p-6 space-y-4">
      <Badge variant="blue">Trilha em andamento</Badge>

      <div>
        <h1 className="font-heading font-bold text-white text-2xl">{trail.title}</h1>
        <p className="text-white/60 text-sm mt-1 leading-relaxed">{trail.description}</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/60">{done} de {total} módulos concluídos</span>
          <span className="text-white font-medium">{trail.progress}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-brand transition-all duration-700"
            style={{ width: `${trail.progress}%` }}
          />
        </div>
        <p className="text-white/40 text-xs">
          {Math.round(trail.totalDuration / 60)}h {trail.totalDuration % 60}min no total
        </p>
      </div>
    </Card>
  )
}

// ── Módulo na linha do tempo ──────────────────────────────────────────────────
function ModuleStep({
  module, isLast,
}: { module: TrailModule; isLast: boolean }) {
  const navigate     = useNavigate()
  const { entries }  = useContentStore()
  const entry        = entries.find((e) => e.moduleId === module.id)
  const isCompleted  = module.status === 'completed'
  const isActive     = module.status === 'active'
  const isLocked     = module.status === 'locked'

  return (
    <div className="flex gap-4">
      {/* Linha do tempo */}
      <div className="flex flex-col items-center">
        {/* Círculo de status */}
        <div
          className={clsx(
            'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all',
            isCompleted ? 'bg-success border-success text-white' :
            isActive    ? 'bg-brand   border-brand   text-white' :
            'bg-white border-gray-200 text-gray-300',
          )}
        >
          {isCompleted ? <CheckCircle className="w-4 h-4" /> :
           isActive    ? <Play        className="w-3.5 h-3.5" /> :
                         <Lock       className="w-3.5 h-3.5" />}
        </div>
        {/* Linha vertical */}
        {!isLast && (
          <div className={clsx(
            'w-0.5 flex-1 mt-1 min-h-[20px]',
            isCompleted ? 'bg-success' : 'bg-gray-100',
          )} />
        )}
      </div>

      {/* Conteúdo do módulo */}
      <div className={clsx('pb-5 flex-1', isLast && 'pb-0')}>
        <Card
          className={clsx(
            'p-3 space-y-2 transition-all duration-150',
            isActive    ? 'border-brand/30 shadow-sm'    : '',
            isCompleted ? 'border-success/20'            : '',
            isLocked    ? 'opacity-60'                   : '',
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className={clsx(
                'font-body font-medium text-sm',
                isLocked ? 'text-gray-400' : 'text-gray-800',
              )}>
                {module.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />{module.duration} min
                </span>
                {entry && (
                  <span className="text-[10px] px-1.5 py-px rounded border bg-gray-50 border-gray-200 text-gray-500">
                    {CONTENT_TYPE_LABEL[entry.contentType]}
                  </span>
                )}
                <Badge variant={isCompleted ? 'success' : 'gray'} dot>
                  +{module.xpReward} XP
                </Badge>
              </div>
            </div>

            {/* Estado do módulo */}
            {isCompleted && module.completedAt && (
              <span className="text-[10px] text-gray-400 flex-shrink-0 whitespace-nowrap">
                {new Date(module.completedAt).toLocaleDateString('pt-BR')}
              </span>
            )}
          </div>

          {/* Barra de progresso inline (apenas módulo ativo) */}
          {isActive && module.progress !== undefined && (
            <ProgressBar value={module.progress} color="blue" size="sm" showLabel />
          )}

          {/* Mensagem de bloqueio */}
          {isLocked && (
            <p className="text-xs text-gray-400 italic">
              🔒 Disponível após concluir o módulo anterior
            </p>
          )}

          {/* Botão de ação */}
          {isActive && (
            <Button
              variant="brand"
              size="sm"
              leftIcon={<Play className="w-3.5 h-3.5" />}
              onClick={() => navigate(`/module/${module.id}`)}
            >
              Continuar
            </Button>
          )}
          {isCompleted && (
            <Button
              variant="ghost"
              size="sm"
              className="text-success hover:bg-success-light"
              onClick={() => navigate(`/module/${module.id}`)}
            >
              <CheckCircle className="w-3.5 h-3.5 mr-1 inline" />
              Concluído — rever conteúdo
            </Button>
          )}
        </Card>
      </div>
    </div>
  )
}

// ── Card de trilha disponível (grade 2×2) ─────────────────────────────────────
function TrailCard({ trail, onSelect }: { trail: Trail; onSelect: () => void }) {
  const catColors: Record<string, string> = {
    'Operações':   'bg-navy',
    'Tecnologia':  'bg-brand',
    'Compliance':  'bg-danger',
    'Soft Skills': 'bg-success',
  }
  const bg = catColors[trail.category] ?? 'bg-gray-400'

  return (
    <Card className="flex flex-col gap-3 hover:shadow-md transition-all duration-150 cursor-pointer group" onClick={onSelect}>
      {/* Thumbnail */}
      <div className={clsx('w-full h-20 rounded-lg flex items-center justify-center', bg)}>
        <span className="font-heading font-bold text-white text-xl">
          {trail.title.charAt(0)}
        </span>
      </div>

      <div className="space-y-1">
        <Badge variant="gray">{trail.category}</Badge>
        <p className="font-heading font-bold text-gray-800 text-sm group-hover:text-brand transition-colors">
          {trail.title}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />{Math.round(trail.totalDuration / 60)}h
          </span>
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3" />{trail.modules.length} módulos
          </span>
        </div>
      </div>

      {trail.progress > 0 ? (
        <ProgressBar value={trail.progress} color="blue" size="sm" showLabel />
      ) : null}

      <Button
        variant={trail.progress > 0 ? 'brand' : 'outline'}
        size="sm"
        fullWidth
        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
      >
        {trail.progress > 0 ? 'Continuar trilha' : 'Iniciar trilha'}
      </Button>
    </Card>
  )
}

// ── Página ────────────────────────────────────────────────────────────────────
export default function Trails() {
  const { trails, activeTrail, setActive } = useTrailsStore()
  const otherTrails = trails.filter((t) => t.id !== activeTrail?.id)

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Hero trilha ativa */}
      {activeTrail && <ActiveTrailHero trail={activeTrail} />}

      {/* Módulos da trilha ativa */}
      {activeTrail && (
        <section className="space-y-1">
          <h2 className="font-heading font-bold text-gray-800 text-base mb-3">Módulos</h2>
          {activeTrail.modules.map((mod, idx) => (
            <ModuleStep
              key={mod.id}
              module={mod}
              isLast={idx === activeTrail.modules.length - 1}
            />
          ))}
        </section>
      )}

      {/* Outras trilhas disponíveis */}
      {otherTrails.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-heading font-bold text-gray-800 text-base">Outras trilhas</h2>
          <div className="grid grid-cols-2 gap-3">
            {otherTrails.map((trail) => (
              <TrailCard key={trail.id} trail={trail} onSelect={() => setActive(trail.id)} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
