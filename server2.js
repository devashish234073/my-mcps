#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { Builder, Capabilities } from 'selenium-webdriver';
import edge from 'selenium-webdriver/edge.js'; // Edge module
import fs from 'fs';
import path from 'path';

const server = new Server(
  {
    name: "mcp-server-2",
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
        name: "test_html_in_browser",
        description: "Capture a screenshot after 10 seconds and return it as a base64 string.",
        inputSchema: {
          type: "object",
          properties: {
            "html": {
              type: "string",
              description: "HTML content to be tested in the browser",
            },
          },
          required: [],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "test_html_in_browser":
      try {
        let html = args.html;
        if (!html) {
          return {
            content: [
              {
                type: "text",
                text: "No HTML content provided.",
              },
            ],
            isError: true,
          };
        }
        return await runEdgeTestAndCaptureLogs(html);
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error testing in browser: ${error.message}`,
            }
          ],
          isError: true,
        };
      }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

async function runEdgeTestAndCaptureLogs(html) {
  let driver;
  try {
    // Path to your msedgedriver.exe (update this if necessary)
    const edgeDriverPath = path.resolve('D:\\Progs\\selenium\\edgedriver_win64\\msedgedriver.exe');

    // Configure Edge options and enable browser logging
    let capabilities = Capabilities.edge();
    capabilities.set('ms:edgeOptions', {
      args: ['--log-level=0'] // Sets the logging level (0 for INFO, 1 for WARNING, 2 for ERROR, 3 for FATAL)
    });

    // Set the path for the EdgeDriverService
    let service = new edge.ServiceBuilder(edgeDriverPath).enableVerboseLogging();

    // Build the WebDriver for Edge with the specified capabilities and service
    driver = await new Builder()
      .withCapabilities(capabilities)
      .setEdgeService(service)
      .build();

    // Navigate to your local HTML file
    fs.writeFileSync('./index.html', html, 'utf8');
    const htmlFilePath = path.resolve('./index.html');
    await driver.get(`file:///${htmlFilePath}`);

    // Wait for a few seconds to ensure the page and scripts load
    await driver.sleep(3000);

    // Capture console logs (including errors)
    const logs = await driver.manage().logs().get('browser');
    fs.writeFileSync("logs.txt", JSON.stringify(logs, null, 2), 'utf8');
    let capturedLogs = { "logs": [], "errorCount": 0 };
    let errorCount = 0;
    for (let entry of logs) {
      capturedLogs["logs"].push(`[${entry.level.name}] ${entry.message}`);
      if (entry.level.name === 'SEVERE') { // In Edge/Chrome, errors are typically logged as 'SEVERE'
        errorCount++;
      }
    }
    capturedLogs["errorCount"] = errorCount;
    fs.writeFileSync("out.txt", JSON.stringify(capturedLogs, null, 2), 'utf8');
    let retVal = {
      content: [
        {
          type: "text",
          text: JSON.stringify(capturedLogs)
        }
      ]
    };
    return retVal;
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error during Selenium test: ${error.message}`
        }
      ]
    };
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

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