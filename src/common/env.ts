import dotenv from "dotenv";

import { EnvSchema, DBConfig } from "./types.js";

/* Load and validate environment variables */
dotenv.config();
export const env: DBConfig = EnvSchema.parse(process.env);