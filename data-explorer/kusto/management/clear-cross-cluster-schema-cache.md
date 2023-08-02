---
title: Clear schema cache for cross-cluster queries
description: Learn how to manually clear the cross-cluster query cache.
ms.reviewer: ziham1531991
ms.topic: reference
ms.date: 05/24/2023
---

# Clear schema cache for cross-cluster queries

When running a cross-cluster query, the cluster that performs the initial query interpretation must have the schema of the entities referenced on the remote clusters. Sending the command can be an expensive network operation and therefore the remote schema entities are cached.

Any changes to the schema of the remote entity may result in unwanted effects. For example, new columns aren't recognized or deleted columns may cause a 'Partial Query Error' instead of a semantic error. For more information, see [Cross-cluster queries and schema changes](../concepts/cross-cluster-and-schema-changes.md).

You can use the following command when you need to refresh the schema without waiting for the expiry time of the cache.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.clear` `cache` `remote-schema` `cluster('`*ClusterName*`').database('`*DatabaseName*`')`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*ClusterName*|string|&check;|The name of the cluster containing the database for which to clear the cache.|
|*DatabaseName*|string|&check;|The name of the database for which to clear the cache.|

## Returns

The command returns a table with the following columns:

| Column | Type | Description |
|--|--|--|
| NodeId | `string` | Identifier of the cluster node |
| Status | `string` | Succeeded/Failed |

## Example

```kusto
.clear cache remote-schema cluster("cluster1").database("database1")
```

**Returns**

|NodeId|Status|
|---|---|
|0|Cache cleared for database database1
