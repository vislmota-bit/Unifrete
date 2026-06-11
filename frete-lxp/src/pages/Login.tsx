import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Users, BookOpen, Star } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { useAuthStore } from '@/store/authStore'

// Estatísticas exibidas no painel esquerdo
const STATS = [
  { icon: Users,    value: '12k+',  label: 'colaboradores' },
  { icon: BookOpen, value: '340',   label: 'cursos' },
  { icon: Star,     value: '94%',   label: 'satisfação' },
]

export default function Login() {
  const navigate  = useNavigate()
  const { login } = useAuthStore()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    // Validação de domínio antes de chamar a store
    if (!email.endsWith('@fretebras.com.br')) {
      setError('Use seu e-mail corporativo @fretebras.com.br')
      return
    }
    if (!password) {
      setError('Informe sua senha.')
      return
    }

    setLoading(true)
    const ok = await login(email, password)
    setLoading(false)

    if (ok) {
      navigate('/courses')
    } else {
      setError('E-mail ou senha incorretos.')
    }
  }

  return (
    <div className="min-h-screen flex font-body">

      {/* ── Painel esquerdo — identidade navy ─────────────────────── */}
      <div className="hidden md:flex flex-col justify-between w-72 bg-navy px-8 py-10 flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center">
            <span className="text-white font-heading font-bold text-sm">FL</span>
          </div>
          <span className="font-heading font-bold text-white text-xl tracking-tight">freteLXP</span>
        </div>

        {/* Frase de impacto */}
        <div className="space-y-3">
          <h1 className="font-heading font-bold text-white text-3xl leading-snug">
            Aprenda no seu ritmo,<br />cresça no seu caminho.
          </h1>
          <p className="text-white/60 text-sm leading-relaxed">
            A plataforma de aprendizagem corporativa da Fretebras.
          </p>
        </div>

        {/* Estatísticas */}
        <div className="space-y-3">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-brand" />
              </div>
              <div>
                <p className="font-heading font-bold text-white text-base leading-none">{value}</p>
                <p className="text-white/50 text-xs mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Painel direito — formulário ───────────────────────────── */}
      <div className="flex flex-1 items-center justify-center bg-gray-50 px-6 py-10">
        <div className="w-full max-w-sm space-y-6">

          {/* Cabeçalho mobile */}
          <div className="md:hidden flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-navy rounded-md flex items-center justify-center">
              <span className="text-white font-heading font-bold text-xs">FL</span>
            </div>
            <span className="font-heading font-bold text-navy text-lg">freteLXP</span>
          </div>

          <div>
            <h2 className="font-heading font-bold text-gray-800 text-2xl">Bem-vindo de volta</h2>
            <p className="text-gray-400 text-sm mt-1">
              Entre com sua conta corporativa <strong className="text-brand">@fretebras.com.br</strong>
            </p>
          </div>

          {/* Erro global */}
          {error && (
            <div className="bg-danger-light border border-danger/20 rounded-md px-3 py-2 text-sm text-danger">
              {error}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="E-mail corporativo"
              type="email"
              placeholder="nome@fretebras.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              autoComplete="email"
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              autoComplete="current-password"
            />

            {/* Lembrar + Esqueceu senha */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-200 accent-brand"
                />
                <span className="text-sm text-gray-600">Lembrar acesso</span>
              </label>
              <button
                type="button"
                className="text-sm text-brand hover:text-brand-dark transition-colors"
              >
                Esqueceu a senha?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              size="lg"
            >
              Entrar
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">ou</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* SSO Microsoft */}
          <Button
            variant="outline"
            fullWidth
            size="lg"
            leftIcon={
              /* Ícone simplificado do Microsoft */
              <svg viewBox="0 0 21 21" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                <rect x="1"  y="1"  width="9" height="9" fill="#F25022" />
                <rect x="11" y="1"  width="9" height="9" fill="#7FBA00" />
                <rect x="1"  y="11" width="9" height="9" fill="#00A4EF" />
                <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
              </svg>
            }
          >
            Entrar com Microsoft SSO
          </Button>

          <p className="text-center text-xs text-gray-400">
            Acesso exclusivo para colaboradores Fretebras.
          </p>
        </div>
      </div>
    </div>
  )
}
