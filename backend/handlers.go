package backend

import (
	"errors"
	"fmt"
	"strconv"
	"strings"

	"ws_config/backend/db"
)

func Login(event Event, client *Client) error {
	data, ok := event.Payload.(map[string]interface{})
	if !ok {
		return errors.New("bad format")
	}

	identifier := data["identifier"].(string)
	password := data["password"].(string)
	connexionMode := "username" // user can either log using his username OR email

	if identifier == "" || password == "" {
		client.SendFeedback("loginFailed", "empty field")
		return errors.New("user is trying to log in without giving an identifier/passsword")
	}

	if strings.ContainsRune(identifier, '@') {
		connexionMode = "email"
	}

	err := db.CheckPassword(identifier, password, connexionMode)
	if err != nil {
		if err.Error() == "wrong password" {
			client.SendFeedback("loginFailed", "sorry, this password isn't right")
		} else {
			client.SendFeedback("loginFailed", "sorry, we couldn't find an account with that "+connexionMode)
		}
		return err
	}

	// if someone is already connected, disconnect this guy first
	// if IsConnected(client) {
	// 	Disconnect(Event{}, client)
	// }

	// db.ConnectUser(identifier, connexionMode)
	if connexionMode == "username" {
		client.username = identifier
	} else {
		client.username = db.GetUsernameByEmail(identifier)
	}

	client.SendFeedback("loginOK", client.username)

	fmt.Println(client.username, " is connected !")
	return nil
}

func Register(event Event, client *Client) error {
	data, ok := event.Payload.(map[string]interface{})
	if !ok {
		return errors.New("bad format")
	}

	form := db.RegisterForm{
		Firstname:   data["firstname"].(string),
		Lastname:    data["lastname"].(string),
		DateOfBirth: data["dateOfBirth"].(string),
		Email:       data["email"].(string),
		Password:    data["password"].(string),
		Username:    data["nickname"].(string),
		AboutMe:     data["aboutMe"].(string),
	}

	// TO DO (optional): check form values validity (password length, valid email ...)
	if db.UsernameAlreadyExists(form.Username) {
		return errors.New("trying to register but username already exists")
	}

	db.Register(form)
	client.SendFeedback("registrationOK", "registered successfully")
	return nil
}

func SendProfilData(event Event, client *Client) error {
	data := db.GetProfilData(client.username)

	database := db.OpenDB()
	followers := db.GetFollowers(database, client.username)
	database.Close()

	following := db.GetFollowing(client.username)

	userPost := []db.Post{}
	for _, post := range db.GetPosts(client.username){
		if post.Author == client.username{
			userPost = append(userPost, post)
		}
	}
	
	client.SendFeedback("profilData", ProfilData{
		Data:       data,
		Followers:  followers,
		Followings: following,
		Posts:      userPost,
	})

	return nil
}

/////////////// POSTS ////////////////

func SavePost(event Event, client *Client) error {
	data, ok := event.Payload.(map[string]interface{})
	if !ok {
		return errors.New("bad format")
	}

	privacy, _ := strconv.Atoi(data["privacy"].(string))
	post := db.Post{
		Title:   data["title"].(string),
		Content: data["content"].(string),
		Author:  client.username,
		Privacy: privacy,
		Image:   data["image"].(string),
	}

	if post.Content == "" || post.Title == "" {
		return errors.New("sharing a post but it is empty or title is missing")
	}

	db.SavePost(post)
	// client.SendFeedback("displayPost", post)

	return nil
}

func GetPosts(event Event, client *Client) error {
	posts := db.GetPosts(client.username)
	client.SendFeedback("posts", posts)
	return nil
}

func GetComments(event Event, client *Client) error {
	postId, ok := event.Payload.(float64)
	if !ok {
		return errors.New("bad format")
	}
	comments := db.GetComments(int(postId))
	fmt.Println("comments :", comments)
	client.SendFeedback("comments", comments)

	return nil
}

func SaveComment(event Event, client *Client) error {
	data, ok := event.Payload.(map[string]interface{})
	if !ok {
		return errors.New("bad format")
	}
	postId := data["postId"].(float64)
	content := data["content"].(string)

	db.SaveComment(client.username, content, int(postId))
	return nil
}

// ////////////// CHAT /////////////////
func GetUsers(event Event, client *Client) error {
	users := db.GetUsers(client.username)

	client.SendFeedback("chatUsers", users)

	return nil
}

func ToggleFollower(event Event, client *Client) error {
	following := event.Payload.(string)
	db.ToggleFollower(client.username, following)
	return nil
}

func saveMess(event Event, client *Client) error {
	data, ok := event.Payload.(map[string]interface{})
	if !ok {
		return errors.New("bad format")
	}
	fmt.Println(data)

	content := data["content"].(string)
	receiver := data["receiver"].(string)

	db.SaveMessage(client.username, receiver, content)

	return nil
}

func getConversation(event Event, client *Client) error {
	receiver, ok := event.Payload.(string)
	if !ok {
		fmt.Println("error conversation : bad request")
		return errors.New("error conversation : bad request")
	}

	conversation := db.GetConversation(client.username, receiver)
	client.SendFeedback("displayConversation", conversation)

	return nil
}

func InitGroup(event Event, client *Client) error {
	groupInformation, ok := event.Payload.(map[string]interface{})

	if !ok {
		fmt.Println("c'est pas ok dans le groupe")
		return errors.Unwrap(nil)
	}

	participantsInterface := groupInformation["selectedUsers"].([]interface{})
	participants := []string{}
	for _, p := range participantsInterface {
		participant := p.(string)
		participants = append(participants, participant)
	}
	participants = append(participants, client.username) // Aj
	title := groupInformation["title"].(string)

	db.InitGroupDB(client.username, participants, title)

	fmt.Println("groups: ", participants)

	client.SendFeedback("displayGroup", participants)

	return nil
}

func printGroup(event Event, client *Client) error {
	current_user := client.username
	fmt.Println(event.Type)

	allGroup := db.GetAllGroups(current_user)

	fmt.Println(allGroup)
	// test := []string{}
	// for _, g := range allGroup{
	// 	test = append(test, g.title)
	// }

	client.SendFeedback("printGroup", allGroup)
	return nil
}
