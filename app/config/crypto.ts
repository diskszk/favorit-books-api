import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const cryptoPassword = process.env.CRYPTO_PASSWORD || "";
const cryptoSalt = process.env.CRYPTO_SALT || "";

export const cryptoAlgo = "aes-256-cbc";
export const cryptoKey = crypto.scryptSync(cryptoPassword, cryptoSalt, 32);
export const cryptoIv = process.env.CRYPTO_IV || "";
export const hashStretch = Number(process.env.HASH_STRETCH || null);
