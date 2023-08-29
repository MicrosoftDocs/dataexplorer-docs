---
title: Kusto graph semantics overview
description: This article describes Kusto capabilities to contextualize data using the KQL graph semantics
ms.reviewer: herauch
ms.topic: conceptual
ms.date: 08/11/2023
---

# Overview

Azure Data Explorer (ADX) is a fast and scalable data analytics service that enables users to explore, analyze, and visualize large volumes of structured, semi-structured, and unstructured data from various sources. ADX is based on Kusto, the database engine that is providing KQL, a query language that supports a rich set of features, such as aggregation, filtering, grouping, joins, window functions, time series, geospatial, and machine learning operations.

This overview is about the graph semantics extension to KQL, which allows users to model and query data as graphs. A graph is a data structure that consists of nodes and edges that connect them. Nodes can have properties that describe them, similar to edges.

:::image type="content" source="media/graph/graph-what-is-a-graph.png" alt-text="Infographic showing a graph":::

Graphs are useful for representing complex and dynamic data that involve many-to-many, hierarchical, or networked relationships, such as social networks, recommendation systems, connected assets, or knowledge graphs.

:::image type="content" source="media/graph/graph-social-network.png" alt-text="Infographic showing social network as a graph":::

The example above illustrates a graph of a social network which consists of four nodes and three edges. Each of the nodes has a property for their name (i.E. "Bob") and each edge has a property for their type ("reportsTo").

Unlike relational databases, which store data in tables and require indexes and joins to access related data, graphs store data in an index-free adjacency manner, which means that each node maintains a direct pointer to its adjacent nodes. This enables fast and efficient traversal of the graph, without the need to scan or join large tables. Graph queries can leverage the graph structure and semantics to perform complex and expressive operations, such as finding paths, patterns, shortest distances, communities, or centrality measures.

The graph semantics extension to Kusto enables users to create and query graphs in ADX using a simple and intuitive syntax that is compatible with the existing KQL features. It can be combined with other KQL features, such as temporal, geospatial, and machine learning queries, to perform comprehensive and powerful data analysis. For example, users can use temporal queries to analyze the evolution of a graph over time, such as how the network structure or the node properties change. Users can use geospatial queries to analyze the spatial distribution or proximity of nodes and edges, such as how the location or distance affects the relationship. Users can use machine learning queries to apply various algorithms or models to the graph data, such as clustering, classification, or anomaly detection. By integrating graph semantics with Kusto, users can leverage the best of both worlds: the scalability and performance of ADX and the expressiveness and flexibility of graphs.

## Lifetime of a Kusto graph query

The graph semantics in Kusto require the creation of a new graph representation for every query. Such a KQL query invokes an operator to create a graph representation of the data based on tabular expressions for edges and optionally nodes. After the graph was created, various operations can be expressed to enrich or analyze the graph data further.

:::image type="content" source="media/graph/graph-make-graph.png" alt-text="Infographic on the creation of a graph from tabular expressions":::

alternative picture:

:::image type="content" source="media/graph/graph-make-graph-simple.png" alt-text="Simplified infographic on the creation of a graph from tabular expressions":::

## Graph engine

The underlying graph engine of the graph semantics extension is in-memory only, which means that it operates on the data that is loaded into the memory of an ADX engine node. This allows for fast and interactive graph analysis. The graph engine follows the model of a property graph, which is a common and popular graph data model that supports nodes and edges with arbitrary properties. The graph engine also allows using all of the existing scalar operators of KQL. This enables users to write complex and expressive graph queries that can leverage the full power and functionality of KQL.

The main memory consumption of the graph representation is determined by the number of nodes and edges including their respective properties.

## Friends of a friend

A common example of graphs is to model and query social networks, where nodes represent users and edges represent friendships or interactions. For instance, suppose we have a table called Users that contains information about users, such as their name, and organization, and a table called Knows that contains information about the friendships between users.

:::image type="content" source="media/graph/graph-fof.png" alt-text="Infographic on the friend of a friend scenario.":::

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
| graph-match (user)-->(middle_man)-->(friendOfAFriend)
    where user.org == "Kusto" and user.UserId != friendOfAFriend.UserId
    project kusto_person = user.name, middle_man = middle_man.name, kusto_friend_of_friend = friendOfAFriend.name
```

The make-graph operator creates a directed graph from FirstUser to SecondUser and enriches the properties on the nodes with the columns provided by the Users table. Once the graph was instantiated, graph-match provides the friend-of-a-friend pattern including filters and a projection which results in a tabular output.

## Why adding graph semantics to kusto

The graph semantics were added to Kusto to enable users to contextualize their time series data.

By adding graph semantics to Kusto, users can benefit from the data gravity in ADX, which means that the data is stored and processed close to where it is generated and ingested, reducing the latency and cost of data movement and transformation. Users can also benefit from the scalability and performance of ADX, which can handle large volumes of data and support fast and concurrent queries.

One of the unique features of Kusto is the support for time-aware graphs, which means that the graph data can be modelled as a time series of graph manipulation events. This allows users to analyze the evolution of the graph over time, such as how the network structure or the node properties change, or how the graph events or anomalies occur. For example, users can use time series queries to detect trends, patterns, or outliers in the graph data, such as how the network density, centrality, or modularity vary over time.

Another feature of Kusto is the intellisense feature of KQL, which means that the query language provides syntax highlighting, auto-completion, error checking, and suggestions to help users write and execute queries. The intellisense feature also supports the graph semantics extension, by providing graph-specific keywords, operators, functions, and examples to guide users through the graph creation and querying process.

Every relational engine is able to model graph traversals using join operations. However, KQL does not allow recursive joins. This means a user must explicitly define the traversals which should be executed (see example above). The new graph operator graph-match allows the definition of such variable length hops. This is crucial when the depth or distance of the relationship is not static, such as finding all the connected resources in a graph, or finding all the reachable destinations from a given source in a transportation network.

## How to model graphs from time series / log data

To create a graph from a simple flat table containing time series information such as log data, a user needs to identify the entities and relationships that are relevant for the graph analysis. For example, suppose we have a table called rawLogs from a web server that contains information about requests, such as the timestamp, the source IP address, the destination resource and much more.

```kusto
let rawLogs = datatable (rawLog:string) [
"31.56.96.51 - - [2019-01-22 03:54:16 +0330] \"GET /product/27 HTTP/1.1\" 200 5379 \"https://www.contoso.com/m/filter/b113\" \"some client\" \"-\"",
"31.56.96.51 - - [2019-01-22 03:55:17 +0330] \"GET /product/42 HTTP/1.1\" 200 5667 \"https://www.contoso.com/m/filter/b113\" \"some client\" \"-\"",
"54.36.149.41 - - [2019-01-22 03:56:14 +0330] \"GET /product/27 HTTP/1.1\" 200 30577 \"-\" \"some client\" \"-\""
];
```

One possible way to model a graph from this table is to treat the source IP addresses as nodes and the web requests to resources as edges. Once we parsed the relevant columns, we can create a graph that represents the network traffic and interactions between different sources and destinations. To create such a graph, we can use the make-graph operator and specify the source and destination columns as the edge endpoints, and optionally provide additional columns as edge or node properties. For example:

```kusto
let parsedLogs = rawLogs
| parse rawLog with ipAddress:string " - - [" timestamp:datetime "] \"" httpVerb:string " " resource:string " " *
| project-away rawLog;
let edges = parsedLogs;
let nodes =
    union
        ( parsedLogs | distinct ipAddress | project nodeId = ipAddress, label = "IP address"),
        ( parsedLogs | distinct resource  | project nodeId = resource,  label = "resource") ;
let graph = edges
| make-graph ipAddress --> resource with nodes on nodeId;
```

This query parses the raw logs and creates a directed graph where the nodes are either IP addresses or resources and each edge is a request from the source to the destination, with the timestamp and the http verb as edge properties.

:::image type="content" source="media/graph/graph-recommendation.png" alt-text="Infographic on the recommendation scenario.":::

Once the graph is created, we can use the graph-match operator to query the graph data using patterns, filters and projections. For example, we can create a simple recommendation based on the resources which where requested by other IP addresses. Additionally, we are only interested in recommendations which are based on requests which are not older than five minutes:

```kusto
graph
| graph-match (startIp)-[request]->(resource)<--(otherIP)-[otherRequest]->(otherResource)
    where startIp.label == "IP address" and //start with an IP address
        resource.nodeId != otherResource.nodeId and //recommending a different resource
        startIp.nodeId != otherIP.nodeId and //only other IP addresses are interesting
        ( request.timestamp - otherRequest.timestamp < 5m) //filter on recommendations based on the last 5 minutes
    project otherResource.nodeId
```

**Output**

| recommendation |
| -------------- |
| /product/42    |

The query returns "/product/42" as a recommendation based on a raw text based log.

## Limits

The graph semantics feature in Kusto has some limitations that users should be aware of when using it. One of the main limitations is that the graph data must fit into the memory of a single ADX engine node, which limits the size of the graph that can be created and queried. This also means that the graph data is not persisted or distributed across the cluster, and it is discarded after the query execution. Users should consider the memory consumption and performance implications of creating and querying large or dense graphs, and use appropriate filters, projections, and aggregations to reduce the graph size and complexity.

## Next steps

Learn more about Scenarios _addLinkHere_
Learn more about Operators _addLinkHere_
