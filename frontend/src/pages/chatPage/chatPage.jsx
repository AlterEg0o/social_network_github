import '../chatPage/chatPage.css'
import UserList from '../../components/userList/userList.jsx'
import Conversation from '../../components/conversation/conversation'
import { useEffect, useState } from 'react'
import { SendEvent } from '../../api/websockets'
import Header from '../../components/header/header'

export default function ChatPage({users, conversation}){
    const [selectedUser,SetselectedUser] = useState(null)

    console.log(" conversation is" ,conversation)

    function getUser(newUser) {
        SetselectedUser(newUser)
    }

    useEffect(()=>{
        if (users.length == 0){
            SendEvent("requestUsers")
        }
    },[])

    return (
        <div className='chatPage'>
            <Header/>
            <UserList onUserChange = {getUser} title="users" list={users}/>
            {selectedUser && <Conversation conversation = {conversation} receiver={selectedUser}/>}
        </div>
    )
}