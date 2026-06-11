import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase'
import RoadHero from '@/components/ui/RoadHero'
import XPProgressBar from '@/components/ui/XPProgressBar'
import TrailCard from '@/components/courses/TrailCard'
import CourseRow from '@/components/courses/CourseRow'
import { Zap } from 'lucide-react'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  const supabase = createServerSupabaseClient()

  const [{ data: trilhas }, { data: modulos }] = await Promise.all([
    supabase.from('trilhas').select('*').eq('ativo', true).limit(4),
    supabase.from('modulos').select('*').limit(6),
  ])

  const firstName = session?.user?.name?.split(' ')[0] ?? 'Colaborador'

  return (
    <div className="pb-10">
      {/* Hero */}
      <RoadHero
        height={220}
        title={`Olá, ${firstName}! 👋`}
        subtitle="Continue sua jornada de aprendizagem"
      >
        <div className="mt-4 flex items-center gap-4">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-heading font-bold text-white text-lg">{user?.xpTotal?.toLocaleString('pt-BR') ?? '0'}</span>
              <span className="text-blue-200 text-sm">XP • {user?.nivel ?? 'Bronze'}</span>
            </div>
          </div>
        </div>
      </RoadHero>

      <div className="px-4 md:px-6 mt-6 space-y-8">
        {/* XP Progress */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-heading font-semibold text-text-primary text-sm mb-3">Seu Progresso</h2>
          <XPProgressBar xp={user?.xpTotal ?? 0} />
        </div>

        {/* Trilhas em andamento */}
        {trilhas && trilhas.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-text-primary text-xl">Trilhas</h2>
              <a href="/app/trilhas" className="text-sm text-primary font-medium hover:underline">Ver todas</a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {trilhas.map((t) => (
                <TrailCard
                  key={t.id}
                  id={t.id}
                  titulo={t.titulo}
                  descricao={t.descricao ?? undefined}
                  diretoria={t.diretoria ?? undefined}
                  facilitador={t.facilitador ?? undefined}
                  xpTotal={t.xp_total}
                />
              ))}
            </div>
          </section>
        )}

        {/* Cursos recomendados */}
        {modulos && modulos.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-text-primary text-xl">Cursos Recomendados</h2>
              <a href="/app/explorar" className="text-sm text-primary font-medium hover:underline">Ver catálogo</a>
            </div>
            <div className="space-y-2">
              {modulos.map((m) => (
                <CourseRow
                  key={m.id}
                  id={m.id}
                  trailId={m.trilha_id}
                  titulo={m.titulo}
                  formato={m.formato as any ?? 'video'}
                  duracao={m.duracao_min ?? undefined}
                  xp={m.xp}
                  obrigatorio={m.obrigatorio}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {(!trilhas || trilhas.length === 0) && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="font-heading font-bold text-text-primary text-xl mb-2">Tudo pronto para começar</h3>
            <p className="text-text-secondary mb-6">Explore as trilhas e cursos disponíveis para você.</p>
            <a
              href="/app/explorar"
              className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary/90 inline-block"
            >
              Explorar Cursos
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
