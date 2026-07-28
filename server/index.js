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
