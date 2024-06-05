import { createServer } from 'node:http'
import { fetch, Agent, setGlobalDispatcher } from 'undici'

const ROUND_TRIPS = parseInt(process.argv[2]) || 10
const PER_TRIP_TIME_TRACK = Boolean(process.argv[3])

const server = createServer((req, res) => {
  const buffers = []
  req.on('data', (buffer) => buffers.push(buffer))
  req.on('end', () => {
    const data = JSON.parse(Buffer.concat(buffers))
    res.end(data + 1 + '')
  })
})

server.listen(3000)

const url = new URL('http://localhost:3000')
console.log(`Listening at ${url}`)

// disable keep alive
const dispatcher = new Agent({ pipelining: 0 })
setGlobalDispatcher(dispatcher)

let counter = 0
console.time('total')
for (let i = 0; i < ROUND_TRIPS; i++) {
  if (PER_TRIP_TIME_TRACK) console.time(i)
  counter = await fetch(url, { method: 'POST', body: counter + '' }).then(
    (res) => res.json()
  )
  if (PER_TRIP_TIME_TRACK) console.timeEnd(i)
}
console.timeEnd('total')
server.close()
