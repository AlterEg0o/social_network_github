package backend

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

const (
	PongWaitingTime = 60 * time.Second
	PingFrame       = PongWaitingTime * 9 / 10 // 90% of the pong waiting time
)

var CAN_WRITE_MESSAGE = true

var (
	CONNECT    = make(chan string)
	DISCONNECT = make(chan string)
)

func NewClient(connection *websocket.Conn, manager *Manager) *Client {
	return &Client{
		conn:    connection,
		manager: manager,
		msgFlow: make(chan Event),
	}
}

func (manager *Manager) AddClient(client *Client) {
	manager.Lock()
	defer manager.Unlock()

	manager.clients[client] = true
}

func (manager *Manager) KickClient(client *Client) {
	manager.Lock()
	defer manager.Unlock()

	clientExists := manager.clients[client]
	if !clientExists {
		return
	}

	client.conn.Close()
	delete(manager.clients, client)
}

func (client *Client) ReadMessages() {
	defer func() {
		client.manager.KickClient(client)
	}()

	client.conn.SetReadLimit(1024)

	// checking for pong response
	// if err := client.conn.SetReadDeadline(time.Now().Add(PongWaitingTime)); err != nil {
	// 	fmt.Println(err.Error())
	// 	return
	// }
	// client.conn.SetPongHandler(client.ResetDeadLine)

	// read message and send it to the EventRouter
	for {
		_, payload, err := client.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				fmt.Println("error reading message :", err.Error())
			}
			break
		}

		var event Event

		err = json.Unmarshal(payload, &event)
		fmt.Println("event after unmarshal :", event)

		if err != nil {
			fmt.Println("error unmarshalling :", err.Error())
		}

		client.manager.EventRouter(event, client)
	}
}

// this broadcaster is used to write messages, handle ping/pong messages
func (client *Client) BroadCaster(writer http.ResponseWriter, req *http.Request) {
	defer func() {
		client.manager.KickClient(client)
	}()

	CAN_WRITE_MESSAGE = true
	ticker := time.NewTicker(PingFrame)

	for CAN_WRITE_MESSAGE {
		select {
		case message, channelIsOpen := <-client.msgFlow:
			client.WriteMessage(message, channelIsOpen)
		case <-ticker.C:
			err := client.conn.WriteMessage(websocket.PingMessage, nil)
			if err != nil {
				fmt.Println("ERROR sending ping:", err.Error())
				CAN_WRITE_MESSAGE = false
			}
			// case username := <-CONNECT:
			// 	SetSessionCookie(writer, req, username)
			// case <-DISCONNECT:
			// 	DeleteCookies(writer)
		}
	}
}

func (client *Client) WriteMessage(message Event, channelIsOpen bool) {
	if !channelIsOpen {
		err := client.conn.WriteMessage(websocket.CloseMessage, nil)
		if err != nil {
			fmt.Println("ERROR connection might be closed :", err.Error())
		}
		CAN_WRITE_MESSAGE = false
		return
	}

	data, err := json.Marshal(message)
	if err != nil {
		fmt.Println("error marshalling the event:", err.Error())
	}

	err = client.conn.WriteMessage(websocket.TextMessage, data)
	if err != nil {
		fmt.Println("message cannot be sent :", err.Error())
	}
}

func (c *Client) ResetDeadLine(appData string) error {
	return c.conn.SetReadDeadline(time.Now().Add(PongWaitingTime))
}

func (client *Client) SendFeedback(feedbackType string, arg interface{}) {
	client.msgFlow <- Event{
		Type:    feedbackType,
		Payload: arg,
	}
}
