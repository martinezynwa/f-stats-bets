import { Category } from '@f-stats-bets/types'
import { create } from 'zustand'

type CatalogState = {
  categories: Record<string, Category>
  setCatalogData: (data: Partial<CatalogState>) => void
}

export const useCatalogStore = create<CatalogState>(set => ({
  categories: {},
  setCatalogData: data => set(state => ({ ...state, ...data })),
}))
