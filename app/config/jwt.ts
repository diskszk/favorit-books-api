import dotenv from "dotenv";
dotenv.config();

export const jwtKey = process.env.JWT_KEY || "";
export const jwtAlgo = "HS256";
