import { test } from 'tap'
import init from '../index.js'

test('simple test', t => {
  t.plan(1)
  const result = init()
  t.same(result, { hello: 'world' })
})
