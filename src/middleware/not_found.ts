import type { Response,Request,NextFunction } from "express";

export const not_found = (req:Request , res:Response , next:NextFunction) =>{
    res.status(404).json({
       success : false,
       message : `${req.originalUrl} not found` 
    })
}