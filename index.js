const express = require('express')
const WebSocket = require('ws').Server

const PORT = process.env.PORT || 3000;

const server = express()
    .use(express.static(process.cwd() + '/views'))
    .use(express.static(process.cwd() + '/scripts'))
    .get('/', (req, res)=> {
        res.sendFile(process.cwd() + '/views/body.html')
    })
    .get('/connect', (req, res)=> {

    })
    .listen(PORT, () => console.log('Listening on ' + 'PORT ' + PORT + 
        "\nTo check your local IP Address please type ipconfig(Windows) or ifconfig(Linux, Mac) command in your terminal"));
var clientList = {}

const wsApp = new WebSocket({server})
wsApp.on('connection', ws=> {
    ws.id = Number(Math.random().toString() + Date.now()).toString(16).substr(2)
    console.log(new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'}) + ' Connection: ' + wsApp.clients.size)

    ws.on('message', (res)=> {
        res = JSON.parse(res)

        switch(res.command){
            case "regular":
                break
            case "connect":
                ws.name = res.name 
                clientList[ws.id] = ws
                let time = new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei', hour: "2-digit", minute: "2-digit"});

                ws.send(JSON.stringify({command: 'id', id: ws.id}))
                wsApp.clients.forEach((client) => {
                    client.send(JSON.stringify({command: "enter", time: time, name: "BOT", num: wsApp.clients.size, msg: ws.name + "君 進入聊天室"}));
                })
                break
            case "message":
                res.name = clientList[res.id].name
                let id = res.id
                delete res.id

                res.isAuthor = 0
                let data_for_others = JSON.stringify(res)
                res.isAuthor = 1
                let data_for_author = JSON.stringify(res)

                wsApp.clients.forEach((client) => {
                    if(id == client.id){
                        client.send(data_for_author)
                    }
                    else{
                        client.send(data_for_others)
                    }
                })
                console.log(new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei'}) + '-> ' + res.name +': ' + res.msg)
                break
        }
    })

    ws.on('close', (e)=> {
        delete clientList.ws
        let time = new Date().toLocaleString('zh-TW', {timeZone: 'Asia/Taipei', hour: "2-digit", minute: "2-digit"});
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
