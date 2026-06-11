import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { createServerSupabaseClient } from '@/lib/supabase'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const email = user.email ?? ''
        if (!email.endsWith('@frete.com')) {
          return false
        }

        // Sync user to Supabase
        try {
          const supabaseAdmin = createServerSupabaseClient()
          const { data: existing } = await supabaseAdmin
            .from('usuarios')
            .select('id')
            .eq('email', email)
            .single()

          if (!existing) {
            await supabaseAdmin.from('usuarios').insert({
              email,
              nome: user.name,
            })
          }
        } catch (err) {
          console.error('Error syncing user to Supabase:', err)
        }

        return true
      }
      return false
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        try {
          const supabaseAdmin = createServerSupabaseClient()
          const { data: usuario } = await supabaseAdmin
            .from('usuarios')
            .select('id, papel, onboarding_completo, xp_total, nivel')
            .eq('email', session.user.email!)
            .single()

          if (usuario) {
            ;(session.user as any).id = usuario.id
            ;(session.user as any).papel = usuario.papel
            ;(session.user as any).onboardingCompleto = usuario.onboarding_completo
            ;(session.user as any).xpTotal = usuario.xp_total
            ;(session.user as any).nivel = usuario.nivel
          }
        } catch (err) {
          console.error('Error enriching session:', err)
        }
      }
      return session
    },

    async jwt({ token, user }) {
      if (user) {
        token.email = user.email
      }
      return token
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
}
