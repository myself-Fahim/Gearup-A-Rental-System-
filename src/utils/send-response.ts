import type { Response } from "express";

export const SendResponse = <T>(res: Response,statusCode:number ,{success,message,data}:{success: boolean,message:string, data?: T}) => {

    res.status(statusCode).json({
        success,
        message,
        data
    })

}