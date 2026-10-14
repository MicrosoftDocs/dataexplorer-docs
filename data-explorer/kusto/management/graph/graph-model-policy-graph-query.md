---
title: graph_query graph model policy
description: Learn how to show, alter, and delete the graph_query policy for a graph model.
ms.reviewer: royo, danieldror
ms.topic: reference
ms.date: 07/08/2026
---

# graph_query graph model policy (preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

> [!NOTE]
> This feature is currently in preview. Functionality and syntax are subject to change before General Availability.

The `graph_query` policy controls graph query behavior for a graph model.

The policy controls which snapshot is selected when a query references a graph model without naming a snapshot. For example, the policy applies to queries that use `graph("MyGraph")`. It doesn't apply when a query names a specific snapshot.

The default `DefaultSnapshotQueryBehavior` value is `LatestSnapshot`.

If a query names a specific snapshot, that snapshot must be available for queries. If the named snapshot isn't available yet, the query fails. If a query doesn't name a snapshot, `LatestSnapshot` selects the latest available snapshot regardless of indexing state. `LatestIndexedSnapshot` selects the latest available snapshot that satisfies the model's `snapshot_indexing` policy.

## Permissions

To show the policy, you need [Database Monitor or Database Viewer permissions](../../access-control/role-based-access-control.md).

To alter or delete the policy, you need Graph Admin permissions on the graph model.

## Syntax

`.show` `graph_model` *GraphModelName* `policy` `graph_query`

`.show` `graph_model` `*` `policy` `graph_query`

`.alter` `graph_model` *GraphModelName* `policy` `graph_query` *PolicyObject*

`.delete` `graph_model` *GraphModelName* `policy` `graph_query`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*GraphModelName*|String|✅|The graph model name.|
|*PolicyObject*|String|✅ for `.alter`|A JSON policy object.|
|`DefaultSnapshotQueryBehavior`|String|✅|The snapshot selection behavior for `graph("model")`. Supported values are `LatestSnapshot` and `LatestIndexedSnapshot`.|

## Default snapshot query behavior

|Value|Description|
|--|--|
|`LatestSnapshot`|Use the latest available snapshot, regardless of indexing state. This is the default value.|
|`LatestIndexedSnapshot`|Use the latest available snapshot that satisfies the model's `snapshot_indexing` policy. If no matching snapshot is available, the query fails with a clear error.|

Deleting the policy restores the default behavior.

## Returns

This command returns a table with the following columns:

|Column|Type|Description|
|--|--|--|
|PolicyName|String|The policy name.|
|EntityName|String|The graph model name.|
|Policy|String|The JSON representation of the policy.|
|ChildEntities|String|Reserved.|
|EntityType|String|The entity type.|

## Examples

### Show the policy for a graph model

```kusto
.show graph_model MyGraph policy graph_query
```

### Show policies for all graph models

```kusto
.show graph_model * policy graph_query
```

### Use the latest available snapshot

````kusto
.alter graph_model MyGraph policy graph_query ```
{
  "DefaultSnapshotQueryBehavior": "LatestSnapshot"
}
```
````

### Use the latest snapshot that satisfies the indexing policy

````kusto
.alter graph_model MyGraph policy graph_query ```
{
  "DefaultSnapshotQueryBehavior": "LatestIndexedSnapshot"
}
```
````

### Delete the policy

```kusto
.delete graph_model MyGraph policy graph_query
```

## Related content

- [Graph model policies](graph-model-policies.md)
- [snapshot_indexing graph model policy](graph-model-policy-snapshot-indexing.md)
- [Graph models overview](graph-model-overview.md)
