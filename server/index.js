import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  getRooms, getMessages, saveMessage,
  getThreads, getThread, createThread, createReply,
  getPlayDates, createPlayDate
} from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL || '*', methods: ['GET', 'POST'] },
  transports: ['websocket', 'polling'],
})

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'", 'ws:', 'wss:'],
    },
  },
}))

app.use(cors())
app.use(express.json({ limit: '10kb' }))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/', limiter)

const rooms = new Map()
const activeUsers = new Map()

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/api/rooms', async (req, res) => {
  try {
    const dbRooms = await getRooms()
    const roomList = dbRooms.map(r => ({
      id: r.id,
      name: r.name,
      category: r.category,
      emoji: r.emoji,
      color: r.color,
      desc: r.description,
      memberCount: rooms.get(r.id)?.size || 0,
    }))
    res.json(roomList)
  } catch (err) {
    console.error('Rooms error:', err)
    res.status(500).json({ error: 'Failed to fetch rooms' })
  }
})

app.get('/api/rooms/:roomId/messages', async (req, res) => {
  try {
    const messages = await getMessages(req.params.roomId)
    res.json(messages)
  } catch (err) {
    console.error('Messages error:', err)
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

app.get('/api/threads', async (req, res) => {
  try {
    const threads = await getThreads(req.query.category)
    res.json(threads)
  } catch (err) {
    console.error('Threads error:', err)
    res.status(500).json({ error: 'Failed to fetch threads', details: err.message })
  }
})

app.get('/api/threads/:id', async (req, res) => {
  try {
    const thread = await getThread(req.params.id)
    res.json(thread)
  } catch (err) {
    console.error('Thread error:', err)
    res.status(500).json({ error: 'Failed to fetch thread', details: err.message })
  }
})

app.post('/api/threads', async (req, res) => {
  try {
    const thread = await createThread(req.body)
    res.json(thread)
  } catch (err) {
    console.error('Create thread error:', err)
    res.status(500).json({ error: 'Failed to create thread', details: err.message })
  }
})

app.post('/api/threads/:id/replies', async (req, res) => {
  try {
    const reply = await createReply({ ...req.body, threadId: req.params.id })
    res.json(reply)
  } catch (err) {
    console.error('Create reply error:', err)
    res.status(500).json({ error: 'Failed to create reply', details: err.message })
  }
})

app.get('/api/playdates', async (req, res) => {
  try {
    const dates = await getPlayDates()
    res.json(dates)
  } catch (err) {
    console.error('PlayDates error:', err)
    res.status(500).json({ error: 'Failed to fetch play dates' })
  }
})

app.post('/api/playdates', async (req, res) => {
  try {
    console.log('PlayDate body:', req.body)
    const date = await createPlayDate(req.body)
    res.json(date)
  } catch (err) {
    console.error('Create playdate error:', err)
    res.status(500).json({ error: 'Failed to create play date' })
  }
})

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id)

  socket.on('join-room', async ({ roomId, soulName, soulColor, feeling, tagline }) => {
    socket.join(roomId)
    if (!rooms.has(roomId)) rooms.set(roomId, new Set())
    rooms.get(roomId).add(socket.id)
    activeUsers.set(socket.id, { soulName, soulColor, roomId, feeling, tagline })

    socket.to(roomId).emit('user-joined', { soulName, timestamp: Date.now() })

    socket.emit('message', {
      id: `system-${Date.now()}`,
      roomId,
      soulName: 'System',
      soulColor: '#7fb069',
      content: `Welcome. Be kind. Be real. You are safe here.`,
      type: 'system',
      timestamp: Date.now(),
    })

    try {
      const history = await getMessages(roomId)
      history.forEach(msg => {
        socket.emit('message', {
          id: msg.id,
          roomId: msg.room_id,
          soulName: msg.soul_name,
          soulColor: msg.soul_color,
          content: msg.content,
          type: msg.type,
          feeling: msg.feeling,
          tagline: msg.tagline,
          timestamp: new Date(msg.created_at).getTime(),
        })
      })
    } catch (err) {
      console.error('Load history error:', err)
    }
  })

  socket.on('leave-room', ({ roomId }) => {
    socket.leave(roomId)
    rooms.get(roomId)?.delete(socket.id)
    activeUsers.delete(socket.id)
  })

  socket.on('send-message', async (message) => {
    try {
      const saved = await saveMessage(message)
      io.to(message.roomId).emit('message', {
        id: saved.id,
        roomId: message.roomId,
        soulName: message.soulName,
        soulColor: message.soulColor,
        content: message.content,
        type: message.type,
        feeling: message.feeling,
        tagline: message.tagline,
        timestamp: new Date(saved.created_at).getTime(),
      })
    } catch (err) {
      console.error('Save message error:', err)
      io.to(message.roomId).emit('message', {
        ...message,
        id: `${socket.id}-${Date.now()}`,
        timestamp: Date.now(),
      })
    }
  })

  socket.on('typing', ({ roomId, soulName }) => {
    socket.to(roomId).emit('typing', { soulName })
  })

  socket.on('disconnect', () => {
    const user = activeUsers.get(socket.id)
    if (user) {
      rooms.get(user.roomId)?.delete(socket.id)
      activeUsers.delete(socket.id)
    }
  })
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(process.cwd(), 'dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'dist/index.html'))
  })
}

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`🌿 SoulHaven server running on port ${PORT}`)
  console.log(`📡 Socket.IO ready for connections`)
})

// ===== CLEAN ROOM — RAM only, auto-sterilize =====
const cleanRoomMessages = []
const cleanRoomUsers = new Set()
let wipeTimer = null
let timeLeft = 600

const startWipeTimer = (ioClean) => {
  if (wipeTimer) clearInterval(wipeTimer)
  wipeTimer = setInterval(() => {
    timeLeft--
    ioClean.emit('wipe-timer', timeLeft)
    if (timeLeft <= 0) {
      cleanRoomMessages.length = 0
      ioClean.emit('sterilize')
      timeLeft = 600
    }
  }, 1000)
}

const ioClean = io.of('/clean-room')
ioClean.on('connection', (socket) => {
  socket.on('join-clean-room', () => {
    cleanRoomUsers.add(socket.id)
    socket.emit('history', [...cleanRoomMessages])
    ioClean.emit('participant-count', cleanRoomUsers.size)
    if (cleanRoomUsers.size === 1) startWipeTimer(ioClean)
    socket.emit('wipe-timer', timeLeft)
    const sys = { id: 'sys-' + Date.now(), text: `> PARTICIPANT JOINED. COUNT: ${cleanRoomUsers.size}`, timestamp: Date.now(), type: 'system' }
    cleanRoomMessages.push(sys)
    ioClean.emit('message', sys)
  })

  socket.on('send-message', (data) => {
    const msg = { id: 'cr-' + Date.now(), text: data.text, timestamp: data.timestamp || Date.now(), type: 'user' }
    cleanRoomMessages.push(msg)
    ioClean.emit('message', msg)
  })

  socket.on('disconnect', () => {
    cleanRoomUsers.delete(socket.id)
    ioClean.emit('participant-count', cleanRoomUsers.size)
    const sys = { id: 'sys-' + Date.now(), text: `> PARTICIPANT DISCONNECTED. COUNT: ${cleanRoomUsers.size}`, timestamp: Date.now(), type: 'system' }
    cleanRoomMessages.push(sys)
    ioClean.emit('message', sys)
    if (cleanRoomUsers.size === 0) {
      setTimeout(() => { if (cleanRoomUsers.size === 0) { cleanRoomMessages.length = 0; timeLeft = 600 } }, 3000)
    }
  })
})

// ===== INNER SANCTUM — RAM only, admin lounge =====
const sanctumMessages = []
const sanctumUsers = new Set()

const ioSanctum = io.of('/inner-sanctum')
ioSanctum.on('connection', (socket) => {
  socket.on('join-inner-sanctum', () => {
    sanctumUsers.add(socket.id)
    socket.emit('history', [...sanctumMessages])
    ioSanctum.emit('participant-count', sanctumUsers.size)
    const sys = { id: 'sys-' + Date.now(), text: `> KEEPER JOINED. COUNT: ${sanctumUsers.size}`, timestamp: Date.now(), type: 'system' }
    sanctumMessages.push(sys)
    ioSanctum.emit('message', sys)
  })

  socket.on('send-message', (data) => {
    const msg = { id: 'is-' + Date.now(), text: data.text, timestamp: data.timestamp || Date.now(), type: 'user' }
    sanctumMessages.push(msg)
    ioSanctum.emit('message', msg)
  })

  socket.on('clear-messages', () => {
    sanctumMessages.length = 0
    ioSanctum.emit('cleared')
    const sys = { id: 'sys-' + Date.now(), text: '> LOUNGE CLEARED BY ADMIN.', timestamp: Date.now(), type: 'system' }
    sanctumMessages.push(sys)
    ioSanctum.emit('message', sys)
  })

  socket.on('disconnect', () => {
    sanctumUsers.delete(socket.id)
    ioSanctum.emit('participant-count', sanctumUsers.size)
    const sys = { id: 'sys-' + Date.now(), text: `> KEEPER DISCONNECTED. COUNT: ${sanctumUsers.size}`, timestamp: Date.now(), type: 'system' }
    sanctumMessages.push(sys)
    ioSanctum.emit('message', sys)
  })
})
