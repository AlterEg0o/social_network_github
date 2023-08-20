import '../profil/profil.css';
import Header from '../../components/header/header';
import ProfilHeader from '../../components/profilHeader/profilHeader';
import UserActivity from '../../components/userActivity/userActivity';
import { useEffect } from 'react';
import { SendEvent } from '../../api/websockets.js';

export default function Profil({user,followers,followings,posts,comments}){
    useEffect(()=>{
        SendEvent("requestUserProfil")
    },[])

    return (
    <div className="profil">
        <Header></Header>
        <ProfilHeader user={user}></ProfilHeader>
        <div className='activity-and-followers'>
            <UserActivity posts={posts} comments={comments}/>

            <div>
                <div className='col profil-follow'>
                    <h2>followers</h2>
                    {followers && followers.map((follower,index) => (
                        <span index={index}>{follower}</span>
                    ))}
                </div>

                <div className='col profil-follow'>
                    <h2>followings</h2>
                    {followings && followers.map((follower,index) => (
                        <span key={index}>{follower}</span>
                    ))}
                </div>
            </div>

        </div>
    </div>)
}