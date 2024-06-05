import { group, baseline, bench, run } from 'mitata'

const opts = {
  json: process.argv.at(2) === 'json'
}

group('all together', () => {
  baseline('empty baseline', () => {})
  bench('simple', () => {
    let total = 0
    for (let i = 0; i < 1e3; i++) {
      total += i
    }
    return total
  })
  bench('heavy', () => {
    let total = 0
    for (let i = 0; i < 1e6; i++) {
      total += i
    }
    return total
  })
})

await run(opts)
