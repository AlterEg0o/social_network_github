package main

import (
	"fmt"
	"log"
	"net/http"

	"ws_config/backend"
	"ws_config/backend/db"

	_ "github.com/mattn/go-sqlite3"
)

const PORT = ":8000"

func main() {
	db.MigrateTable("group_users")
	db.InitDatabase()
	// handling url routes
	fs := http.FileServer(http.Dir("./frontend/build"))
	// http.Handle("/static/",http.StripPrefix("/static",fs))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			http.ServeFile(w, r, "./frontend/build/index.html")
		} else {
			fs.ServeHTTP(w, r)
		}
	})
	// handling ws
	manager := backend.NewManager()
	http.HandleFunc("/ws", manager.ServeWS)

	fmt.Println("listening on port", PORT)
	log.Fatal(http.ListenAndServe(PORT, nil))
}
