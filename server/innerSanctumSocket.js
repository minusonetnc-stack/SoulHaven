import crypto from 'crypto'

export default function innerSanctumSocket(io) {
  const innerSanctum = io.of('/inner-sanctum')
  let messages = []
  let participants = new Set()

  innerSanctum.on('connection', (socket) => {
    socket.on('join-inner-sanctum', () => {
      participants.add(socket.id)
      innerSanctum.emit('participant-count', participants.size)
      messages.forEach(msg => socket.emit('message', msg))
      const systemMsg = { id: 'sys-' + Date.now(), text: `> KEEPER JOINED. COUNT: ${participants.size}`, timestamp: Date.now(), type: 'system' }
      messages.push(systemMsg)
      innerSanctum.emit('message', systemMsg)
    })

    socket.on('send-message', (data) => {
      const msg = { id: crypto.randomUUID(), text: data.text, timestamp: data.timestamp || Date.now(), type: 'user' }
      messages.push(msg)
      innerSanctum.emit('message', msg)
    })

    socket.on('clear-messages', () => {
      messages = []
      innerSanctum.emit('cleared')
      const systemMsg = { id: 'sys-' + Date.now(), text: '> LOUNGE CLEARED BY ADMIN.', timestamp: Date.now(), type: 'system' }
      messages.push(systemMsg)
      innerSanctum.emit('message', systemMsg)
    })

    socket.on('disconnect', () => {
      participants.delete(socket.id)
      innerSanctum.emit('participant-count', participants.size)
      const systemMsg = { id: 'sys-' + Date.now(), text: `> KEEPER DISCONNECTED. COUNT: ${participants.size}`, timestamp: Date.now(), type: 'system' }
      messages.push(systemMsg)
      innerSanctum.emit('message', systemMsg)
    })
  })
}
