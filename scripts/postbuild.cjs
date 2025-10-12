#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')

const projectRoot = process.cwd()
const distDir = path.join(projectRoot, 'dist')
const staticJsonSource = path.join(projectRoot, 'static.json')
const staticJsonTarget = path.join(distDir, 'static.json')
const menuDir = path.join(distDir, 'menu')
const indexSource = path.join(distDir, 'index.html')
const menuIndexTarget = path.join(menuDir, 'index.html')

const ensureDirectory = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true })
}

const copyIfExists = (sourcePath, targetPath) => {
  if (!fs.existsSync(sourcePath)) return
  ensureDirectory(path.dirname(targetPath))
  fs.copyFileSync(sourcePath, targetPath)
}

ensureDirectory(distDir)
copyIfExists(staticJsonSource, staticJsonTarget)
copyIfExists(indexSource, menuIndexTarget)
