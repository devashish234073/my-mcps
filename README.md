# my-mcp-server

A simple Model Context Protocol (MCP) server implementation in Node.js. This server exposes three tools via MCP:

- **greet**: Greet someone with a personalized message.
- **calculate**: Perform basic math calculations.
- **weather_info**: Get mock weather information for a city.

<a href="https://glama.ai/mcp/servers/@devashish234073/my-mcps">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@devashish234073/my-mcps/badge" alt="my-mcp-server MCP server" />
</a>

## Features
- MCP server using `@modelcontextprotocol/sdk`
- Stdio transport for easy integration
- Extensible tool definitions

## Steps

1. **Clone the repo and install dependencies**
   ```powershell
   git clone https://github.com/devashish234073/my-mcps
   cd my-mcps
   npm install
   ```
2. Open the my-mcp folder in vscode
3. Open copilot chat
   <br><img width="508" height="308" alt="image" src="https://github.com/user-attachments/assets/5cdec5fd-5931-48b4-8e28-e94ba1342e9c" />
4. In the chat click on "Configure Tools"
   <br><img width="653" height="343" alt="image" src="https://github.com/user-attachments/assets/b819df14-72c7-407b-911f-43169b7d57b3" />
5. Add more tools
   <br><img width="647" height="329" alt="image" src="https://github.com/user-attachments/assets/1a1487d6-3bb7-483a-956f-ea10b82dc7cd" />
6. Add MCP Server
   <br><img width="669" height="168" alt="image" src="https://github.com/user-attachments/assets/f80488df-9a40-4cfb-a25d-c2ea8791d53d" />
7. This creates an mcp.json file with minimal configuration of the command your mcp server will run, in our case the repo already has that so step #4 to #7 is not needed
   <br><img width="572" height="112" alt="image" src="https://github.com/user-attachments/assets/f80488df-9a40-4cfb-a25d-c2ea8791d53d" />
   <br><img width="572" height="227" alt="image" src="https://github.com/user-attachments/assets/0f2e8946-5101-48dc-9f7e-160b89597383" />
8. Just go to that file and click "Restart"
9. The server.js has three tools greet, calculate and weather_info
   <br><img width="432" height="242" alt="image" src="https://github.com/user-attachments/assets/db22b737-cde4-4950-8885-e24b965c2c2a" />
10. You can interact with these now using prompts like:
   <br><img width="330" height="550" alt="image" src="https://github.com/user-attachments/assets/f9e24139-89e7-4630-8bd5-d61b80f67fb2" />