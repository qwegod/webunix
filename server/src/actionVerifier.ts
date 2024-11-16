import { ISession } from "./ISession";
import { Request } from "express";

export const actionVerifier = (req: Request): boolean => {
    if (req.sessionID && (req.session as ISession).username) {
        return true
    }
    return false
}