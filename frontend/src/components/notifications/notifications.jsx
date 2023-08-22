import { useEffect, useState } from 'react'
import '../notifications/notifications.css'
import { SendEvent } from '../../api/websockets'

export default function Notifications({notifs}){
    const [isVisible,setIsVisible] = useState(false)
    const [array, setArray] = useState(["hello","there"])

    function ToggleNotif(){
        setIsVisible(!isVisible)
        if (!isVisible){
            console.log("notifications in notif : ",notifs)
            SendEvent("requestNotif")
        }
    } 

    return(
        <div className='Notifications'>
            <button onClick={ToggleNotif}>Notifications</button>
            {isVisible && <div className='notif-box'>
                {notifs.length == 0 ? "you don't have any notifications" :
                notifs.map((notif,index) => (
                    <div>
                    <span key={index}>{notif.Desc}</span>
                    {notif.NotifType == "groupInvitation" ? (<div><button>Accept</button> <button>Decline</button></div>) : (<button>Ok</button>)}
                    </div>
            ))}
            </div>
            }
        </div>
    )
}