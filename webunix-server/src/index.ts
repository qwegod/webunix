import express, { Express, Request, Response } from "express";
import mysql from "mysql";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import session from "express-session";
import cookieParser from "cookie-parser";
import { ISession } from "./ISession";
import jwt from 'jsonwebtoken'

dotenv.config();

const app: Express = express();

const port = process.env.PORT || 5252;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SECRET_KEY as string,
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: false, secure: false, sameSite: "lax" },
  })
);

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
  const { login, password } = req.body;

  const query = "SELECT * FROM users WHERE login = ?";

  db.query(query, [login], (err, result) => {
    if (err) {
      console.error("Error executing query: ", err);
      return res.status(500);
    }
    if (result) {
      if (password) {
        if (result[0].password === password) {
          (req.session as ISession).user = login;

          return res.json({ success: true, directory: result[0].directory });
        }
        return res.json({ success: false });
      }
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  });
});


app.post("/api/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) console.error(err)
    else res.json({success: true})
  })
  res.status(200)
})

app.post('/api/session', function(req, res) {

  res.json({
    message: 'Session.id: ' + req.session.id,  
    user: (req.session as ISession).user 
  });
});


const keyGenerator = () => {
  return Math.random().toString(36).substr(2);
};

app.post("/api/reg", (req: Request, res: Response) => {
  const { login, password } = req.body;

  const query = "SELECT * FROM users WHERE login = ?";

  if (!password) {
    db.query(query, [login], (err, result) => {
      if (err) {
        console.error("Error executing query: ", err);
        return res.status(500);
      }
      if (result.length > 0) {

        return res.json({ exists: true });
      } else {
        const query = "INSERT INTO users (login) VALUES (?)";
        db.query(query, [login], (err, result) => {
          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500);
          }
          if (result.affectedRows > 0) {
            return res.json({ exists: false });
          }
        });
      }
    });
  } else {
    const query = "UPDATE users SET password = ? WHERE login = ?";
    db.query(query, [password, login], (err, result) => {
      if (err) {
        console.error("Error executing query: ", err);
        return res.status(500);
      }
      if (result.affectedRows > 0) {
        const query = "UPDATE users SET directory = ? WHERE login = ?";
        const dir = login + keyGenerator();
        db.query(query, [dir, login], (err, result) => {
          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500);
          }
          if (result.affectedRows > 0) {
            res.cookie("session_id", req.sessionID, {
              httpOnly: false,
              secure: false,
              sameSite: "lax",
              maxAge: 1000 * 60 * 60 * 24,
            });
            return res.json({ success: true, directory: dir });
          }
        });
      }
    });
  }
});

app.post("/api/authorizationChecker", (req: Request, res: Response) => {
  if (req.sessionID && (req.session as ISession).user) {
    res.json({ success: true, user: (req.session as ISession).user });
  } else {
    res.json({ success: false });
  }
  res.status(200);
});

app.listen(port, () => {
  console.log(`[server]: server is running at http://localhost:${port}`);
});
