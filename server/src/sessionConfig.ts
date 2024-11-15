import dotenv from "dotenv";

dotenv.config();

export const sessionConfig = {
  secret: process.env.SECRET_KEY as string,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: false,
    secure: false,
    sameSite: "lax" as "lax",
  },
};
