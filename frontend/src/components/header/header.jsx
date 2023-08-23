import './header.css'
import { Link } from 'react-router-dom'
import Notifications from '../notifications/notifications.jsx'
import { SendEvent } from '../../api/websockets'


export default function Header({notifs}){
    return <div className='header'>
        <Link to="/profil">Profil</Link>
        <Link to="/posts" onClick={() => SendEvent("requestPosts")}>Posts</Link>
        <Link to="/groups">Groups</Link>
        <Link to="/chat">Chat</Link>
        <Notifications notifs={notifs}/>
        <a onClick={()=>window.location.href = "/"} className='disconnect'>Disconnect</a>
    </div>
}