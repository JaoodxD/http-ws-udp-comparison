import { WebSocket, WebSocketServer } from 'ws'

const ROUND_TRIPS = parseInt(process.argv[2]) || 10
const PER_TRIP_TIME_TRACK = Boolean(process.argv[3])

const server = new WebSocketServer({ port: 8080 })

server.on('listening', () => {
  const url = new URL('ws://localhost:3000')
  console.log(`Listening at ${url}`)
})
server.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message)
    ws.send(data + 1 + '')
  })
})

const ws = new WebSocket('ws://localhost:8080')

let counter = 0
ws.on('message', (message) => {
  if (PER_TRIP_TIME_TRACK) console.timeEnd(counter)
  counter = JSON.parse(message)
  if (counter >= ROUND_TRIPS) {
    console.timeEnd('total')
    ws.close()
    server.close()
    return
  }
  if (PER_TRIP_TIME_TRACK) console.time(counter)
  ws.send(counter + '')
})
console.time('total')
ws.on('open', () => {
  if (PER_TRIP_TIME_TRACK) console.time(counter)
  ws.send(counter + '')
})
