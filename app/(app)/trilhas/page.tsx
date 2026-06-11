import { createServerSupabaseClient } from '@/lib/supabase'
import RoadHero from '@/components/ui/RoadHero'
import TrailCard from '@/components/courses/TrailCard'

const DIRETORIAS = ['Gente e Gestão', 'Tecnologia', 'Marketplace', 'Fintech', 'Produto', 'Broker']

export default async function TrilhasPage() {
  const supabase = createServerSupabaseClient()
  const { data: trilhas } = await supabase.from('trilhas').select('*').eq('ativo', true)

  const byDir = DIRETORIAS.reduce<Record<string, typeof trilhas>>((acc, dir) => {
    const list = (trilhas ?? []).filter((t) => t.diretoria === dir)
    if (list.length > 0) acc[dir] = list
    return acc
  }, {})

  const noDir = (trilhas ?? []).filter((t) => !t.diretoria)

  return (
    <div className="pb-10">
      <RoadHero height={180} title="Trilhas de Aprendizagem" subtitle="Desenvolva suas habilidades com trilhas curadas por área" />

      <div className="px-4 md:px-6 mt-6 space-y-10">
        {Object.entries(byDir).map(([dir, list]) => (
          <section key={dir}>
            <h2 className="font-heading font-bold text-text-primary text-xl mb-4">{dir}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {(list ?? []).map((t) => (
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
        ))}

        {noDir.length > 0 && (
          <section>
            <h2 className="font-heading font-bold text-text-primary text-xl mb-4">Gerais</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {noDir.map((t) => (
                <TrailCard
                  key={t.id}
                  id={t.id}
                  titulo={t.titulo}
                  descricao={t.descricao ?? undefined}
                  xpTotal={t.xp_total}
                />
              ))}
            </div>
          </section>
        )}

        {(!trilhas || trilhas.length === 0) && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🗺️</div>
            <h3 className="font-heading font-bold text-text-primary text-xl mb-2">Nenhuma trilha disponível</h3>
            <p className="text-text-secondary">Em breve novas trilhas serão adicionadas.</p>
          </div>
        )}
      </div>
    </div>
  )
}
