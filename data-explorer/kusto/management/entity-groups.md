# Stored entity group management overview

Stored entity groups are named entities that are stored in a database and can be referenced by the [macro-expand query operator](../query/macro-expand-operator.md). 
Storing an entity group in the database instead of providing its value in the query text itself makes it easier to manage these objects.

> [!NOTE]
>  A query can only reference entity groups defined in the query text or in the database-in-context. Entity groups in other databases or clusters (directly or indirectly) cannot be referenced.

This section describes control commands used for creating, altering and dropping entity groups:

|Function |Description|
|---------|-----------|
|[.alter entity_group](alter-entity-group.md) |Alters an existing entity group and stores it inside the database metadata |
|[.alter-merge entity_group](alter-merge-entity-group.md) |Alters and merge the value of an existing function |
|[.create entity_group](create-entity-group.md) |Creates a stored entity group|
|[.drop entity_grop](drop-entity-group.md) |Drops an entity group from the database |
|[.show entity_grop and .show entity_groups](show-entity-group.md) |Lists all the stored entity groups, or a specific entity group, in the currently-selected database|
