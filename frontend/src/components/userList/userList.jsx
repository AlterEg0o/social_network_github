import { useRef, useState } from 'react'
import './userList.css'
import { SendEvent } from '../../api/websockets.js'

export default function UserList({ list, title, onUserChange }) {
    const [selectedUser, SetSelectedUser] = useState(null)
    const [showConversation, setShowConversation] = useState(false);
    const [messageInput, setMessageInput] = useState('');

    function ToggleFollow() {
        console.log("you're now following ", selectedUser)
        SendEvent("toggleFollower", selectedUser)
    }

    function HandleUserClick(event) {
        const user = event.target.textContent
        SetSelectedUser(user)
        onUserChange(user)
        console.log("sending conv request ...",user)
        SendEvent("getConversation",user)
    }


    return <div className='userList block'>
        <h2>{title}</h2>
        {(
            <ul>
                {list.map((user, index) => (
                    <li className='user' key={index} >   
                        <span onClick={HandleUserClick}>{user.Username}</span>

                        {selectedUser == user.Username &&

                            <button
                                className='followButton'
                                onClick={ToggleFollow}>
                                {user.IsFollowed ? 'unfollow' : 'follow'}
                            </button>
                        }

                        {(selectedUser == user.Username && !user.isPrivate) &&
                            <div>
                                <button onClick={() => setShowConversation(true)}>
                                    See user profile
                                </button>
                            </div>
                        }
                    </li>
                ))}
            </ul>
        )}
    </div>
}