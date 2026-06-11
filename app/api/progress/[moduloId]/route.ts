import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(_req: NextRequest, { params }: { params: { moduloId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ pct_assistido: 0, concluido: false })

  const user = session.user as any
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('progresso')
    .select('*')
    .eq('usuario_id', user.id)
    .eq('modulo_id', params.moduloId)
    .single()

  return NextResponse.json(data ?? { pct_assistido: 0, concluido: false })
}
