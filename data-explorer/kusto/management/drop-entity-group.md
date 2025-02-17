---
title: .drop entity_group command
description: Learn how to use the `.drop entity_group` command to remove an entity group from your database.
ms.reviewer: ziham1531991
ms.topic: reference
ms.date: 01/27/2025
---

# .drop entity_group command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Drops an entity group from a database.

## Permissions

You must have at least [Database Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.drop` `entity_group` *EntityGroupName*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*EntityGroupName*| `string` | |The name of the specific entity group you want to drop. |

## Returns

This command returns a list of the remaining tables in the database.

|Output parameter |Type |Description|
|---|---|---|
|Name | `string` | The name of the entity group.|
|Entities | `array` | An array with one or more entities.|

## Examples

The following example drops the `MyEntityGroup` from your selected database.

```kusto
.drop entity_group MyEntityGroup
```

## Related content

* [Entity groups](entity-groups.md)
* [Entity types](../query/schema-entities/index.md)
* [.create entity_group command](create-entity-group.md)
* [.alter entity_group command](alter-entity-group.md)
* [.alter-merge entity_group command](alter-merge-entity-group.md)
* [.show entity_group(s) command](show-entity-group.md)