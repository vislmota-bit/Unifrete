import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, X, Plus, BookOpen, Users,
  Tag, Shield, Zap, CheckCircle, ImageIcon,
} from 'lucide-react'
import { clsx } from 'clsx'
import { Button, Card, Input } from '@/components/ui'
import { useAdminStore } from '@/store/adminStore'
import type { UserRole } from '@/types'

const AREAS = ['Operações','Tecnologia','Comercial','Logística','Financeiro','RH','Jurídico']
const ROLES: { value: UserRole; label: string }[] = [
  { value: 'user',    label: 'Colaborador' },
  { value: 'manager', label: 'Gestor'      },
  { value: 'admin',   label: 'Admin'       },
]
const BANNER_COLORS = [
  '#0D1B36','#00AEEF','#0084C1','#12B76A','#F79009','#F04438','#475467','#6D28D9',
]

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
        <div className="w-7 h-7 rounded-md bg-brand-light flex items-center justify-center text-brand flex-shrink-0">
          {icon}
        </div>
        <h2 className="font-heading font-bold text-gray-800 text-sm">{title}</h2>
      </div>
      {children}
    </Card>
  )
}

function TagInput({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState('')

  const add = () => {
    const v = input.trim()
    if (v && !tags.includes(v)) onChange([...tags, v])
    setInput('')
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5 min-h-[32px]">
        {tags.map((t) => (
          <span
            key={t}
            className="flex items-center gap-1 px-2 py-0.5 bg-brand-light text-brand-dark text-xs rounded-md border border-brand/20 font-body font-medium"
          >
            {t}
            <button onClick={() => onChange(tags.filter((x) => x !== t))} className="hover:text-danger transition-colors">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
          placeholder="Digite e pressione Enter para adicionar"
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition font-body"
        />
        <Button variant="outline" size="sm" onClick={add} leftIcon={<Plus className="w-3.5 h-3.5" />}>
          Adicionar
        </Button>
      </div>
      <p className="text-[10px] text-gray-400">
        Sugestões: Segurança · Compliance · Motorista · Tecnologia · Soft Skills · Obrigatório
      </p>
    </div>
  )
}

function BannerUpload({
  bannerUrl, bannerColor, onUrlChange, onColorChange,
}: {
  bannerUrl: string; bannerColor: string;
  onUrlChange: (u: string) => void; onColorChange: (c: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => onUrlChange(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-3">
      {/* Preview */}
      <div
        className={clsx(
          'w-full h-36 rounded-xl flex items-center justify-center relative overflow-hidden border-2 transition-all cursor-pointer',
          dragging ? 'border-brand border-dashed' : 'border-dashed border-gray-200',
        )}
        style={{ background: bannerUrl ? 'transparent' : bannerColor }}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault(); setDragging(false)
          const f = e.dataTransfer.files[0]
          if (f) handleFile(f)
        }}
      >
        {bannerUrl ? (
          <>
            <img src={bannerUrl} alt="banner" className="w-full h-full object-cover" />
            <button
              onClick={(e) => { e.stopPropagation(); onUrlChange('') }}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <div className="text-center pointer-events-none">
            <ImageIcon className="w-8 h-8 text-white/40 mx-auto mb-2" />
            <p className="text-white/60 text-xs font-body">Clique ou arraste a imagem do banner</p>
            <p className="text-white/30 text-[10px] mt-0.5">PNG, JPG ou WEBP · Recomendado 1280×360px</p>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />

      {/* Cor de fundo (fallback) */}
      <div className="space-y-1.5">
        <p className="text-xs font-body font-medium text-gray-600">Cor de fundo (usada sem imagem)</p>
        <div className="flex gap-2 flex-wrap">
          {BANNER_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => onColorChange(c)}
              className={clsx(
                'w-7 h-7 rounded-md border-2 transition-all',
                bannerColor === c ? 'border-gray-800 scale-110' : 'border-transparent hover:scale-105',
              )}
              style={{ background: c }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CourseCreate() {
  const navigate = useNavigate()
  const { addCourse } = useAdminStore()
  const [saved, setSaved] = useState(false)

  const [title,       setTitle]       = useState('')
  const [description, setDescription] = useState('')
  const [xpReward,    setXpReward]    = useState(100)
  const [courseType,  setCourseType]  = useState<'mandatory' | 'optional'>('optional')
  const [tags,        setTags]        = useState<string[]>([])
  const [bannerUrl,   setBannerUrl]   = useState('')
  const [bannerColor, setBannerColor] = useState('#0D1B36')
  const [roles,       setRoles]       = useState<UserRole[]>(['user', 'manager'])
  const [areas,       setAreas]       = useState<string[]>([])

  const toggleRole = (r: UserRole) =>
    setRoles((prev) => prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r])

  const toggleArea = (a: string) =>
    setAreas((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a])

  const handleSave = (status: 'draft' | 'published') => {
    if (!title.trim()) return
    addCourse({ title, description, xpReward, tags, bannerUrl, bannerColor,
      permissions: { roles, areas }, type: courseType, status })
    setSaved(true)
    setTimeout(() => navigate('/admin/courses'), 1200)
  }

  const isValid = title.trim().length > 0

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* Topbar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-gray-800 text-2xl">Novo curso</h1>
          <p className="text-gray-400 text-sm mt-0.5">Preencha as informações abaixo para criar o curso.</p>
        </div>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-success font-body font-medium">
            <CheckCircle className="w-4 h-4" /> Salvo com sucesso!
          </span>
        )}
      </div>

      {/* 1. Dados básicos */}
      <Section icon={<BookOpen className="w-3.5 h-3.5" />} title="Dados básicos">
        <div className="space-y-4">
          <Input
            label="Nome do curso *"
            placeholder="Ex: Direção Defensiva Avançada"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="space-y-1">
            <label className="text-xs font-body font-medium text-gray-800">Descrição</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o objetivo e o conteúdo do curso..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition font-body resize-none"
            />
          </div>

          {/* Tipo */}
          <div className="space-y-1.5">
            <label className="text-xs font-body font-medium text-gray-800">Tipo</label>
            <div className="flex gap-2">
              {(['mandatory','optional'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setCourseType(t)}
                  className={clsx(
                    'flex-1 py-2 rounded-lg text-sm font-body font-medium border transition-all',
                    courseType === t
                      ? t === 'mandatory'
                        ? 'bg-danger text-white border-danger'
                        : 'bg-brand text-white border-brand'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300',
                  )}
                >
                  {t === 'mandatory' ? '⚠️ Obrigatório' : '✨ Opcional'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* 2. Banner */}
      <Section icon={<ImageIcon className="w-3.5 h-3.5" />} title="Banner do curso">
        <BannerUpload
          bannerUrl={bannerUrl}
          bannerColor={bannerColor}
          onUrlChange={setBannerUrl}
          onColorChange={setBannerColor}
        />
      </Section>

      {/* 3. Pontuação */}
      <Section icon={<Zap className="w-3.5 h-3.5" />} title="Pontuação XP">
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-body font-medium text-gray-800">
              Pontos XP concedidos ao concluir o curso
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={10} max={500} step={10}
                value={xpReward}
                onChange={(e) => setXpReward(Number(e.target.value))}
                className="flex-1 accent-brand"
              />
              <div className="w-20 flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg">
                <Zap className="w-3.5 h-3.5 text-brand flex-shrink-0" />
                <input
                  type="number"
                  min={10} max={500}
                  value={xpReward}
                  onChange={(e) => setXpReward(Math.min(500, Math.max(10, Number(e.target.value))))}
                  className="w-full text-sm font-heading font-bold text-brand outline-none bg-transparent"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[50,100,150,200,300,500].map((v) => (
              <button
                key={v}
                onClick={() => setXpReward(v)}
                className={clsx(
                  'px-3 py-1 rounded-md text-xs font-body font-medium border transition-all',
                  xpReward === v ? 'bg-brand text-white border-brand' : 'bg-white text-gray-500 border-gray-200 hover:border-brand hover:text-brand',
                )}
              >
                {v} XP
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* 4. Tags */}
      <Section icon={<Tag className="w-3.5 h-3.5" />} title="Tags">
        <div className="space-y-1">
          <p className="text-xs text-gray-500 font-body">
            Tags ajudam a associar o curso a trilhas, áreas e categorias de busca.
          </p>
          <TagInput tags={tags} onChange={setTags} />
        </div>
      </Section>

      {/* 5. Permissões */}
      <Section icon={<Shield className="w-3.5 h-3.5" />} title="Permissões de acesso">
        <div className="space-y-4">
          {/* Por perfil */}
          <div className="space-y-2">
            <label className="text-xs font-body font-medium text-gray-800">Perfis com acesso</label>
            <div className="flex gap-2 flex-wrap">
              {ROLES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => toggleRole(value)}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-medium border transition-all',
                    roles.includes(value)
                      ? 'bg-navy text-white border-navy'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300',
                  )}
                >
                  <Users className="w-3 h-3" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Por área */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-body font-medium text-gray-800">Restringir por área</label>
              <span className="text-[10px] text-gray-400">Deixe vazio para todas as áreas</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {AREAS.map((a) => (
                <button
                  key={a}
                  onClick={() => toggleArea(a)}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg text-xs font-body font-medium border transition-all',
                    areas.includes(a)
                      ? 'bg-brand text-white border-brand'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300',
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
            {areas.length > 0 && (
              <p className="text-xs text-brand font-body">
                Visível para: {areas.join(', ')}
              </p>
            )}
          </div>
        </div>
      </Section>

      {/* Ações */}
      <div className="flex items-center justify-between gap-3 pb-6">
        <Button variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={!isValid}
            onClick={() => handleSave('draft')}
          >
            Salvar rascunho
          </Button>
          <Button
            variant="primary"
            disabled={!isValid}
            leftIcon={<CheckCircle className="w-4 h-4" />}
            onClick={() => handleSave('published')}
          >
            Publicar curso
          </Button>
        </div>
      </div>
    </div>
  )
}
