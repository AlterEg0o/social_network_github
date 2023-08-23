package db

import (
	"database/sql"
	"fmt"
	"io/ioutil"
	"log"
)

// /////// MIGRATIONS //////////
func InitDatabase() {
	db := OpenDB()
	defer db.Close()

	ApplyMigration(db, "create_table_users.up.sql")
	ApplyMigration(db, "create_table_posts.up.sql")
	ApplyMigration(db, "create_table_comments.up.sql")
	ApplyMigration(db, "create_table_followers.up.sql")
	ApplyMigration(db, "create_table_messages.up.sql")
	ApplyMigration(db, "create_table_groups.up.sql")
	ApplyMigration(db, "create_table_group_users.up.sql")
	ApplyMigration(db, "create_table_group_event.up.sql")
}

// use this function to reset a table
func MigrateTable(table_name string) {
	db := OpenDB()
	defer db.Close()

	ApplyMigration(db, "create_table_"+table_name+".down.sql")
	ApplyMigration(db, "create_table_"+table_name+".up.sql")

	fmt.Println(table_name + " migrated successfully !")
}

// execute the sql code contained in the given migration file
func ApplyMigration(db *sql.DB, filename string) {
	sqlFile, err := ioutil.ReadFile(MIGRATION_PATH + filename)
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec(string(sqlFile))
	if err != nil {
		log.Fatal("ERROR executing sql in file ", filename, " : ", err.Error())
	}
}

func Contains(arr []string, value string) bool {
	for _, elem := range arr {
		if elem == value {
			return true
		}
	}

	return false
}

func OpenDB() *sql.DB {
	db, err := sql.Open("sqlite3", DB_PATH)
	if err != nil {
		log.Fatal("ERROR cannot open database :", err.Error())
	}
	return db
}
