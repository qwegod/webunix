import { Session } from "express-session";

export interface ISession extends Session {
  user?: string;
}