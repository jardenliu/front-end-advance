const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')

app.use(express.static('./static'))

app.get('/performance-1.html', (req, res) => {
  const file = fs.readFileSync(
    path.resolve(__dirname, 'static/performance/performance-1.html'),
    'utf-8'
  )
  setTimeout(() => {
    res.send(file).end()
  }, 2000)
})

app.get('/performance-1.js', (req, res) => {
  const file = fs.readFileSync(
    path.resolve(__dirname, 'static/performance/performance-1.js'),
    'utf-8'
  )
  setTimeout(() => {
    res.send(file).end()
  }, 2000)
})

app.get('/performance-1-1.js', (req, res) => {
  const file = fs.readFileSync(
    path.resolve(__dirname, 'static/performance/performance-1-1.js'),
    'utf-8'
  )
  setTimeout(() => {
    res.send(file).end()
  }, 1000)
})

app.get('/cross-domain-error.js', (req, res) => {
  const file = fs.readFileSync(
    path.resolve(__dirname, 'static/error/cross-domain-error.js'),
    'utf-8'
  )
  res.header('Access-Control-Allow-Origin', '*')
  res.send(file).end()
})

app.listen(3000, err => {
  console.log(`server listen on: http://localhost:3000`)
})
