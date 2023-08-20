package backend

import (
	"fmt"
	"log"
	"net/http"
	"sync"
)

func NewManager() *Manager {
	man := &Manager{
		make(map[*Client]bool),
		sync.RWMutex{},
		make(map[string]EventHandler),
	}

	man.handlers["login"] = Login
	man.handlers["registration"] = Register
	man.handlers["requestUserProfil"] = SendProfilData
	man.handlers["SavePost"] = SavePost
	man.handlers["requestPosts"] = GetPosts
	man.handlers["requestUsers"] = GetUsers
	man.handlers["toggleFollower"] = ToggleFollower
	man.handlers["saveComment"] = SaveComment
	man.handlers["requestComments"] = GetComments
	man.handlers["saveMess"] = saveMess
	man.handlers["getConversation"] = getConversation
	man.handlers["newGroup"] = InitGroup
	man.handlers["requestGroup"] = printGroup
	return man
}

func (man *Manager) ServeWS(writer http.ResponseWriter, req *http.Request) {
	log.Println("new connection")
	// upgrade http into websocket
	websocketConn, err := websocketUpgrader.Upgrade(writer, req, nil)
	if err != nil {
		fmt.Println("ERR upgrading http connexion into websocket :", err.Error())
		return
	}

	newClient := NewClient(websocketConn, man)
	man.AddClient(newClient)

	// get posts

	go newClient.ReadMessages()
	go newClient.BroadCaster(writer, req)
}

func (manager *Manager) EventRouter(event Event, client *Client) {
	handler := manager.handlers[event.Type]
	if handler == nil {
		fmt.Println("Error routing the event :", event.Type, " event type is unknown")
		return
	}

	err := handler(event, client)
	if err == nil {
		return
	}

	// error handling
	fmt.Println(err)
	if err.Error() == "user must be connected" {
		client.SendFeedback("UserMustBeConnected", "")
	}
}
