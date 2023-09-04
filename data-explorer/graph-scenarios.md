---
title: Scenarios for using Kusto Query Language (KQL) graph semantics
description: Learn about common scenarios for using Kusto Query Language (KQL) graph semantics.
ms.reviewer: herauch
ms.topic: conceptual
ms.date: 09/03/2023
# Customer intent: As a data analyst, I want to learn about common scenarios for using Kusto Query Language (KQL) graph semantics.
---

# What are common scenarios for using Kusto Query Language (KQL) graph semantics?

Graph semantics in Kusto Query Language (KQL) allows you to model and query data as graphs. There are many scenarios where graphs are useful for representing complex and dynamic data that involve many-to-many, hierarchical, or networked relationships, such as social networks, recommendation systems, connected assets, or knowledge graphs.

In this article, you learn about the following common scenarios for using KQL graph semantics:

- [Friends of a friend](#friends-of-a-friend)
- [Insights from log data](#insights-from-log-data)

## Friends of a friend

One common use case for graphs is to model and query social networks, where nodes are users and edges are friendships or interactions. For example, imagine we have a table called *Users* that has data about users, such as their name and organization, and a table called *Knows* that has data about the friendships between users as shown in the following diagram:

:::image type="content" source="media/graph/graph-friends-of-a-friend.png" alt-text="Diagram that shows a graph of friends of a friend.":::

Without using graph semantics in KQL, you could create a graph to find friends of a friend by using multiple joins, as follows:

```kusto
let Users = datatable (UserId: string, name: string, org: string)[]; // nodes
let Knows = datatable (FirstUser: string, SecondUser: string)[]; // edges
Users
| where org == "Contoso"
| join kind=inner (Knows) on $left.UserId == $right.FirstUser
| join kind=innerunique(Users) on $left.SecondUser == $right.UserId
| join kind=inner (Knows) on $left.SecondUser == $right.FirstUser
| join kind=innerunique(Users) on $left.SecondUser1 == $right.UserId
| where UserId != UserId1
| project name, name1, name2
```

You can use graph semantics in KQL to perform the same query in a more intuitive and efficient way. The following query uses the [make-graph operator](kusto/query/make-graph-operator.md) to create a directed graph from *FirstUser* to *SecondUser* and enriches the properties on the nodes with the columns provided by the *Users* table. Once the graph is instantiated, the [graph-match operator](kusto/query/graph-match-operator.md) provides the friend-of-a-friend pattern including filters and a projection that results in a tabular output.

```kusto
let Users = datatable (UserId:string , name:string , org:string)[]; // nodes
let Knows = datatable (FirstUser:string , SecondUser:string)[]; // edges
Knows
| make-graph FirstUser --> SecondUser with Users on UserId
| graph-match (user)-->(middle_man)-->(friendOfAFriend)
    where user.org == "Contoso" and user.UserId != friendOfAFriend.UserId
    project contoso_person = user.name, middle_man = middle_man.name, kusto_friend_of_friend = friendOfAFriend.name
```

## Insights from log data

In some use cases, you want to gain insights from a simple flat table containing time series information, such as log data. The data in each row is a string that contains raw data. To create a graph from this data, you must first identify the entities and relationships that are relevant to the graph analysis. For example, suppose you have a table called *rawLogs* from a web server that contains information about requests, such as the timestamp, the source IP address, the destination resource, and much more.

The following table shows an example of the raw data:

```kusto
let rawLogs = datatable (rawLog: string) [
    "31.56.96.51 - - [2019-01-22 03:54:16 +0330] \"GET /product/27 HTTP/1.1\" 200 5379 \"https://www.contoso.com/m/filter/b113\" \"some client\" \"-\"",
    "31.56.96.51 - - [2019-01-22 03:55:17 +0330] \"GET /product/42 HTTP/1.1\" 200 5667 \"https://www.contoso.com/m/filter/b113\" \"some client\" \"-\"",
    "54.36.149.41 - - [2019-01-22 03:56:14 +0330] \"GET /product/27 HTTP/1.1\" 200 30577 \"-\" \"some client\" \"-\""
];
```

One possible way to model a graph from this table is to treat the source IP addresses as nodes and the web requests to resources as edges. You can use the [parse operator](kusto/query/parseoperator.md) to extract the columns you need for the graph and then you can create a graph that represents the network traffic and interactions between different sources and destinations. To create the graph, you can use the [make-graph operator](kusto/query/make-graph-operator.md) specifying the source and destination columns as the edge endpoints, and optionally providing additional columns as edge or node properties.

The following query creates a graph from the raw logs:

```kusto
let parsedLogs = rawLogs
    | parse rawLog with ipAddress: string " - - [" timestamp: datetime "] \"" httpVerb: string " " resource: string " " *
    | project-away rawLog;
let edges = parsedLogs;
let nodes =
    union
        (parsedLogs
        | distinct ipAddress
        | project nodeId = ipAddress, label = "IP address"),
        (parsedLogs | distinct resource | project nodeId = resource, label = "resource");
let graph = edges
    | make-graph ipAddress --> resource with nodes on nodeId;
```

This query parses the raw logs and creates a directed graph where the nodes are either IP addresses or resources and each edge is a request from the source to the destination, with the timestamp and HTTP verb as edge properties.

:::image type="content" source="media/graph/graph-recommendation.png" alt-text="Diagram that shows a graph of the parsed log data.":::

Once the graph is created, you can use the [graph-match operator](kusto/query/graph-match-operator.md) to query the graph data using patterns, filters, and projections. For example, you can create a pattern that makes a simple recommendation based on the resources that other IP addresses requested within the last five minutes, as follows:

```kusto
graph
| graph-match (startIp)-[request]->(resource)<--(otherIP)-[otherRequest]->(otherResource)
    where startIp.label == "IP address" and //start with an IP address
    resource.nodeId != otherResource.nodeId and //recommending a different resource
    startIp.nodeId != otherIP.nodeId and //only other IP addresses are interesting
    (request.timestamp - otherRequest.timestamp < 5m) //filter on recommendations based on the last 5 minutes
    project Recommendation=otherResource.nodeId
```

**Output**

| Recommendation |
| -------------- |
| /product/42    |

The query returns "/product/42" as a recommendation based on a raw text-based log.

## Related content

- [Best practices](graph-best-practices.md)
- [Graph operators](kusto/query/graph-operators.md)
