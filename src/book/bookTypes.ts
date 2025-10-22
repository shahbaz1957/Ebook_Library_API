import type { IUser } from "../user/userTypes.js";

export interface IBook{
    _id:string,
    title:string,
    file:string,
    genre:string,
    author:IUser,
    coverImage:string,
    createdAt:Date,
    updatedAt:Date
}