
const fs = require('fs').promises

main()

async function main () {
  console.log(process.argv.length)
  const usage = 'I need twoexisting JSON files'
  if (process.argv.length !== 4) {
    console.log(usage)
    process.exit(-1)
  }

  try {
    const dicts = { }
    const paths = [process.argv[2], process.argv[3]]
    for (const path of paths) {
      const d = await readJSON(path)
      const sz = sizeOf(d)
      console.log({ path, sz })
      dicts[path] = d
    }

    const a = dicts[paths[0]]
    const b = dicts[paths[1]]
    // console.log(JSON.stringify({ a, b }, null, 2))

    const invertedA = {}
    const invertedB = {}
    const union = {}
    invertHash(a, invertedA, 'a->a')
    invertHash(a, union, 'a->union')
    invertHash(b, invertedB, 'b->b')
    invertHash(b, union, 'b->union')

    console.log({
      invertedA: Object.keys(invertedA).length,
      invertedB: Object.keys(invertedB).length,
      union: Object.keys(union).length
    })
  } catch (err) {
    console.error(err)
  }
}

function invertHash (src, dest, name) {
  for (const path of Object.keys(src)) {
    const entry = src[path]
    // const key = entry.hash
    const key = entry.stamp
    if (dest[key]) {
      console.log(`collision (${name}):`, key, path, dest[key])
    }
    dest[key] = path
  }
}
// return count and sum(size) for the dict d
function sizeOf (d) {
  const paths = Object.keys(d)

  const size = paths.reduce((sum, path) => sum + d[path].size, 0)

  return {
    count: paths.length,
    size: (size / 1e6).toFixed(2) + 'MB'
  }
}
async function readJSON (path) {
  const content = await fs.readFile(path, { encoding: 'utf8' })
  return JSON.parse(content)
}
