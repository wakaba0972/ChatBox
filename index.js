const express = require('express')
const WebSocket = require('ws').Server

const PORT = process.env.PORT || 3000;

const server = express()
    .get('/', (req, res)=> {
        res.sendFile(__dirname + '/body.html')
    })
    .get('/opCheck', (req, res)=> {
        console.log(req.query.pass)
        if(req.query.pass == 'hnjnknln0') res.end('1')
        else res.end('0')
    })
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
    

const wsApp = new WebSocket({server})

wsApp.on('connection', ws=> {
    console.log(wsApp.clients.size)

    ws.on('message', (res)=> {
        res = JSON.parse(res)

        switch(res.command){
            case "regular":
                break
            case "message":
                let data = JSON.stringify(res)
                wsApp.clients.forEach((client) => {
                    client.send(data);
                })
        }
    })

    ws.on('close', (e)=> {
        console.log(wsApp.clients.size)
    })
})

var a = JSON.stringify({command: "regular"})
setInterval(()=>{
    wsApp.clients.forEach((client) => {
        client.send(a);
    })
}, 40000)
