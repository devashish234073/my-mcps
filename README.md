# my-mcp-server

A simple Model Context Protocol (MCP) server implementation in Node.js. This server exposes three tools via MCP:

- **greet**: Greet someone with a personalized message.
- **calculate**: Perform basic math calculations.
- **weather_info**: Get mock weather information for a city.

## Features
- MCP server using `@modelcontextprotocol/sdk`
- Stdio transport for easy integration
- Extensible tool definitions

## Usage

1. **Install dependencies**
   ```powershell
   npm install
   ```