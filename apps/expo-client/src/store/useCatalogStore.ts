import { League, Season } from '@f-stats-bets/types'
import { create } from 'zustand'

type CatalogState = {
  leagues: Record<string, League>
  seasons: Record<string, Season>
  setCatalogData: (data: Partial<CatalogState>) => void
}

export const useCatalogStore = create<CatalogState>(set => ({
  leagues: {},
  seasons: {},
  setCatalogData: data => set(state => ({ ...state, ...data })),
}))
