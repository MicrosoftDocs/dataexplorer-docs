---
title: graph function
description: Learn how to use the graph function to reference a persisted graph entity for querying.
ms.reviewer: royo
ms.topic: reference
ms.date: 05/28/2025
---
# graph function (preview)

>[!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

> [!NOTE]
> This feature is currently in public preview. Functionality and syntax are subject to change before General Availability.

The `graph` function is an intrinsic function that enables querying of a persisted graph entity, similar to the `cluster()`, `database()`, `external_table()`, and `table()` functions. It supports retrieving either the most recent snapshot of the graph, a specific snapshot, or creating a transient graph from the model.

## Permissions

To run this function, the user needs [Database viewer permissions](../../access-control/role-based-access-control.md).

## Syntax

`graph(` *GraphName* `)`

`graph(` *GraphName* `,` *SnapshotName* `)`

`graph(` *GraphName* `,` `snapshot=` *SnapshotName* `)`

`graph(` *GraphName* `,` *Transient* `)`

## Parameters

| Name           | Type     | Required           | Description                                                                 |
|----------------|----------|--------------------|-----------------------------------------------------------------------------|
| *GraphName*    | `string` | :heavy_check_mark: | The name of the [graph model](../management/graph/graph-model-overview.md) to query. |
| *SnapshotName* | `string` |                    | The name of a specific snapshot to retrieve. If not specified, the most recent snapshot is used. |
| *Transient*    | `bool`   |                    | If `true`, creates a transient graph from the model (no snapshot is used). If `false`, uses the latest snapshot (same as omitting this parameter). |

## Returns

The `graph` function returns a graph and must be followed by a [graph operator](graph-operators.md#supported-graph-operators). The function retrieves the specified graph model name, either as:

- The latest snapshot (default or when `false` is specified)
- A specific named snapshot
- A transient graph from the model (when `true` is specified)

## Examples

### Query the latest snapshot

The following example queries the most recent snapshot of a persisted graph named "SecurityGraph":

```kusto
graph("SecurityGraph")
| graph-match (user)-[permission]->(resource)
  where user.type == "User" and resource.type == "Database"
  project UserName = user.name, ResourceName = resource.name, Permission = permission.type
```

### Query a specific snapshot

The following example queries a specific snapshot of the graph:

```kusto
graph("SecurityGraph", "Snapshot_2025_05_01")
| graph-match (attacker)-[attacks]->(target)-[connects]->(system)
  where attacker.name == "MaliciousActor"
  project Attacker = attacker.name, Target = target.name, System = system.name
```

### Query with named parameter syntax

The following example uses the named parameter syntax to specify a snapshot:

```kusto
graph("SecurityGraph", snapshot="Snapshot_2025_05_01")
| graph-shortest-paths (start)-[e*1..20]->(end)
  where start.name == "Alice" and end.name == "Database"
  project PathLength = array_length(e), Path = e
```

### Create a transient graph from the model

The following example creates a transient graph from the model, similar to the `make-graph` operator:

```kusto
graph("SecurityGraph", true)
| graph-match (user)-[permission]->(resource)
  where user.type == "User" and resource.type == "Database"
  project UserName = user.name, ResourceName = resource.name, Permission = permission.type
```

### Use false to specify latest snapshot

The following example explicitly specifies `false` to use the latest snapshot, which is equivalent to omitting the second parameter:

```kusto
graph("SecurityGraph", false)
| graph-match (user)-[permission]->(resource)
  where user.type == "User" and resource.type == "Database"
  project UserName = user.name, ResourceName = resource.name, Permission = permission.type
```

## Related content

* [Graph semantics overview](graph-semantics-overview.md)
* [Persistent graphs overview](../management/graph/graph-persistent-overview.md)
* [Graph model overview](../management/graph/graph-model-overview.md)
* [Graph snapshots overview](../management/graph/graph-snapshot-overview.md)
* [Graph operators](graph-operators.md)
