import { TAlgorithm } from "jwt-simple";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly DB_PORT: number;
      readonly HASH_STRETCH: number;

      readonly JWT_ALGO: TAlgorithm;
    }
  }
}
