import { useEffect, useState } from 'react'
import '../notifications/notifications.css'
import { SendEvent } from '../../api/websockets'

export default function Notifications({notifs}){
    const [isVisible,setIsVisible] = useState(false)

    function ToggleNotif(){
        setIsVisible(!isVisible)
        if (!isVisible){
            console.log("notifications in notif : ",notifs)
            SendEvent("requestNotif")
        }
    } 

    function ClearNotif(notif,state){
        const group = notif.NotifType == "groupInvitation" ?
        //notif.Desc.split(`"`)[1] : null
        "ca marche la ou pas ?" : null

            SendEvent("notifChecked",{
                id : notif.Id,
                notifType : notif.NotifType,
                state : state,
                group : group
            })
    }

    return(
        <div className='Notifications'>
            <button onClick={ToggleNotif} className='button-rgb'>Notifications</button>
            {isVisible && <div className='notif-box'>
                {notifs && notifs.length == 0 ? "you don't have any notifications" :
                notifs.map((notif,index) => (
                    <div>
                        <span key={index}>{notif.Desc}</span>

                        {notif.NotifType == "groupInvitation" ?
                        (<div>
                            <button onClick={()=>ClearNotif(notif,"Accepted")}>Accept</button> 
                            <button onClick={()=>ClearNotif(notif,"Declined")}>Decline</button>
                        </div>) :
                        notif.NotifType == "groupRequest" ?
                        (<div>
                            <button onClick={()=>ClearNotif(notif,"Accepted")}>Accept</button> 
                            <button onClick={()=>ClearNotif(notif,"Declined")}>Decline</button>
                        </div>) :
                        <button onClick={()=>ClearNotif(notif,"Checked")}>Ok</button>}
                    </div>
            ))}
            </div>
            }
        </div>
    )
}