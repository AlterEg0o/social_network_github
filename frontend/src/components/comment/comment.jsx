import '../comment/comment.css'

export default function Comment({comment}){
    return (
        <div className='comment-wrapper'>
            <div className='author'>
                <span>written by : {comment.Author}</span>
                <img src="https://i.redd.it/imrpoved-steam-default-avatar-v0-ffxjnceu7vf81.png?s=945a316066a6e2d6a3623690d5a696a4063bd851" alt="avatar de l'auteur du post" height="50px" width="50px"/>
            </div>
            <p>{comment.Content}</p>
        </div>
    )
}