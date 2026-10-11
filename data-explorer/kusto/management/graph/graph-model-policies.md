---
title: Graph model policies
description: Learn about graph model policies that control retention, caching, snapshot indexing, and default graph query behavior.
ms.reviewer: royo, danieldror
ms.topic: reference
ms.date: 07/08/2026
---

# Graph model policies (preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

> [!NOTE]
> This feature is currently in preview. Functionality and syntax are subject to change before General Availability.

Graph model policies control how a graph model is stored, prepared, and used by default graph queries.

Graph models support existing [retention](../retention-policy.md) and [caching](../cache-policy.md) policies. Graph models also support policies that are specific to graph snapshots and graph queries.

## Supported policies

|Policy|Description|
|--|--|
|`retention`|Controls data retention for graph model artifacts.|
|`caching`|Controls hot-cache behavior for graph model artifacts.|
|`snapshot_indexing`|Controls how graph snapshots are indexed.|
|`graph_query`|Controls graph query behavior for the graph model.|

## Syntax

`.show` `graph_model` *GraphModelName* `policy` *PolicyName*

`.alter` `graph_model` *GraphModelName* `policy` *PolicyName* *PolicyObject*

`.delete` `graph_model` *GraphModelName* `policy` *PolicyName*

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*GraphModelName*|String|✅|The graph model name.|
|*PolicyName*|String|✅|The policy name. Supported values include `retention`, `caching`, `snapshot_indexing`, and `graph_query`.|
|*PolicyObject*|String|✅ for `.alter`|A JSON policy object. The shape depends on the policy.|

## Examples

### Set the snapshot indexing policy

````kusto
.alter graph_model MyGraph policy snapshot_indexing ```
{
  "IndexingLevel": "Default"
}
```
````

### Set the default graph query policy

````kusto
.alter graph_model MyGraph policy graph_query ```
{
  "DefaultSnapshotQueryBehavior": "LatestIndexedSnapshot"
}
```
````

## Related content

- [snapshot_indexing graph model policy](graph-model-policy-snapshot-indexing.md)
- [graph_query graph model policy](graph-model-policy-graph-query.md)
- [Graph models overview](graph-model-overview.md)
