# Clear schema cache for cross cluster queries

When executing cross-cluster query, the cluster that is doing the initial query interpretation must have the schema of the entities referenced in the remote clusters.
Sending the command that retrievs the schema can be expensive and therefore schemas of remote entities are cached.

Changes in the schema of the remote entity may result in unwanted effects. For example, added columns aren't recognized, or deleted columns cause a 'Partial Query Error' instead of a semantic error.
Cached schemas expire one hour after retrieval but if there is a need to refresh the schema of a specific remote entity then this command can be useful in this case.

**Syntax**

`.clear cache remote-schema cluster("cluster1").database("database1")`

**Returns**

This command returns a table with the following columns:

|Column    |Type    |Description
|---|---|---
|NodeId|`string`|Identifier of the cluster node
|Status|`string`|Succeeded/Failed

**Example**

```kusto

.clear cache remote-schema cluster("cluster1").database("database1")

```

|NodeId|Status|
|---|---|
|0|Cache cleared for database database1

> [!NOTE]
> The command may fail when not enough time has passed since the last cleanup of the cache.
> In that case, the command can be safely retried after enough time passed.
