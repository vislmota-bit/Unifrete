import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { moduloId, pctAssistido } = await req.json()
  if (!moduloId || pctAssistido === undefined) {
    return NextResponse.json({ error: 'moduloId and pctAssistido required' }, { status: 400 })
  }

  const user = session.user as any
  const supabase = createServerSupabaseClient()

  const concluido = pctAssistido >= 90
  const now = new Date().toISOString()

  // Get module XP
  const { data: modulo } = await supabase.from('modulos').select('xp').eq('id', moduloId).single()
  const xpGanho = concluido ? (modulo?.xp ?? 0) : 0

  // Check if already concluded (to avoid double XP)
  const { data: existing } = await supabase
    .from('progresso')
    .select('concluido, xp_ganho')
    .eq('usuario_id', user.id)
    .eq('modulo_id', moduloId)
    .single()

  const alreadyConcluded = existing?.concluido === true

  await supabase.from('progresso').upsert(
    {
      usuario_id: user.id,
      modulo_id: moduloId,
      pct_assistido: pctAssistido,
      concluido,
      xp_ganho: xpGanho,
      data_conclusao: concluido ? now : null,
      updated_at: now,
    },
    { onConflict: 'usuario_id,modulo_id' }
  )

  // Credit XP if newly concluded
  if (concluido && !alreadyConcluded && xpGanho > 0) {
    await supabase.rpc('increment_xp', { user_id: user.id, amount: xpGanho }).catch(() => {
      // Fallback if rpc not available
      supabase
        .from('usuarios')
        .select('xp_total')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            supabase
              .from('usuarios')
              .update({ xp_total: (data.xp_total ?? 0) + xpGanho })
              .eq('id', user.id)
          }
        })
    })
  }

  return NextResponse.json({ success: true, concluido, xpGanho })
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = session.user as any
  const moduloId = req.nextUrl.searchParams.get('moduloId')
  if (!moduloId) return NextResponse.json({ error: 'moduloId required' }, { status: 400 })

  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('progresso')
    .select('*')
    .eq('usuario_id', user.id)
    .eq('modulo_id', moduloId)
    .single()

  return NextResponse.json(data ?? { pct_assistido: 0, concluido: false })
}
