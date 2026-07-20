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
  setFeeling: (f: string) => void      // NEW
  setTagline: (t: string) => void     // NEW
  clearAllData: () => void
}

const COLORS = ['#7fb069', '#c4a86b', '#8b7b9e', '#6b9e8e', '#9e7b7b', '#7b9ec4', '#9e8b7b', '#8b9e7b']
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
      setFeeling: (feeling) => set((s) => ({   // NEW
        identity: s.identity ? { ...s.identity, feeling } : null
      })),
      setTagline: (tagline) => set((s) => ({  // NEW
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
