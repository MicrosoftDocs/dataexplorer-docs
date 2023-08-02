---
title: graph operators (Preview)
description: Learn how to use Kusto graph capabilities.
ms.author: rocohen
ms.service: data-explorer
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/19/2023
---
# Graph operators (Preview)

> [!WARNING]
> The graph operators are currently offered in preview mode. 
> The syntax and semantics of the operator might change prior to public availability.

Kusto graph operators enable operations over graph structures.  
The graph is built from tabular data using the `make-graph` operator then queried using graph operators.

The graph operators are in public preview mode, currently several operators are available:

* [make-graph](make-graph-operator.md) builds a graph from tabular data
* [graph-match](graph-match-operator.md) searches for patterns in the graph
* [graph-merge](graph-merge-operator.md) merges two graphs into a single new graph 
* [graph-to-table](graph-to-table-operator.md) builds nodes and/or edges tables from graph

## Limitations and recommendations

The graph object is built in memory on the fly for each graph query. As such, there is a performance cost for building the graph and a limit to the size of the graph that could be build. 
Although it is not strictly enforced, it is recommended to build graphs with at most 10 million elements (nodes + edges).
