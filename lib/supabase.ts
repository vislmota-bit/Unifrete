import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client-side Supabase client (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client (uses service role key, bypasses RLS)
export function createServerSupabaseClient() {
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export type Database = {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          email: string
          nome: string | null
          cargo: string | null
          diretoria: string | null
          regime: string | null
          gestor_id: string | null
          papel: string
          xp_total: number
          nivel: string
          data_admissao: string
          onboarding_completo: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          nome?: string | null
          cargo?: string | null
          diretoria?: string | null
          regime?: string | null
          gestor_id?: string | null
          papel?: string
          xp_total?: number
          data_admissao?: string
          onboarding_completo?: boolean
        }
        Update: {
          nome?: string | null
          cargo?: string | null
          diretoria?: string | null
          regime?: string | null
          gestor_id?: string | null
          papel?: string
          xp_total?: number
          onboarding_completo?: boolean
        }
      }
      trilhas: {
        Row: {
          id: string
          titulo: string
          descricao: string | null
          diretoria: string | null
          facilitador: string | null
          xp_total: number
          ativo: boolean
          created_at: string
        }
      }
      modulos: {
        Row: {
          id: string
          trilha_id: string
          titulo: string
          descricao: string | null
          formato: string | null
          url_conteudo: string | null
          duracao_min: number | null
          xp: number
          ordem: number | null
          obrigatorio: boolean
          bloqueado_ate: string | null
          created_at: string
        }
      }
      progresso: {
        Row: {
          id: string
          usuario_id: string
          modulo_id: string
          pct_assistido: number
          concluido: boolean
          xp_ganho: number
          data_conclusao: string | null
          updated_at: string
        }
      }
      novidades: {
        Row: {
          id: string
          titulo: string
          descricao: string | null
          categoria: string | null
          tempo_leitura_min: number
          url_externa: string | null
          destaque: boolean
          publicado_em: string
          autor: string | null
        }
      }
    }
  }
}
