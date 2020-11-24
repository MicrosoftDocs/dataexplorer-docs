---
title: Getting started with Kusto
description: This article describes Getting started with Kusto.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/13/2020
ms.localizationpriority: high 
---
# Getting started with Kusto

Azure Data Explorer is a service for storing and running interactive analytics on big data.

It's based on relational database management systems, and supports entities such as databases, tables, and columns. Complex analytical queries are made using the Kusto Query Language. Some query operators include:
* calculated columns
* searching and filtering on rows
* group by-aggregates
* join functions

The service offers excellent data ingestion and query performance: 
* It sacrifices the ability to do in-place updates of individual rows and cross-table constraints or transactions. 
* The service supplements, rather than replaces, traditional RDBMS systems for scenarios such as OLTP and data warehousing.
* Structured, semi-structured (for example, JSON-like nested types), and unstructured (free text) data are handled equally well.

## Interacting with Azure Data Explorer

The main way for users to interact with Azure Data Explorer (Kusto):
* Use one of the [query tools](../../tools-integrations-overview.md#azure-data-explorer-query-tools). 
* [SQL queries](../api/tds/t-sql.md).
*  [Kusto query language](../query/index.md) is primary means of interaction. KQL allows you to send data queries, and use [control commands](../management/index.md) to manage entities, discover metadata, and so on.
Both queries and control commands are short textual "programs".

## Kusto queries

A query is a read-only request to process data and return the results of this processing, without modifying the data or metadata. Kusto queries can use the [SQL language](../api/tds/t-sql.md), or the [Kusto query language](../query/index.md). As an example for the latter, the following query counts how many rows in the `Logs` table have a value in the `Level` column equal to the string `Critical`:

```kusto
Logs
| where Level == "Critical"
| count
```

> [!NOTE]
> Queries can't start with the dot (`.`) character or the hash (`#`) character.

## Control commands

Control commands are requests to Kusto to process and potentially modify data or metadata. For example, the following control command creates a new Kusto table with two columns, `Level` and `Text`:

```kusto
.create table Logs (Level:string, Text:string)
```

Control commands have their own syntax, which isn't part of the Kusto Query Language syntax, although the two share many concepts. In particular, control commands are distinguished from queries by having the first character in the text of the command be the dot (`.`) character (which can't start a query).
This distinction prevents many kinds of security attacks, simply because it prevents embedding control commands inside queries.

Not all control commands modify data or metadata. The large class of commands that start with `.show`, are used to display metadata or data. For example, the `.show tables` command returns a list of all tables in the current database.
