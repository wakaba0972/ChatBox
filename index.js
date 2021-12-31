const ip = require("ip");
const express = require('express')
const WebSocket = require('ws').Server

const PORT = process.env.PORT || 3000;

const server = express()
    .use(express.static('public'))
    .get('/', (req, res)=> {
        res.sendFile(__dirname + '/body.html')
    })
    .get('/connect', (req, res)=> {

    })
    .listen(PORT, () => console.log('Listening on ' + ip.address() + ':' + PORT));
    

const wsApp = new WebSocket({server})

wsApp.on('connection', ws=> {
    console.log(new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'}) + ' Connection: ' + wsApp.clients.size)

    ws.on('message', (res)=> {
        res = JSON.parse(res)

        switch(res.command){
            case "regular":
                break
            case "connect":
                ws.name = res.name
                let date = new Date()
                let time = date.getHours()+'時'+date.getMinutes()+'分 '
                wsApp.clients.forEach((client) => {
                    client.send(JSON.stringify({command: "connection", time: time, name: "BOT", num: wsApp.clients.size, msg: ws.name + "君 進入聊天室"}));
                })
                break
            case "message":
                let data = JSON.stringify(res)
                wsApp.clients.forEach((client) => {
                    client.send(data);
                })
                console.log(new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'}) + ' ' + res.name +': ' + res.msg)
                break
        }
    })

    ws.on('close', (e)=> {
        let date = new Date()
        let time = date.getHours()+'時'+date.getMinutes()+'分 '
        wsApp.clients.forEach((client) => {
            client.send(JSON.stringify({command: "connection", time: time, name: "BOT", num: wsApp.clients.size, msg: ws.name + "君 離開聊天室"}))
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
