import type { Response,Request,NextFunction } from "express"
import { CatchAsync } from "../utils/catch-async"
import type { Role } from "../../prisma/generated/prisma/enums"
import { AppError } from "../utils/app-error"
import { verifyAccessToken } from "../utils/jwt"
import prisma from "../lib/prisma"

export const auth = (...roles : Role[]) =>{
   return CatchAsync(async(req:Request,res:Response,next:NextFunction)=>{
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            throw new AppError(401,"Unauthorized-No token provided")
        }

        const token = authHeader.slice(7);
        try{
            const decoded = verifyAccessToken(token) 

            if(roles.length && !roles.includes(decoded.role)){
                throw new AppError(401,"Unauthorized access")
            }

            const user = await prisma.user.findUnique({
                where:{
                    id:decoded.id
                }
            })
            if(!user){
                throw new AppError(404,"User doesn't exist")
            }

            if(user.status == 'suspend'){
                throw new AppError(400,'User is suspended')
            }

            req.user = decoded 
            next();
        }
        catch(err){
            if(err instanceof AppError) throw err;
            throw new AppError(401,"Invalid token")
        }

    })

}
   

    
