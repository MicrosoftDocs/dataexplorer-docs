---
title: Entity groups
description: Learn how to use Entity groups to store entity groups in the database.
ms.reviewer: ziham1531991
ms.topic: reference
ms.date: 01/26/2025
---

# Entity groups

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Entity groups are named entities stored in a database that the [macro-expand query operator](../query/macro-expand-operator.md) can reference.


Storing an entity group in the database, instead of providing its value in the query text itself, makes it easier to manage these objects.

## Management commands

|Function |Description|
|---------|-----------|
|[.alter entity_group](alter-entity-group.md) |Alters an existing entity group and stores it inside the database metadata. |
|[.alter-merge entity_group](alter-merge-entity-group.md) |Alters and merges the value of an existing entity group. |
|[.create entity_group](create-entity-group.md) |Creates a stored entity group.|
|[.drop entity_group](drop-entity-group.md) |Drops an entity group from the database. |
|[.show entity_group(s)](show-entity-group.md) |Lists all the stored entity groups, or a specific entity group, in the current database.|

> [!NOTE]
> A query can only reference entity groups defined in the query text or in the scoped database. Out-of-scope entity groups that aren't within the query or database can’t be directly or indirectly referenced.

## Related content

* [macro-expand operator](../query/macro-expand-operator.md)
* [Entity types](../query/schema-entities/index.md)