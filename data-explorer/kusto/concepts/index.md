---
title: Getting started with Kusto Query Language
description: This article describes Getting started with Kusto Query Language.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 09/02/2021
ms.localizationpriority: high 
adobe-target: true
---
# Getting started with Kusto Query Language

A query is a read-only request to process data and return the results of this processing, without modifying the data or metadata. Kusto queries can use the [SQL language](../api/tds/t-sql.md), or the [Kusto Query Language](../query/index.md). As an example for the latter, the following query counts how many rows in the `Logs` table have a value in the `Level` column equal to the string `Critical`:

```kusto
Logs
| where Level == "Critical"
| count
```

> [!NOTE]
> Queries can't start with the dot (`.`) character or the hash (`#`) character.

## Control commands

[Control commands](../management/index.md) are requests to Kusto to process and potentially modify data or metadata. For example, the following control command creates a new Kusto table with two columns, `Level` and `Text`:

```kusto
.create table Logs (Level:string, Text:string)
```

Control commands have their own syntax, which isn't part of the Kusto Query Language syntax, although the two share many concepts. In particular, control commands are distinguished from queries by having the first character in the text of the command be the dot (`.`) character (which can't start a query).
This distinction prevents many kinds of security attacks, simply because it prevents embedding control commands inside queries.

Not all control commands modify data or metadata. The large class of commands that start with `.show`, are used to display metadata or data. For example, the `.show tables` command returns a list of all tables in the current database.

## Next steps

* [Tutorial: Use Kusto queries](../query/tutorial.md)
* [Samples for Kusto Queries](../query/samples.md)
