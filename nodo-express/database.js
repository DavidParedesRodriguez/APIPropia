var sqlite3 = require('sqlite3').verbose();
var md5 = require('md5');

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');

        db.run(`
            CREATE TABLE IF NOT EXISTS user (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT UNIQUE,
                password TEXT,
                CONSTRAINT email_unique UNIQUE (email)
            )
        `, (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('User table created successfully.');
            }
        });

        db.run(`
            CREATE TABLE IF NOT EXISTS user_annotations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                annotation TEXT,
                FOREIGN KEY (user_id) REFERENCES user (id)
            )
        `, (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('User annotations table created successfully.');
            }
        });
    }
});

module.exports = db;
