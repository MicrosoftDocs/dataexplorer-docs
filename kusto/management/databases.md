---
title:  Databases management
description:  This article describes Databases management.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 03/24/2020
---
# Databases management

This topic describes the following database management commands:

|Command |Description |
|--------|------------|
|[`.show databases`](show-databases.md) |Returns a table in which every record corresponds to a database in the cluster that the user has access to|
|[`.show database`](show-database.md) |Returns a table showing the properties of the context database |
|[`.show cluster databases`](show-cluster-database.md) |Returns a table showing all databases attached to the cluster and to which the user invoking the command has access |
|[`.alter database prettyname`](alter-database.md) |Alters a database's pretty (friendly) name |
|[`.show database schema`](show-schema-database.md) |Returns a flat list of the structure of the selected databases with all their tables and columns in a single table or JSON object |
|[`.show databases entities`](show-databases-entities.md) |Returns a list of databases' entities (for example: tables, materialized views, etc.) |
|[`.execute database script`](execute-database-script.md) | Executes batch of management commands in scope of a single database |
