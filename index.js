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
    console.log(new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'}) + '\nNow Connection: ' + wsApp.clients.size + '\n')

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
                console.log(new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'}) + '\n' + res.name +': ' + res.msg + '\n')
        }
    })

    ws.on('close', (e)=> {
        console.log(new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'}) + '\n Now Connection: ' + wsApp.clients.size + '\n')
    })
})

var a = JSON.stringify({command: "regular"})
setInterval(()=>{
    wsApp.clients.forEach((client) => {
        client.send(a);
    })
}, 40000)
