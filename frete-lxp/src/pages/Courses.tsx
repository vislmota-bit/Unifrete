import { useState } from 'react'
import { Play, RotateCcw, CheckCircle, Clock, Layers, AlertCircle } from 'lucide-react'
import { clsx } from 'clsx'
import { Button, Badge, Card, ProgressBar, Avatar } from '@/components/ui'
import { useAuthStore }   from '@/store/authStore'
import { useCoursesStore } from '@/store/coursesStore'
import type { Course, Enrollment } from '@/types'

// ── Tabs disponíveis ──────────────────────────────────────────────────────────
type Tab = 'all' | 'in_progress' | 'completed' | 'not_started'
const TABS: { key: Tab; label: string }[] = [
  { key: 'all',         label: 'Todos'          },
  { key: 'in_progress', label: 'Em andamento'   },
  { key: 'completed',   label: 'Concluídos'     },
  { key: 'not_started', label: 'Não iniciados'  },
]

// ── Mapa de cores do thumbnail ────────────────────────────────────────────────
function CourseThumbnail({ color, size = 'md' }: { color: string; size?: 'sm' | 'md' }) {
  return (
    <div
      className={clsx(
        'rounded-lg flex-shrink-0',
        size === 'md' ? 'w-14 h-14' : 'w-10 h-10',
      )}
      style={{ backgroundColor: color }}
    />
  )
}

// ── Item de curso na lista ────────────────────────────────────────────────────
function CourseItem({ course, enrollment }: { course: Course; enrollment?: Enrollment }) {
  const progress = enrollment?.progress ?? 0
  const status   = enrollment?.status   ?? 'not_started'
  const isLate   = course.deadline && status !== 'completed'
    && new Date(course.deadline) < new Date()

  return (
    <div
      className={clsx(
        'flex items-center gap-3 p-3 rounded-lg border transition-all duration-150 hover:shadow-sm',
        isLate       ? 'bg-danger-light  border-danger/20'  :
        status === 'completed' ? 'bg-white border-gray-100' :
        'bg-white border-gray-100',
      )}
    >
      <CourseThumbnail color={course.thumbnail} />

      {/* Metadados */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-body font-medium text-sm text-gray-800 truncate">{course.title}</span>
          <Badge variant={course.type === 'mandatory' ? 'danger' : 'gray'} dot>
            {course.type === 'mandatory' ? 'Obrigatório' : 'Opcional'}
          </Badge>
          {isLate && (
            <Badge variant="danger">
              <AlertCircle className="w-3 h-3 inline mr-1" />Atrasado
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />{course.duration} min
          </span>
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3" />{course.modules} módulos
          </span>
          <Badge variant="blue">{course.category}</Badge>
          {course.deadline && (
            <span className={clsx(isLate ? 'text-danger font-medium' : '')}>
              Prazo: {new Date(course.deadline).toLocaleDateString('pt-BR')}
            </span>
          )}
        </div>

        {status !== 'not_started' && (
          <ProgressBar
            value={progress}
            color={status === 'completed' ? 'green' : 'blue'}
            size="sm"
            showLabel
          />
        )}
      </div>

      {/* Botão contextual */}
      <div className="flex-shrink-0">
        {status === 'completed' ? (
          <Button variant="ghost" size="sm" leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Rever
          </Button>
        ) : status === 'in_progress' ? (
          <Button variant="brand" size="sm" leftIcon={<Play className="w-3.5 h-3.5" />}>
            Continuar
          </Button>
        ) : (
          <Button variant="outline" size="sm" leftIcon={<Play className="w-3.5 h-3.5" />}>
            Iniciar
          </Button>
        )}
      </div>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function Courses() {
  const { user }                    = useAuthStore()
  const { courses, enrollments }    = useCoursesStore()
  const [activeTab, setActiveTab]   = useState<Tab>('all')

  // Mapeia courseId → enrollment
  const enrollMap = Object.fromEntries(enrollments.map((e) => [e.courseId, e]))

  // XP para próximo nível
  const xpPct = user ? Math.round((user.xp / (user.xp + user.xpToNextLevel)) * 100) : 0

  // Filtra cursos pela tab
  const filtered = courses.filter((c) => {
    const status = enrollMap[c.id]?.status ?? 'not_started'
    if (activeTab === 'all') return true
    return status === activeTab
  })

  const completedCourses    = courses.filter((c) => enrollMap[c.id]?.status === 'completed')
  const nonCompletedFiltered = filtered.filter((c) => enrollMap[c.id]?.status !== 'completed')

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* ── Card de XP ───────────────────────────────────────────── */}
      <Card className="bg-navy border-0 text-white p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar initials={user?.name.slice(0, 2) ?? 'PJ'} size="lg" variant="blue" />
            <div>
              <p className="font-heading font-bold text-white text-lg">{user?.name}</p>
              <p className="text-white/60 text-sm">{user?.area}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/50 text-xs mb-0.5">Posição no ranking</p>
            <p className="font-heading font-bold text-white text-2xl">#{user?.rankPosition}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Nível {user?.level} → Nível {(user?.level ?? 0) + 1}</span>
            <span className="text-white font-medium">
              {user?.xp.toLocaleString('pt-BR')} / {((user?.xp ?? 0) + (user?.xpToNextLevel ?? 0)).toLocaleString('pt-BR')} XP
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-brand transition-all duration-700"
              style={{ width: `${xpPct}%` }}
            />
          </div>
          <p className="text-white/50 text-xs text-right">
            Faltam {user?.xpToNextLevel.toLocaleString('pt-BR')} XP para o próximo nível
          </p>
        </div>
      </Card>

      {/* ── Tabs de filtro ───────────────────────────────────────── */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={clsx(
              'px-3 py-1.5 rounded-md text-sm font-body font-medium transition-all duration-150',
              activeTab === key
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-700',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Lista de cursos filtrada ─────────────────────────────── */}
      {nonCompletedFiltered.length > 0 && (
        <section className="space-y-2">
          {nonCompletedFiltered.map((c) => (
            <CourseItem key={c.id} course={c} enrollment={enrollMap[c.id]} />
          ))}
        </section>
      )}

      {/* ── Seção de concluídos (separada, apenas quando tab = all ou completed) ── */}
      {(activeTab === 'all' || activeTab === 'completed') && completedCourses.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-success" />
            <h2 className="font-heading font-bold text-gray-800 text-sm">
              Concluídos ({completedCourses.length})
            </h2>
          </div>
          <div className="space-y-2">
            {completedCourses.map((c) => (
              <CourseItem key={c.id} course={c} enrollment={enrollMap[c.id]} />
            ))}
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="font-body text-sm">Nenhum curso encontrado nesta categoria.</p>
        </div>
      )}
    </div>
  )
}
