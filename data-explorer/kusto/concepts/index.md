---
title: Getting started with Kusto - Azure Data Explorer | Microsoft Docs
description: This article describes Getting started with Kusto in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/23/2018

---
# Getting started with Kusto

Kusto is a service for storing and running interactive analytics
over Big Data.

It is based on relational database management systems, supporting entities
such as databases, tables, and columns, as well as providing complex analytics
query operators (such as calculated columns, searching and filtering or rows,
group by-aggregates, joins).

Kusto offers excellent data ingestion and query performance by "sacrificing"
the ability to perform in-place updates of individual rows and cross-table
constraints/transactions. Therefore, it supplants, rather than replaces,
traditional RDBMS systems for scenarios such as OLTP and data warehousing.

As a Big Data service, Kusto handles structured, semi-structured (e.g. JSON-like
nested types), and unstructured (free-text) data equally well.

## Interacting with Kusto

The main way for users to interact with Kusto is by using one of the many
[client tools](../tools/index.md) available for Kusto. While [SQL queries](../api/tds/t-sql.md) to
Kusto are supported, the primary means of interaction with Kusto is through
the use of the [Kusto query language](../query/index.md)
to send data queries, and through the use of [control commands](../management/index.md)
to manage Kusto entities, discover metadata, etc. Both queries and control commands
are basically short textual "programs".

## Queries

A Kusto query is a read-only request to process Kusto data and return the results
of this processing, without modifying the Kusto data or metadata. Kusto queries
can use the [SQL language](../api/tds/t-sql.md), or the [Kusto query language](../query/index.md).
As an example for the latter, the following query counts how many rows in the
`Logs` table have the value of the `Level` column equals the string `Critical`:

```kusto
Logs
| where Level == "Critical"
| count
```

Queries cannot start with the dot (`.`) character or the hash (`#`) character.

## Control commands

Control commands are requests to Kusto to process and potentially modify data
or metadata. For example, the following control command creates a new Kusto
table with two columns, `Level` and `Text`:

```kusto
.create table Logs (Level:string, Text:string)
```

Control commands have their own syntax (which is not part of the Kusto query
language syntax, although the two share many concepts). In particular, control
commands are distinguished from queries by having the first character in the
text of the command be the dot (`.`) character (which cannot start a query).
This distinction prevents many kinds of security attacks, simply because this
prevents embedding control commands inside queries.

Not all control commands modify Kusto data or metadata. A large class of
commands, the commands that start with `.show`, are used to display metadata
or data about Kusto. For example, the `.show tables` command returns a list
of all tables in the current database.