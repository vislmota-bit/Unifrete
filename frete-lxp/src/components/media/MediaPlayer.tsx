import { ExternalLink, FileText, Music, Video } from 'lucide-react'
import type { ContentType } from '@/types'

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
  return m ? m[1] : null
}

function getPdfEmbedUrl(url: string): string {
  // Google Drive: convert /view to /preview
  if (url.includes('drive.google.com')) {
    return url.replace('/view', '/preview').replace(/\?.*$/, '')
  }
  // Other PDFs: route through Google Docs viewer
  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
}

function getDocEmbedUrl(url: string): string {
  if (url.includes('docs.google.com')) {
    return url.replace('/edit', '/preview').split('?')[0]
  }
  return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
}

interface Props {
  contentType: ContentType
  contentUrl: string
  title: string
}

export function MediaPlayer({ contentType, contentUrl, title }: Props) {
  if (!contentUrl) {
    return (
      <div className="w-full rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center gap-3 py-16">
        <Video className="w-10 h-10 text-gray-200" />
        <p className="text-sm text-gray-400">Conteúdo ainda não disponível</p>
        <p className="text-xs text-gray-300">O administrador não configurou a URL deste módulo.</p>
      </div>
    )
  }

  // ── Vídeo YouTube ────────────────────────────────────────────────────────
  if (contentType === 'video') {
    const videoId = getYouTubeId(contentUrl)
    if (videoId) {
      return (
        <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      )
    }
    // Vídeo HTML5 direto (mp4, etc.)
    return (
      <div className="w-full rounded-xl overflow-hidden bg-black">
        <video
          src={contentUrl}
          controls
          className="w-full"
          title={title}
        />
      </div>
    )
  }

  // ── Áudio ────────────────────────────────────────────────────────────────
  if (contentType === 'audio') {
    return (
      <div className="w-full rounded-xl bg-gradient-to-br from-purple-50 to-brand-light border border-brand/20 p-8 flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center">
          <Music className="w-8 h-8 text-brand" />
        </div>
        <div className="text-center">
          <p className="font-heading font-bold text-gray-800 text-base">{title}</p>
          <p className="text-xs text-gray-400 mt-1">Podcast / Áudio</p>
        </div>
        <audio
          src={contentUrl}
          controls
          className="w-full max-w-sm"
          title={title}
        />
      </div>
    )
  }

  // ── PDF ──────────────────────────────────────────────────────────────────
  if (contentType === 'pdf') {
    const embedUrl = getPdfEmbedUrl(contentUrl)
    return (
      <div className="w-full rounded-xl overflow-hidden border border-gray-100 flex flex-col">
        <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
          <FileText className="w-4 h-4 text-danger" />
          <span className="text-sm font-body font-medium text-gray-700 flex-1 truncate">{title}</span>
          <a
            href={contentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-brand hover:text-brand-dark transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Abrir original
          </a>
        </div>
        <iframe
          src={embedUrl}
          title={title}
          className="w-full border-0"
          style={{ height: '520px' }}
        />
      </div>
    )
  }

  // ── Documento (Google Docs / Word) ───────────────────────────────────────
  if (contentType === 'doc') {
    const embedUrl = getDocEmbedUrl(contentUrl)
    return (
      <div className="w-full rounded-xl overflow-hidden border border-gray-100 flex flex-col">
        <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
          <FileText className="w-4 h-4 text-success" />
          <span className="text-sm font-body font-medium text-gray-700 flex-1 truncate">{title}</span>
          <a
            href={contentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-brand hover:text-brand-dark transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Abrir no Google Docs
          </a>
        </div>
        <iframe
          src={embedUrl}
          title={title}
          className="w-full border-0"
          style={{ height: '520px' }}
        />
      </div>
    )
  }

  return null
}
