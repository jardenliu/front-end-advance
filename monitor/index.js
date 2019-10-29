const express = require('express')
const app = express()

app.use(express.static('./static'))

app.listen(3000, err => {
  console.log(`server listen on: http://localhost:3000`)
})
