import React from "react";
import "./registerForm.css"
import { Link } from "react-router-dom";
import { SendEvent } from "../../api/websockets";

export default function RegisterForm(props){
    let email = React.useRef()
    let firstname = React.useRef()
    let lastname = React.useRef()
    let dateOfBirth = React.useRef()
    let password = React.useRef()
    let nickname = React.useRef()
    let aboutMe = React.useRef()

    function TryRegister(){
        let form = {
            email : email.current.value,
            firstname :firstname.current.value,
            lastname : lastname.current.value,
            dateOfBirth : dateOfBirth.current.value,
            password : password.current.value,
            nickname : nickname.current.value,
            aboutMe : aboutMe.current.value,
        }

        SendEvent("registration", form)
    }


    return (
    <div className="register-form">
        <input type="text" ref={email} placeholder="email"/>
        <input type="text" ref={firstname} placeholder="first name"/>
        <input type="text" ref={lastname} placeholder="last name"/>
        <input type="text" ref={dateOfBirth} placeholder="date of birth(DD/MM/YYYY)"/>
        <input type="password" ref={password} placeholder="password"/>
        <input type="text" ref={nickname} placeholder="nickname"/>
        <input type="text" ref={aboutMe} placeholder="about me"/>

        <button onClick={TryRegister}>Register</button>

        <span> Already have an account ? login here !</span>
        <Link to="/login">Login</Link>

        <span>{props.feedback}</span>
    </div>)
}