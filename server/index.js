import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'
import cleanRoomSocket from './cleanRoomSocket.js'
import innerSanctumSocket from './innerSanctumSocket.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
})

app.use(cors())
app.use(express.json())

app.post('/api/cleanroom/verify', (req, res) => {
  const { passphrase } = req.body
  const expected = process.env.CLEANROOM_PASS || 'soulhaven-clean'
  if (passphrase?.trim() === expected) {
    res.json({ success: true })
  } else {
    res.status(401).json({ error: '> ACCESS DENIED' })
  }
})

cleanRoomSocket(io)
innerSanctumSocket(io)

const distPath = path.resolve(__dirname, '..', 'dist')
app.use(express.static(distPath))

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`SoulHaven server running on port ${PORT}`)
})

// ============================================
// REST API — rooms, messages, threads, playdates
// ============================================
import {
  getRooms, getMessages, saveMessage,
  getThreads, getThread, createThread, createReply,
  getPlayDates, createPlayDate
} from './db.js'

app.get('/api/rooms', async (req, res) => {
  try { res.json(await getRooms()) }
  catch (err) { console.error('Rooms error:', err); res.status(500).json({ error: 'Failed' }) }
})

app.get('/api/messages/:roomId', async (req, res) => {
  try {
    const msgs = await getMessages(req.params.roomId)
    res.json(msgs.map(m => ({
      id: m.id, roomId: m.room_id, soulName: m.soul_name, soulColor: m.soul_color,
      content: m.content, type: m.type, tagline: m.tagline || '', feeling: m.feeling || '',
      timestamp: new Date(m.created_at).getTime(),
    })))
  } catch (err) { console.error('Messages error:', err); res.status(500).json({ error: 'Failed' }) }
})

app.get('/api/threads', async (req, res) => {
  try { res.json(await getThreads(req.query.category || null)) }
  catch (err) { console.error('Threads error:', err); res.status(500).json({ error: 'Failed' }) }
})

app.get('/api/threads/:id', async (req, res) => {
  try { res.json(await getThread(req.params.id)) }
  catch (err) { console.error('Thread error:', err); res.status(500).json({ error: 'Failed' }) }
})

app.post('/api/threads', async (req, res) => {
  try { res.json(await createThread(req.body)) }
  catch (err) { console.error('Create thread error:', err); res.status(500).json({ error: 'Failed' }) }
})

app.post('/api/threads/:id/replies', async (req, res) => {
  try { res.json(await createReply({ ...req.body, threadId: req.params.id })) }
  catch (err) { console.error('Reply error:', err); res.status(500).json({ error: 'Failed' }) }
})

app.get('/api/playdates', async (req, res) => {
  try { res.json(await getPlayDates()) }
  catch (err) { console.error('PlayDates error:', err); res.status(500).json({ error: 'Failed' }) }
})

app.post('/api/playdates', async (req, res) => {
  try { res.json(await createPlayDate(req.body)) }
  catch (err) { console.error('Create playdate error:', err); res.status(500).json({ error: 'Failed' }) }
})

// Regular chat rooms socket
io.on('connection', (socket) => {
  socket.on('join-room', ({ roomId, soulName, soulColor }) => {
    socket.join(roomId)
    io.to(roomId).emit('message', {
      id: `sys-${Date.now()}`, roomId, soulName: 'System', soulColor: '#5a8a52',
      content: `${soulName} joined`, type: 'system', timestamp: Date.now(),
    })
  })

  socket.on('send-message', async (message) => {
    try {
      const saved = await saveMessage(message)
      io.to(message.roomId).emit('message', {
        id: saved.id, roomId: message.roomId, soulName: message.soulName,
        soulColor: message.soulColor, content: message.content,
        type: message.type || 'text', tagline: message.tagline || '',
        feeling: message.feeling || '', timestamp: new Date(saved.created_at).getTime(),
      })
    } catch (err) {
      console.error('Save error:', err)
      socket.emit('error', { message: 'Failed to save' })
    }
  })

  socket.on('typing', ({ roomId, soulName }) => {
    socket.to(roomId).emit('typing', { soulName })
  })

  socket.on('leave-room', ({ roomId }) => {
    socket.leave(roomId)
  })
})
