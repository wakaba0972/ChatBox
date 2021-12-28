const express = require('express')
const WebSocket = require('ws').Server


const server = express()
    .get('/', (req, res)=> {
        res.sendFile(__dirname + '/body.html')
    })
    .get('/opCheck', (req, res)=> {
        console.log(req.query.pass)
        if(req.query.pass == 'hnjnknln0') res.end('1')
        else res.end('0')
    })
    .listen(8000)
    

const wsApp = new WebSocket({server})

var nums = 0
wsApp.on('connection', ws=> {
    console.log(++nums)

    ws.on('message', (msg)=> {
        msg = JSON.stringify(JSON.parse(msg))
        wsApp.clients.forEach((client) => {
            client.send(msg);
        })
    })

    ws.on('close', (e)=> {
        console.log(--nums)
    })
})
