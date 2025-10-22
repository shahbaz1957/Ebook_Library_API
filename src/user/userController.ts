import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const createUser =(req: Request, res: Response, next: NextFunction) => {
    const { name, email, password} = req.body;

    // validation 
    if(!name || !email || !password){
        const error = createHttpError(400, "User All Field Required ??")
        return next(error);
    }

  res.status(200).json({
    message: "User Created Successfully !!!!",
  });
};

export { createUser };
  