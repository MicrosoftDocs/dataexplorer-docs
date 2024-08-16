---
title: API and SDK Overview
description: Learn about Kusto REST APIs and SDKs.
ms.reviewer: vladikb
ms.topic: reference
ms.date: 08/11/2024
---
# API and SDK Overview

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

The following communication endpoints are supported:

1. A [REST API](#rest-api) endpoint, through which you can query and manage the data in your query environment.
   This endpoint supports the [Kusto Query Language](../query/index.md) for queries and [management commands](../management/index.md).
1. An [MS-TDS](#ms-tds) endpoint that implements a subset of the Microsoft Tabular Data Stream (TDS) protocol, used by the Microsoft SQL Server products. The endpoint supports TDS versions 7.x and 8.0.
   This endpoint is useful for tools that know how to communicate with a SQL Server endpoint for queries.
::: moniker range="azure-data-explorer"
3. An [Azure Resource Manager (ARM)](/azure/role-based-access-control/resource-provider-operations#microsoftkusto) endpoint that is the standard means for Azure services. The endpoint is used to manage resources, such as Azure Data Explorer clusters.
::: moniker-end

## REST API

The primary means of communicating with any service is by using the service's [REST API](rest/index.md).
With this fully documented endpoint, callers can:

* Query data
* Query and modify metadata
* Ingest data
* Query the service health status
* Manage resources

The different services communicate among themselves, via the same [publicly available REST API](/rest/api/azurerekusto/).

A number of [client libraries](client-libraries.md) are also available to use the service, without dealing with the REST API protocol.

## MS-TDS

The service supports the Microsoft SQL Server communication protocol (MS-TDS), and includes a limited support for running T-SQL queries. The supported versions of MS-TDS include 7.x and 8.0.
This protocol enables users to run queries using a well-known query syntax (T-SQL) and database client tools such as LINQPad, sqlcmd, Tableau, Excel, and Power BI.

For more information, see [MS-TDS](../query/t-sql.md).

## Client libraries

There are a number of [client libraries](client-libraries.md) that make use of the above endpoints, to make programmatic access easy.

* .NET SDK
* Python SDK
* R
* Java SDK
* Node SDK
* Go SDK
* PowerShell

::: moniker range="azure-data-explorer"
> [!TIP]
> You can use the sample app generator wizard to create a working app tailored to your cluster, to ingest and query your data in your preferred programming language. The generated code can be used as a baseline to write your own apps, alter the code as you go, or you can copy sections of code into your own apps. For more information, see [sample app generator wizard](/azure/data-explorer/sample-app-generator-wizard).
::: moniker-end

### .NET Framework Libraries

:::moniker range="azure-data-explorer"
.NET Framework Libraries are the recommended way to interact with your cluster programmatically.
A number of different libraries are available.

* [Kusto.Data (Kusto Client Library)](./netfx/about-kusto-data.md): Can be used to query data, query metadata, and alter it.
   It's built on top of the Kusto REST API, and sends HTTPS requests to the target Kusto cluster.
* [Kusto.Ingest (Kusto Ingestion Library)](netfx/about-kusto-ingest.md): Uses `Kusto.Data` and extends it to ease data ingestion.
::: moniker-end

:::moniker range="microsoft-fabric"
.NET Framework Libraries are the recommended way to interact with your Eventhouse programmatically.
A number of different libraries are available.

* [Kusto.Data (Kusto Client Library)](./netfx/about-kusto-data.md): Can be used to query data, query metadata, and alter it.
   It's built on top of the Kusto REST API, and sends HTTPS requests to the target Eventhouse.
* [Kusto.Ingest (Kusto Ingestion Library)](netfx/about-kusto-ingest.md): Uses `Kusto.Data` and extends it to ease data ingestion.
::: moniker-end

The above libraries use Azure APIs, such as Azure Storage API and Microsoft Entra API.

### Python Libraries

The Python client library permits callers to send data queries and management commands.
For more information, see [Kusto Python SDK](python/kusto-python-client-library.md).

### R Library

The R client library permits callers to send data queries and management commands.
For more information, see [Kusto R SDK](r/kusto-r-client-library.md).

### Java SDK

:::moniker range="azure-data-explorer"
The Java client library provides the capability to query clusters using Java.
For more information, see [Kusto Java SDK](java/kusto-java-client-library.md).
::: moniker-end

:::moniker range="microsoft-fabric"
The Java client library provides the capability to query Eventhouses using Java.
For more information, see [Kusto Java SDK](java/kusto-java-client-library.md).
::: moniker-end

### Node SDK

The Node SDK is compatible with Node LTS (currently v6.14) and built with ES6.
For more information, see [Kusto Node SDK](node/kusto-node-client-library.md).

### Go SDK

The Go Client library provides the capability to query, control and ingest into your cluster using Go.
For more information, see [Kusto Golang SDK](golang/kusto-golang-client-library.md).

### PowerShell

The .NET Framework Libraries can be used by PowerShell scripts.
For more information, see [Use Kusto .NET client libraries from PowerShell](powershell/powershell.md).

## Monaco IDE integration

The `monaco-kusto` package supports integration with the Monaco web editor.
The Monaco Editor, developed by Microsoft, is the basis for Visual Studio Code.
For more information, see [monaco-kusto package](monaco/monaco-kusto.md).
