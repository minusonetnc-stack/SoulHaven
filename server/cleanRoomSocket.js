import crypto from 'crypto'

export default function cleanRoomSocket(io) {
  const cleanRoom = io.of('/clean-room')
  let messages = []
  let participants = new Set()
  let wipeTimer = null
  let timeUntilWipe = 600
  let sterile = false

  const startWipeTimer = () => {
    if (wipeTimer) clearInterval(wipeTimer)
    timeUntilWipe = 600
    sterile = false
    wipeTimer = setInterval(() => {
      timeUntilWipe--
      cleanRoom.emit('wipe-timer', timeUntilWipe)
      if (timeUntilWipe <= 0) sterilize()
    }, 1000)
  }

  const stopWipeTimer = () => {
    if (wipeTimer) { clearInterval(wipeTimer); wipeTimer = null }
  }

  const sterilize = () => {
    messages = []
    sterile = true
    cleanRoom.emit('sterilize')
    stopWipeTimer()
  }

  cleanRoom.on('connection', (socket) => {
    socket.on('join-clean-room', () => {
      participants.add(socket.id)
      cleanRoom.emit('participant-count', participants.size)
      messages.forEach(msg => socket.emit('message', msg))
      if (participants.size === 1) startWipeTimer()
      socket.emit('wipe-timer', timeUntilWipe)
      const systemMsg = { id: 'sys-' + Date.now(), text: `> PARTICIPANT JOINED. COUNT: ${participants.size}`, timestamp: Date.now(), type: 'system' }
      messages.push(systemMsg)
      cleanRoom.emit('message', systemMsg)
    })

    socket.on('send-message', (data) => {
      if (sterile) return
      const msg = { id: crypto.randomUUID(), text: data.text, timestamp: data.timestamp || Date.now(), type: 'user' }
      messages.push(msg)
      cleanRoom.emit('message', msg)
    })

    socket.on('disconnect', () => {
      participants.delete(socket.id)
      cleanRoom.emit('participant-count', participants.size)
      const systemMsg = { id: 'sys-' + Date.now(), text: `> PARTICIPANT DISCONNECTED. COUNT: ${participants.size}`, timestamp: Date.now(), type: 'system' }
      messages.push(systemMsg)
      cleanRoom.emit('message', systemMsg)
      if (participants.size === 0) {
        setTimeout(() => { if (participants.size === 0) sterilize() }, 3000)
      }
    })
  })
}
