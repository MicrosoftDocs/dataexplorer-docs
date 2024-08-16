---
title: .clear database cache query_results command
description: Learn how to use the `.clear database cache query_results` command to clear all cached query results from the database.
 clear cached query results.
ms.reviewer: amitof
ms.topic: reference
ms.date: 08/11/2024
---
# .clear database cache query_results command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Clear all [cached query results](../query/query-results-cache.md) made against the context database.

## Permissions

You must have at least [Database Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.clear` `database` `cache` `query_results`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Returns

This command returns a table with the following columns:

|Column    |Type    |Description |
|---|---|--- |
|NodeId|`string`|The node identifier. |
|Count|`long`|The number of entries deleted by the node. |

## Example

```kusto
.clear database cache query_results
```

|NodeId|Entries|
|---|---|
|Node1|42 |
|Node2|0 |
