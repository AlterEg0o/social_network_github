import { useEffect, useState } from 'react'
import '../group/group.css'
import { SendEvent } from '../../api/websockets'
import SubmitPost from '../submitPost/submitPost'
import UserPost from '../userPost/userPosts'

export default function Group({groupId,data}){
    const OptionEnum = {
        post : "post",
        event : "event"
    }
    const [option,setOptions] = useState(OptionEnum.post)

    useEffect(()=>{
        SendEvent("requestGroupData",groupId)
    },[])

    function HandlePostClick(){
        setOptions(OptionEnum.post)
    }

    function HandleEventClick(){
        setOptions(OptionEnum.event)
    }

    return (
        <div className='Group'>
            <button 
                id="posts" 
                className={option==OptionEnum.post ? "on":"off"} 
                onClick={HandlePostClick}>
                Posts
            </button>
            <button 
                id="events" 
                className={option==OptionEnum.event ? "on":"off"} 
                onClick={HandleEventClick}>
                Events
            </button>

            {option == OptionEnum.post ? 
                <div>        
                    <SubmitPost groupId={groupId}/>
                    <ul className="posts">
                        {data.Posts && data.Posts.map((post, index) => (
                            <li key={index}>
                                <UserPost post={post} />
                            </li>
                        ))}
                    </ul>
                </div>
            : 
                <span>Events</span>
            }
        </div>
    )
}