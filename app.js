const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use('*', (req, res, next) => {
  res.header('Content-Type', 'application/json')
  next()
})

const usersRoute = require('./routes/users')

app.use('/users', usersRoute)

app.listen(5500, () => {
  console.log('server is already to service')
})