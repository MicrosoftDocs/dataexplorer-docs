---
title: Azure Data Explorer API Overview - Azure Data Explorer
description: This article describes API in Azure Data Explorer.
ms.reviewer: vladikb
ms.topic: reference
ms.date: 09/11/2022
---
# Azure Data Explorer API Overview

The Azure Data Explorer service supports the following communication endpoints:

1. A [REST API](#rest-api) endpoint, through which you can query and manage the data in Azure Data Explorer.
   This endpoint supports the [Kusto Query Language](../query/index.md) for queries and [control commands](../management/index.md).
1. An [MS-TDS](#ms-tds) endpoint that implements a subset of the Microsoft Tabular Data Stream (TDS) protocol, used by the Microsoft SQL Server products.
   This endpoint is useful for tools that know how to communicate with a SQL Server endpoint for queries.
1. An [Azure Resource Manager (ARM)](/azure/role-based-access-control/resource-provider-operations#microsoftkusto) endpoint that is the standard means for Azure services. The endpoint is used to manage resources, such as Azure Data Explorer clusters.

## REST API

The primary means of communicating with any Azure Data Explorer service is by using the service's [REST API](rest/index.md).
With this fully documented endpoint, callers can:

* Query data
* Query and modify metadata
* Ingest data
* Query the service health status
* Manage resources

The different Azure Data Explorer services communicate among themselves, via the same [publicly available REST API](/rest/api/azurerekusto/).

A number of [client libraries](client-libraries.md) are also available to use the service, without dealing with the REST API protocol.

## MS-TDS

Azure Data Explorer also supports the Microsoft SQL Server communication protocol (MS-TDS), and includes a limited support for running T-SQL queries.
This protocol enables users to run queries on Azure Data Explorer using a well-known query syntax (T-SQL) and database client tools such as LINQPad, sqlcmd, Tableau, Excel, and Power BI.

For more information, see [MS-TDS](../../t-sql.md).

## Client libraries

Azure Data Explorer provides a number of client libraries that make use of the above endpoints, to make programmatic access easy.

* .NET SDK
* Python SDK
* R
* Java SDK
* Node SDK
* Go SDK
* PowerShell

> [!TIP]
> You can use the sample app generator wizard to create a working app tailored to your cluster, to ingest and query your data in your preferred programming language. The generated code can be used as a baseline to write your own apps, alter the code as you go, or you can copy sections of code into your own apps. For more information, see [sample app generator wizard](../../sample-app-generator-wizard.md).

### .NET Framework Libraries

.NET Framework Libraries are the recommended way to invoke Azure Data Explorer functionality programmatically.
A number of different libraries are available.

* [Kusto.Data (Kusto Client Library)](./netfx/about-kusto-data.md): Can be used to query data, query metadata, and alter it.
   It's built on top of the Kusto REST API, and sends HTTPS requests to the target Kusto cluster.
* [Kusto.Ingest (Kusto Ingestion Library)](netfx/about-kusto-ingest.md): Uses `Kusto.Data` and extends it to ease data ingestion.

The above libraries use Azure APIs, such as Azure Storage API and Azure Active Directory API.

### Python Libraries

Azure Data Explorer provides a Python client library that permits callers to send data queries and control commands.
For more information, see [Azure Data Explorer Python SDK](python/kusto-python-client-library.md).

### R Library

Azure Data Explorer provides an R client library that permits callers to send data queries and control commands.
For more information, see [Azure Data Explorer R SDK](r/kusto-r-client-library.md).

### Java SDK

The Java client library provides the capability to query Azure Data Explorer clusters using Java.
For more information, see [Azure Data Explorer Java SDK](java/kusto-java-client-library.md).

### Node SDK

Azure Data Explorer Node SDK is compatible with Node LTS (currently v6.14) and built with ES6.
For more information, see [Azure Data Explorer Node SDK](node/kusto-node-client-library.md).

### Go SDK

Azure Data Explorer Go Client library provides the capability to query, control and ingest into Azure Data Explorer clusters using Go.
For more information, see [Azure Data Explorer Golang SDK](golang/kusto-golang-client-library.md).

### PowerShell

Azure Data Explorer .NET Framework Libraries can be used by PowerShell scripts.
For more information, see [Calling Azure Data Explorer from PowerShell](powershell/powershell.md).

## Monaco IDE integration

The `monaco-kusto` package supports integration with the Monaco web editor.
The Monaco Editor, developed by Microsoft, is the basis for Visual Studio Code.
For more information, see [monaco-kusto package](monaco/monaco-kusto.md).