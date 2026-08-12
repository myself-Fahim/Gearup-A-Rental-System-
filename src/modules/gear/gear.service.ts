import { da } from "zod/locales"
import prisma from "../../lib/prisma"
import { AppError } from "../../utils/app-error"
import type { allGearFilterParams, CreateGearInput, UpdateGearInput } from "./gear.validation"

const getAllGear = async(filterParams : allGearFilterParams) =>{
    const{category_id , max_price,min_price} = filterParams;
    const gears = await prisma.gear.findMany({
        where:{
            ...(category_id && {
                category_id
            }),
            ...(max_price !== undefined || min_price !== undefined?{
                price_per_day:{
                    ...(min_price!==undefined && {
                        gte:min_price
                    }),
                    ...(max_price!==undefined && {
                        lte:max_price
                    })
                }

            }:{})
        }
    })

    if(!gears || gears.length == 0){
        throw new AppError(404,"No data found")
    }
    return gears
    
}

const getGearById = async(id :string ) =>{
    const gear = await prisma.gear.findUnique({
        where :{
            id
        }
    })

    if(!gear){
        throw new AppError(404,"Gear not found")
    }

    return gear 
}

const getGearCategories = async() =>{
    const categories = await prisma.category.findMany()
    return categories
}

const createGear = async(gear:CreateGearInput,providerId:string) =>{

    const data = {
        ...gear,
        provider_id : providerId
    }
    const gear_create = await prisma.gear.create({data})
    return gear_create

}
const updateGear = async(data : UpdateGearInput , id:string) =>{
    const updateGear = await prisma.gear.update({
        where:{
            id
        },
        data
    })

    return updateGear

}
const deleteGear = async(id:string) =>{
    const removeGear = await prisma.gear.delete({
        where:{
            id
        }
    })

    return removeGear

}


export const gearService = {
    getAllGear,
    getGearById,
    getGearCategories,
    createGear,
    updateGear,
    deleteGear
}