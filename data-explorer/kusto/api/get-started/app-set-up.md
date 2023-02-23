---
title: Set up your development environment to use Azure Data Explorer client libraries
description: Learn how to set up your development environment to use Azure Data Explorer client libraries.
ms.reviewer: yogilad
ms.topic: how-to
ms.date: 02/23/2023
---
# Set up your development environment to use Azure Data Explorer client libraries

Learn how to set up your environment to use Azure Data Explorer client libraries. You can use these libraries to create apps that connect with a cluster and run queries or ingest data.

In this article, you learn how to install client library packages for your preferred language

## Prerequisites

Language specific prerequisites:

### [C\#](#tab/csharp)

One of the following .NET SDKs:

- .NET SDK 5.0 or later
- .NET Core 2.1 or later
- .NET Standard 2.1 or later
- .NET Framework 4.7.2 or later

### [Python](#tab/python)

- [Python 3.7 or later](https://www.python.org/downloads/)
    - Ensure the `python` executable is in your `PATH`
    - Verify installation: In a command shell, run `python --version` to check that the version is 3.7 or later

### [Node.js](#tab/nodejs)

- [Node 16 or later](https://nodejs.org/en/download/) built with ES6
    - Ensure the `node` executable is in your `PATH`
    - Verify installation: In a command shell, run `node --version` to check that the version is 3.7 or later

<!-- ### [Go](#tab/go) -->

### [Java](#tab/java)

- JDK 11 or later
    - Ensure the `java` executable is in your `PATH`
    - Verify installation: In a command shell, run `java -version` to check that the version is 11 or later
- Maven 3.6.3 or later
    - Ensure the `mvn` executable is in your `PATH`
    - Verify installation: In a command shell, run `mvn -version` to check that the version is 3.6.3 or later
---

### Install the package

This section walks you through installing the the Azure Data Explorer client library in your environment.

The following table lists the client libraries for Azure Data Explorer and the corresponding package names.

| Library Name | Description |
| -- | -- |
| Kusto Data library | Provides a client for connecting to Azure Data Explorer. Use the client library to [query data](../../query/index.md) or run [management commands](../../management/index.md). |
| Kusto Ingest library | Provides a client for ingesting data into Azure Data Explorer. Use the ingest client library to [ingest data](../../../ingest-data-overview.md) into Azure Data Explorer. |

Add the Azure Data Explorer client libraries for your preferred language to your project, or use the package manager appropriate for your language to install the client libraries.

### [C\#](#tab/csharp)

```bash
dotnet add package Microsoft.Azure.Kusto.Data --version 11.2.2
dotnet add package Microsoft.Azure.Kusto.Ingest --version 11.2.2
```

### [Python](#tab/python)

```bash
python -m pip install azure-kusto-data
python -m pip install azure-kusto-ingest
```

### [Node.js](#tab/nodejs)

```bash
npm install azure-kusto-data
npm install azure-kusto-ingest
```

<!-- ### [Go](#tab/go) -->

### [Java](#tab/java)

```bash
mvn clean install azure-kusto-data
mvn clean install azure-kusto-ingest
```

---

### Learn how to create apps that use client libraries

The following articles walk you through creating apps that use the Azure Data Explorer client libraries.

- [Create a Hello Kusto! app](app-hello-kusto.md)
- TBD

## Next steps

<!-- Advance to the next article to learn how to create... -->
> [!div class="nextstepaction"]
> [KQL quick reference](../../../kql-quick-reference.md)

> [!div class="nextstepaction"]
> [Sample app generator wizard](../../../sample-app-generator-wizard.md)
