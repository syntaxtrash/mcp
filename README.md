# MCP Server

A TypeScript-based server for interacting with MySQL databases using the Model Context Protocol (MCP). Provides read-only tools to list tables, retrieve table schemas, and execute SELECT queries.

## Tools
- **`mysql-list-tables`**:
    - Description: Retrieves a list of all tables in the database.
    - Input: `{}` (optional) or no arguments.
- **`mysql-get-table-info`**:
    - Description: Returns the schema (via `SHOW CREATE TABLE`) and up to 3 sample rows for a specified table.
    - Input: `{ "table": "string" }` - The table name.
- **`mysql-execute-query`**:
    - Description: Executes a read-only SELECT query and returns the results.
    - Input: `{ "query": "string" }` - The SELECT query.


## Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd mcp-main
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Build the Project**:
   ```bash
   npm run build
   ```

## Integration

### Node.js
To integrate with a Node.js-based MCP client: [cursor](https://docs.cursor.com/context/model-context-protocol#adding-an-mcp-server-to-cursor), [windsurf](https://docs.codeium.com/windsurf/mcp), [claud](https://modelcontextprotocol.io/quickstart/user)


```json
{
  "mcpServers": {
    "mcp": {
      "command": "npm",
      "args": ["start", "--prefix", "/absolute/path/to/mcp-main"],
      "env": {
        "MYSQL_HOST": "localhost",
        "MYSQL_PORT": "3306",
        "MYSQL_USER": "<your-username>",
        "MYSQL_PASSWORD": "<your-password>",
        "MYSQL_DATABASE": "<your-database>"
      }
    }
  }
}
```

- Replace `/absolute/path/to/mcp-main` with the full path to this repository.
- Update `<your-username>`, `<your-password>`, and `<your-database>` with your MySQL credentials.

### Docker
1. **Build the Image**:
   ```bash
   docker build -t mcp-server:latest .
   ```

2. **Configure in `mcp_config.json`**:
   ```json
   {
     "mcpServers": {
       "mcp": {
         "command": "docker",
         "args": [
           "run",
           "--rm",
           "-i",
           "-e",
           "MYSQL_HOST",
           "-e",
           "MYSQL_USER",
           "-e",
           "MYSQL_PASSWORD",
           "-e",
           "MYSQL_DATABASE",
           "mcp-server:latest"
         ],
         "env": {
           "MYSQL_HOST": "host.docker.internal",
           "MYSQL_PORT": "3306",
           "MYSQL_USER": "<your-username>",
           "MYSQL_PASSWORD": "<your-password>",
           "MYSQL_DATABASE": "<your-database>"
         }
       }
     }
   }
   ```

   - Use `host.docker.internal` for MySQL on the host machine (Docker Desktop).
   - Substitute `<your-username>`, `<your-password>`, and `<your-database>` with your MySQL credentials.

## Development

### Prerequisites
- Node.js 20+
- MySQL 8.0+
- npm 10+
- Docker 27+ (optional, for containerized deployment)

### Setup
1. **Clone and Install**:
   ```bash
   git clone <repository-url>
   cd mcp-main
   npm install
   ```

2. **Configure Environment**:
   Create a `.env` file in the project root:
   ```env
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=root
   MYSQL_PASSWORD=<your-password>
   MYSQL_DATABASE=<your-database>
   ```

3. **Build**:
   ```bash
   npm run build
   ```

4. **Test Locally**:
   ```bash
   npm run dev  # Watch mode for development
   ```

### Project Structure
```
mcp-main/
├── dist/            # Compiled JavaScript output
│   ├── common/      # Shared utilities and types
│   ├── operations/  # MySQL operations
│   └── index.js     # Server entry point
├── src/             # TypeScript source files
├── .eslintrc.json   # ESLint configuration
├── .gitignore       # Git ignore settings
├── Dockerfile       # Docker configuration
├── package.json     # Dependencies and scripts
└── tsconfig.json    # TypeScript configuration
```

## Security Configuration

### MySQL
Create a MySQL user with `SELECT`-only privileges instead of using the `root` account:

1. **Log in to MySQL as Root**:
   ```bash
   mysql -u root -p
   ```

2. **Create the User**:
   ```sql
   CREATE USER 'mcp_user'@'localhost' IDENTIFIED BY 'secure_password';
   ```

3. **Grant SELECT Privileges**:
   ```sql
   GRANT SELECT ON your_database.* TO 'mcp_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

4. **Verify Permissions**:
   ```sql
   SHOW GRANTS FOR 'mcp_user'@'localhost';
   ```

5. **Update Configuration**:
   Use these credentials in your `.env` or MCP client config:
   ```env
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=mcp_user
   MYSQL_PASSWORD=secure_password
   MYSQL_DATABASE=your_database
   ```

- Replace `your_database` with your target database name.
- For Docker, use `host.docker.internal` instead of `localhost` if MySQL runs on the host.