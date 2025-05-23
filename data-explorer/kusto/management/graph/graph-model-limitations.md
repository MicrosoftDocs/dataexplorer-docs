---
title: Graph model limitations in Kusto
description: This article describes the limitations of the graph model feature in Kusto
ms.reviewer: herauch
ms.topic: reference
ms.date: 04/27/2025
---

# Graph model limitations (Preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

This article describes the limitations of Graph models in Kusto.

## Size limitations

Graph models are subject to the following size limitations:

* **Maximum number of nodes**: 100 million nodes per Graph model
* **Maximum number of edges**: 500 million edges per Graph model
* **Maximum number of properties per node/edge type**: 100 properties
* **Maximum number of node types**: 50 types
* **Maximum number of edge types**: 50 types
* **Maximum stored size**: The total size of a Graph model is limited by the available resources in the cluster

When these limits are approached or exceeded, queries may fail or performance may degrade significantly.

## Performance considerations

The performance of Graph model queries is affected by:

* **Graph complexity**: Dense graphs with high average node degree (number of connections per node) can lead to slower query performance
* **Query complexity**: Complex pattern matching with multiple hops and filter conditions can be resource-intensive
* **Graph size**: Larger graphs consume more memory and may affect query performance
* **Property usage**: Storing large property values or having many properties per node/edge can increase memory consumption

## Runtime limitations

Graph models have the following runtime limitations:

* **Query timeout**: Graph queries are subject to the same query timeout as regular Kusto queries
* **Memory limit**: Graph queries are constrained by the memory limits of the cluster nodes
* **Concurrency**: There are limits to the number of concurrent graph queries that can run against the same Graph model
* **Updates**: Graph models are not updated in real-time; they reflect the state of the data at the time of creation or last refresh

## Schema limitations

The following schema limitations apply to Graph models:

* **Property types**: Graph models support standard Kusto scalar types for properties (string, int, long, datetime, timespan, decimal, real, boolean, guid, dynamic)
* **Property names**: Must follow Kusto column naming conventions
* **Identifier columns**: Node ID and edge source/target columns must be scalar types
* **Query limitations**: Graph model definition queries cannot include [user-defined functions](../../query/functions/user-defined-functions.md) or [stored functions](../../query/schema-entities/stored-functions.md)

## Traversal limitations

* **Maximum path length**: Pattern matching with variable-length paths (`*`) is limited to a maximum of 10 hops by default
* **Recursive traversals**: Very deep recursive traversals may cause performance issues or query failures
* **Cyclic paths**: Detecting cycles in graphs with a large number of cycles may be computationally expensive

## Integration limitations

* **Cross-database queries**: Graph models can only be queried within the database they are defined in
* **Cross-cluster queries**: Cross-cluster queries against Graph models are not supported
* **External tools**: Direct integration with external graph visualization tools is limited

## Related content

* [Graph model overview](graph-model-overview.md)
* [.create graph model](graph-model-create.md)
* [.alter graph model](graph-model-alter.md)
* [Graph model policies](graph-model-policies.md)