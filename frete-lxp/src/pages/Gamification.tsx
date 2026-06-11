import { clsx } from 'clsx'
import { Trophy, Zap, BookCheck, Star } from 'lucide-react'
import { Card, Avatar, Badge } from '@/components/ui'
import { useAuthStore }         from '@/store/authStore'
import { useGamificationStore } from '@/store/gamificationStore'
import type { User } from '@/types'

// ── Dias da semana para o streak ─────────────────────────────────────────────
const WEEK_DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

// ── Banner de nível ───────────────────────────────────────────────────────────
function LevelBanner({ user }: { user: User }) {
  const totalXP = user.xp + user.xpToNextLevel
  const pct     = Math.round((user.xp / totalXP) * 100)

  const levelNames: Record<number, string> = {
    1: 'Iniciante', 2: 'Aprendiz', 3: 'Colaborador', 4: 'Experiente',
    5: 'Especialista', 6: 'Sênior', 7: 'Referência', 8: 'Líder',
    9: 'Mestre', 10: 'Expert', 11: 'Embaixador', 12: 'Lenda',
  }

  return (
    <Card className="bg-navy border-0 p-6">
      <div className="flex items-center gap-5">
        {/* Badge circular de nível */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-brand/20 border-4 border-brand flex items-center justify-center">
            <span className="font-heading font-bold text-white text-3xl">{user.level}</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-warning flex items-center justify-center">
            <Star className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-2">
          <div>
            <p className="text-white/50 text-xs font-body">Nível atual</p>
            <p className="font-heading font-bold text-white text-xl">
              {levelNames[user.level] ?? `Nível ${user.level}`}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-white/60">
              <span>{user.xp.toLocaleString('pt-BR')} XP</span>
              <span>{totalXP.toLocaleString('pt-BR')} XP</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-brand transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-white/40 text-xs">
              Faltam {user.xpToNextLevel.toLocaleString('pt-BR')} XP para o próximo nível
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

// ── Grid de métricas ──────────────────────────────────────────────────────────
function MetricsGrid({ user }: { user: User }) {
  const metrics = [
    { icon: BookCheck, label: 'Cursos concluídos', value: '3',   color: 'text-brand bg-brand-light' },
    { icon: Trophy,    label: 'Conquistas',         value: '3',   color: 'text-warning bg-warning-light' },
    { icon: Zap,       label: 'Posição ranking',    value: `#${user.rankPosition}`, color: 'text-success bg-success-light' },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {metrics.map(({ icon: Icon, label, value, color }) => (
        <Card key={label} className="text-center p-4 space-y-2">
          <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center mx-auto', color)}>
            <Icon className="w-5 h-5" />
          </div>
          <p className="font-heading font-bold text-gray-800 text-2xl">{value}</p>
          <p className="text-gray-400 text-xs font-body">{label}</p>
        </Card>
      ))}
    </div>
  )
}

// ── Card de streak semanal ────────────────────────────────────────────────────
function StreakCard({ streakDays }: { streakDays: number }) {
  // Marca os últimos N dias como ativos
  const today       = new Date().getDay()          // 0=Dom … 6=Sáb
  const dayOrder    = [1, 2, 3, 4, 5, 6, 0]        // Seg … Dom (alinha com WEEK_DAYS)
  const todayIndex  = dayOrder.indexOf(today)

  return (
    <Card className="bg-warning-light border-warning/20 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-2xl" role="img" aria-label="fogo">🔥</span>
        <div>
          <p className="font-heading font-bold text-gray-800 text-sm">Streak semanal</p>
          <p className="text-gray-500 text-xs">{streakDays} dias consecutivos de aprendizagem</p>
        </div>
        <Badge variant="warning" className="ml-auto">{streakDays} dias</Badge>
      </div>

      {/* Blocos dos dias */}
      <div className="flex gap-1.5">
        {WEEK_DAYS.map((day, idx) => {
          const done = idx <= todayIndex
          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={clsx(
                  'w-full h-8 rounded-md flex items-center justify-center text-sm transition-all',
                  done
                    ? 'bg-warning text-white font-body font-medium'
                    : 'bg-white border border-gray-100 text-gray-300',
                )}
              >
                {done ? '✓' : ''}
              </div>
              <span className="text-[10px] text-gray-400 font-body">{day}</span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

// ── Grid de conquistas ────────────────────────────────────────────────────────
function AchievementsGrid() {
  const { achievements } = useGamificationStore()

  return (
    <section className="space-y-3">
      <h2 className="font-heading font-bold text-gray-800 text-base">Conquistas</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {achievements.map((ach) => (
          <Card
            key={ach.id}
            className={clsx(
              'flex items-start gap-3 p-3 transition-all duration-150',
              !ach.unlocked && 'opacity-40 grayscale',
            )}
          >
            <span className="text-3xl flex-shrink-0" role="img" aria-label={ach.name}>
              {ach.icon}
            </span>
            <div className="min-w-0 space-y-0.5">
              <p className="font-body font-medium text-gray-800 text-sm leading-tight">{ach.name}</p>
              <p className="text-gray-400 text-xs leading-snug line-clamp-2">{ach.description}</p>
              <Badge variant={ach.unlocked ? 'success' : 'gray'} dot>
                +{ach.xpReward} XP
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

// ── Leaderboard ───────────────────────────────────────────────────────────────
function Leaderboard() {
  const { leaderboard } = useGamificationStore()
  const sorted = [...leaderboard].sort((a, b) => b.xp - a.xp)

  const posIcons: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

  return (
    <section className="space-y-3">
      <h2 className="font-heading font-bold text-gray-800 text-base">Leaderboard</h2>
      <Card className="p-0 overflow-hidden">
        {sorted.map((entry, idx) => {
          const pos = idx + 1
          return (
            <div
              key={entry.userId}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 transition-colors',
                entry.isCurrentUser ? 'bg-brand-light' : 'hover:bg-gray-50',
              )}
            >
              {/* Posição */}
              <span className="w-6 text-center text-sm font-body font-medium text-gray-400 flex-shrink-0">
                {posIcons[pos] ?? pos}
              </span>

              <Avatar
                initials={entry.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                size="sm"
                variant={entry.isCurrentUser ? 'blue' : 'navy'}
              />

              <div className="flex-1 min-w-0">
                <p className={clsx(
                  'text-sm font-body font-medium truncate',
                  entry.isCurrentUser ? 'text-brand-dark' : 'text-gray-800',
                )}>
                  {entry.name}
                  {entry.isCurrentUser && <span className="text-xs text-brand ml-1">(você)</span>}
                </p>
                <p className="text-xs text-gray-400 truncate">{entry.area}</p>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="font-heading font-bold text-sm text-gray-800">
                  {entry.xp.toLocaleString('pt-BR')}
                </p>
                <p className="text-[10px] text-gray-400">XP · Nível {entry.level}</p>
              </div>
            </div>
          )
        })}
      </Card>
    </section>
  )
}

// ── Página ────────────────────────────────────────────────────────────────────
export default function Gamification() {
  const { user } = useAuthStore()
  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <LevelBanner user={user} />
      <MetricsGrid user={user} />
      <StreakCard streakDays={user.streakDays} />
      <AchievementsGrid />
      <Leaderboard />
    </div>
  )
}
