import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('modulos')
    .select('*, trilhas(diretoria)')
    .order('ordem')

  return NextResponse.json(data ?? [])
}
