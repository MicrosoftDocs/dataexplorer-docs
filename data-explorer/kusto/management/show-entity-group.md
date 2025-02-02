---
title: .show entity_group(s) command
description: Learn how to use the `.show entity_group` command to view existing entity groups.
ms.reviewer: ziham1531991
ms.topic: reference
ms.date: 01/27/2025
---

# .show entity_group(s) command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Lists all the [entity groups](entity-groups.md) in the selected database or lists the details of one specific stored entity group.

## Permissions

You must have at least [Database Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.show` `entity_groups`

`.show` `entity_group` *EntityGroupName*

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*EntityGroupName*| `string` | |The name of the specific entity group you wish to view. |

## Returns

This command returns a table with the following columns:

|Output parameter |Type |Description|
|---|---|---|
|Name | `string` | The name of the entity group.|
|Entities | `array` | An array which includes one or more entities. If the entity group doesn't exist, an error is returned.|

## Examples

The following examples show how to use the `.show entity_group` and `.show entity_group` commands.

### Show entity groups

The following example returns all the entity groups in the selected database, `eg1` and `eg2`, along with their entities.

```kusto
.show entity_groups
```

**Output**

|Name|Entities|
|---|---|
|eg1|["cluster('c1').database('d1')"]|
|eg2|["cluster('c2').database('d2')"]|

### Show an entity group

The following example returns the entity group, `eg1` along with its entity, `cluster('c1').database('d1')`.

```kusto
.show entity_group eg1
```

**Output**

|Name|Entities|
|---|---|
|eg1|["cluster('c1').database('d1')"]|

## Related content

* [Entity groups](entity-groups.md)
* [Entity types](../query/schema-entities/index.md)
* [.alter entity_group command](alter-entity-group.md)
* [.alter-merge entity_group command](alter-merge-entity-group.md)
* [.create entity_group command](create-entity-group.md)
* [.drop entity_group command](drop-entity-group.md)