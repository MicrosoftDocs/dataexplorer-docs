---
title: Querying graph models in Kusto
description: This article describes how to query graph models using the graph() function in Kusto
ms.reviewer: herauch
ms.topic: reference
ms.date: 04/28/2025
---

# Querying graph models (Preview)

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

This article explains how to query graph models using the `graph()` function in Kusto.

## The graph() function

The `graph()` function is the primary method for accessing and querying graph models. It provides a consistent way to interact with graph data without needing to explicitly construct the graph for each query.

### Syntax

```kusto
graph("GraphModelName") | <graph-operator>
graph("GraphModelName", "SnapshotName") | <graph-operator>
graph("GraphModelName", snapshot="SnapshotName") | <graph-operator>
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| GraphModelName | string | Yes | The name of the graph model to query |
| SnapshotName | string | No | The name of a specific snapshot to query. If not specified, the latest available snapshot is used |

### Returns

A graph representation that can be consumed by graph operators such as `graph-match`, `graph-shortest-paths`, etc.

## Querying scenarios

### Query the latest snapshot

To query the latest snapshot of a graph model:

```kusto
graph("MyGraph") 
| graph-match (person)-[comments]->(employee)
  where person.age > 30 and comments.CreateTime > ago(7d)
  project person.Name, employee.UserName
```

In this case, the `graph()` function will:

1. Look for the most recent snapshot of the "MyGraph" graph model
2. If found, use that snapshot for the query
3. If no snapshot exists, create the graph at query time based on the graph model definition

Using the latest snapshot is recommended for most scenarios as it provides the best performance while ensuring you're working with the most up-to-date data.

### Query a specific snapshot

You can also query a specific snapshot by name using either syntax:

```kusto
// Option 1: Use positional parameter
graph("MyGraph", "WeeklySnapshot") 
| graph-match (person)-[knows]->(friend)
  where person.age > 30
  project person.name, friend.name

// Option 2: Use named parameter
graph("MyGraph", snapshot="WeeklySnapshot") 
| graph-match (person)-[knows]->(friend)
  where person.age > 30
  project person.name, friend.name
```

Querying specific snapshots is useful for:

* Historical analysis of graph data at specific points in time
* Comparing graph states across different time periods
* Ensuring consistent results across multiple queries or users
* Testing and validation scenarios

### Fallback behavior

If no snapshot exists for a graph model (or the specified snapshot isn't available), the `graph()` function will automatically create a graph at query time using the definition in the graph model. This process is similar to using the `make-graph` operator but with the advantage that:

1. The entity is well-defined and doesn't require construction within the query
2. The graph will be built consistently based on the model definition
3. No knowledge of the underlying data structure is required

## Performance considerations

For optimal performance when querying graph models:

* **Use snapshots**: Snapshots provide significantly better performance than building the graph at query time
* **Schedule snapshots**: Create snapshots of frequently queried graph models at regular intervals
* **Filter early**: Apply filters in the `graph-match` pattern to limit the data processed
* **Limit pattern complexity**: Very complex graph patterns may impact query performance

## Example: Analyzing social connections

```kusto
graph("SocialNetwork") 
| graph-match (user)-[follows]->(influencer)-[posts]->(content)
  where influencer.followers > 10000
  and posts.timestamp > ago(7d)
  project user.name, influencer.name, content.title, content.engagement
| top 10 by content.engagement desc
```

This query finds the top 10 most engaging content pieces from influencers with more than 10,000 followers that were posted in the last 7 days and the users who follow those influencers.

## Example: Security analysis with a specific snapshot

```kusto
graph("SecurityGraph", "April2025Snapshot")
| graph-match (source)-[p:communicates*1..3]->(destination)
  where source.ipAddress == "10.0.0.5"
  and destination.classification == "Sensitive"
  project source.ipAddress, destination.ipAddress, 
          path = map(p, step, strcat(step.source, " -> ", step.destination)),
          protocols = array_unique(p.protocol)
```

This query uses a specific snapshot to analyze security data, finding all paths of up to 3 hops between a specific source IP address and any sensitive destination systems.

## Related content

* [Graph model overview](graph-model-overview.md)
* [Graph snapshots in Kusto](graph-snapshot-overview.md)
* [.make graph_snapshot](graph-snapshot-make.md)
* [Graph operators](../../query/graph-operators.md)
* [Graph best practices](../../query/graph-best-practices.md)