import { AlertTriangle, Lightbulb, Clock, Layers, CheckCircle } from 'lucide-react'
import { clsx } from 'clsx'
import { Button, Badge, ProgressBar } from '@/components/ui'
import { useCoursesStore } from '@/store/coursesStore'
import type { Course, Enrollment } from '@/types'

// ── Resumo 4 colunas ──────────────────────────────────────────────────────────
function SummaryGrid({
  mandatory, optional, completed, enrollments,
}: {
  mandatory: Course[]; optional: Course[]; completed: Course[]; enrollments: Record<string, Enrollment>
}) {
  const late = mandatory.filter((c) =>
    c.deadline && enrollments[c.id]?.status !== 'completed'
    && new Date(c.deadline) < new Date()
  )
  const pending = mandatory.filter((c) =>
    c.deadline && enrollments[c.id]?.status !== 'completed'
    && new Date(c.deadline) >= new Date()
  )

  const items = [
    { label: 'Obrigatórios em atraso', value: late.length,      color: 'text-danger',  bg: 'bg-danger-light  border-danger/20' },
    { label: 'Pendentes',              value: pending.length,    color: 'text-warning', bg: 'bg-warning-light border-warning/20' },
    { label: 'Concluídos',             value: completed.length,  color: 'text-success', bg: 'bg-success-light border-success/20' },
    { label: 'Opcionais',              value: optional.length,   color: 'text-brand',   bg: 'bg-brand-light   border-brand/20' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map(({ label, value, color, bg }) => (
        <div key={label} className={clsx('rounded-xl border p-4 space-y-1', bg)}>
          <p className={clsx('font-heading font-bold text-2xl', color)}>{value}</p>
          <p className="text-gray-600 text-xs font-body">{label}</p>
        </div>
      ))}
    </div>
  )
}

// ── Item de treinamento ───────────────────────────────────────────────────────
function TrainingItem({
  course, enrollment,
}: { course: Course; enrollment?: Enrollment }) {
  const status   = enrollment?.status   ?? 'not_started'
  const progress = enrollment?.progress ?? 0
  const isLate   = course.deadline && status !== 'completed'
    && new Date(course.deadline) < new Date()
  const isDueSoon = course.deadline && status !== 'completed' && !isLate
    && new Date(course.deadline) <= new Date(Date.now() + 7 * 86400 * 1000)

  const deadlineStr = course.deadline
    ? new Date(course.deadline).toLocaleDateString('pt-BR')
    : null

  // Cor do dot de status
  const dotColor =
    status === 'completed' ? 'bg-success' :
    isLate                 ? 'bg-danger'  :
    isDueSoon              ? 'bg-warning' :
    'bg-brand'

  return (
    <div
      className={clsx(
        'flex items-center gap-3 p-3 rounded-lg border transition-all duration-150',
        isLate    ? 'bg-danger-light  border-danger/20  hover:border-danger/40'  :
        isDueSoon ? 'bg-warning-light border-warning/20 hover:border-warning/40' :
        'bg-white border-gray-100 hover:shadow-sm',
      )}
    >
      {/* Bolinha de status */}
      <span className={clsx('w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5', dotColor)} />

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-body font-medium text-gray-800">{course.title}</span>
          {isLate && <Badge variant="danger">Atrasado</Badge>}
          {isDueSoon && !isLate && <Badge variant="warning">Prazo próximo</Badge>}
          {status === 'completed' && <Badge variant="success" dot>Concluído</Badge>}
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration} min</span>
          <span className="flex items-center gap-1"><Layers className="w-3 h-3" />{course.modules} módulos</span>
          {deadlineStr && (
            <span className={clsx(isLate ? 'text-danger font-medium' : isDueSoon ? 'text-warning font-medium' : '')}>
              Prazo: {deadlineStr}
            </span>
          )}
        </div>

        {status !== 'not_started' && (
          <ProgressBar
            value={progress}
            color={status === 'completed' ? 'green' : isLate ? 'red' : isDueSoon ? 'yellow' : 'blue'}
            size="sm"
            showLabel
          />
        )}
      </div>

      {/* Botão ação */}
      <div className="flex-shrink-0">
        {status === 'completed' ? (
          <CheckCircle className="w-5 h-5 text-success" />
        ) : status === 'in_progress' ? (
          <Button variant="brand" size="sm">Continuar</Button>
        ) : (
          <Button
            variant={isLate ? 'danger' : 'outline'}
            size="sm"
          >
            Iniciar
          </Button>
        )}
      </div>
    </div>
  )
}

// ── Seção de obrigatórios ─────────────────────────────────────────────────────
function MandatorySection({
  courses, enrollments,
}: { courses: Course[]; enrollments: Record<string, Enrollment> }) {
  const lateCount = courses.filter((c) =>
    c.deadline && enrollments[c.id]?.status !== 'completed'
    && new Date(c.deadline) < new Date()
  ).length

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 px-3 py-2 bg-danger-light rounded-lg border border-danger/20">
        <AlertTriangle className="w-4 h-4 text-danger flex-shrink-0" />
        <span className="font-heading font-bold text-danger text-sm flex-1">
          Obrigatórios
        </span>
        {lateCount > 0 && (
          <Badge variant="danger">{lateCount} em atraso</Badge>
        )}
      </div>

      <div className="space-y-2">
        {courses.map((c) => (
          <TrainingItem key={c.id} course={c} enrollment={enrollments[c.id]} />
        ))}
      </div>
    </section>
  )
}

// ── Seção de opcionais ────────────────────────────────────────────────────────
function OptionalSection({
  courses, enrollments,
}: { courses: Course[]; enrollments: Record<string, Enrollment> }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 px-3 py-2 bg-brand-light rounded-lg border border-brand/20">
        <Lightbulb className="w-4 h-4 text-brand flex-shrink-0" />
        <span className="font-heading font-bold text-brand-dark text-sm flex-1">Opcionais</span>
        <Badge variant="blue">+XP ao completar</Badge>
      </div>

      <div className="space-y-2">
        {courses.map((c) => (
          <TrainingItem key={c.id} course={c} enrollment={enrollments[c.id]} />
        ))}
      </div>
    </section>
  )
}

// ── Página ────────────────────────────────────────────────────────────────────
export default function Trainings() {
  const { courses, enrollments } = useCoursesStore()
  const enrollMap = Object.fromEntries(enrollments.map((e) => [e.courseId, e]))

  const mandatory  = courses.filter((c) => c.type === 'mandatory')
  const optional   = courses.filter((c) => c.type === 'optional')
  const completed  = courses.filter((c) => enrollMap[c.id]?.status === 'completed')

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading font-bold text-gray-800 text-xl">Treinamentos</h1>
        <p className="text-gray-400 text-sm mt-0.5">Acompanhe seus treinamentos obrigatórios e opcionais.</p>
      </div>

      <SummaryGrid
        mandatory={mandatory}
        optional={optional}
        completed={completed}
        enrollments={enrollMap}
      />

      <MandatorySection courses={mandatory} enrollments={enrollMap} />
      <OptionalSection  courses={optional}  enrollments={enrollMap} />
    </div>
  )
}
