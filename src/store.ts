import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SoulIdentity } from './types'

interface Store {
  identity: SoulIdentity | null
  isOnboarded: boolean
  theme: 'dark' | 'light'
  privacyMode: 'standard' | 'enhanced' | 'maximum'
  setIdentity: (i: SoulIdentity) => void
  clearIdentity: () => void
  setTheme: (t: 'dark' | 'light') => void
  setPrivacyMode: (m: 'standard' | 'enhanced' | 'maximum') => void
  setFeeling: (f: string) => void
  setTagline: (t: string) => void
  clearAllData: () => void
}

const COLORS = ['#8ba888', '#c2a06b', '#9a8fa8', '#a88383', '#8299b3', '#6f9a8a', '#9a8f7d', '#93a06f']
const EMOJIS = ['🌿', '🌙', '🔥', '💧', '🍃', '🌻', '🦋', '🐢', '🌲', '🌊']

const genName = () => {
  const a = ['Gentle','Quiet','Warm','Steady','Soft','Brave','Kind','Patient','Open','True']
  const n = ['River','Stone','Pine','Dawn','Moss','Ember','Tide','Path','Haven','Nest']
  return `${a[Math.floor(Math.random()*a.length)]} ${n[Math.floor(Math.random()*n.length)]}`
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      identity: null,
      isOnboarded: false,
      theme: 'dark',
      privacyMode: 'enhanced',
      setIdentity: (i) => set({ identity: i, isOnboarded: true }),
      clearIdentity: () => set({ identity: null, isOnboarded: false }),
      setTheme: (t) => set({ theme: t }),
      setPrivacyMode: (m) => set({ privacyMode: m }),
      setFeeling: (feeling) => set((s) => ({
        identity: s.identity ? { ...s.identity, feeling } : null
      })),
      setTagline: (tagline) => set((s) => ({
        identity: s.identity ? { ...s.identity, tagline: tagline.slice(0, 30) } : null
      })),
      clearAllData: () => { localStorage.clear(); window.location.reload() }
    }),
    { name: 'soulhaven', partialize: (s) => ({ identity: s.identity, isOnboarded: s.isOnboarded, theme: s.theme, privacyMode: s.privacyMode }) }
  )
)

export const genIdentity = (): SoulIdentity => ({
  soulName: genName(),
  soulColor: COLORS[Math.floor(Math.random()*COLORS.length)],
  soulEmoji: EMOJIS[Math.floor(Math.random()*EMOJIS.length)],
  createdAt: Date.now(),
  isAnonymous: true,
})
