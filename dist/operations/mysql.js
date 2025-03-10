import mysql from "mysql2/promise";
import { FIRST_VALUE_INDEX, JSON_INDENTATION, NO_AFFECTED_ROWS } from "../common/constants.js";
import { isSafeQuery } from "../common/utils.js";
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
export async function listTables() {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query("SHOW TABLES");
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
        throw new Error(`Failed to list tables: ${error.message}`);
    }
    finally {
        connection.release();
    }
}
/**
 * Docu: Get the schema of a specific table and sample data
 * Last Updated Date: March 07, 2025
 * @param {string} table - The table name
 * @returns {object} - The schema of the table and sample data
 * @author Aaron
 */
export async function getTableInfo(table) {
    const connection = await pool.getConnection();
    try {
        const [schema_rows] = await connection.query(`SHOW CREATE TABLE ??`, [table]);
        const [data_rows] = await connection.query(`SELECT * FROM ?? LIMIT 3`, [table]);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        table,
                        schema: schema_rows,
                        sample_data: data_rows,
                    }, null, JSON_INDENTATION),
                },
            ],
        };
    }
    catch (error) {
        throw new Error(`Failed to get table info for ${table}: ${error.message}`);
    }
    finally {
        connection.release();
    }
}
/**
 * Docu: Execute a SELECT query and return the results
 * Last Updated Date: March 10, 2025
 * @param {string} query - The SELECT query to execute
 * @returns {object} - The results of the query
 * @author Aaron
 */
export async function executeQuery(query) {
    if (!isSafeQuery(query)) {
        throw new Error("Only SELECT and INSERT queries are allowed for safety");
    }
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.query(query);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        result: result,
                        affectedRows: "affectedRows" in result ? result.affectedRows : NO_AFFECTED_ROWS,
                    }, null, JSON_INDENTATION),
                },
            ],
        };
    }
    catch (error) {
        throw new Error(`Query execution failed: ${error.message}`);
    }
    finally {
        connection.release();
    }
}
