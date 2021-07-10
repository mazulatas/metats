require('core-js/es/string/replace-all')
const esbuild = require('esbuild')
const path = require('path')
const fs = require('fs')
const { exec } = require("child_process")
const pkg = require('./package.json')


const outputPath = path.join(__dirname, 'dist')
const srcPath = path.join(__dirname, 'src')
const indexPath = path.join(srcPath, 'index.ts')


const platforms = [ 'neutral' ]
const formats = [ 'esm', 'cjs', 'iife' ]

const config = []

function execAsync(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error)
        return;
      }
      if (stderr) {
        reject(stderr)
        return;
      }
      resolve(stdout)
    })
  })
}

platforms.forEach(platform => formats.forEach(format => {
  const fileName = `index.${format}.js`
  config.push({
    entryPoints: [ indexPath ],
    platform, format,
    minify: platform === 'browser',
    target: platform === 'node' ? 'node14.17.0' : undefined,
    bundle: true,
    sourcemap: true,
    treeShaking: true,
    outfile: path.join(outputPath, 'lib', fileName)
  })
}))

fs.rmdirSync(outputPath, { recursive: true })
fs.mkdirSync(outputPath)

Promise.all([ ...config.map(c => esbuild.build(c)), execAsync('tsc --project tsconfig.json') ])
  .then(() => console.log('complete build'))
  .catch((err) => console.error('error build', err))
  .then(() => fs.writeFileSync(path.join(outputPath, 'package.json'), JSON.stringify(pkg)))
