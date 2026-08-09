import type { Request, Response } from "express"
import { CatchAsync } from "../../utils/catch-async";
import { loginSchema, registerSchema } from "./auth.validation";
import { authService } from "./auth.service";
import { SendResponse } from "../../utils/send-response";

const registerUser = CatchAsync(async (req: Request, res: Response) => {
    const input = registerSchema.parse(req.body)
    const result = await authService.registerUser(input)
    SendResponse(res,201,{
        success:true,
        message:'User registered successfully',
        data : result
    })
})

const loginUser = CatchAsync(async (req: Request, res: Response) => {
    const input = loginSchema.parse(req.body)
    const result = await authService.loginUser(input)
      SendResponse(res,201,{
        success:true,
        message:'User login successful',
        data : {
            user : result.user,
            accessToken : result.accessToken,
            refreshToken : result.refreshToken
        }
    })

})

const myProfile = (req: Request, res: Response) => {
    console.log('profile');

}



export const authController = {
    registerUser,
    loginUser,
    myProfile
}