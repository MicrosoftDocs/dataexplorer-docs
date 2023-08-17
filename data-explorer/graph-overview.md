---
title: Kusto graph semantics overview
description: This article describes Kusto capabilities to contextualize data using the KQL graph semantics
ms.reviewer: herauch
ms.topic: conceptual
ms.date: 08/11/2023
---

# Overview

Azure Data Explorer (ADX) is a fast and scalable data analytics service that enables users to explore, analyze, and visualize large volumes of structured, semi-structured, and unstructured data from various sources. ADX is based on Kusto, the database engine that is providing KQL, a query language that supports a rich set of features, such as aggregation, filtering, grouping, joins, window functions, time series, geospatial, and machine learning operations.

This overview is about the graph semantics extension to KQL, which allows users to model and query data as graphs. A graph is a data structure that consists of nodes (or vertices) and edges (or relationships) that connect them. Nodes can have properties (or attributes) that describe them, similar to edges. Graphs are useful for representing complex and dynamic data that involve many-to-many, hierarchical, or networked relationships, such as social networks, recommendation systems, connected assets, or knowledge graphs.

Unlike relational databases, which store data in tables and require indexes and joins to access related data, graphs store data in an index-free adjacency manner, which means that each node maintains a direct pointer to its adjacent nodes. This enables fast and efficient traversal of the graph, without the need to scan or join large tables. Graph queries can leverage the graph structure and semantics to perform complex and expressive operations, such as finding paths, patterns, shortest distances, communities, or centrality measures.

The graph semantics extension to Kusto enables users to create and query graphs in ADX using a simple and intuitive syntax that is compatible with the existing KQL features. It can be combined with other KQL features, such as temporal, geospatial, and machine learning queries, to perform comprehensive and powerful data analysis. For example, users can use temporal queries to analyze the evolution of a graph over time, such as how the network structure or the node properties change. Users can use geospatial queries to analyze the spatial distribution or proximity of nodes and edges, such as how the location or distance affects the relationship. Users can use machine learning queries to apply various algorithms or models to the graph data, such as clustering, classification, or anomaly detection. By integrating graph semantics with Kusto, users can leverage the best of both worlds: the scalability and performance of ADX and the expressiveness and flexibility of graphs.

## Lifetime of a Kusto graph query

The graph semantics in Kusto require the creation of a new graph representation for every query. Such a KQL query invokes an operator to create a graph representation of the data based on tabular expressions for edges and optionally nodes. After the graph was created, various operations can be expressed to enrich or analyze the graph data further.

## Graph engine

The underlying graph engine of the graph semantics extension is in-memory only, which means that it operates on the data that is loaded into the memory of an ADX engine node. This allows for fast and interactive graph analysis. The graph engine follows the model of a property graph, which is a common and popular graph data model that supports nodes and edges with arbitrary properties. The graph engine also allows using all of the existing scalar operators of KQL. This enables users to write complex and expressive graph queries that can leverage the full power and functionality of KQL.

## Friends of a friend

A common example of graphs is to model and query social networks, where nodes represent users and edges represent friendships or interactions. For instance, suppose we have a table called Users that contains information about users, such as their name, and organization, and a table called Knows that contains information about the friendships between users.

We can create a graph from these tables by using multiple joins:

```kusto
let Users = datatable (UserId:string , name:string , org:string)[]; // nodes
let Knows = datatable (FirstUser:string , SecondUser:string)[]; // edges
Users
| where org == "Kusto"
| join kind=inner (Knows) on $left.UserId == $right.FirstUser
| join (Users) on $left.SecondUser == $right.UserId
| join kind=inner (Knows) on $left.SecondUser == $right.FirstUser
| join (Users) on $left.SecondUser1 == $right.UserId
| where UserId != UserId1
| project name, name1, name2
```

The same operation can be executed using the new graph operators:

```kusto
let Users = datatable (UserId:string , name:string , org:string)[]; // nodes
let Knows = datatable (FirstUser:string , SecondUser:string)[]; // edges
Knows
| make-graph FirstUser --> SecondUser with Users on UserId
| graph-match (user)-[knows1]->(m)-[knows2]->(fof)
    where user.org == "Kusto" and user.UserId != fof.UserId
    project kusto_person = user.name, middle_man = m.name, Kusto_friend_of_friend = fof.name  
```

The make-graph operator creates a directed graph from FirstUser to SecondUser and enriches the properties on the nodes with the columns provided by the Users table. Once the graph was instantiated, graph-match provides the friend-of-a-friend pattern including filters and a projection which results in a tabular output.

## Why adding graph semantics to kusto

The graph semantics were added to Kusto to enable users to contextualize their time series data.

By adding graph semantics to Kusto, users can benefit from the data gravity in ADX, which means that the data is stored and processed close to where it is generated and ingested, reducing the latency and cost of data movement and transformation. Users can also benefit from the scalability and performance of ADX, which can handle large volumes of data and support fast and concurrent queries.

One of the unique features of Kusto is the support for time-aware graphs, which means that the graph data can be modelled as a time series of graph manipulation events. This allows users to analyze the evolution of the graph over time, such as how the network structure or the node properties change, or how the graph events or anomalies occur. For example, users can use time series queries to detect trends, patterns, or outliers in the graph data, such as how the network density, centrality, or modularity vary over time.

Another feature of Kusto is the intellisense feature of KQL, which means that the query language provides syntax highlighting, auto-completion, error checking, and suggestions to help users write and execute queries. The intellisense feature also supports the graph semantics extension, by providing graph-specific keywords, operators, functions, and examples to guide users through the graph creation and querying process.

Every relational engine is able to model graph traversals using join operations. However, KQL does not allow recursive joins. This means a user must explicitly define the traversals which should be executed (see example above). The new graph operator graph-match allows the definition of such variable length hops. This is crucial when the depth or distance of the relationship is not static, such as finding all the connected resources in a graph, or finding all the reachable destinations from a given source in a transportation network.

## Limits

in-memory
operators

## Next steps

Learn more about Scenarios _addLinkHere_
Learn more about Operators _addLinkHere_
