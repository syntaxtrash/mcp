import dotenv from "dotenv";
import { EnvSchema } from "./types.js";
/* Load and validate environment variables */
dotenv.config();
export const env = EnvSchema.parse(process.env);
