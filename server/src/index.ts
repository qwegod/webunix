import express, { Express, Request, response, Response } from "express";
import { db } from "./db";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import session from "express-session";
import cookieParser from "cookie-parser";
import fs from "fs"
import { ISession } from "./ISession";
import bcrypt from "bcrypt";
import { sessionConfig } from "./sessionConfig";
import path from "path";
import { actionVerifier } from "./actionVerifier";

dotenv.config();

const app: Express = express();

const TIME_LIMIT = 5 * 60 * 1000;

const port = process.env.PORT || 5252;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(session(sessionConfig));

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
  const { username, password } = req.body;

  const query = "SELECT * FROM users WHERE username = ?";

  db.query(query, [username], (err, result) => {
    if (err) {
      console.error("Error executing query: ", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    if (result && result.length > 0) {
      if (password) {
        bcrypt.compare(password, result[0].password, (err, isMatch) => {
          if (err) {
            console.error("Error comparing passwords: ", err);
            return res.status(500).json({ error: "Error comparing passwords" });
          }

          if (isMatch) {
            (req.session as ISession).username = username;
            return res.json({ success: true });
          } else {
            return res.json({ success: false, message: "Invalid password" });
          }
        });
      } else {
        return res.json({ exists: true });
      }
    } else {
      return res.json({ exists: false });
    }
  });
});

app.post("/api/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    else res.json({ success: true });
  });
  res.status(200);
});

app.post("/api/session", function (req, res) {
  res.json({
    sessionID: req.session.id,
    user: (req.session as ISession).username,
  });
});

const keyGenerator = () => {
  return Math.random().toString(36).substr(2);
};

app.post("/api/tools/mkdir", (req: Request, res: Response) => {
  if (!actionVerifier(req)) {
    res.json({ success: false })
  }
  else {
    const query = "SELECT directory FROM users WHERE username = ?";

    db.query(query, [(req.session as ISession).username], (_, result) => {
      const folderPath = path.join(__dirname, '../workspace', '/', result[0].directory, '/', req.body.dirname)
      fs.mkdir(folderPath, (err) => {
        if (err) {
          console.error('Error creating folder')
          return res.status(500)
        }
        res.json({ success: true })
      })
    })
  }
})

app.post("/api/reg", (req: Request, res: Response) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM users WHERE username = ?";

  if (!password) {
    db.query(query, [username], (err: any, result: string | any[]) => {
      if (err) {
        console.error("Error executing query: ", err);
        return res.status(500);
      }
      if (result.length > 0) {
        return res.json({ exists: true });
      } else {
        const query = "INSERT INTO users (username) VALUES (?)";
        db.query(
          query,
          [username],
          (err: any, result: { affectedRows: number }) => {
            if (err) {
              console.error("Error executing query: ", err);
              return res.status(500);
            }
            if (result.affectedRows > 0) {
              return res.json({ exists: false });
            }
          }
        );
      }
    });
  } else {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password: ", err);
        return res
          .status(500)
          .json({ success: false, message: "Error hashing password" });
      }
      const query =
        "UPDATE users SET password = ?, directory = ? WHERE username = ?";
      const dir = username + keyGenerator();
      db.query(
        query,
        [hashedPassword, dir, username],
        (err: any, result: { affectedRows: number }) => {
          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500);
          }
          if (result.affectedRows > 0) {
            (req.session as ISession).username = username;
            const folderPath = path.join(__dirname, '../workspace', dir)
            fs.mkdir(folderPath, (err) => {
              if (err) {
                console.error('Error creating folder')
                return res.status(500)
              }
            })
            return res.json({ success: true });
          }
        }
      );
    });
  }
});

app.get("/", (_, res: Response) => {
  res.status(200).json({message: "Welcome"})
})

setInterval(() => {
  const currentTime = new Date();
  const expirationTime = new Date(currentTime.getTime() - TIME_LIMIT);

  const checkExpiredQuery = `
    SELECT username, registration_date
    FROM users
    WHERE password IS NULL AND registration_date < ?`;

  db.query(checkExpiredQuery, [expirationTime], (err: any, result: any[]) => {
    if (err) {
      console.error("Error executing query: ", err);
      return;
    }

    result.forEach((user: any) => {
      const deleteQuery =
        "DELETE FROM users WHERE username = ? AND registration_date < ?";
      db.query(deleteQuery, [user.username, expirationTime], (err: any) => {
        if (err) {
          console.error("Error deleting expired user: ", err);
        } else {
          console.log(
            `User ${user.username} has been deleted due to password not being set in time.`
          );
        }
      });
    });
  });
}, 60 * 1000);

app.post("/api/authorizationChecker", (req: Request, res: Response) => {
  if (req.sessionID && (req.session as ISession).username) {
    res.json({ success: true, user: (req.session as ISession).username });
  } else {
    res.json({ success: false });
  }
  res.status(200);
});

app.listen(port, () => {
  console.log(`[server]: server is running at http://localhost:${port}`);
});

export default app;