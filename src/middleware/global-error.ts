import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/app-error";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "../../prisma/generated/prisma/internal/prismaNamespace";
import config from "../config";

export const globarErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Something went wrong"
    let errorDetails: unknown = null;


    if (err instanceof ZodError) {
        statusCode = 400;
        message = "Validation Error"
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
        errorDetails = err.errorDetails ?? null
    }

    else if (err instanceof PrismaClientKnownRequestError) {

        if (err.code === "P2002") {
            statusCode = 400;
            message = "Duplicate Value"
        }
        else if (err.code === "P2025") {
            statusCode = 400;
            message = "Not found in database"
        }
        else if (err.code === "P2003") {
            statusCode = 400;
            message = "Foreign key constraint failed"
        }
        else {
            statusCode = 400;
            message = "Database Error"
            errorDetails = { code: err.code }
        }
    }
    else if (err instanceof PrismaClientValidationError) {
        statusCode = 400
        message = "Invalid Query"
    }


    if (statusCode == 500 && config.node_env == 'production') {
        message = "Internal Server Error",
        errorDetails = null
    }
    else if (config.node_env != 'production' && err instanceof Error && errorDetails == null) {
        errorDetails = { stack: err.stack }
    }

    res.status(statusCode).json({ success: false, message, errorDetails })




}