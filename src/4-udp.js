import { createSocket } from 'node:dgram'

const ROUND_TRIPS = parseInt(process.argv[2]) || 10
const PER_TRIP_TIME_TRACK = Boolean(process.argv[3])

const server = createSocket({ type: 'udp4', reuseAddr: true })

const client = createSocket({ type: 'udp4', reuseAddr: true })

server.on('listening', () => {
  const address = server.address()
  console.log(
    'Listining to ',
    'Address: ',
    address.address,
    'Port: ',
    address.port
  )
})

server.on('message', (msg, info) => {
  msg = msg.toString()
  if (PER_TRIP_TIME_TRACK) console.timeEnd(msg)
  msg = +msg + 1 + ''
  const buffer = Buffer.from(msg)
  server.send(buffer, info.port, info.address)
})

let counter = 0 + ''
client.on('message', (msg, info) => {
  counter = msg.toString()
  if (counter >= ROUND_TRIPS) {
    client.close()
    server.close()
    console.timeEnd('total')
    return
  }
  const buffer = Buffer.from(counter)
  if (PER_TRIP_TIME_TRACK) console.time(counter)
  client.send(buffer, info.port, info.address)
})

server.bind(3000)
client.bind(3001)

console.time('total')
if (PER_TRIP_TIME_TRACK) console.time(counter)
client.send(counter, 0, counter.length, 3000)
