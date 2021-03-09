import dotenv from "dotenv";
dotenv.config();

export const jwtKey = process.env.JWT_KEY || "";
export const jwtAlgo = process.env.JWT_ALGO;
