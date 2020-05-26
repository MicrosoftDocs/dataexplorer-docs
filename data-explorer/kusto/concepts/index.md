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
---
# Getting started with Azure Data Explorer

Azure Data Explorer is a service for storing and running interactive analytics on big data.

It is based on relational database management systems, supporting entities such as databases, tables, and columns. Complex analytical queries are performed using the Kusto Query Language. Some query operators include calculated columns, searching and filtering or rows, group by-aggregates, and joins.

Azure Data Explorer is able to offer excellent data ingestion and query performance by "sacrificing" the ability to perform in-place updates of individual rows and cross-table constraints/transactions. Therefore, it supplements, rather than replaces, traditional RDBMS systems for scenarios such as OLTP and data warehousing.

As a Big Data service, Azure Data Explorer handles structured, semi-structured (e.g. JSON-like nested types), and unstructured (free-text) data equally well.

## Interacting with Azure Data Explorer

The main way for users to interact with Azure Data Explorer is by using one of the many available [client tools](../tools/index.md). While [SQL queries](../api/tds/t-sql.md) are supported, the primary means of interaction with Azure Data Explorer is through the use of the [Kusto query language](../query/index.md) to send data queries, and through the use of [control commands](../management/index.md) to manage entities, discover metadata, etc. Both queries and control commands are basically short textual "programs".

## Kusto Queries

A query is a read-only request to process data and return the results of this processing, without modifying the data or metadata. Queries on Azure Data Explorer
can use the [SQL language](../api/tds/t-sql.md), or the [Kusto query language](../query/index.md). As an example for the latter, the following query counts how many rows in the `Logs` table have the value of the `Level` column equals the string `Critical`:

```kusto
Logs
| where Level == "Critical"
| count
```

Queries cannot start with the dot (`.`) character or the hash (`#`) character.

## Control commands

Control commands are requests to Azure Data Explorer to process and potentially modify data or metadata. For example, the following control command creates a new Kusto table with two columns, `Level` and `Text`:

```kusto
.create table Logs (Level:string, Text:string)
```

Control commands have their own syntax (which is not part of the Kusto Query Language syntax, although the two share many concepts). In particular, control commands are distinguished from queries by having the first character in the text of the command be the dot (`.`) character (which cannot start a query).
This distinction prevents many kinds of security attacks, simply because this prevents embedding control commands inside queries.

Not all control commands modify data or metadata. A large class of commands, the commands that start with `.show`, are used to display metadata or data. For example, the `.show tables` command returns a list of all tables in the current database.
