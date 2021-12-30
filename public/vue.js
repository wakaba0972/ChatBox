
var v = new Vue({
    el: '#app',
    created() {
        if(localStorage.getItem('name') == null){
            let name = prompt('請輸入ID')
            localStorage.setItem('name', name)
            this.name = name
        }
        else{
            this.name = localStorage.getItem('name')
        }
        window.addEventListener('keypress', (key) => {
            if(key.which == 13){
                this.send()
            }
        });
    },
    data: {
        text: "送出",
        name: "",
        msg: ""
    },
    methods: {
        send: function(){
            if(this.msg.search('228922') != -1){
                this.text = '委任你是不是沒被扁過'
                this.msg = ""
            }
            if(this.msg && !this.msg.match(/^\s+$/)){
                let date = new Date()
                let time = date.getHours()+'時'+date.getMinutes()+'分 '

                ws.send(JSON.stringify({command: "message", time: time, name: this.name, msg: this.msg}))
                this.msg = ""
            }
        }
    },
})