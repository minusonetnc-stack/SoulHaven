export interface SoulIdentity {
  soulName: string
  soulColor: string
  soulEmoji: string
  createdAt: number
  isAnonymous: boolean
}

export interface Message {
  id: string
  roomId: string
  soulName: string
  soulColor: string
  content: string
  type: 'text' | 'system'
  timestamp: number
}

export interface Thread {
  id: string
  title: string
  author: string
  authorColor: string
  content: string
  category: string
  replies: { id: string; author: string; authorColor: string; content: string; createdAt: number }[]
  createdAt: number
  isPinned: boolean
}

export interface PlayDate {
  id: string
  title: string
  description: string
  type: string
  location: string
  dateTime: string
  maxParticipants: number
  participants: string[]
  createdBy: string
}

export interface CrisisResource {
  id: string
  name: string
  description: string
  phone?: string
  url?: string
  text?: string
  categories: string[]
  available: string
}