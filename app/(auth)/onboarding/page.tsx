'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Loader2, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const DIRETORIAS = ['Gente e Gestão', 'Tecnologia', 'Marketplace', 'Fintech', 'Produto', 'Broker']
const REGIMES = [
  { value: 'remoto', label: 'Remoto', emoji: '🏠', desc: 'Trabalha 100% de casa' },
  { value: 'híbrido', label: 'Híbrido', emoji: '🔄', desc: 'Mistura escritório e home' },
  { value: 'presencial', label: 'Presencial', emoji: '🏢', desc: 'No escritório frete.com' },
]

export default function OnboardingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nome: (session?.user?.name ?? ''),
    cargo: '',
    diretoria: '',
    regime: '',
  })

  const user = session?.user as any

  const handleNext = () => setStep((s) => s + 1)
  const handleBack = () => setStep((s) => s - 1)

  const handleFinish = async () => {
    setLoading(true)
    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      router.push('/app/home')
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-navy text-white px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="font-heading font-bold text-white text-xs">UF</span>
        </div>
        <span className="font-heading font-bold text-lg">Unifrete</span>
      </div>

      {/* Step indicators */}
      <div className="flex justify-center gap-2 py-6">
        {[1,2,3,4,5].map((s) => (
          <div
            key={s}
            className={cn(
              'w-2.5 h-2.5 rounded-full transition-all',
              s < step ? 'bg-success' : s === step ? 'bg-primary w-6' : 'bg-gray-200'
            )}
          />
        ))}
      </div>

      {/* Steps */}
      <div className="flex-1 flex items-center justify-center px-4 pb-10">
        <div className="w-full max-w-lg">

          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="text-center">
              <div className="text-6xl mb-6">🚀</div>
              <h1 className="font-heading font-bold text-text-primary text-3xl mb-3">
                Olá, {session?.user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-text-secondary text-lg mb-2">
                Bem-vindo à <strong className="text-primary">Unifrete</strong>
              </p>
              <p className="text-text-secondary mb-8">
                A universidade corporativa da frete.com. Aqui você vai encontrar trilhas de
                desenvolvimento, cursos, podcasts e muito mais para acelerar sua carreira.
              </p>
              <button
                onClick={handleNext}
                className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2 mx-auto"
              >
                Vamos começar <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 2: Confirm data */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="font-heading font-bold text-text-primary text-2xl mb-2">Confirme seus dados</h2>
              <p className="text-text-secondary text-sm mb-6">Esses dados serão usados no seu perfil.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Nome completo</label>
                  <input
                    type="text"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Cargo</label>
                  <input
                    type="text"
                    value={form.cargo}
                    onChange={(e) => setForm({ ...form, cargo: e.target.value })}
                    placeholder="Ex: Desenvolvedor Senior"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Diretoria</label>
                  <select
                    value={form.diretoria}
                    onChange={(e) => setForm({ ...form, diretoria: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary bg-white"
                  >
                    <option value="">Selecione sua diretoria</option>
                    {DIRETORIAS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleBack} className="flex-1 py-3 rounded-xl border border-gray-200 text-text-secondary font-semibold hover:bg-gray-50">
                  Voltar
                </button>
                <button
                  onClick={handleNext}
                  disabled={!form.nome || !form.cargo || !form.diretoria}
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Regime */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="font-heading font-bold text-text-primary text-2xl mb-2">Como você trabalha?</h2>
              <p className="text-text-secondary text-sm mb-6">Seu regime de trabalho.</p>

              <div className="space-y-3">
                {REGIMES.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setForm({ ...form, regime: r.value })}
                    className={cn(
                      'w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all',
                      form.regime === r.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-100 hover:border-gray-200'
                    )}
                  >
                    <span className="text-2xl">{r.emoji}</span>
                    <div>
                      <p className="font-semibold text-text-primary">{r.label}</p>
                      <p className="text-xs text-text-secondary">{r.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleBack} className="flex-1 py-3 rounded-xl border border-gray-200 text-text-secondary font-semibold hover:bg-gray-50">
                  Voltar
                </button>
                <button
                  onClick={handleNext}
                  disabled={!form.regime}
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Onboarding trail */}
          {step === 4 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="font-heading font-bold text-text-primary text-2xl mb-2">Sua trilha de onboarding</h2>
              <p className="text-text-secondary text-sm mb-6">
                Preparamos uma trilha especial para seus primeiros 30 dias na frete.com.
              </p>

              <div className="bg-navy/5 border border-navy/10 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">30</span>
                  </div>
                  <div>
                    <p className="font-heading font-bold text-text-primary">Trilha de Onboarding</p>
                    <p className="text-xs text-text-secondary">Primeiros 30 dias</p>
                  </div>
                </div>
                {[
                  'Cultura e valores da frete.com',
                  'Produtos e serviços',
                  'Ferramentas e processos',
                  'Sua área e equipe',
                  'Objetivos e metas',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 border-b border-gray-100 last:border-0">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">{i + 1}</span>
                    </div>
                    <span className="text-sm text-text-primary">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={handleBack} className="flex-1 py-3 rounded-xl border border-gray-200 text-text-secondary font-semibold hover:bg-gray-50">
                  Voltar
                </button>
                <button onClick={handleNext} className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90">
                  Ótimo!
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Done */}
          {step === 5 && (
            <div className="text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
              <CheckCircle className="w-16 h-16 text-success mx-auto mb-6" />
              <h2 className="font-heading font-bold text-text-primary text-3xl mb-3">Tudo pronto!</h2>
              <p className="text-text-secondary mb-8">
                Seu perfil foi configurado. Sua jornada de aprendizagem começa agora.
                <br />Bons estudos! 🎉
              </p>
              <button
                onClick={handleFinish}
                disabled={loading}
                className="bg-primary text-white px-10 py-3 rounded-xl font-semibold hover:bg-primary/90 flex items-center gap-2 mx-auto disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                Ir para a Home
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
