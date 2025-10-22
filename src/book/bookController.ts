
import type { Response,Request,NextFunction } from "express"

const createBook = async(req:Request,res:Response, next:NextFunction)=>{

    const {} = req.body;
    console.log(req.files)

}

export {createBook};