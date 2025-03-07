import mysql, { RowDataPacket } from "mysql2/promise";

import { FIRST_VALUE_INDEX, JSON_INDENTATION } from "../common/constants.js";
import { isSelectQuery } from "../common/utils.js";
import { MCPResponse } from "../common/types.js";
import { env } from "../common/env.js";
/**
 * DOCU: MySQL connection pool
 * Last Updated Date: March 06, 2025
 * @author Aaron
 */
const pool = mysql.createPool({
    host: env.MYSQL_HOST,
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
    port: env.MYSQL_PORT,
});

/**
 * Docu: List all tables in the database
 * Last Updated Date: March 06, 2025
 * @returns {object} - The list of tables in the database
 * @author Aaron
 */
export async function listTables(): Promise<MCPResponse> {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query<RowDataPacket[]>("SHOW TABLES");
        const tables = rows.map((row) => Object.values(row)[FIRST_VALUE_INDEX]);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({ tables }, null, JSON_INDENTATION),
                },
            ],
        };
    }
    catch (error) {
        throw new Error(`Failed to list tables: ${(error as Error).message}`);
    }
    finally {
        connection.release();
    }
}

/**
 * Docu: Get the schema of a specific table and sample data
 * Last Updated Date: March 06, 2025
 * @param {string} table - The table name
 * @returns {object} - The schema of the table and sample data
 * @author Aaron
 */
export async function getTableInfo(table: string): Promise<MCPResponse> {
    const connection = await pool.getConnection();
    try {
        const [schemaRows] = await connection.query<RowDataPacket[]>(`DESCRIBE ??`, [table]);
        const [dataRows] = await connection.query<RowDataPacket[]>(`SELECT * FROM ?? LIMIT 3`, [table]);

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(
                        {
                            table,
                            schema: schemaRows,
                            sample_data: dataRows,
                        },
                        null,
                        JSON_INDENTATION
                    ),
                },
            ],
        };
    }
    catch (error) {
        throw new Error(`Failed to get table info for ${table}: ${(error as Error).message}`);
    }
    finally {
        connection.release();
    }
}

/**
 * Docu: Execute a SELECT query and return the results
 * Last Updated Date: March 06, 2025
 * @param {string} query - The SELECT query to execute
 * @returns {object} - The results of the query
 * @author Aaron
 */
export async function executeQuery(query: string): Promise<MCPResponse> {
    if (!isSelectQuery(query)) {
        throw new Error("Only SELECT queries are allowed for safety");
    }
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query<RowDataPacket[]>(query);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({ result: rows }, null, JSON_INDENTATION),
                },
            ],
        };
    }
    catch (error) {
        throw new Error(`Query execution failed: ${(error as Error).message}`);
    }
    finally {
        connection.release();
    }
}