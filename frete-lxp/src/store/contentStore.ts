import { create } from 'zustand'
import type { ContentType } from '@/types'
import { MOCK_TRAILS } from './mockData'

export interface ContentEntry {
  moduleId: string
  trailId: string
  moduleTitle: string
  trailTitle: string
  contentType: ContentType
  contentUrl: string
  description: string
}

interface ContentStore {
  entries: ContentEntry[]
  updateEntry: (moduleId: string, patch: Partial<Pick<ContentEntry, 'contentType' | 'contentUrl' | 'description'>>) => void
}

// Build initial entries from mock trail data
const initialEntries: ContentEntry[] = MOCK_TRAILS.flatMap((trail) =>
  trail.modules.map((mod) => ({
    moduleId:    mod.id,
    trailId:     trail.id,
    moduleTitle: mod.title,
    trailTitle:  trail.title,
    contentType: mod.contentType ?? 'video',
    contentUrl:  mod.contentUrl  ?? '',
    description: mod.description ?? '',
  }))
)

export const useContentStore = create<ContentStore>((set) => ({
  entries: initialEntries,

  updateEntry: (moduleId, patch) =>
    set((state) => ({
      entries: state.entries.map((e) =>
        e.moduleId === moduleId ? { ...e, ...patch } : e
      ),
    })),
}))
