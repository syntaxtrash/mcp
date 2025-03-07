#!/usr/bin/env node

import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { zodToJsonSchema } from "zod-to-json-schema";

import { MySQLListTablesSchema, MySQLGetTableInfoSchema, MySQLExecuteQuerySchema, } from "./common/types.js";
import { listTables, getTableInfo, executeQuery } from "./operations/mysql.js";
import { EXIT_CODE_FAILURE } from "./common/constants.js";

const server = new Server(
    {
        name: "mcp",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

/**
 * Docu: List all tables in the database
 * Last Updated Date: March 06, 2025
 * @returns {object} - The list of tables in the database
 * @author Aaron
 */
server.setRequestHandler(ListToolsRequestSchema, () => {
    return {
        tools: [
            {
                name: "mysql-list-tables",
                description: "asdf Lists all tables in the MySQL database. Pass an empty object or omit arguments.",
                inputSchema: zodToJsonSchema(MySQLListTablesSchema),
            },
            {
                name: "mysql-get-table-info",
                description: "Returns the schema (columns and types) of a specific table in the MySQL database.",
                inputSchema: zodToJsonSchema(MySQLGetTableInfoSchema),
            },
            {
                name: "mysql-execute-query",
                description: "Executes a read-only SELECT query on the MySQL database and returns the results.",
                inputSchema: zodToJsonSchema(MySQLExecuteQuerySchema),
            }
        ],
    };
});

/**
 * Docu: Call a specific tool
 * Last Updated Date: March 06, 2025
 * @param {object} request - The request object
 * @returns {object} - The response object
 * @author Aaron
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    switch (request.params.name) {
        case "mysql-list-tables": {
            if (request.params.arguments) {
                MySQLListTablesSchema.parse(request.params.arguments);
            }
            return await listTables();
        }
        case "mysql-get-table-info": {
            if (!request.params.arguments) {
                throw new Error("Arguments are required; provide a table name in the format: {\"table\": \"table_name\"}");
            }
            const args = MySQLGetTableInfoSchema.parse(request.params.arguments);
            return await getTableInfo(args.table);
        }
        case "mysql-execute-query": {
            if (!request.params.arguments) {
                throw new Error("Arguments are required; provide a SELECT query in the format: {\"query\": \"SELECT ...\"}");
            }
            const args = MySQLExecuteQuerySchema.parse(request.params.arguments);
            return await executeQuery(args.query);
        }
        default:
            throw new Error(`Unknown tool: ${request.params.name}`);
    }
});

/**
 * Docu: Start the MCP server
 * Last Updated Date: March 06, 2025
 * @author Aaron
 */
async function runServer() {
    try {
        const transport = new StdioServerTransport();
        await server.connect(transport);
    }
    catch (error) {
        console.error("Failed to start MCP Server:", error);
        process.exit(EXIT_CODE_FAILURE);
    }
}

runServer();