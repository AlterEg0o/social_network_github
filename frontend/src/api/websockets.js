let websocket = new WebSocket("ws://"+document.location.host+"/ws")
window.websocket = websocket
if (!window["WebSocket"]){
    alert("this browser doesn't support websockets :(")
}

class Message{
    constructor(type,payload){
        this.type = type
        this.payload = payload
    }
}

export function SendEvent(type, payload={}){
    const msg = JSON.stringify(new Message(type,payload))
    websocket.send(msg)
}

export function HandleWebsocket(callback){
    websocket.onopen = (event)=>{
        console.log("new websocket conn established :",event)
    }

    websocket.onclose = (event)=>{
        console.log("ws connection closed :",event)
    }

    websocket.onerror = (event)=>{
        console.log("ERROR websocket :",event)
    }

    websocket.onmessage = callback
}

