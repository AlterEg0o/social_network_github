import '../commentForm/commentForm.css'
import {SendEvent} from '../../api/websockets.js'
import { useRef, useState } from 'react'

export default function CommentForm({postId}){
    const ref = useRef()
    const [btnEnabled, SetBtnEnabled] = useState(false)

    function HandleClick(){
        let comment = {
            postId : postId,
            content : ref.current.value
        }
        console.log("new comment : " , comment)
        SendEvent("saveComment",comment)
    }

    function HandleChange(event){
        if (event.target.value.length == 0){
            SetBtnEnabled(false)
        }else{
            SetBtnEnabled(true)
        }
    }

    return (
        <div className='commentForm'>
            <input ref={ref} onChange={HandleChange} type="text" id="comment-input" placeholder='tell us what you think ...'/>
            <button onClick={HandleClick} disabled={!btnEnabled}>Send</button>
        </div>
    )
}