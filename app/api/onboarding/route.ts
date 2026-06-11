import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { nome, cargo, diretoria, regime } = await req.json()
  const user = session.user as any
  const supabase = createServerSupabaseClient()

  await supabase
    .from('usuarios')
    .update({ nome, cargo, diretoria, regime, onboarding_completo: true })
    .eq('email', session.user.email!)

  return NextResponse.json({ success: true })
}
