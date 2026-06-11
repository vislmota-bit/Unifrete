import { createServerSupabaseClient } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import RoadHero from '@/components/ui/RoadHero'
import ProgressLine from '@/components/ui/ProgressLine'
import { ArrowRight, Users, Zap } from 'lucide-react'

export default async function TrailDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  const supabase = createServerSupabaseClient()

  const [{ data: trilha }, { data: modulos }, { data: progresso }] = await Promise.all([
    supabase.from('trilhas').select('*').eq('id', params.id).single(),
    supabase.from('modulos').select('*').eq('trilha_id', params.id).order('ordem'),
    user?.id
      ? supabase.from('progresso').select('*').eq('usuario_id', user.id).in(
          'modulo_id', [] // filled below
        )
      : Promise.resolve({ data: [] }),
  ])

  if (!trilha) return notFound()

  // Build progress lookup
  const progressMap: Record<string, { concluido: boolean; pct: number }> = {}
  if (modulos && user?.id) {
    const ids = modulos.map((m) => m.id)
    const { data: prog } = await supabase
      .from('progresso')
      .select('*')
      .eq('usuario_id', user.id)
      .in('modulo_id', ids)

    ;(prog ?? []).forEach((p) => {
      progressMap[p.modulo_id] = { concluido: p.concluido, pct: p.pct_assistido }
    })
  }

  // Determine module statuses with sequential unlock
  const moduleList = (modulos ?? []).map((m, idx) => {
    let status: 'done' | 'current' | 'available' | 'locked' = 'available'
    if (progressMap[m.id]?.concluido) {
      status = 'done'
    } else if (m.bloqueado_ate) {
      const prev = progressMap[m.bloqueado_ate]
      status = prev?.concluido ? 'available' : 'locked'
    }

    // First non-done is 'current'
    return { id: m.id, title: m.titulo, status, xp: m.xp, format: m.formato, duration: m.duracao_min }
  })

  const firstAvailable = moduleList.find((m) => m.status === 'available' || m.status === 'current')
  // Mark first available as current
  if (firstAvailable) firstAvailable.status = 'current'

  const completed = moduleList.filter((m) => m.status === 'done').length
  const pct = modulos?.length ? Math.round((completed / modulos.length) * 100) : 0

  return (
    <div className="pb-10">
      <RoadHero
        height={200}
        title={trilha.titulo}
        subtitle={trilha.facilitador ? `Com ${trilha.facilitador}` : undefined}
      >
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-lg">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-white font-bold text-sm">{trilha.xp_total} XP</span>
          </div>
          {trilha.diretoria && (
            <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-lg">
              <Users className="w-4 h-4 text-blue-200" />
              <span className="text-blue-200 text-sm">{trilha.diretoria}</span>
            </div>
          )}
        </div>
      </RoadHero>

      <div className="px-4 md:px-6 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {trilha.descricao && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="font-heading font-bold text-text-primary text-lg mb-2">Sobre a Trilha</h2>
                <p className="text-text-secondary text-sm leading-relaxed">{trilha.descricao}</p>
              </div>
            )}

            {/* Modules */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-bold text-text-primary text-lg">Módulos</h2>
                <span className="text-sm text-text-secondary">{completed}/{modulos?.length ?? 0} concluídos</span>
              </div>
              <ProgressLine modules={moduleList} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Progress card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-semibold text-text-primary text-sm mb-3">Seu Progresso</h3>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-heading font-bold text-3xl text-primary">{pct}%</span>
                <span className="text-text-secondary text-sm">concluído</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>

            {/* CTA */}
            {firstAvailable && (
              <Link href={`/app/trilhas/${params.id}/modulos/${firstAvailable.id}`}>
                <button className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 flex items-center justify-center gap-2">
                  {pct > 0 ? 'Continuar' : 'Começar'} <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            )}
            {pct === 100 && (
              <div className="bg-success/10 border border-success/20 rounded-xl p-4 text-center">
                <p className="text-success font-semibold text-sm">🎉 Trilha Concluída!</p>
                <p className="text-success/80 text-xs mt-1">Parabéns pelo seu progresso</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
