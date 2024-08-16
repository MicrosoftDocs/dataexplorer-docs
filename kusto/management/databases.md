---
title:  Databases management
description:  This article describes Databases management.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 08/11/2024
---
# Databases management

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

This topic describes the following database management commands:

:::moniker range="azure-data-explorer"
|Command |Description |
|--------|------------|
|[`.show databases`](show-databases.md) |Returns a table in which every record corresponds to a database in the cluster that the user has access to|
|[`.show database`](show-database.md) |Returns a table showing the properties of the context database |
|[`.show cluster databases`](show-cluster-database.md) |Returns a table showing all databases attached to the cluster and to which the user invoking the command has access |
|[`.alter database prettyname`](alter-database.md) |Alters a database's pretty (friendly) name |
|[`.show database schema`](show-schema-database.md) |Returns a flat list of the structure of the selected databases with all their tables and columns in a single table or JSON object |
|[`.show databases entities`](show-databases-entities.md) |Returns a list of databases' entities (for example: tables, materialized views, etc.) |
|[`.execute database script`](execute-database-script.md) | Executes batch of management commands in scope of a single database |
::: moniker-end
:::moniker range="microsoft-fabric"
|Command |Description |
|--------|------------|
|[`.show databases`](show-databases.md) |Returns a table in which every record corresponds to a database in the eventhouse that the user has access to|
|[`.show database`](show-database.md) |Returns a table showing the properties of the context database |
|[`.show cluster databases`](show-cluster-database.md) |Returns a table showing all databases attached to the eventhouse and to which the user invoking the command has access |
|[`.alter database prettyname`](alter-database.md) |Alters a database's pretty (friendly) name |
|[`.show database schema`](show-schema-database.md) |Returns a flat list of the structure of the selected databases with all their tables and columns in a single table or JSON object |
|[`.show databases entities`](show-databases-entities.md) |Returns a list of databases' entities (for example: tables, materialized views, etc.) |
|[`.execute database script`](execute-database-script.md) | Executes batch of management commands in scope of a single database |
::: moniker-end