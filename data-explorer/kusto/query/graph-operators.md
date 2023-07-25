---
title: graph operators (Preview)
description: Learn how to use Kusto graph capabilities.
ms.author: rocohen
ms.service: data-explorer
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/25/2023
---
# Graph operators (Preview)

Kusto Query Language (KQL) graph operators enable operations over graph structures.  
The graph is built from tabular data using the `make-graph` operator then queried using graph operators.

The graph operators are in public preview mode, and currently four operators are available:

* [make-graph](make-graph-operator.md) builds a graph from tabular data
* [graph-match](graph-match-operator.md) searches for patterns in the graph
* [graph-merge](graph-merge-operator.md) merges two graphs into a single new graph 
* [graph-to-table](graph-to-table-operator.md) builds nodes and/or edges tables from graph

## Before using the graph operators

The graph operators use V2 of the KQL parser, the client has to be configured to run queries with KQL parser V2.

To learn how to configure the client to run with KQL parser V2, select the relevant tab for your environment.

### [Kusto.Explorer](#tab/explorer)

### [Azure Data Explorer web UI](#tab/web)

1. In the upper right corner, select the settings widget.
1. Select **Connection**.
1. From the **Server parser** dropdown, select **V2**.

## Limitations and recommendations

The graph object is built in memory on the fly for each graph query. As such, there's a performance cost for building the graph and a limit to the size of the graph that can be built.

Although it isn't strictly enforced, we recommend building graphs with at most 10 million elements (nodes + edges).
