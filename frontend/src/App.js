import React, { useEffect,useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import {HandleWebsocket} from "./api/websockets.js";
import LoginForm from './pages/login_form/loginForm.jsx';
import RegisterForm from './pages/register_form/registerForm.jsx';
import Profil from './pages/profil/profil';
import NoPage from './pages/NoPage/noPage.jsx';
import Posts from './pages/posts/posts';
import ChatPage from './pages/chatPage/chatPage';
import Groups from './pages/groups/groups';

export function App() {
  const [feedback, setFeedback] = useState('');
  const [user,setUser] = useState({});
  const [users,setUsers] = useState([]);
  const [posts,setPosts] = useState([]);
  const [comments,setComments] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [groups, setGroup] = useState([])
  const [notifs, setNotifs] = useState([])
  const [groupData, setGroupData] = useState({})

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
            console.log("profil data : ",msg.payload)

            const userData = msg.payload.Data
            setUser({...user,
              username: userData.Username,
              fullname: userData.Fullname,
              aboutMe:  userData.AboutMe
            });

            setFollowers(msg.payload.Followers)
            setFollowings(msg.payload.Followings)
            setPosts(msg.payload.Posts)
            break;

          case "posts":
            console.log("posts : ",msg.payload)
            setPosts(msg.payload)
            break;

          case "comments":
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
              
            case "printGroup":
              console.log("groups : ",msg.payload)
              setGroup(msg.payload)
              break;

              // case "displayGgroups={groups}roup":
              //   console.log("lol")
              //   setGroup(msg.payload)
              //   break;

              case "notifs":
                setNotifs(msg.payload)
                break;
              case "groupData":
                const groupData = msg.payload

                console.log("groupData : ",msg.payload)

                setGroupData({...groupData,
                  Group : groupData.Group,
                  Posts : groupData.Posts
                });

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
            element={<Profil user={user} followers={followers} followings={followings} posts={posts} comments={comments} notifs={notifs}/>}>
          </Route>

          <Route
            path='/posts'
            element={<Posts posts={posts} comments={comments} notifs={notifs}/>}>
          </Route>

          <Route
          path='/chat'
          element={<ChatPage users={users} conversation={conversation} notifs={notifs}/>}>
          </Route>

          <Route
            path="/groups"
            element={<Groups users={users} groupCreation={groups} notifs={notifs} currentUser={user.username} groupData={groupData}/>}>
          </Route>

          <Route path="*" element={<NoPage/>}></Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
}
