#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "my-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "greet",
        description: "Greet someone with a personalized message",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "The name of the person to greet",
            },
          },
          required: ["name"],
        },
      },
      {
        name: "calculate",
        description: "Perform basic math calculations",
        inputSchema: {
          type: "object",
          properties: {
            expression: {
              type: "string",
              description: "Math expression to evaluate (e.g., '2 + 2')",
            },
          },
          required: ["expression"],
        },
      },
      {
        name: "weather_info",
        description: "Get weather information for a city",
        inputSchema: {
          type: "object",
          properties: {
            city: {
              type: "string",
              description: "The city name",
            },
          },
          required: ["city"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "greet":
      return {
        content: [
          {
            type: "text",
            text: `Hello, ${args.name}! Nice to meet you! 👋`,
          },
        ],
      };

    case "calculate":
      try {
        // Simple math evaluation (sanitized)
        const sanitized = args.expression.replace(/[^0-9+\-*/().\s]/g, "");
        const result = eval(sanitized);
        return {
          content: [
            {
              type: "text",
              text: `${args.expression} = ${result}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error calculating "${args.expression}": ${error.message}`,
            },
          ],
          isError: true,
        };
      }

    case "weather_info":
      // Mock weather data (you could integrate with a real API)
      const weatherData = {
        "New York": "Sunny, 72°F",
        "London": "Cloudy, 65°F",
        "Tokyo": "Rainy, 68°F",
        "Sydney": "Partly cloudy, 75°F",
      };
      
      const weather = weatherData[args.city] || "Weather data not available for this city";
      
      return {
        content: [
          {
            type: "text",
            text: `Weather in ${args.city}: ${weather}`,
          },
        ],
      };

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});