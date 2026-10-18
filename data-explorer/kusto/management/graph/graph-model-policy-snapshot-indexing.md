---
title: snapshot_indexing graph model policy
description: Learn how to show, alter, and delete the snapshot_indexing policy for a graph model.
ms.reviewer: royo, danieldror
ms.topic: reference
ms.date: 07/08/2026
---

# snapshot_indexing graph model policy (preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

> [!NOTE]
> This feature is currently in preview. Functionality and syntax are subject to change before General Availability.

The `snapshot_indexing` policy controls how graph snapshots for a graph model are indexed.

The policy affects snapshots created after the policy is set. It doesn't change existing snapshots.

The default `IndexingLevel` value is `Default`.

Indexing can improve query performance, but more complete indexing can increase the work needed to prepare a snapshot. Indexing runs in the background, so graph queries can continue to use available snapshots while indexing work is in progress. To control whether default graph queries wait for indexed snapshots, use the [`graph_query`](graph-model-policy-graph-query.md) policy.

## Permissions

To show the policy, you need [Database Monitor or Database Viewer permissions](../../access-control/role-based-access-control.md).

To alter or delete the policy, you need Graph Admin permissions on the graph model.

## Syntax

`.show` `graph_model` *GraphModelName* `policy` `snapshot_indexing`

`.show` `graph_model` `*` `policy` `snapshot_indexing`

`.alter` `graph_model` *GraphModelName* `policy` `snapshot_indexing` *PolicyObject*

`.delete` `graph_model` *GraphModelName* `policy` `snapshot_indexing`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*GraphModelName*|String|✅|The graph model name.|
|*PolicyObject*|String|✅ for `.alter`|A JSON policy object.|
|`IndexingLevel`|String|✅|The requested indexing level. Supported values are `Disabled`, `Default`, and `Best`.|

## Indexing levels

|Indexing level|Description|
|--|--|
|`Disabled`|Don't index graph snapshots for the model.|
|`Default`|Let the system decide whether indexing is beneficial for each snapshot. This is the default value.|
|`Best`|Use the most complete indexing behavior for snapshots of the model. This can improve query performance, but might require more work while preparing snapshots.|

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
.show graph_model MyGraph policy snapshot_indexing
```

### Show policies for all graph models

```kusto
.show graph_model * policy snapshot_indexing
```

### Use the default indexing behavior

````kusto
.alter graph_model MyGraph policy snapshot_indexing ```
{
  "IndexingLevel": "Default"
}
```
````

### Use the most complete indexing behavior

````kusto
.alter graph_model MyGraph policy snapshot_indexing ```
{
  "IndexingLevel": "Best"
}
```
````

### Disable snapshot indexing

````kusto
.alter graph_model MyGraph policy snapshot_indexing ```
{
  "IndexingLevel": "Disabled"
}
```
````

### Delete the policy

```kusto
.delete graph_model MyGraph policy snapshot_indexing
```

## Related content

- [Graph model policies](graph-model-policies.md)
- [graph_query graph model policy](graph-model-policy-graph-query.md)
- [Graph snapshots overview](graph-snapshot-overview.md)
