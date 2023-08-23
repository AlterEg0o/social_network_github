import './posts.css'
import Header from '../../components/header/header'
import SubmitPost from '../../components/submitPost/submitPost'
import UserPost from '../../components/userPost/userPosts'
import { useEffect } from 'react'
import {SendEvent} from '../../api/websockets.js'

export default function Posts({posts,comments,notifs}){
    useEffect(()=>{
    })

    return (
    <div className='wrapper'>
        <Header notifs={notifs}/>
        <SubmitPost/>
        {(
            <ul className="posts">
                {posts && posts.map((post, index) => (
                    <li key={index}>
                        <UserPost post={post} comments={comments} />
                    </li>
                ))}
            </ul>
        )}
    </div>)
}