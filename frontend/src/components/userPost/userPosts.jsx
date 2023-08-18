import { useEffect, useState } from "react"
import "./userPosts.css"
import Comment from "../comment/comment";
import CommentForm from "../commentForm/commentForm";
import { SendEvent } from "../../api/websockets";

export default function UserPost({post,comments}){
    useEffect(()=>{
        console.log()
    })

    const [commentsIsExtended, setCommentsIsExtended] = useState(false);

    function ToggleComments(){
        if (!commentsIsExtended){
            SendEvent("requestComments",post.Id)
        }
        setCommentsIsExtended(!commentsIsExtended)
        
    }

    return (
        <div className="userPost">
            <div className="post">
                <span className="title">{post.Title}</span>
                <div className="post-author">
                    <span>{post.Author}</span>
                    <img src="https://i.redd.it/imrpoved-steam-default-avatar-v0-ffxjnceu7vf81.png?s=945a316066a6e2d6a3623690d5a696a4063bd851" alt="avatar de l'auteur du post" height="100px" width="100px"/>
                </div>
                <p>{post.Content}</p>
            </div>

            <div className="comments">
                <button onClick={ToggleComments}>Toggle comments</button>
                {commentsIsExtended && (
                <div>
                    <CommentForm postId={post.Id}/>
                    <ul>
                    {comments.map((comment, index) => (
                        <li key={index}>
                        <Comment comment={comment} />
                        </li>
                    ))}
                    </ul>
                </div>
                )}
            </div>
        </div>
    )
}