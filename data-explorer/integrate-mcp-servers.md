---
title: Use the Model Context Protocol (MCP) Server With ADX Clusters
description: Learn how to use Model Context Protocol (MCP) with Azure Data Explorer clusters to create AI agents and applications that analyze real-time data. Get started now!
ms.reviewer: sharmaanshul
author: spelluru
ms.author: spelluru
ms.topic: conceptual
ms.date: 09/14/2025
ms.search.form: MCP, AI, agents

#CustomerIntent: As an ADX AI developer, I want to use the RTI MCP server or Azure MCP server to create AI agents and AI applications.
---

# Use MCP Servers with Azure Data Explorer (preview)

Integrating Model Context Protocol (MCP) with Azure Data Explorer (ADX) clusters lets you get AI-driven insights and actions in real time. The MCP server lets AI agents or AI applications interact with ADX by providing tools through the MCP interface, so you can query and analyze data easily.

[Model Context Protocol](https://modelcontextprotocol.io/introduction) (MCP) is a protocol that lets AI models, like Azure OpenAI models, interact with external tools and resources. MCP makes it easier for agents to find, connect to, and use enterprise data.

> [!NOTE]
>
> This feature is in preview.

The most common scenario for using the RTI or Azure MCP Server is to connect to it from an existing AI client, such as Cline, Claude, and GitHub copilot. The AI client can then use the available tools to access and interact with ADX resources using natural language.

For example, you could use GitHub Copilot agent mode with the RTI MCP Server to list KQL databases or run natural language queries on ADX clusters.

## Build AI Agents

MCP support for Azure Data Explorer is a full open-source MCP server integration. It supports natural language queries and allows agents to discover schemas and metadata dynamically. The MCP server can be used with various AI clients, such as GitHub Copilot, Cline, or Claude Desktop.

You can use the following MCP Servers to integrate and build AI agents with Azure Data Explorer:

* [Fabric RTI MCP Server (preview)](https://github.com/microsoft/fabric-rti-mcp/) - This server is designed for use with ADX clusters or with a Fabric Real-Time Intelligence (RTI) Eventhouse. It provides a unified interface for AI agents to query, reason, and act on real-time data.

* [Azure MCP Server (preview)](/azure/developer/azure-mcp-server/tools/azure-data-explorer) - The Azure MCP Server allows you to manage Azure Data Explorer resources using natural language prompts. You can list clusters, view databases, query data, and more without remembering complex Kusto Query Language (KQL) syntax.

## Architecture

The MCP Server is at the core of the system and acts as a bridge between AI agents and ADX data sources. Agents send requests to the MCP server, which translates them into ADX queries.

:::image type="content" source="media/model-context-protocol/model-context-protocol-server-architecture.png" alt-text="Diagram that shows the MCP architecture.":::

This architecture lets you build modular, scalable, and secure intelligent applications that respond to real-time signals. MCP uses a client-server architecture, so AI applications can interact with external tools efficiently. The architecture includes the following components:

* **MCP Host**: The host environment where the AI model runs (like GPT-4, Claude, or Gemini).
* **MCP Client**: An intermediary service forwards the AI model's requests to MCP servers, like GitHub Copilot, Cline, or Claude Desktop.
* **MCP Server**: Lightweight applications exposing specific capabilities by natural language APIs, databases. For example, to execute KQL queries for real-time data retrieval from ADX clusters.

## Key features

**Real-Time Data Access**: Retrieval of data from ADX clusters in seconds.

**Natural Language Interfaces**: Users or agents ask questions in plain English or other languages, and the system turns them into optimized queries (NL2KQL).

**Schema Discovery**: MCP servers show schema and metadata, so agents can learn data structures dynamically.

**Plug-and-Play Integration**: MCP clients like GitHub Copilot, Claude, and Cline connect to RTI with minimal setup because of standardized APIs and discovery mechanisms.

**Local Language Inference**: Use your preferred language to work with your data.

## Related content

* [RTI MCP server](https://github.com/microsoft/fabric-rti-mcp/)
* [Azure MCP Server](/azure/developer/azure-mcp-server/)
* [Model Context Protocol (MCP) overview](https://modelcontextprotocol.io/introduction)
