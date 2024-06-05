import { execSync as $ } from 'node:child_process'
import { summary, benchmark, size, header, br } from 'mitata/reporter/table.mjs'

const MAIN_BRANCH = 'main'
const CURRENT_BRANCH_CMD = 'git symbolic-ref --short HEAD'
const opts = { encoding: 'utf8', stdio: 'pipe' }
const CURRENT_BRANCH = $(CURRENT_BRANCH_CMD, opts).replace(
  /[\r\n]/g,
  ''
)

const isMainBranch = MAIN_BRANCH === CURRENT_BRANCH

const benchmarks = JSON.parse($('node benchmark/bench.js json')).benchmarks
benchmarks.forEach(bench => (bench.branch = CURRENT_BRANCH))
if (!isMainBranch) {
  $(`git switch ${MAIN_BRANCH}`, opts)
  const mainBranchBench = JSON.parse(
    $('node benchmark/bench.js json')
  ).benchmarks
  mainBranchBench.forEach(bench => (bench.branch = MAIN_BRANCH))
  $(`git switch ${CURRENT_BRANCH}`, opts)
  benchmarks.push(...mainBranchBench)

  const results = {}

  for (const bench of benchmarks) {
    const { name, branch, ...other } = bench
    const processed = { ...other, group: name, name: branch }
    if (!results[name]) results[name] = []
    results[name].push(processed)
  }

  for (const key in results) {
    console.log(summary(results[key]))
  }
} else {
  const opts = {
    size: size(benchmarks.map(({ name }) => name))
  }

  console.log(header(opts))
  console.log(br(opts))
  for (const { name, stats } of benchmarks) {
    console.log(benchmark(name, stats, opts))
  }
}
