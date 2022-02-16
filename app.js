const express = require('express')
const app = express()
const os = require('os')

// Middleware to log requests
app.use(function (req, res, next) {
    console.log(`${new Date()} - ${req.method} request for ${req.url}`)
    next()
})

app.use(express.static('./static'))

var listen = app.listen(process.env.PORT || 3000, function(){
    console.log(`Listening on port ${listen.address().port}`)
})
