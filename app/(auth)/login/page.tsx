'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'authenticated') {
      const user = session.user as any
      router.replace(user?.onboardingCompleto ? '/app/home' : '/onboarding')
    }
  }, [status, session])

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')
    const result = await signIn('google', { redirect: false })
    if (result?.error) {
      setError('Acesso negado. Use seu e-mail @frete.com.')
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left panel — animated road */}
      <div className="hidden md:flex md:w-1/2 relative bg-navy items-center justify-center overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="skyGradLogin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#001833" />
              <stop offset="60%" stopColor="#002f5e" />
              <stop offset="100%" stopColor="#001833" />
            </linearGradient>
          </defs>
          <rect width="600" height="800" fill="url(#skyGradLogin)" />
          <polygon points="270,400 330,400 600,800 0,800" fill="#002244" />
          <line x1="275" y1="400" x2="0" y2="800" stroke="#00AEEF" strokeWidth="1.5" strokeOpacity="0.5" />
          <line x1="325" y1="400" x2="600" y2="800" stroke="#00AEEF" strokeWidth="1.5" strokeOpacity="0.5" />
          {[0,1,2,3,4,5,6,7].map((i) => (
            <line key={i}
              x1={295 + i * 4} y1={400 + i * 50}
              x2={305 + i * 4} y2={415 + i * 50}
              stroke="#F5B800" strokeWidth={1 + i * 0.3} strokeDasharray="10 10" strokeOpacity="0.8"
              style={{ animation: `dashMove 2s linear infinite`, animationDelay: `${i * 0.25}s` }}
            />
          ))}
          <circle cx="300" cy="398" r="6" fill="#00AEEF" opacity="0.9">
            <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="300" cy="398" r="18" fill="none" stroke="#00AEEF" strokeWidth="1" opacity="0.4">
            <animate attributeName="r" values="14;22;14" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
          </circle>
          {[[80,100],[180,60],[380,80],[500,120],[150,200],[450,180],[100,320],[520,300]].map(([cx,cy],i) => (
            <circle key={i} cx={cx} cy={cy} r="1.5" fill="#fff" opacity={0.2 + (i%3)*0.15} />
          ))}
        </svg>

        <div className="relative z-10 text-center px-10">
          <div className="w-20 h-20 bg-primary/20 border-2 border-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="font-heading font-bold text-white text-3xl">UF</span>
          </div>
          <h1 className="font-heading font-bold text-white text-4xl mb-3">Unifrete</h1>
          <p className="text-blue-200 text-lg font-medium">Universidade Corporativa</p>
          <p className="text-blue-300/70 text-sm mt-2">frete.com</p>

          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            {[['200+', 'Cursos'], ['5k+', 'Colaboradores'], ['50+', 'Trilhas']].map(([n,l]) => (
              <div key={l} className="bg-white/10 rounded-xl p-3">
                <p className="font-heading font-bold text-white text-xl">{n}</p>
                <p className="text-blue-200 text-xs">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 md:hidden">
            <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center">
              <span className="font-heading font-bold text-primary text-lg">UF</span>
            </div>
            <div>
              <p className="font-heading font-bold text-text-primary text-xl">Unifrete</p>
              <p className="text-xs text-text-secondary">Universidade Corporativa frete.com</p>
            </div>
          </div>

          <h2 className="font-heading font-bold text-text-primary text-2xl mb-1">Bem-vindo de volta</h2>
          <p className="text-text-secondary text-sm mb-8">
            Faça login com sua conta Google <span className="font-semibold text-primary">@frete.com</span>
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-navy text-white py-3 rounded-xl font-semibold hover:bg-navy/90 transition-colors disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {loading ? 'Entrando...' : 'Entrar com Google'}
          </button>

          <p className="text-xs text-text-secondary text-center mt-6">
            Acesso exclusivo para colaboradores <strong>@frete.com</strong>.
            <br />Em caso de problemas, contate o time de Gente e Gestão.
          </p>
        </div>
      </div>
    </div>
  )
}
