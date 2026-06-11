import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET() {
  const session = await getServerSession(authOptions)
  const user = session?.user as any
  if (user?.papel !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('usuarios')
    .select('nome, email, cargo, diretoria, regime, papel, xp_total, nivel, onboarding_completo, data_admissao')
    .order('nome')

  if (!data) return NextResponse.json({ error: 'No data' }, { status: 500 })

  const headers = ['Nome', 'Email', 'Cargo', 'Diretoria', 'Regime', 'Papel', 'XP Total', 'Nível', 'Onboarding Completo', 'Data Admissão']
  const rows = data.map((u) => [
    u.nome, u.email, u.cargo, u.diretoria, u.regime, u.papel,
    u.xp_total, u.nivel, u.onboarding_completo ? 'Sim' : 'Não', u.data_admissao,
  ].map((v) => `"${v ?? ''}"`).join(','))

  const csv = [headers.join(','), ...rows].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="unifrete-colaboradores.csv"',
    },
  })
}
