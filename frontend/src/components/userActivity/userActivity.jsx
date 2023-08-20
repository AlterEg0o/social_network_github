import { useEffect } from 'react'
import './userActivity.css'
import Posts from '../../pages/posts/posts'
import UserPost from '../userPost/userPosts'

export default function UserActivity({posts,comments}){
    useEffect(()=>{
        console.log("userActivity : ",posts,comments)
    })

    return <div className='userActivity block'>
        <h2>Activity</h2>
        {posts.map((post, index) => (
            <UserPost post={post} comments={comments} key={index}/>
        ))}
    </div>
}