import { z } from "zod";

import { NON_EMPTY_VALUE, DEFAULT_DB_PORT } from "./constants.js";

export const MySQLListTablesSchema = z.object({}).describe("No arguments needed, can be omitted or pass an empty object");

export const MySQLGetTableInfoSchema = z.object({
    table: z.string().describe("The table name to get the schema for"),
});

export const MySQLExecuteQuerySchema = z.object({
    query: z.string().min(NON_EMPTY_VALUE).describe("The SELECT or INSERT query to execute"),
});

export const EnvSchema = z.object({
    MYSQL_HOST: z.string().min(NON_EMPTY_VALUE, "MYSQL_HOST is required"),
    MYSQL_PORT: z.coerce.number().optional().default(DEFAULT_DB_PORT),
    MYSQL_USER: z.string().min(NON_EMPTY_VALUE, "MYSQL_USER is required"),
    MYSQL_PASSWORD: z.string().min(NON_EMPTY_VALUE, "MYSQL_PASSWORD is required"),
    MYSQL_DATABASE: z.string().min(NON_EMPTY_VALUE, "MYSQL_DATABASE is required"),
});

export const MCPResponseSchema = z.object({
    content: z.array(
        z.object({
            type: z.literal("text"),
            text: z.string(),
        })
    ),
});

export type DBConfig = z.infer<typeof EnvSchema>;
export type MCPResponse = z.infer<typeof MCPResponseSchema>;

