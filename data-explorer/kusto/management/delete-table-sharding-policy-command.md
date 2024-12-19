---
title: .delete table policy sharding command
description: Learn how to use the `.delete table policy sharding` command to delete a table's sharding policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 12/18/2024
monikerRange: "azure-data-explorer"
---
# .delete table policy sharding command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Delete the table sharding policy. Use the [sharding policy](../management/sharding-policy.md) to manage data sharding for databases and tables.  

The sharding policy defines if and how [Extents (data shards)](../management/extents-overview.md) should be sealed. When a database is created, it contains the default data sharding policy. This policy is inherited by all tables created in the database (unless the policy is explicitly overridden at the table level).

## Permissions

You must have at least [Table Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` *TableName* `policy` `sharding`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` | :heavy_check_mark:|The name of the table. A wildcard (`*`) denotes all tables.|

## Example

The following example deleted the sharding policy for a table:

```kusto
.delete table MyTable policy sharding 
```

## Related content

* [Data sharding policy](sharding-policy.md)
* [.show database policy sharding command](show-database-sharding-policy-command.md)
* [.show table policy sharding command](show-table-sharding-policy-command.md)
* [.alter table policy sharding command](alter-table-sharding-policy-command.md)
* [.alter-merge table policy sharding command](alter-merge-table-sharding-policy-command.md)
* [.delete database policy sharding command](delete-database-sharding-policy-command.md)
* [Extents (data shards)](extents-overview.md)
