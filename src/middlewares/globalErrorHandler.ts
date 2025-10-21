import type { Request, Response, NextFunction } from "express";
import createHttpError, { HttpError } from "http-errors";
import { config } from "../config/config.js";

const globalError= (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statuCode = err.statusCode || 500;
  return res.status(statuCode).json({
    message: err.message,
    errorStack: config.ENV === "development" ? err.stack : "",
  });
};


export default globalError;