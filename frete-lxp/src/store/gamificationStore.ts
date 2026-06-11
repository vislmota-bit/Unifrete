import { create } from 'zustand'
import { type Achievement, type LeaderboardEntry } from '@/types'
import { MOCK_ACHIEVEMENTS, MOCK_LEADERBOARD } from './mockData'

interface GamificationState {
  achievements: Achievement[]
  leaderboard:  LeaderboardEntry[]
  addXP:        (amount: number) => void
}

export const useGamificationStore = create<GamificationState>((set) => ({
  achievements: MOCK_ACHIEVEMENTS,
  leaderboard:  MOCK_LEADERBOARD,

  addXP: (amount) =>
    set((state) => ({
      leaderboard: state.leaderboard.map((entry) =>
        entry.isCurrentUser ? { ...entry, xp: entry.xp + amount } : entry
      ),
    })),
}))
