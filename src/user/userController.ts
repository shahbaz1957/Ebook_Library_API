import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { config } from "../config/config.js";
import type { IUser } from "./userTypes.js";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  // validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "User All Field Required ??");
    return next(error);
  }

  // Check if User Already Exist
  try {
    const user = await userModel.findOne({ email });

    if (user) {
      const error = createHttpError(400, "User Alredy Exist with this Email");
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "Error while  getting User ???"));
  }

  // Hashed Password
  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser: IUser;

  try {
    newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while  getting User ???"));
  }

  // Create Token
  try {
    const token = jwt.sign({ sub: newUser._id }, config.Jwt_Secret as string, {
      expiresIn: "7d",
    });
    res.status(200).json({
      message: "User Created Successfully !!!!",
      accessToken: token,
    });
  } catch (error) {
    return next(createHttpError(500, "Error while  getting User ???"));
  }
};

export { createUser };
