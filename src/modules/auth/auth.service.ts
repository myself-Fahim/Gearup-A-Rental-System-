import prisma from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import { createTokenPair } from "../../utils/jwt";
import type { LoginInput, RegisterInput } from "./auth.validation";
import bcrypt from "bcrypt"

const registerUser = async (input: RegisterInput) => {
    const existingUser = await prisma.user.findUnique({
        where: { email: input.email },
    });
    if (existingUser) {
        throw new AppError(409, "Email already exists");
    }
    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = await prisma.user.create({
        data: {
            name: input.name,
            email: input.email,
            password: hashedPassword,
            role: input.role,
        },
        omit: {
            password: true,
        },
    });
    return user;
}

const loginUser =async(input: LoginInput)=> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(input.password, user.password);

  if (!passwordMatches) {
    throw new AppError(401, "Invalid email or password");
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    imageURL : user.image_url ?? null,
    createdAt: user.created_At,
    updatedAt: user.updated_At,
  };

  return {
    user: safeUser,
    ...createTokenPair({ email: user.email, id: user.id, role: user.role }),
  };
}




export const authService = {
    registerUser,
    loginUser
}