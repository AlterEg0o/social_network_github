import React, { useEffect,useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import {HandleWebsocket} from "./api/websockets.js";
import LoginForm from './pages/login_form/loginForm.jsx';
import RegisterForm from './pages/register_form/registerForm.jsx';
import Profil from './pages/profil/profil';
import NoPage from './pages/NoPage/noPage.jsx';
import Posts from './pages/posts/posts';
import Group from './pages/groups/groups';
import ChatPage from './pages/chatPage/chatPage';

export function App() {
  const [feedback, setFeedback] = useState('');
  const [user,setUser] = useState({});
  const [users,setUsers] = useState([]);
  const [posts,setPosts] = useState([]);
  const [comments,setComments] = useState([]);
  const [conversation, setConversation] = useState([])

  useEffect(() => {
    function HandleMessage(message) {
      let msg = JSON.parse(message.data)
      switch (msg.type) {
          case "loginOK": 
              setFeedback("Connexion_OK")
              break;

          case "loginFailed":
              setFeedback(msg.payload)
              break;

          case "RegistrationOK":
              setFeedback(msg.payload)
              break;

          case "profilData":
            setUser({...user,
              username: msg.payload.Username,
              fullname: msg.payload.Fullname,
              aboutMe:  msg.payload.AboutMe
            });
            break;

          case "posts":
            console.log("App posts : ",msg.payload)
            setPosts(msg.payload)
            break;

          case "comments":
            console.log("App comments : ",msg.payload)
            if (msg.payload){
              setComments(msg.payload)
            }
            break;
          case "chatUsers":
            console.log("chat users : ",msg.payload)
            setUsers(msg.payload)
            break;

            case "displayConversation": 
            setConversation(msg.payload)
            break;

          default:
              console.log("WARNING : unknown server message type !")
              break;
      }
    }

    HandleWebsocket(HandleMessage);

  },[]);


  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

          <Route 
            index
            element={<LoginForm feedback={feedback}/>}> 
          </Route>
          
          <Route 
            path='/login'
            element={<LoginForm feedback={feedback}/>}> 
          </Route>

          <Route 
            path='/register'
            element={<RegisterForm feedback={feedback}/>}>
          </Route>

          <Route
            path='/profil'
            element={<Profil user={user}/>}>
          </Route>

          <Route
            path='/posts'
            element={<Posts posts={posts} comments={comments}/>}>
          </Route>

          <Route
          path='/chat'
          element={<ChatPage conversation = {conversation} users={users}/>}>
          </Route>

          <Route 
          path='/groups'
          element={<Group users={users}></Group>}>
          </Route>

          <Route path="*" element={<NoPage/>}></Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
}
