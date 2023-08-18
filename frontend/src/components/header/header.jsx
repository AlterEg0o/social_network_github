import './header.css'
import { Link } from 'react-router-dom'
import Notifications from '../notifications/notifications.jsx'


export default function Header(props){
    return <div className='header'>
        <Link to="/profil">Profil</Link>
        <Link to="/posts">Posts</Link>
        <Link to="/groups">Groups</Link>
        <Link to="/chat">Chat</Link>
        <Notifications/>
        <a onClick={()=>window.location.href = "/"} className='disconnect'>Disconnect</a>
    </div>
}