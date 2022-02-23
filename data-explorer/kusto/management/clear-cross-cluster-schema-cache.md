# Clear schema cache for cross cluster queries

When executing cross-cluster query, the cluster that is doing the initial query interpretation must have the schema of the entities referenced in the remote clusters.

Sending the command that retrieves the schema can be expensive and therefore the remote schemas are cached.

Changes in the schema of the remote entity may result in unwanted effects. For example, added columns aren't recognized, or deleted columns cause a 'Partial Query Error' instead of a semantic error. See [Cross Cluster Schema Changes](../concepts/crossclusterandschemachanges.md).

This command can be used if there is a need to refresh the schema without waiting for the expiry time of the cache which is one hour.

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

