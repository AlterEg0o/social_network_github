import { useEffect, useState, useRef } from 'react'
import { SendEvent } from '../../api/websockets'
import UserList from '../../components/userList/userList'
import '../groups/groups.css'
import UserChoice from '../../components/userChoice/userChoice'
import Header from '../../components/header/header'

export default function Group({ users }) {
    const [selectedUsers,SetSelectedUser] = useState([])
    const titleRef = useRef("")

    function GetUsers(newUser){
        SetSelectedUser([...selectedUsers,newUser])
    }

    useEffect(() => {
        console.log(users)
        if (users.length == 0) {
            SendEvent("requestUsers")

        }
    }, [])

    function CreateGroup(){
        const group = {
            title : titleRef.current.value,
            selectedUsers : selectedUsers
        }
        console.log("creating group : ",group)
        SendEvent("newGroup",group)
        SetSelectedUser([])
    }

    return (

        <div>
            <Header />
            <span>Type the name of group..</span>
            <input ref={titleRef} type="text" placeholder="name of group..." />

            <span>Please add participants</span>
            <UserChoice users={users} onUserChange={GetUsers}/>
            <button onClick={CreateGroup}>Create a group</button>
        </div>

    )

}