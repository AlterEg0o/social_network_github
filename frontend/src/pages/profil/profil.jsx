import '../profil/profil.css';
import Header from '../../components/header/header';
import ProfilHeader from '../../components/profilHeader/profilHeader';
import UserActivity from '../../components/userActivity/userActivity';
import UserList from '../../components/userList/userList';
import { useEffect } from 'react';
import { SendEvent } from '../../api/websockets.js';

export default function Profil({user,followers,followings}){
    useEffect(()=>{
        console.log("userData", followers, followings)
        SendEvent("requestUserProfil")
    },[])

    return (
    <div className="profil">
        <Header></Header>
        <ProfilHeader user={user}></ProfilHeader>
        <div className='activity-and-followers'>
            <UserActivity/>
            <div>
                <UserList title="followers" list={followers}/>
                <UserList title="following" list={followings}/>
            </div>
        </div>
    </div>)
}