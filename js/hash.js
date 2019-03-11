
const fs = require('fs').promises
const { ExifImage } = require('exif')
const crypto = require('crypto')

main()

async function main () {
  console.log(process.argv.length)
  const usage = 'I need an existing directory without a slash ending as a parameter'
  if (process.argv.length !== 3) {
    console.log(usage)
    process.exit(-1)
  }
  const dirName = process.argv[2]
  if (!(await isDir(dirName)) || dirName.endsWith('/')) {
    console.log(usage)
    process.exit(-1)
  }

  try {
    const hashes = {}
    await walk(dirName, hashes)
    // await walk('../gPhoto', hashes)
    // await walk('../iCloud', hashes)

    await fs.writeFile(`${dirName}.json`, JSON.stringify(hashes, null, 2))
  } catch (err) {
    console.error(err)
  }
}

async function walk (dir, dict) {
  const list = await fs.readdir(dir)
  // console.log({ list })
  for (const f of list) {
    const path = `${dir}/${f}`
    if (await isDir(path)) {
      console.log(`subdir: ${path}`)
      await walk(path, dict)
    } else {
      const size = await fileSize(path)
      const exif = await extractExif(path)
      const stamp = (((exif || {}).image) || {}).ModifyDate || 'Unknown'

      const hash = await hashFile(path)

      dict[path] = {
        ...dict[path],
        ...{
          size,
          stamp,
          // exif,
          hash
        }
      }
      console.log(`  ${path}:`, JSON.stringify(dict[path]))
    }
  }
}

async function fileSize (path) {
  try {
    const stat = await fs.stat(path)
    if (stat) {
      return stat.size
    }
  } catch (err) { }
  return 0
}

async function isDir (path) {
  try {
    const stat = await fs.stat(path)
    return (stat && stat.isDirectory())
  } catch (err) {
    return false
  }
}

async function hashFile (path, algo = 'sha1') {
  const content = await fs.readFile(path, { encoding: 'utf8' })
  return hashStr(content)
}

function hashStr (str, algo = 'sha1') {
  return crypto.createHash(algo).update(str).digest('hex')
}

async function extractExif (path) {
  return new Promise((resolve, reject) => {
    ExifImage({ image: path }, function (error, exifData) {
      if (error) {
        // console.error('Error: ' + error.message)
        // reject(error)
        resolve({})
      } else {
        // console.log(exifData)
        resolve(exifData)
      }
    })
  })
}
