---
title: Graph operators
description: Learn how to use KQL graph operators.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/05/2024
---
# Graph operators

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Kusto Query Language (KQL) graph operators enable graph analysis of data by representing tabular data as a graph with nodes and edges, or by referencing persistent graph entities. This setup lets you use graph operations to study the connections and relationships between different data points.

Graph analysis can be performed using either transient graphs (created dynamically from tabular data using [make-graph](make-graph-operator.md)) or persistent graphs (referenced using the [graph](graph-operator.md) operator). Once a graph is established, you can use graph operators such as [graph-match](graph-match-operator.md), [graph-shortest-paths](graph-shortest-paths-operator.md), and [graph-to-table](graph-to-table-operator.md) to analyze relationships, find patterns, and transform results back into tabular form for further processing.

## Supported graph operators

The following table describes the supported graph operators.

| Operator | Description |
|--|--|
| [make-graph](make-graph-operator.md) | Builds a graph from tabular data. |
| [graph](graph-operator.md) | References a persisted graph entity and retrieves the latest or a specific snapshot. |
| [graph-match](graph-match-operator.md) | Searches for patterns in a graph. |
| [graph-to-table](graph-to-table-operator.md) | Builds nodes or edges tables from a graph. |
| [graph-shortest-paths](graph-shortest-paths-operator.md) | Finds the shortest paths from a given set of source nodes to a set of target nodes. |
| [graph-mark-components](graph-mark-components-operator.md) | Finds and marks all connected components. |

## Related content

* [Graph overview](../../graph-overview?view=azure-data-explorer&preserve-view=true)
* [Graph best practices](../../graph-best-practices?view=azure-data-explorer&preserve-view=true)
