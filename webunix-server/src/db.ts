import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: ", err.message);
    return;
  }
  console.log("Connected to MySQL as ID", db.threadId);
});
