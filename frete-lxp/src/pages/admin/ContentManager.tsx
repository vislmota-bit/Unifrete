import { useState } from 'react'
import { Save, Youtube, FileText, Music, File, CheckCircle } from 'lucide-react'
import { clsx } from 'clsx'
import { Button, Card } from '@/components/ui'
import { useContentStore } from '@/store/contentStore'
import type { ContentEntry } from '@/store/contentStore'
import { MOCK_TRAILS } from '@/store/mockData'
import type { ContentType } from '@/types'

const CONTENT_TYPES: { value: ContentType; label: string; icon: React.ReactNode; hint: string }[] = [
  {
    value: 'video',
    label: 'Vídeo YouTube',
    icon: <Youtube className="w-4 h-4" />,
    hint: 'Cole a URL do YouTube: youtube.com/watch?v=... ou youtu.be/...',
  },
  {
    value: 'audio',
    label: 'Áudio / Podcast',
    icon: <Music className="w-4 h-4" />,
    hint: 'URL direta para arquivo .mp3 ou link de plataforma de podcast',
  },
  {
    value: 'pdf',
    label: 'PDF',
    icon: <FileText className="w-4 h-4" />,
    hint: 'Link do Google Drive (compartilhado) ou URL direta do arquivo .pdf',
  },
  {
    value: 'doc',
    label: 'Documento',
    icon: <File className="w-4 h-4" />,
    hint: 'Link do Google Docs, Google Slides ou outro documento online',
  },
]

function ModuleRow({ entry }: { entry: ContentEntry }) {
  const { updateEntry } = useContentStore()
  const [localType, setLocalType] = useState<ContentType>(entry.contentType)
  const [localUrl, setLocalUrl]   = useState(entry.contentUrl)
  const [localDesc, setLocalDesc] = useState(entry.description)
  const [saved, setSaved]         = useState(false)

  const handleSave = () => {
    updateEntry(entry.moduleId, { contentType: localType, contentUrl: localUrl, description: localDesc })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const typeInfo = CONTENT_TYPES.find((t) => t.value === localType)!

  return (
    <div className="border border-gray-100 rounded-xl p-4 space-y-3 bg-white hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-body font-medium text-gray-800 text-sm">{entry.moduleTitle}</p>
          <p className="text-xs text-gray-400 mt-0.5">{entry.trailTitle}</p>
        </div>
        {saved && (
          <span className="flex items-center gap-1 text-xs text-success font-body font-medium">
            <CheckCircle className="w-3.5 h-3.5" /> Salvo
          </span>
        )}
      </div>

      {/* Seletor de tipo */}
      <div className="flex gap-2 flex-wrap">
        {CONTENT_TYPES.map(({ value, label, icon }) => (
          <button
            key={value}
            onClick={() => setLocalType(value)}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-medium border transition-all',
              localType === value
                ? 'bg-brand text-white border-brand'
                : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300',
            )}
          >
            {icon}{label}
          </button>
        ))}
      </div>

      {/* Campo de URL */}
      <div className="space-y-1">
        <label className="text-xs font-body font-medium text-gray-600">URL do conteúdo</label>
        <input
          type="url"
          value={localUrl}
          onChange={(e) => setLocalUrl(e.target.value)}
          placeholder={typeInfo.hint}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition font-body"
        />
        <p className="text-[10px] text-gray-400">{typeInfo.hint}</p>
      </div>

      {/* Campo de descrição */}
      <div className="space-y-1">
        <label className="text-xs font-body font-medium text-gray-600">Descrição do módulo</label>
        <textarea
          value={localDesc}
          onChange={(e) => setLocalDesc(e.target.value)}
          rows={2}
          placeholder="Descreva o conteúdo deste módulo..."
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition font-body resize-none"
        />
      </div>

      <div className="flex justify-end">
        <Button
          variant="brand"
          size="sm"
          leftIcon={<Save className="w-3.5 h-3.5" />}
          onClick={handleSave}
        >
          Salvar módulo
        </Button>
      </div>
    </div>
  )
}

export default function ContentManager() {
  const { entries } = useContentStore()
  const [selectedTrail, setSelectedTrail] = useState<string>('all')

  const trailOptions = MOCK_TRAILS.map((t) => ({ id: t.id, title: t.title }))
  const filtered = selectedTrail === 'all'
    ? entries
    : entries.filter((e) => e.trailId === selectedTrail)

  return (
    <div className="space-y-6">
      {/* Topbar */}
      <div>
        <h1 className="font-heading font-bold text-gray-800 text-2xl">Gestão de Conteúdo</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          Configure URLs de vídeos (YouTube), áudios, PDFs e documentos para cada módulo.
        </p>
      </div>

      {/* Instruções */}
      <Card className="bg-brand-light border-brand/20 space-y-2">
        <p className="font-body font-medium text-brand-dark text-sm">Como funciona</p>
        <ul className="space-y-1 text-xs text-gray-600 font-body">
          <li>🎬 <strong>Vídeo:</strong> cole o link do YouTube (youtube.com/watch?v=... ou youtu.be/...)</li>
          <li>🎧 <strong>Áudio:</strong> URL direta de .mp3 ou link de podcast público</li>
          <li>📄 <strong>PDF:</strong> link do Google Drive compartilhado ou URL pública do PDF</li>
          <li>📝 <strong>Documento:</strong> link de Google Docs ou Google Slides (configurado como "Qualquer pessoa com o link")</li>
        </ul>
      </Card>

      {/* Filtro por trilha */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500 font-body">Filtrar trilha:</span>
        <button
          onClick={() => setSelectedTrail('all')}
          className={clsx(
            'px-3 py-1.5 rounded-lg text-xs font-body font-medium border transition-all',
            selectedTrail === 'all'
              ? 'bg-navy text-white border-navy'
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300',
          )}
        >
          Todas
        </button>
        {trailOptions.map(({ id, title }) => (
          <button
            key={id}
            onClick={() => setSelectedTrail(id)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-body font-medium border transition-all',
              selectedTrail === id
                ? 'bg-navy text-white border-navy'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300',
            )}
          >
            {title}
          </button>
        ))}
      </div>

      {/* Lista de módulos */}
      <div className="space-y-3">
        {filtered.map((entry) => (
          <ModuleRow key={entry.moduleId} entry={entry} />
        ))}
      </div>
    </div>
  )
}
