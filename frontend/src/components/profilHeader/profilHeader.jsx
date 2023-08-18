import './profilHeader.css'

export default function ProfilHeader(props){
    return <div className='profilHeader block'>
        <img src="https://i.redd.it/imrpoved-steam-default-avatar-v0-ffxjnceu7vf81.png?s=945a316066a6e2d6a3623690d5a696a4063bd851" alt="Avatar" height="100px" width="100px"/>   
        <div className='profilInfo'>
            <h3 className='nickname'>{props.user.username}</h3>
            <span>{props.user.fullname}</span>
            <input type="checkbox" name="privacy-checkbox" id="privacy-checkbox"/>
            <label htmlFor="privacy-checkbox"></label>
        </div>

        <div>
            <h4>About Me</h4>
            <p>{props.user.aboutMe}</p>
        </div>
    </div>
}