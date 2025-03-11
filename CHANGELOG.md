# Changelog

All notable changes to this project will be documented in this file.

## [1.0.4] - March 11, 2025 Manila Time
### Changed
- Updated `mysql-execute-query` tool description in `src/index.ts` to "Executes a SELECT, INSERT, UPDATE, or DELETE query on the MySQL database and returns the results or affected rows."
- Made `MYSQL_PASSWORD` optional in `EnvSchema` (`src/common/types.ts`), allowing password-less MySQL connections.
- Updated README.md to document the optional MYSQL_PASSWORD, expanded the mysql-execute-query functionality, removed the installation section, and updated usage to npx

## [1.0.2] - March 11, 2025 Manila Time
### Added
- Support for `UPDATE` and `DELETE` queries in the `mysql-execute-query` tool, in addition to `SELECT` and `INSERT`.
  - Updated `isSafeQuery` function in `src/common/utils.ts` to allow `UPDATE` and `DELETE` while still blocking `DROP`.
  - Updated `MySQLExecuteQuerySchema` description in `src/common/types.ts` to reflect the new query types.

### Changed
- Updated `README.md` to document the expanded `mysql-execute-query` functionality and adjust MySQL user privileges in the security configuration.

## [1.0.1] - March 10, 2025 Manila Time
### Added
- Support for `INSERT` queries in the `mysql-execute-query` tool, allowing users to create dummy data in the database.
  - Updated `executeQuery` function to handle both `SELECT` and `INSERT` queries safely.
  - Added type-safe handling of query results (`RowDataPacket[]` for `SELECT`, `ResultSetHeader` for `INSERT`).
- Updated `README.md` to reflect the new `INSERT` functionality.

### Changed
- Modified `isSelectQuery` to `isSafeQuery` in `src/common/utils.ts` to allow `INSERT` while still restricting `UPDATE`, `DELETE`, and `DROP`.
- Updated `MySQLExecuteQuerySchema` description in `src/common/types.ts` to include `INSERT`.

## [1.0.0] - March 07, 2025 Manila Time
### Added
- Initial release of the MCP server with MySQL integration.
- Tools: `mysql-list-tables`, `mysql-get-table-info`, and `mysql-execute-query` (limited to `SELECT` queries).
- Basic TypeScript setup with Zod for schema validation.
- MySQL connection pool configuration via environment variables.