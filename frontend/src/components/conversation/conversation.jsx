import React, { useEffect, useRef } from "react"
import "../conversation/conversation.css"
import { SendEvent } from '../../api/websockets'



export default function Conversation({ receiver, conversation }) {

    const ref = useRef("")
    function sendMess() {
        const mess = {
            receiver: receiver,
            content: ref.current.value
        }
        console.log("printing")
        SendEvent("saveMess", mess)
    }
    return (
        <React.Fragment>
            <div className="conversation-container">
                {
                    conversation && conversation.map((message, index) => (
                        <div className="msg">
                            <span className="pseudonyme" key={index}>{message.Sender}</span>
                            <span className="date" key={index}>{message.Date + " :"}</span>
                            <span key={index}>{message.Content}</span>

                        </div>
                    )

                    )

                }
                <div className="input">
                    <input className="input-chat" ref={ref} type="text" placeholder="type a message.." />
                    <button className="button-chat" onClick={sendMess}>Send</button>
                </div>
            </div>

        </React.Fragment>
    )
}