
import { Role } from "../../../prisma/generated/prisma/enums"
import prisma from "../../lib/prisma"
import { AppError } from "../../utils/app-error"
import type { UpdateUserInput, UpdateUserStatusInput } from "./user.validation"


const getAllUser = async () => {
    const allUser = await prisma.user.findMany({
        where:{
            role:{
                in:[Role.CUSTOMER,Role.PROVIDER]
            },
            
        },
        omit:{
            password:true
        }
    })

    if (!allUser || allUser.length == 0) {
        throw new AppError(404, 'No user found')
    }

    return allUser

}

const updateUserStatus = async(input : UpdateUserStatusInput,userID:string) =>{
    const user = await prisma.user.update({
        where:{
            id:userID
        },
        data:{
            ...input
        }
    }) 

    return user  
}
const updateUser = async(input : UpdateUserInput,id:string,userID:string) =>{


    if(id !== userID){
        throw new AppError(400,"Only owner can update profile")
    }

    const user = await prisma.user.update({
        where:{
            id
        },
        data:{
            ...input
        }
    }) 

    return user  
}

const deleteUser = async(id:string) =>{

    const deleteUser = await prisma.user.delete({
        where:{
            id
        }
    }) 

    return deleteUser

}

export const userService = {
    getAllUser,
    updateUserStatus,
    updateUser,
    deleteUser
}