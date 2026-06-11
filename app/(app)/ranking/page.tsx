import { createServerSupabaseClient } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import RoadHero from '@/components/ui/RoadHero'
import RankRow from '@/components/ui/RankRow'
import { Trophy } from 'lucide-react'

export default async function RankingPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  const supabase = createServerSupabaseClient()

  const { data: usuarios } = await supabase
    .from('usuarios')
    .select('id, nome, diretoria, xp_total, nivel')
    .order('xp_total', { ascending: false })
    .limit(50)

  const ranked = (usuarios ?? []).map((u, i) => ({ ...u, position: i + 1 }))
  const top3 = ranked.slice(0, 3)
  const rest = ranked.slice(3)
  const myPos = ranked.find((u) => u.id === user?.id)

  const tierIcons = ['🥇', '🥈', '🥉']

  return (
    <div className="pb-10">
      <RoadHero height={180} title="Ranking de XP" subtitle="Os colaboradores com mais pontos este mês">
        <div className="flex items-center gap-2 mt-3">
          <Trophy className="w-5 h-5 text-warning" />
          <span className="text-warning font-bold text-sm">
            {myPos ? `Você está em ${myPos.position}º lugar` : 'Complete módulos para entrar no ranking'}
          </span>
        </div>
      </RoadHero>

      <div className="px-4 md:px-6 mt-6 max-w-2xl mx-auto">
        {/* Podium */}
        {top3.length >= 3 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
            <h2 className="font-heading font-bold text-text-primary text-lg mb-4 text-center">Top 3</h2>
            <div className="flex items-end justify-center gap-4">
              {/* 2nd */}
              <div className="text-center flex-1">
                <div className="text-3xl mb-1">🥈</div>
                <div className="w-full h-16 bg-gray-200 rounded-t-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">{top3[1]?.xp_total?.toLocaleString('pt-BR')} XP</span>
                </div>
                <p className="text-xs font-semibold text-text-primary mt-1 truncate">{top3[1]?.nome?.split(' ')[0]}</p>
              </div>
              {/* 1st */}
              <div className="text-center flex-1">
                <div className="text-4xl mb-1">🥇</div>
                <div className="w-full h-24 bg-yellow-100 rounded-t-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-yellow-700">{top3[0]?.xp_total?.toLocaleString('pt-BR')} XP</span>
                </div>
                <p className="text-xs font-semibold text-text-primary mt-1 truncate">{top3[0]?.nome?.split(' ')[0]}</p>
              </div>
              {/* 3rd */}
              <div className="text-center flex-1">
                <div className="text-3xl mb-1">🥉</div>
                <div className="w-full h-10 bg-amber-100 rounded-t-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-amber-700">{top3[2]?.xp_total?.toLocaleString('pt-BR')} XP</span>
                </div>
                <p className="text-xs font-semibold text-text-primary mt-1 truncate">{top3[2]?.nome?.split(' ')[0]}</p>
              </div>
            </div>
          </div>
        )}

        {/* Full list */}
        <div className="space-y-2">
          {ranked.map((u) => (
            <RankRow
              key={u.id}
              position={u.position}
              name={u.nome ?? 'Colaborador'}
              area={u.diretoria ?? 'frete.com'}
              xp={u.xp_total ?? 0}
              isCurrentUser={u.id === user?.id}
            />
          ))}
        </div>

        {ranked.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🏆</div>
            <p className="font-semibold text-text-primary mb-1">Nenhum dado ainda</p>
            <p className="text-text-secondary text-sm">Complete módulos para aparecer no ranking</p>
          </div>
        )}
      </div>
    </div>
  )
}
