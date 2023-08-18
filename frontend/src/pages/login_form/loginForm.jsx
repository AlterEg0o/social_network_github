import React from "react";
import './loginForm.css';
import {SendEvent} from "../../api/websockets.js";
import { Link ,useNavigate} from "react-router-dom";
import { useEffect } from "react";

export default function LoginForm(props){
    const navigate = useNavigate()

    function CheckLogin(){
        console.log("checking login")
        let loginForm = {
            identifier : usernameInput.current.value,
            password : passwordInput.current.value
        }
        SendEvent("login",loginForm) 
    }

    const usernameInput = React.useRef()
    const passwordInput = React.useRef()

    useEffect(() => {
        if (props.feedback == 'Connexion_OK') {
            console.log("redirecting to profil page")
          navigate('/profil')
        }
      }, [props.feedback]);
    
    return <div className="login-form">
        <input ref={usernameInput} type="text" placeholder="username or email"/>
        <input ref={passwordInput} type="password" placeholder="password"/>

        <button onClick={CheckLogin}>login</button>
    
        <span>don't have an account ? Create one !</span>
        <Link to="/register">Register</Link>

        <div>{props.feedback}</div>

    </div>
}