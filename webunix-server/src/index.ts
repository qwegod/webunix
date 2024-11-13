import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5252;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());


app.post("/api/execute", (req, res) => {
  try {
    const command = req.body.command;
    if (!command) {
      throw new Error("Missing command");
    }
    if (command === "!clear")
    res.json({ task: "!clear" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error occurred" });
  }
});

app.listen(port, () => {
  console.log(`[server]: server is running at http://localhost:${port}`);
});
