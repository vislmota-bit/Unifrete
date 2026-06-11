import { createServerSupabaseClient } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Users, BookOpen, TrendingUp, Award, Download, ToggleLeft } from 'lucide-react'
import Link from 'next/link'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  if (user?.papel !== 'admin') redirect('/app/home')

  const supabase = createServerSupabaseClient()

  const [
    { count: totalUsers },
    { count: totalModulos },
    { data: trilhas },
    { data: topUsers },
  ] = await Promise.all([
    supabase.from('usuarios').select('*', { count: 'exact', head: true }),
    supabase.from('modulos').select('*', { count: 'exact', head: true }),
    supabase.from('trilhas').select('*').order('created_at', { ascending: false }),
    supabase.from('usuarios').select('nome, diretoria, xp_total').order('xp_total', { ascending: false }).limit(5),
  ])

  const metrics = [
    { label: 'Colaboradores', value: totalUsers ?? 0, icon: Users, color: 'text-primary bg-primary/10' },
    { label: 'Módulos', value: totalModulos ?? 0, icon: BookOpen, color: 'text-orange bg-orange/10' },
    { label: 'Trilhas ativas', value: trilhas?.filter((t) => t.ativo).length ?? 0, icon: TrendingUp, color: 'text-success bg-success/10' },
    { label: 'XP médio', value: topUsers ? Math.round(topUsers.reduce((s, u) => s + (u.xp_total ?? 0), 0) / (topUsers.length || 1)) : 0, icon: Award, color: 'text-warning bg-warning/10' },
  ]

  const DIRS = ['Gente e Gestão', 'Tecnologia', 'Marketplace', 'Fintech', 'Produto', 'Broker']

  return (
    <div className="px-4 md:px-6 py-6 pb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-text-primary text-2xl">Painel Admin</h1>
          <p className="text-text-secondary text-sm mt-0.5">Visão geral da plataforma Unifrete</p>
        </div>
        <a
          href="/api/admin/export-csv"
          className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-navy/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </a>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => {
          const Icon = m.icon
          return (
            <div key={m.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${m.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="font-heading font-bold text-3xl text-text-primary">{m.value.toLocaleString('pt-BR')}</p>
              <p className="text-sm text-text-secondary mt-0.5">{m.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Engagement by diretoria */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-heading font-bold text-text-primary text-lg mb-4">Engajamento por Diretoria</h2>
          <div className="space-y-3">
            {DIRS.map((dir, i) => {
              const pct = Math.max(20, 95 - i * 12)
              return (
                <div key={dir}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary">{dir}</span>
                    <span className="font-medium text-text-primary">{pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top users */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-heading font-bold text-text-primary text-lg mb-4">Top Colaboradores</h2>
          <div className="space-y-3">
            {(topUsers ?? []).map((u, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-text-primary truncate">{u.nome ?? 'Colaborador'}</p>
                  <p className="text-xs text-text-secondary">{u.diretoria ?? 'frete.com'}</p>
                </div>
                <span className="text-sm font-bold text-primary">{u.xp_total?.toLocaleString('pt-BR')} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course management */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-text-primary text-lg">Gestão de Trilhas</h2>
          <Link
            href="/admin/trilhas/nova"
            className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/90"
          >
            + Nova Trilha
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 pr-4 text-text-secondary font-medium">Trilha</th>
                <th className="text-left py-2 pr-4 text-text-secondary font-medium hidden sm:table-cell">Diretoria</th>
                <th className="text-left py-2 pr-4 text-text-secondary font-medium hidden md:table-cell">XP</th>
                <th className="text-left py-2 text-text-secondary font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {(trilhas ?? []).map((t) => (
                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-text-primary">{t.titulo}</p>
                    {t.facilitador && <p className="text-xs text-text-secondary">{t.facilitador}</p>}
                  </td>
                  <td className="py-3 pr-4 text-text-secondary hidden sm:table-cell">{t.diretoria ?? '—'}</td>
                  <td className="py-3 pr-4 text-text-secondary hidden md:table-cell">{t.xp_total}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${t.ativo ? 'bg-success' : 'bg-gray-300'}`} />
                      <span className={`text-xs font-medium ${t.ativo ? 'text-success' : 'text-text-secondary'}`}>
                        {t.ativo ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!trilhas || trilhas.length === 0) && (
            <p className="text-center py-8 text-text-secondary text-sm">Nenhuma trilha cadastrada</p>
          )}
        </div>
      </div>
    </div>
  )
}
