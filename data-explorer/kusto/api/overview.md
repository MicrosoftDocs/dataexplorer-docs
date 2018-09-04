---
title: Kusto API Overview - Azure Kusto | Microsoft Docs
description: This article describes Kusto API Overview in Azure Kusto.
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: kusto
ms.topic: reference
ms.date: 09/24/2018
---
# Kusto API Overview

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

## MS SQL (TDS)

As an alternative means of connecting to Kusto and querying its data, Kusto
supports the Microsoft SQL Server communication protocol (MS-TDS)
and includes a limited support for running T-SQL queries. This allows users
to run queries on Kusto using a well-known query syntax (T-SQL) and their
familiar database client tools (e.g. LINQPad, sqlcmd, Tableau, Excel, Power BI, ...)

Please see [this page](tds/tds.md) for details.

## .NET Framework Libraries

This is the recommended way to invoke Kusto functionality programmatically.
A number of different libraries are provided:

1. [**Kusto.Data (Kusto Client Library)**](./using-the-kusto-client-library.md), which can be used to query data, query metadata, and alter it.
2. [**Kusto.Ingest (Kusto Ingestion Library)**](./kusto-ingest-client-library.md), which makes use of Kusto.Data and extends it to facilitate
   data ingestion.
3. [**Kusto.Manage (Kusto Management Library)**](./kusto-management-client-library.md), which also makes use of Kusto.Data and extends it to
   make it easier to manage Kusto clusters.
4. **Kusto.IntelliSense**, which provides functionality of query tokenization for Syntax Highlighting and IntelliSense rules.

The **Kusto Client Library** (Kusto.Data) is built on top of the Kusto REST API,
and sends HTTPS requests to the target Kusto cluster. The **Kusto Ingestion Library**
(Kusto.Ingest) and **Kusto Management Library** (Kusto.Manage) both utilize
Kusto.Data. All three libraries make use of the Azure APIs (e.g. Azure Storage API,
Azure Active Directory API).

## Python Libraries

Kusto provides a Python client library that allows callers to send data queries and control commands.

## JavaScript Libraries

Kusto provides a JavaScript client library that allows callers to send data queries and control commands.

## Using Kusto from PowerShell

The Kusto .NET Framework Libraries can be used by PowerShell scripts.
See [Calling Kusto from PowerShell](powershell/powershell.md) for an example.

## IDE integration

`monaco-kusto` package supports integrating with monaco-editor which is a web editor developed by microsoft, and the basis for vscode.
see [monaco-kusto](monaco/monaco-kusto.md) for details.