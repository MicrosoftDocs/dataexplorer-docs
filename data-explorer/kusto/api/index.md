---
title: Azure Data Explorer API Overview - Azure Data Explorer
description: This article describes API in Azure Data Explorer.
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
   This endpoint supports the [Kusto query language](../query/index.md) for queries and [control commands](../management/index.md).
2. An [MS-TDS](#ms-tds) endpoint that implements a subset of the Microsoft Tabular Data Stream (TDS) protocol, used by the Microsoft SQL Server products.
   This endpoint is useful for tools that know how to communicate with a SQL Server endpoint for queries.
3. An [Azure Resource Manager (ARM)](https://docs.microsoft.com/azure/role-based-access-control/resource-provider-operations#microsoftkusto) endpoint that is the standard means for Azure services. The endpoint is used to manage resources, such as Azure Data Explorer clusters.

Azure Data Explorer provides a number of client libraries that make use of the above endpoints, to make programmatic access easy.

* .NET SDK
* Python SDK
* Java SDK
* Node SDK
* Go SDK
* PowerShell
* R

## REST API

The primary means of communicating with any Azure Data Explorer service, is by using the service's REST API. 
With this fully-documented endpoint, callers can:

* Query data
* Query and modify metadata
* Ingest data
* Query the service health status
* Manage resources

The different Azure Data Explorer services communicate among themselves, via the same publicly-available REST API.

A number of client libraries are also available to use the service, without dealing with the REST API protocol.

## MS-TDS

Azure Data Explorer also supports the Microsoft SQL Server communication protocol (MS-TDS), and includes a limited support for running T-SQL queries. 
This protocolenables users to run queries on Azure Data Explorer using a well-known query syntax (T-SQL) and database client tools such as LINQPad, sqlcmd, Tableau, Excel, and Power BI.

For more information, see [MS-TDS](tds/index.md).

## .NET Framework Libraries

.NET Framework Libraries is the recommended way to invoke Azure Data Explorer functionality programmatically.
A number of different libraries are available.

* [Kusto.Data (Kusto Client Library)](./netfx/about-kusto-data.md): Can be used to query data, query metadata, and alter it. 
   It is built on top of the Kusto REST API, and sends HTTPS requests to the target Kusto cluster.
* [Kusto.Ingest (Kusto Ingestion Library)](netfx/about-kusto-ingest.md): Uses Kusto.Data and extends it to facilitate data ingestion.

The above libraries use Azure APIs, such as Azure Storage API and Azure Active Directory API.

## Python Libraries

Azure Data Explorer provides a Python client library that permits callers to send data queries and control commands.

## R Library

Azure Data Explorer provides an R client library that permits callers to send data queries and control commands.

## PowerShell

Azure Data Explorer .NET Framework Libraries can be used by PowerShell scripts. 
For an example, see [Calling Azure Data Explorer from PowerShell](powershell/powershell.md).

## IDE integration

The `monaco-kusto` package supports integration with the Monaco web editor.
The Monaco Editor, developed by Microsoft, is the basis for Visual Studio Code.
For more information, see [monaco-kusto package](monaco/monaco-kusto.md).
