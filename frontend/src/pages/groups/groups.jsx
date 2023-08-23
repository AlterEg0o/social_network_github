import { useEffect, useState, useRef } from 'react'
import { SendEvent } from '../../api/websockets'
import UserList from '../../components/userList/userList'
import '../groups/groups.css'
import UserChoice from '../../components/userChoice/userChoice'
import Header from '../../components/header/header'
import Group from '../../components/group/group.jsx'

export default function Groups({ users, groupCreation ,notifs,currentUser,groupData}) {
    const [selectedUsers, SetSelectedUser] = useState([])
    const titleRef = useRef("")
    const [selectedGroup,setSelectedGroup] = useState(null)

    function GetUsers(newUser) {
        SetSelectedUser([...selectedUsers, newUser])
    }

    useEffect(() => {
        console.log("the current user is : ",currentUser)
        if (users.length == 0) {
            SendEvent("requestUsers")
        }
        SendEvent("requestGroup")
    }, [])

    function CreateGroup() {
        const group = {
            title: titleRef.current.value,
            selectedUsers: selectedUsers
        }
        console.log("creating group : ", group)
        SendEvent("newGroup", group)
        SetSelectedUser([])
    }

    function PrintConvGroups() {
        console.log("lol")
    }

    function SelectGroup(group, index){
        //SendEvent("requestGroupAccess",group.Title)
        setSelectedGroup(index)
    }

    return (

        <div className="groups-container">

            <div>
                <Header notifs={notifs}/>
                <span>Type the name of group..</span>
                <input ref={titleRef} type="text" placeholder="name of group..." />

                <span>Please add participants</span>
                <UserChoice users={users} onUserChange={GetUsers} />
                <button onClick={CreateGroup}>Create a group</button>
            </div>
            {
                groupCreation && groupCreation.map((message, index) => (
                    <div className="msg" onClick={()=> SelectGroup(message,index)}>
                        <span onClick={PrintConvGroups} className="title-groups" key={index}>{message.Title}</span>
                        <br />
                        {Object.keys(message.Username).map((key, usernameIndex) => (
                            <>
                                <span key={usernameIndex}>{key}</span>
                                <span style={message.Username[key] ? { color: "green" } : { color: "red" }} key={usernameIndex}>{message.Username[key] ? " Accepted" : " Not accepted"}</span>
                                <br/>
                            </>
                        ))}

                        {index == selectedGroup && (message.Username[currentUser] ? 
                            <Group groupId={message.Id} data={groupData}/> :
                            <span>Sorry, you're not allowed to access this group :(</span>
                        )}
                    </div>
                )
                )
            }
        </div>
    )
}