package db

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"strings"
	"time"
)

const DATE_FORMAT = "Jan 2, 2006 at 3:04pm (MST)"

////////////////////// LOGIN ////////////////////////////

func GetUsernameByEmail(email string) string {
	database := OpenDB()
	defer database.Close()

	row := database.QueryRow("SELECT username FROM users WHERE email=?", email)

	var username string
	row.Scan(&username)
	return username
}

func CheckPassword(identifier string, password string, connexionMode string) error {
	var correctPassword string

	database := OpenDB()
	defer database.Close()

	query := "SELECT password FROM users WHERE " + connexionMode + "=?"
	row := database.QueryRow(query, identifier)
	row.Scan(&correctPassword)

	if correctPassword == "" {
		return errors.New(connexionMode + " does not exists")
	}
	if correctPassword != password {
		return errors.New("wrong password")
	}

	return nil
}

//////////////// REGISTRATION /////////////////////////

func Register(data RegisterForm) {
	database := OpenDB()
	defer database.Close()
	statement, err := database.Prepare("INSERT INTO users (firstname,lastname,date_of_birth,email,password,username,about_me,is_private) VALUES (?,?,?,?,?,?,?,?)")
	if err != nil {
		fmt.Println("cannot insert row into users :", err.Error())
	}
	defer statement.Close()

	statement.Exec(
		data.Firstname,
		data.Lastname,
		data.DateOfBirth,
		data.Email,
		data.Password,
		data.Username,
		data.AboutMe,
		false,
	)

	fmt.Println("registration done successfully !")
}

func UsernameAlreadyExists(newUsername string) bool {
	var username string

	database := OpenDB()
	defer database.Close()

	rows, err := database.Query("SELECT username FROM users")
	if err != nil {
		fmt.Println("error getting users data :", err.Error())
	}

	if rows == nil {
		return false
	}

	for rows.Next() {
		rows.Scan(&username)
		if newUsername == username {
			return true
		}
	}

	return false
}

// ///////// PROFIL ////////////////
func GetProfilData(username string) User {
	var firstname string
	var lastname string
	var aboutMe string

	db := OpenDB()
	defer db.Close()

	rows, err := db.Query("SELECT firstname, lastname, about_me FROM users WHERE username=?", username)
	if err != nil {
		fmt.Println("error getting user profil data :", err.Error())
	}

	if rows == nil {
		return User{}
	}

	for rows.Next() {
		rows.Scan(&firstname, &lastname, &aboutMe)
	}

	return User{
		Username: username,
		Fullname: firstname + " " + lastname,
		AboutMe:  aboutMe,
	}
}

////////////////// POSTS ////////////////////////

func SavePost(post Post) {
	database := OpenDB()
	defer database.Close()

	statement, err := database.Prepare("INSERT INTO posts (group_id,author, title, content, privacy, imageURL) VALUES (?,?,?,?,?,?)")
	if err != nil {
		fmt.Println("ERROR cannot save post :", err.Error())
	}
	defer statement.Close()
	_, err = statement.Exec(post.GroupId,post.Author, post.Title, post.Content, post.Privacy, post.Image)
	if err != nil {
		fmt.Println("Error saving post :", err.Error())
	}
}

func GetPosts(client string, groupOnly bool) []Post {
	var posts []Post
	var id int
	var groupId int
	var title string
	var content string
	var privacy int
	var author string
	var imageUrl string

	db := OpenDB()
	defer db.Close()

	rows, err := db.Query("SELECT * FROM posts")
	if err != nil {
		fmt.Println("error getting posts :", err.Error())
	}

	if rows == nil {
		return []Post{}
	}

	for rows.Next() {
		rows.Scan(&id,&groupId, &title, &content, &privacy, &author, &imageUrl)

		post := Post{
			Id:      id,
			GroupId: groupId,
			Title:   title,
			Content: content,
			Privacy: privacy,
			Author:  author,
			Image:   imageUrl,
		}
		//
		if !groupOnly && privacy == 3{
			continue
		}

		// only followers of the author can see this post
		if privacy == 1 {
			followers := GetFollowers(db, author)
			if !Contains(followers, client) && author != client {
				continue
			}
		}

		posts = append(posts, post)
	}

	fmt.Println("posts : ", posts)

	return posts
}

func SaveComment(author string, content string, postId int) {
	db := OpenDB()
	defer db.Close()

	statement, err := db.Prepare("INSERT INTO comments (content, author, post_id) VALUES (?,?,?)")
	if err != nil {
		fmt.Println("ERROR cannot save comment :", err.Error())
	}
	defer statement.Close()

	_, err = statement.Exec(content, author, postId)
	if err != nil {
		fmt.Println("Error saving comment :", err.Error())
	}
}

func GetComments(postId int) []Comment {
	db := OpenDB()
	defer db.Close()

	var comments []Comment
	var author string
	var content string

	rows, err := db.Query("SELECT author, content FROM comments WHERE post_id=?", postId)
	if err != nil {
		fmt.Println("error getting comments :", err.Error())
	}

	if rows == nil {
		return []Comment{}
	}

	for rows.Next() {
		rows.Scan(&author, &content)
		comments = append(comments, Comment{
			Author:  author,
			Content: content,
		})
	}

	return comments
}

// ///////////// CHAT ///////////////
func GetUsers(currentUser string) []User {
	db := OpenDB()
	defer db.Close()

	var username string
	var isPrivate bool
	nameList := []User{}

	rows, err := db.Query("SELECT username, is_private FROM users")
	if err != nil {
		fmt.Println("error getting user profil data :", err.Error())
	}

	if rows == nil {
		return []User{}
	}

	for rows.Next() {
		rows.Scan(&username, &isPrivate)

		if currentUser == username {
			continue
		}

		followers := GetFollowers(db, username)

		nameList = append(nameList, User{
			Username:   username,
			IsPrivate:  isPrivate,
			Followers:  followers,
			IsFollowed: Contains(followers, currentUser),
		})
	}

	return nameList
}

func GetFollowers(db *sql.DB, username string) []string {
	followers := []string{}
	var follower string

	rows, err := db.Query("SELECT follower FROM followers WHERE following=?", username)
	if err != nil {
		fmt.Println("error getting user profil data :", err.Error())
	}

	if rows == nil {
		return followers
	}

	for rows.Next() {
		rows.Scan(&follower)
		followers = append(followers, follower)
	}

	return followers
}

func ToggleFollower(follower string, following string) {
	database := OpenDB()
	defer database.Close()

	followers := GetFollowers(database, following)
	if Contains(followers, follower) {
		Unfollow(database, follower, following)
	} else {
		Follow(database, follower, following)
	}
}

func GetFollowing(username string) []string {
	db := OpenDB()
	defer db.Close()

	followings := []string{}
	var following string

	rows, err := db.Query("SELECT following FROM followers WHERE follower=?", username)
	if err != nil {
		fmt.Println("error getting user profil data :", err.Error())
	}

	if rows == nil {
		return followings
	}

	for rows.Next() {
		rows.Scan(&following)
		followings = append(followings, following)
	}

	return followings
}

func Follow(database *sql.DB, follower string, following string) {
	statement, err := database.Prepare("INSERT INTO followers (follower, following) VALUES (?,?)")
	if err != nil {
		fmt.Println("cannot insert row into users :", err.Error())
	}
	defer statement.Close()

	_, err = statement.Exec(follower, following)
	if err != nil {
		fmt.Println("error Adding follower :", err.Error())
	}
}

func Unfollow(database *sql.DB, follower string, following string) {
	// Open a connection to the database
	db := OpenDB()
	defer db.Close()

	// Prepare the DELETE statement
	stmt, err := db.Prepare("DELETE FROM followers WHERE follower=? AND following=?")
	if err != nil {
		log.Fatal("error in the Unfollow statement :", err.Error())
	}
	defer stmt.Close()

	// Execute the DELETE statement
	_, err = stmt.Exec(follower, following) // Replace 1 and "john" with the actual values of id and username
	if err != nil {
		log.Fatal("cannot execute unfollow statement : ", err.Error())
	}
}

func SaveMessage(sender string, receiver string, content string) {
	database := OpenDB()
	defer database.Close()

	query := "INSERT INTO messages (sender, receiver, content, created_at) VALUES (?,?,?,?)"
	statement, err := database.Prepare(query)
	if err != nil {
		log.Fatal("error save message :", err.Error())
	}
	defer statement.Close()

	date := time.Now().Format(DATE_FORMAT)
	statement.Exec(sender, receiver, content, strings.Trim(date, "(CEST)"))
}

func GetConversation(user1 string, user2 string) []Message {
	var conversation []Message
	var sender string
	var receiver string
	var content string
	var date string

	database := OpenDB()
	defer database.Close()

	query := "SELECT sender, receiver, content, created_at FROM messages WHERE (sender IN (?,?) AND receiver IN (?,?))"
	rows, err := database.Query(query, user1, user2, user1, user2)
	if err != nil {
		log.Fatal("cannot load messages :", err.Error())
	}

	if rows == nil {
		return conversation
	}

	for rows.Next() {
		rows.Scan(&sender, &receiver, &content, &date)

		conversation = append(conversation, Message{
			Sender:   sender,
			Receiver: receiver,
			Content:  content,
			Date:     date,
		})
		fmt.Println("date is", date)

	}

	return conversation
}

func InitGroupDB(creator string, participants []string, title string) {
	database := OpenDB()
	defer database.Close()

	// insert row into groups
	query := "INSERT INTO groups (title ) VALUES (?)"
	statement, err := database.Prepare(query)
	if err != nil {
		log.Fatal("error save message :", err.Error())
	}
	defer statement.Close()

	statement.Exec(title)

	// inserting group's participants
	for _, participant := range participants {
		query := "INSERT INTO groups_users (user, title,is_accepted) VALUES (?, ?,?)"
		statement, err := database.Prepare(query)
		if err != nil {
			log.Fatal("error save message :", err.Error())
		}
		defer statement.Close()

		if participant == creator {
			statement.Exec(participant, title, true)
			continue
		}
		statement.Exec(participant, title, false)
	}
}
// notifications

func CreateNotif(user string, notifType string, description string) {
	db := OpenDB()
	defer db.Close()

	statement, err := db.Prepare("INSERT INTO notifications (user, notif_type, notif_desc, is_checked) VALUES (?,?,?,?)")
	if err != nil {
		fmt.Println("cannot insert row into users :", err.Error())
	}
	defer statement.Close()

	_, err = statement.Exec(user, notifType, description, false)
	if err != nil {
		fmt.Println("error Adding follower :", err.Error())
	}

	fmt.Println("notif created successfully !")
}

func GetNotifs(username string) []Notif{
	db := OpenDB()
	defer db.Close()

	notifs := []Notif{}
	var id int
	var notifType string
	var desc string
	var isChecked bool

	query := "SELECT id, notif_type, notif_desc, is_checked FROM notifications WHERE user=?"
	rows, err := db.Query(query, username)
	if err != nil {
		log.Fatal("cannot load messages :", err.Error())
	}

	if rows == nil {
		return notifs
	}

	for rows.Next() {
		rows.Scan(&id,&notifType, &desc, &isChecked)

		notifs = append(notifs, Notif{
			Id: id,
			NotifType: notifType,
			Desc: desc,
			IsChecked: isChecked,
		})
	}

	return notifs
}

func ClearNotif(id int){
	db := OpenDB()
	defer db.Close()

	// Prepare the DELETE statement
	stmt, err := db.Prepare("DELETE FROM notifications WHERE id=?")
	if err != nil {
		log.Fatal("error in the Unfollow statement :", err.Error())
	}
	defer stmt.Close()

	// Execute the DELETE statement
	_, err = stmt.Exec(id) // Replace 1 and "john" with the actual values of id and username
	if err != nil {
		log.Fatal("cannot clear notifications : ", err.Error())
	}
}

func AddGroupMember(username string, group string){
	database := OpenDB()
	defer database.Close()

	query := "UPDATE groups_users SET is_accepted = true WHERE user=? AND title=?"
	statement, err := database.Prepare(query)
	if err != nil{
		fmt.Println("cannot add group memeber : ",err.Error())
		return
	}
	defer statement.Close()

	statement.Exec(username,group)

	fmt.Println("member added successfully : ", username, "to", group)
}

func RemoveGroupMember(username string, group string){
	db := OpenDB()
	defer db.Close()

	stmt, err := db.Prepare("DELETE FROM groups_users username=? AND title=?")
	if err != nil {
		log.Fatal("error in the Unfollow statement :", err.Error())
	}
	defer stmt.Close()

	// Execute the DELETE statement
	_, err = stmt.Exec(username,group) // Replace 1 and "john" with the actual values of id and username
	if err != nil {
		log.Fatal("cannot remove member from group : ", err.Error())
	}
}

func GetAllGroups(username string) []GroupUser {
	db := OpenDB()
	defer db.Close()

	userGroup := []GroupUser{}

	var id int
	var title string
	var user string
	var is_accepted bool
	var groupFound bool

	query := "SELECT id,user, title, is_accepted FROM groups_users"
	rows, err := db.Query(query)
	if err != nil {
		log.Fatal("cannot load messages :", err.Error())
	}

	if rows == nil {
		return []GroupUser{}
	}

	for rows.Next() {
		groupFound = false
		rows.Scan(&id,&user, &title, &is_accepted)

		// group already added, we have to add the user*
		for _, group := range userGroup {
			if group.Title == title {
				group.Username[user] = is_accepted
				groupFound = true
				break
			}
		}

		if !groupFound {
			// new group
			user_map := map[string]bool{}
			user_map[user] = is_accepted

			userGroup = append(userGroup, GroupUser{
				Id: id,
				Title:    title,
				Username: user_map,
			})
		}

	}

	return userGroup
}
