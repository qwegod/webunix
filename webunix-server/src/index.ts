import express, { Express, Request, Response } from "express";
import mysql from "mysql";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5252;

app.use(cors({ origin: "http://localhost:3000" }));

app.use(bodyParser.json())

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as ID " + db.threadId);
});

// app.post("/api/execute", (req: Request, res: Response) => {
//   try {
//     const exec = req.body;
//     console.log(exec);
//     if (!exec) {
//       throw new Error("Missing command");
//     }
//     if (exec.command === "!clear") res.json({ task: "!clear" });
//     if (exec.args[0] === "login") {
//       if (exec.command.trim() == login) {
//         res.json({ success: true });
//       } else {
//         res.json({ success: false });
//       }
//     } else if (exec.args[0] === "password") {
//       if (exec.command.trim() == password) {
//         res.json({ success: true, directory: directory });
//       } else {
//         res.json({ success: false });
//       }
//     } else if (exec.args[0] === "directory") {
//       directory = exec.command;
//       res.json({ success: true });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error occurred" });
//   }
// });

app.post("/api/login", (req: Request, res: Response) => {
  const loginToCheck = req.body.login;

  const query = "SELECT * FROM users WHERE login = ?";

  db.query(query, [loginToCheck], (err, result) => {
    if (err) {
      console.error("Error executing query: ", err);
      return res.status(500);
    }
    if (result) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  });
});

app.post("/api/password", (req: Request, res: Response) => {
  const { login, password } = req.body;

  const query = "SELECT * FROM users WHERE login = ?";

  db.query(query, [login], (err, result) => {
    if (err) {
      console.error("Error executing query: ", err);
      return res.status(500);
    }
    if (result[0].password === password) {
      
      if (result[0].directory) {
        return res.json({ success: true, directory: result[0].directory });
      }
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }
  });
});

app.post("/api/directory", (req: Request, res: Response) => {
  const { login, directory } = req.body;

  const query = "UPDATE users SET directory = ? WHERE login = ?";

  db.query(query, [directory, login], (err, result) => {
    if (err) {
      console.error("Error executing query: ", err);
      return res.status(500);
    }
    if (result.affectedRows === 0) {
      return res.json({ success: false });
    }
    return res.json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`[server]: server is running at http://localhost:${port}`);
});
