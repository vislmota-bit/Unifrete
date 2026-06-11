import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('novidades')
    .select('*')
    .order('publicado_em', { ascending: false })
    .limit(30)

  return NextResponse.json(data ?? [])
}
