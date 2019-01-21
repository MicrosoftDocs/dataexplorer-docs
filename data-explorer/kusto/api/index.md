---
title: Kusto API Overview - Azure Data Explorer | Microsoft Docs
description: This article describes Kusto API Overview in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 01/15/2019
---
# Kusto API Overview

The Kusto cloud service supports the following communication endpoints:

1. A [REST API](#rest-api) endpoint, through which one can query the data in Kusto and manage it.
   This endpoint supports the [Kusto query language](../query/index.md) for queries
   and the [Kusto management language](../management/index.md) for control
   commands.
2. A [MS-TDS](#ms-tds) endpoint, which implements a subset of the Microsoft
   Tabular Data Stream (TDS) protocol, used by the Microsoft SQL Server products.
   This endpoint is primarily useful for existing tools that know how to communicate
   with a SQL Server endpoint for queries.
3. An Azure Resource Management (ARM) endpoint, which is the standard means for
   Azure services to manage resources such as Kusto clusters.

Kusto provides a number of client libraries that make use of the
endpoints above to make programmatic access easy:

1. .NET SDK
2. Python SDK
3. Java SDK 
4. Node SDK 
5. PowerShell

## REST API

The primary means of communicating with any Kusto service
is by using the service's REST API. Through this fully-documented
endpoint, callers may:

1. Query data
2. Query and modify metadata
3. Ingest data
4. Query the service health status
5. Manage resources

In fact, the different Kusto services communicate between
themselves using the same publicly-available REST API.

In addition to supporting making requests to Kusto using the
REST API, the Kusto team also provides and supports a number of
client libraries, to make it easier for callers to use the service
without dealing with the details of the REST API protocol.

## MS-TDS

As an alternative means of connecting to Kusto and querying its data, Kusto
supports the Microsoft SQL Server communication protocol (MS-TDS)
and includes a limited support for running T-SQL queries. This allows users
to run queries on Kusto using a well-known query syntax (T-SQL) and their
familiar database client tools (e.g. LINQPad, sqlcmd, Tableau, Excel, Power BI, ...)

Please see [this page](tds/index.md) for details.

## .NET Framework Libraries

This is the recommended way to invoke Kusto functionality programmatically.
A number of different libraries are provided:

- [**Kusto.Data (Kusto Client Library)**](./netfx/about-kusto-data.md), which can be used to query data, query metadata, and alter it.
- [**Kusto.Ingest (Kusto Ingestion Library)**](netfx/about-kusto-ingest.md), which makes use of Kusto.Data and extends it to facilitate
   data ingestion.


The **Kusto Client Library** (Kusto.Data) is built on top of the Kusto REST API,
and sends HTTPS requests to the target Kusto cluster. 

The **Kusto Ingestion Library** (Kusto.Ingest) utilizes Kusto.Data.



All of the above libraries make use of the Azure APIs (e.g. Azure Storage API, Azure Active Directory API).

## Python Libraries

Kusto provides a Python client library that allows callers to send data queries and control commands.



## Using Kusto from PowerShell

The Kusto .NET Framework Libraries can be used by PowerShell scripts.
See [Calling Kusto from PowerShell](powershell/powershell.md) for an example.

## IDE integration

`monaco-kusto` package supports integrating with monaco-editor which is a web editor developed by microsoft, and the basis for vscode.
see [monaco-kusto](monaco/monaco-kusto.md) for details.