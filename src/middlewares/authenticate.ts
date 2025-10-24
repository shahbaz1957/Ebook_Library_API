import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export interface AuthRequest extends Request {
  userId: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract token from Authorization headertoken , it also comes from cookies
    // let token = req.header("Authorization")?.split(" ")[1];
    let token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      next(createHttpError(401, "Authorization token is required "));
    }
    const decoded = jwt.verify(token as string, config.Jwt_Secret as string);
    const _req = req as AuthRequest;
    _req.userId = decoded.sub as string;

    next();
  } catch (error) {
    return next(createHttpError(401, "Failed to Authenticate "));
  }
};

export default authenticate;
