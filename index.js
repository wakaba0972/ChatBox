const express = require('express')
const WebSocket = require('ws').Server

const PORT = process.env.PORT || 3000;

const server = express()
    .get('/', (req, res)=> {
        res.sendFile(__dirname + '/body.html')
    })
    .get('/opCheck', (req, res)=> {
        if(req.query.pass == 'hnjnknln0') res.end('1')
        else res.end('0')
    })
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
    

const wsApp = new WebSocket({server})

wsApp.on('connection', ws=> {
    console.log(new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'}) + ' Connection: ' + wsApp.clients.size)
    
    wsApp.clients.forEach((client) => {
        client.send(JSON.stringify({command: "connect", nums: wsApp.clients.size}));
    })

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
                console.log(new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'}) + ' ' + res.name +': ' + res.msg)
        }
    })

    ws.on('close', (e)=> {
        wsApp.clients.forEach((client) => {
            client.send(JSON.stringify({command: "connect", nums: wsApp.clients.size}));
        })
        console.log(new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'}) + ' Connection: ' + wsApp.clients.size)
    })
})

var a = JSON.stringify({command: "regular"})
setInterval(()=>{
    wsApp.clients.forEach((client) => {
        client.send(a);
    })
}, 40000)
