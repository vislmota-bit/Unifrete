import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { Download, Plus, Users, TrendingUp, Clock, ThumbsUp, AlertTriangle } from 'lucide-react'
import { clsx } from 'clsx'
import { Button, Avatar, Card, ProgressBar } from '@/components/ui'
import {
  MOCK_METRICS, MOCK_MONTHLY, MOCK_AREA_ADHERENCE,
  MOCK_LEADERBOARD,
  MOCK_ALERTS,
} from '@/store/mockData'

// ── Topbar admin ──────────────────────────────────────────────────────────────
function AdminTopbar() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="font-heading font-bold text-gray-800 text-2xl">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-0.5">Visão geral da plataforma FreteLXP</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
          Exportar
        </Button>
        <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          Novo curso
        </Button>
      </div>
    </div>
  )
}

// ── Grid de métricas principais ───────────────────────────────────────────────
function MetricsGrid() {
  const m = MOCK_METRICS
  const cards = [
    {
      icon: Users,     label: 'Colaboradores ativos',
      value: m.activeCollaborators.toLocaleString('pt-BR'),
      sub: '+3,2% este mês', subColor: 'text-success',
      iconStyle: 'bg-brand-light text-brand',
    },
    {
      icon: TrendingUp, label: 'Taxa de conclusão',
      value: `${m.completionRate}%`,
      sub: '+5pp vs mês anterior', subColor: 'text-success',
      iconStyle: 'bg-success-light text-success',
    },
    {
      icon: Clock,     label: 'Horas aprendidas',
      value: m.hoursLearned.toLocaleString('pt-BR'),
      sub: 'Acumulado no ano', subColor: 'text-gray-400',
      iconStyle: 'bg-warning-light text-warning',
    },
    {
      icon: ThumbsUp,  label: 'NPS',
      value: m.nps.toString(),
      sub: 'Promotores: 74%', subColor: 'text-gray-400',
      iconStyle: 'bg-navy/10 text-navy',
    },
  ]

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      {cards.map(({ icon: Icon, label, value, sub, subColor, iconStyle }) => (
        <Card key={label} className="space-y-3">
          <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center', iconStyle)}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-heading font-bold text-gray-800 text-2xl">{value}</p>
            <p className="text-gray-400 text-xs mt-0.5">{label}</p>
          </div>
          <p className={clsx('text-xs font-body font-medium', subColor)}>{sub}</p>
        </Card>
      ))}
    </div>
  )
}

// ── Gráfico de barras: conclusões por mês ─────────────────────────────────────
function CompletionsChart() {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-gray-800 text-sm">Conclusões por mês</h2>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-brand inline-block" /> Conclusões
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-gray-200 inline-block" /> Iniciados
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={MOCK_MONTHLY} barGap={4} barCategoryGap="30%">
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#98A2B3', fontFamily: 'DM Sans' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#98A2B3', fontFamily: 'DM Sans' }}
            width={36}
          />
          <Tooltip
            contentStyle={{
              border: '1px solid #EAECF0',
              borderRadius: 8,
              fontSize: 12,
              fontFamily: 'DM Sans',
            }}
            cursor={{ fill: '#F7F8FA' }}
          />
          <Bar dataKey="starts"      fill="#EAECF0" radius={[4, 4, 0, 0]} name="Iniciados"   />
          <Bar dataKey="completions" fill="#00AEEF" radius={[4, 4, 0, 0]} name="Conclusões"  />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

// ── Donut de aderência por área ───────────────────────────────────────────────
function AdherenceChart() {
  const data = MOCK_AREA_ADHERENCE.map((a) => ({ name: a.area, value: a.percentage }))

  return (
    <Card className="space-y-3">
      <h2 className="font-heading font-bold text-gray-800 text-sm">Aderência por área</h2>

      {/* Mini donut */}
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={65}
            paddingAngle={3}
            dataKey="value"
          >
            {MOCK_AREA_ADHERENCE.map((entry) => (
              <Cell key={entry.area} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v: number) => [`${v}%`, '']}
            contentStyle={{ border: '1px solid #EAECF0', borderRadius: 8, fontSize: 12, fontFamily: 'DM Sans' }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legenda manual */}
      <div className="space-y-1.5">
        {MOCK_AREA_ADHERENCE.map((a) => (
          <div key={a.area} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: a.color }} />
            <span className="text-xs text-gray-600 flex-1">{a.area}</span>
            <ProgressBar value={a.percentage} color="blue" size="sm" className="w-24" />
            <span className="text-xs font-body font-medium text-gray-800 w-8 text-right">{a.percentage}%</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── Tabela top aprendizes ─────────────────────────────────────────────────────
function TopLearnersTable() {
  const sorted = [...MOCK_LEADERBOARD].sort((a, b) => b.xp - a.xp)

  return (
    <Card className="space-y-3">
      <h2 className="font-heading font-bold text-gray-800 text-sm">Top aprendizes</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-gray-100">
              <th className="pb-2 text-xs font-body font-medium text-gray-400 w-8">#</th>
              <th className="pb-2 text-xs font-body font-medium text-gray-400">Colaborador</th>
              <th className="pb-2 text-xs font-body font-medium text-gray-400 hidden sm:table-cell">Área</th>
              <th className="pb-2 text-xs font-body font-medium text-gray-400 text-right">XP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sorted.map((entry, idx) => {
              const initials = entry.name.split(' ').map((n) => n[0]).slice(0, 2).join('')
              return (
                <tr key={entry.userId} className="hover:bg-gray-50 transition-colors">
                  <td className="py-2.5 text-xs text-gray-400 font-body">{idx + 1}</td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <Avatar initials={initials} size="sm" variant="navy" />
                      <span className="font-body font-medium text-gray-800 text-sm">{entry.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-xs text-gray-400 hidden sm:table-cell">{entry.area}</td>
                  <td className="py-2.5 text-right">
                    <span className="font-heading font-bold text-brand text-sm">
                      {entry.xp.toLocaleString('pt-BR')}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// ── Lista de alertas críticos ─────────────────────────────────────────────────
function AlertsList() {
  const variantMap = {
    danger:  { badge: 'danger'  as const, icon: 'bg-danger-light  text-danger'  },
    warning: { badge: 'warning' as const, icon: 'bg-warning-light text-warning' },
    info:    { badge: 'blue'    as const, icon: 'bg-brand-light   text-brand'   },
  }

  return (
    <Card className="space-y-3">
      <h2 className="font-heading font-bold text-gray-800 text-sm">Alertas críticos</h2>
      <div className="space-y-2">
        {MOCK_ALERTS.map((alert) => {
          const style = variantMap[alert.type]
          return (
            <div
              key={alert.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className={clsx('w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0', style.icon)}>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body font-medium text-gray-800">{alert.message}</p>
                {alert.count && (
                  <p className="text-xs text-gray-400">{alert.count} colaboradores</p>
                )}
              </div>
              <Button variant="outline" size="sm">{alert.action}</Button>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

// ── Página ────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <AdminTopbar />
      <MetricsGrid />

      {/* Gráficos lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <CompletionsChart />
        </div>
        <AdherenceChart />
      </div>

      {/* Tabela + Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TopLearnersTable />
        <AlertsList />
      </div>
    </div>
  )
}
