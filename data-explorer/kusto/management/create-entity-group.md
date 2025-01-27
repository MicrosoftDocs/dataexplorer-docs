---
title: .create entity_group command
description: Learn how to use the `.create entity_group` command to create an entity group.
ms.reviewer: ziham1531991
ms.topic: reference
ms.date: 01/27/2025
---

# .create entity_group command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Creates a stored entity group with a specific name, which functions like a reusable [`let` statement](../query/let-statement.md). The entity group definition is saved as part of the database metadata.

## Permissions

You must have at least [Database Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.create` `entity_group` [`ifnotexists`] *EntityGroupName* `(`[*EntityReference*`,` ...]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| `ifnotexists` | `string` | | If specified, the entity group is only created if the entity group doesn't exist yet.|
|*EntityGroupName*| `string` | :heavy_check_mark:|The name of the entity group. |
|*EntityReference*| `string` | :heavy_check_mark:|An entity included in the entity group. |

## Returns

This command returns a table with the following columns:

|Output parameter |Type |Description|
|---|---|---|
|Name | `string` | The name of the entity group.|
|Entities | `array` | An array which includes one or more entities. If the entity group already exists, and the `ifnotexists` flag is specified, the command is ignored. Otherwise, an error is returned.|

## Examples

The following example creates the `MyEntityGroup` entity group with two entities, `cluster('c1').database('d1')` and `cluster('c2').database('d2')`.

```kusto
.create entity_group MyEntityGroup (cluster('c1').database('d1'), cluster('c2').database('d2'))
```

|Name|Entities|
|---|---|
|MyEntityGroup|["cluster('c1').database('d1')","cluster('c2').database('d2')"]|

## Related content

* [Entity groups](entity-groups.md)
* [Entity types](../query/schema-entities/index.md)
* [.alter entity_group command](alter-entity-group.md)
* [.alter-merge entity_group command](alter-merge-entity-group.md)
* [.drop entity_group command](drop-entity-group.md)
* [.show entity_group(s) command](show-entity-group.md)