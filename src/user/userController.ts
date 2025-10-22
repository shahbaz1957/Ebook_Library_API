import type { NextFunction, Request, Response } from "express";

const createUser = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: "User Created Successfully...!!!!",
  });
};

export { createUser };
