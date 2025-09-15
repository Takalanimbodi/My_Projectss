import mysql from "mysql2"

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',  // your MySQL password
  database: ''
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL connected!");
});

export default db;


