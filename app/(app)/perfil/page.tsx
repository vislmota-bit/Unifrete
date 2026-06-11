import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase'
import XPOrb from '@/components/ui/XPOrb'
import XPProgressBar from '@/components/ui/XPProgressBar'
import BadgeGrid from '@/components/ui/BadgeGrid'
import StreakBadge from '@/components/ui/StreakBadge'
import CourseRow from '@/components/courses/CourseRow'
import { Mail, Building2, Briefcase } from 'lucide-react'

export default async function PerfilPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  const supabase = createServerSupabaseClient()

  const [{ data: usuario }, { data: historico }] = await Promise.all([
    user?.id
      ? supabase.from('usuarios').select('*').eq('id', user.id).single()
      : Promise.resolve({ data: null }),
    user?.id
      ? supabase
          .from('progresso')
          .select('*, modulos(id, titulo, formato, xp, trilha_id, duracao_min, obrigatorio)')
          .eq('usuario_id', user.id)
          .eq('concluido', true)
          .order('data_conclusao', { ascending: false })
          .limit(10)
      : Promise.resolve({ data: [] }),
  ])

  const xp = usuario?.xp_total ?? 0
  const nivel = usuario?.nivel ?? 'Bronze'

  return (
    <div className="px-4 md:px-6 py-6 pb-10 max-w-4xl mx-auto">
      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-navy flex items-center justify-center text-white font-heading font-bold text-2xl overflow-hidden flex-shrink-0">
            {session?.user?.image ? (
              <img src={session.user.image} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              session?.user?.name?.charAt(0) ?? 'U'
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-heading font-bold text-text-primary text-2xl">{usuario?.nome ?? session?.user?.name}</h1>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-2">
              {usuario?.cargo && (
                <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                  <Briefcase className="w-4 h-4" />
                  <span>{usuario.cargo}</span>
                </div>
              )}
              {usuario?.diretoria && (
                <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                  <Building2 className="w-4 h-4" />
                  <span>{usuario.diretoria}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-sm text-text-secondary">
                <Mail className="w-4 h-4" />
                <span>{session?.user?.email}</span>
              </div>
            </div>
          </div>

          <XPOrb xp={xp} nivel={nivel} size="md" />
        </div>

        <div className="mt-4">
          <XPProgressBar xp={xp} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
          <p className="font-heading font-bold text-3xl text-primary">{historico?.length ?? 0}</p>
          <p className="text-sm text-text-secondary mt-1">Módulos concluídos</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
          <p className="font-heading font-bold text-3xl text-text-primary">{xp.toLocaleString('pt-BR')}</p>
          <p className="text-sm text-text-secondary mt-1">XP total</p>
        </div>
        <StreakBadge days={7} className="justify-center" />
      </div>

      {/* Badges */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
        <h2 className="font-heading font-bold text-text-primary text-lg mb-4">Conquistas</h2>
        <BadgeGrid earned={historico && historico.length > 0 ? ['first_module'] : []} />
      </div>

      {/* History */}
      {historico && historico.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-heading font-bold text-text-primary text-lg mb-4">Histórico de Conclusões</h2>
          <div className="space-y-2">
            {historico.map((h) => {
              const m = h.modulos as any
              if (!m) return null
              return (
                <CourseRow
                  key={h.id}
                  id={m.id}
                  trailId={m.trilha_id}
                  titulo={m.titulo}
                  formato={m.formato as any}
                  duracao={m.duracao_min}
                  xp={m.xp}
                  concluido
                  obrigatorio={m.obrigatorio}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
