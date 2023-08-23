package db

type Message struct {
	Sender   string
	Receiver string
	Content  string
	Date     string
}

type RegisterForm struct {
	Firstname   string
	Lastname    string
	Username    string
	Email       string
	Password    string
	DateOfBirth string
	AboutMe     string
}

type User struct {
	Username   string
	Fullname   string
	AboutMe    string
	IsFollowed bool
	IsPrivate  bool
	Followers  []string
}

type Post struct {
	Id              int
	GroupId         int
	Author          string
	Title           string
	Content         string
	CommentsAuthors []string
	Privacy         int
	Image           string
}

type Comment struct {
	Author  string
	Content string
}

type GroupUser struct {
	Title    string
	Username map[string]bool
}

type Notif struct {
	Id        int
	NotifType string
	Desc      string
	IsChecked bool
}

const (
	DB_PATH        = "backend/db/database.db"
	MIGRATION_PATH = "backend/db/migrations/"
)
