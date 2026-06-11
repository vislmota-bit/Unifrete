import { create } from 'zustand'
import { type Trail } from '@/types'
import { MOCK_TRAILS } from './mockData'

interface TrailsState {
  trails:      Trail[]
  activeTrail: Trail | null
  setActive:   (trailId: string) => void
}

export const useTrailsStore = create<TrailsState>((set, get) => ({
  trails:      MOCK_TRAILS,
  activeTrail: MOCK_TRAILS[0],  // Motorista Pro em andamento por padrão

  setActive: (trailId) =>
    set({ activeTrail: get().trails.find((t) => t.id === trailId) ?? null }),
}))
