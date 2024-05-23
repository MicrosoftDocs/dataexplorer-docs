---
title: .clear database cache query_results command
description: Learn how to use the `.clear database cache query_results` command to clear all cached query results from the database.
 clear cached query results.
ms.reviewer: amitof
ms.topic: reference
ms.date: 06/05/2023
---
# .clear database cache query_results command

Clear all [cached query results](../query/query-results-cache.md) made against the context database.

## Permissions

You must have at least [Database Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.clear` `database` `cache` `query_results`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Returns

This command returns a table with the following columns:

|Column    |Type    |Description
|---|---|---
|NodeId|`string`|Identifier of the cluster node.
|Count|`long`|The number of entries deleted by the node.

## Example

```kusto
.clear database cache query_results
```

|NodeId|Entries|
|---|---|
|Node1|42
|Node2|0
