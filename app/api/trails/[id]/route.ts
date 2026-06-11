import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()
  const [{ data: trilha }, { data: modulos }] = await Promise.all([
    supabase.from('trilhas').select('*').eq('id', params.id).single(),
    supabase.from('modulos').select('*').eq('trilha_id', params.id).order('ordem'),
  ])
  if (!trilha) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ...trilha, modulos: modulos ?? [] })
}
