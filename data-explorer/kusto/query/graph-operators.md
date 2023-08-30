---
title: graph operators (Preview)
description: Learn how to use Kusto graph operators.
ms.author: rocohen
ms.service: data-explorer
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/30/2023
---
# Graph operators (Preview)

Kusto Query Language (KQL) graph operators allow for the analysis of data by representing tabular data as a graph, with nodes and edges. This setup lets us use graph operations to study the connections and relationships between different data points.

Graph analysis is typically comprised of the following steps:

1. Prepare and preprocess the data using tabular operators
1. Build a graph from the prepared tabular data using [make-graph](make-graph-operator.md)
1. Perform graph analysis using [graph-match](graph-match-operator.md) or [graph-merge](graph-merge-operator.md)
1. Transform the results of the graph analysis back into tabular form using [graph-to-table](graph-to-table-operator.md)
1. Continue the query with tabular operators

## Supported graph operators

| Operator | Description |
|--|--|
| [make-graph](make-graph-operator.md) | Builds a graph from tabular data. |
| [graph-match](graph-match-operator.md) | Searches for patterns in a graph. |
| [graph-merge](graph-merge-operator.md) | Merges two graphs into a single new graph. |
| [graph-to-table](graph-to-table-operator.md) | Builds nodes or edges tables from a graph. |

## Graph model

A graph is modeled as a *directed property graph* that represents the data as a network of vertices, or *nodes*, connected by *edges*. Both nodes and edges can have properties that store more information about them, and a node in the graph must have a unique identifier. A pair of nodes can have multiple edges between them that have different properties or direction. There's no special distinction of *labels* in the graph, and any property can act as a label.

## Graph lifetime

A graph is a transient object. It's built in each query that contains graph operators and ceases to exist once the query is completed. To persist a graph, it has to first be transformed back into tabular form and then stored as edges or nodes tables.

## Limitations and recommendations

The graph object is built in memory on the fly for each graph query. As such, there's a performance cost for building the graph and a limit to the size of the graph that can be built.

Although it isn't strictly enforced, we recommend building graphs with at most 10 million elements (nodes and edges).

## Related content

* [Graph overview](../../graph-overview.md)
* [Graph best practices](../../graph-best-practices.md)
