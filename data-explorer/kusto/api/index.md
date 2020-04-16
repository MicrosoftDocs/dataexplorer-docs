---
title: Azure Data Explorer API Overview - Azure Data Explorer | Microsoft Docs
description: This article describes Azure Data Explorer API Overview in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 01/27/2020
---
# Azure Data Explorer API Overview

The Azure Data Explorer service supports the following communication endpoints:

1. A [REST API](#rest-api) endpoint, through which you can query and manage the data in Azure Data Explorer.
   This endpoint supports the [Kusto query language](../query/index.md) for queries
   and the [control commands](../management/index.md).
2. An [MS-TDS](#ms-tds) endpoint, which implements a subset of the Microsoft
   Tabular Data Stream (TDS) protocol, used by the Microsoft SQL Server products.
   This endpoint is primarily useful for existing tools that know how to communicate
   with a SQL Server endpoint for queries.
3. An [Azure Resource Manager (ARM)](https://docs.microsoft.com/azure/role-based-access-control/resource-provider-operations#microsoftkusto) endpoint, which is the standard means for Azure services, to manage resources, such as Azure Data Explorer clusters.

Azure Data Explorer provides a number of client libraries that make use of the
endpoints above to make programmatic access easy:

1. .NET SDK
2. Python SDK
3. Java SDK
4. Node SDK
5. Go SDK
6. PowerShell
7. R

## REST API

The primary means of communicating with any Azure Data Explorer service
is by using the service's REST API. Through this fully-documented
endpoint, callers can:

1. Query data
2. Query and modify metadata
3. Ingest data
4. Query the service health status
5. Manage resources

The different Azure Data Explorer services communicate between
themselves using the same publicly-available REST API.

In addition to supporting making requests to Azure Data Explorer using the
REST API, a number of client libraries are available to use the service
without dealing with the REST API protocol.

## MS-TDS

As an alternative means of connecting to Azure Data Explorer and querying its data, Azure Data Explorer supports the Microsoft SQL Server communication protocol (MS-TDS)
and includes a limited support for running T-SQL queries. This enables users
to run queries on Azure Data Explorer using a well-known query syntax (T-SQL) and their
familiar database client tools (such as LINQPad, sqlcmd, Tableau, Excel, and Power BI)

You can find more details about MS-TDS on [this page](tds/index.md).

## IDE integration

`monaco-kusto` package supports integrating with Monaco Editor, which is a web editor developed by Microsoft, and the basis for Visual Studio Code.
Learn more about the [monaco-kusto](monaco/monaco-kusto.md) package.
