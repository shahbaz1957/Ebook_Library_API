import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel.js";
import bcrypt from 'bcrypt'

const createUser = async(req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  // validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "User All Field Required ??");
    return next(error);
  }

  // Check if User Already Exist
  const user = await userModel.findOne({email})

  if(user){
    const error = createHttpError(400, "User Alredy Exist with this Email")
    return next(error);
  }

  // Hashed Password
  const passwordHashed = bcrypt.hash(password, 10);


  res.status(200).json({
    message: "User Created Successfully !!!!",
  });
};

export { createUser };
