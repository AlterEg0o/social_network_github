package backend

import (
	"sync"

	"ws_config/backend/db"

	"github.com/gorilla/websocket"
)

var websocketUpgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type Event struct {
	Type    string      `json:"type"`
	Payload interface{} `json:"payload"`
}

type EventHandler func(event Event, client *Client) error

type Manager struct {
	clients      map[*Client]bool
	sync.RWMutex // allows to use Lock and Unlock methods
	handlers     map[string]EventHandler
}

type Client struct {
	username string
	conn     *websocket.Conn
	manager  *Manager
	msgFlow  chan Event // we use a channel in order to prevent concurrency
}

/// FORM STRUCTS ///

type LoginForm struct {
	Identifier string `json:"identifier"`
	Password   string `json:"password"`
}

type ProfilData struct {
	Data       db.User
	Followers  []string
	Followings []string
	Posts      []db.Post
}
