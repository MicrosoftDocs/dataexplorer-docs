---
title: graph function
description: Learn how to use the graph function to reference a persisted graph entity for querying.
ms.reviewer: royo
ms.topic: reference
ms.date: 05/23/2025
---
# graph function (preview)

>[!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

> [!NOTE]
> This feature is currently in public preview. Functionality and syntax are subject to change before General Availability.

The `graph` function is an intrinsic function that enables querying of a persisted graph entity, similar to the `cluster()`, `database()`, `external_table()`, and `table()` functions. It supports retrieving either the most recent snapshot of the graph or a specific snapshot.

## Syntax

`graph(` *GraphName* `)`

`graph(` *GraphName* `,` *SnapshotName* `)`

`graph(` *GraphName* `,` `snapshot=` *SnapshotName* `)`

## Parameters

| Name           | Type     | Required           | Description                                                                 |
|----------------|----------|--------------------|-----------------------------------------------------------------------------|
| *GraphName*    | `string` | :heavy_check_mark: | The name of the [graph model](../management/graph/graph-model-overview.md) to query. |
| *SnapshotName* | `string` |                    | The name of a specific snapshot to retrieve. If not specified, the most recent snapshot is used. |

## Returns

The `graph` function returns a graph and must be followed by a [graph operator](graph-operators.md#supported-graph-operators). The function retrieves the specified graph model name, either as the latest snapshot or a specific named snapshot.

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
| graph-shortest-paths (start)-[*]->(end)
  where start.name == "Alice" and end.name == "Database"
  project PathLength = path_length, Path = path_nodes
```

## Related content

* [Graph semantics overview](graph-semantics-overview.md)
* [Persistent graphs overview](../management/graph/graph-persistent-overview.md)
:::moniker range="microsoft-fabric || azure-data-explorer"
* [Graph model overview](../management/graph/graph-model-overview.md)
* [Graph snapshots overview](../management/graph/graph-snapshot-overview.md)
:::moniker-end
* [Graph operators](graph-operators.md)
