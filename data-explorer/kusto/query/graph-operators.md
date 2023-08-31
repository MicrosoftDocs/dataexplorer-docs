---
title: graph operators (Preview)
description: Learn how to use Kusto graph operators.
ms.author: rocohen
ms.service: data-explorer
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/29/2023
---
# Graph operators (Preview)

Kusto graph operators enable graph analysis of data by modeling tabular data of nodes and edges as a graph structure and applying graph operations on the graph. The graph analysis is done as part of regular KQL, a query doing graph analysis is typically comprised of the following steps:
1.  Prepare and preprocess the data using tabular operators
2.  Build a graph from the prepared tabular data using the `make-graph`
3.  Perform graph analysis using the graph operators
4.  Transform the results of the graph analysis back into tabular form
5.  Continue the query with tabular operators

The graph operators are in preview, currently the following operators are available:

* [make-graph](make-graph-operator.md) builds a graph from tabular data
* [graph-match](graph-match-operator.md) searches for patterns in the graph
* [graph-merge](graph-merge-operator.md) merges two graphs into a single new graph 
* [graph-to-table](graph-to-table-operator.md) builds nodes and/or edges tables from a graph

## Graph model

In Kusto, a graph is modeled as a *directed property graph* that represents the data as a network of vertices (also termed *nodes*) connected by *edges*. Both nodes and edges can have properties that store additional information about them, a node in the graph must have a unique identifier. A pair of nodes can have multiple edges between them (which have different properties and/or direction). There's no special distinction of *labels* in the graph, any property can act as a label.

## Graph lifetime

A graph is a transient object, it's built on the fly in each query that contains graph operators and ceases to exist once the query is completed. To persist a graph, it has to first be transformed back into tabular form and then stored as edges and/or nodes table(s).

## Limitations and recommendations

The graph object is built in memory on the fly for each graph query and here is a performance cost for building the graph and a limit to the size of the graph that could be build. Although it isn't strictly enforced, it's recommended to build graphs with at most 10 million elements (nodes + edges).
