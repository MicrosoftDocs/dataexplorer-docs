---
title: .alter-merge entity_group command
description: Learn how to use the `.alter-merge entity_group` command to change an existing entity group.
ms.reviewer: ziham1531991
ms.topic: reference
ms.date: 01/26/2025
---

# .alter-merge entity_group command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Alters and merges an existing entity group with the provided list of entities and stores it inside the database metadata. For more information, see [Entity groups](entity-groups.md).

## Permissions

You must have at least [Database Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `entity_group` *EntityGroupName* `(`*EntityReference* [`,` ...]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*EntityGroupName*| `string` | :heavy_check_mark:|The name of the entity group. |
|*EntityReference*| `string` | :heavy_check_mark:|An entity included in the entity group. |

## Returns

This command returns a table with the following columns:

|Output parameter |Type |Description|
|---|---|---|
|Name | `string` | The name of the entity group.|
|Entities | `array` | An array which includes one or more entities.|

## Examples

The following example edits the `MyEntityGroup` entity group and adds the entity `cluster('c2').database('d2')` to the entity group.

First run the following command to create a new entity group with entity `cluster('c1').database('d1')`:

```kusto
.create entity_group MyEntityGroup (cluster('c1').database('d1'))
```

**Output**

|Name|Entities|
|---|---|
|MyEntityGroup|["cluster('c1').database('d1')"]|

Then run the following command to edit the existing entity group `MyEntityGroup` and add the entity `cluster('c2').database('d2')`:

```kusto
.alter-merge entity_group MyEntityGroup (cluster('c2').database('d2'))
```

**Output**

|Name|Entities|
|---|---|
|MyEntityGroup|["cluster('c1').database('d1')","cluster('c2').database('d2')"]|

## Related content

* [Entity groups](entity-groups.md)
* [Entity types](../query/schema-entities/index.md)
* [.create entity_group command](create-entity-group.md)
* [.alter entity_group command](alter-entity-group.md)
* [.drop entity_group command](drop-entity-group.md)
* [.show entity_group(s) command](show-entity-group.md)
