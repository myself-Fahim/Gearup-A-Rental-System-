import jwt from "jsonwebtoken";
import type { Role, User_status } from "../../prisma/generated/prisma/enums";
import config from "../config";

export type UserJwtPayload = {
  id: string;
  email: string;
  role: Role;
  status: User_status
};

export function signAccessToken(payload: UserJwtPayload) {
  return jwt.sign(payload, config.jwt_secret_key, { expiresIn: "2h" });
}

export function signRefreshToken(payload: UserJwtPayload) {
  return jwt.sign(payload, config.jwt_refresh_key, { expiresIn: "15d" });
}

export function createTokenPair(payload: UserJwtPayload) {
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, config.jwt_secret_key) as UserJwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, config.jwt_refresh_key) as UserJwtPayload;
}