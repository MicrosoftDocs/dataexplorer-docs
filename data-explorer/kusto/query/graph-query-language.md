---
title: GQL - Azure Data Explorer
description: This article describes Graph Query Language (GQL) in Azure Data Explorer.
ms.reviewer: herauch
ms.topic: reference
ms.date: 08/13/2025
---
# Graph Query Language (GQL) in Azure Data Explorer (preview)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Graph Query Language (GQL) lets you use standardized graph pattern matching in Azure Data Explorer. GQL follows the emerging ISO GQL standard for graph database queries.

> [!NOTE]
> GQL support in Azure Data Explorer is currently in preview. Features and syntax can change based on feedback and ongoing development.

## Introduction

Graph Query Language (GQL) is an emerging ISO standard for querying graph databases. GQL lets you use SQL-like syntax for graph pattern matching in Azure Data Explorer, making it easier to analyze relationships in your data. This article explains how to use GQL in Azure Data Explorer, its benefits, and key features.

Azure Data Explorer implements GQL, so you get standardized graph pattern matching capabilities. You can analyze relationships in your data using the ISO standard syntax.

GQL in Azure Data Explorer builds on the existing [graph operators](graph-operators.md) functionality. It gives you a standardized way to write graph queries that focus on relationships and patterns between entities.

## Getting Started

To use GQL in Azure Data Explorer, you need:

- A graph data source that's either a [graph snapshot](graph-operators.md) or a function with a `make-graph` statement (see step 1).
- Set specific client request properties (see step 2).

## Step 1: Create a graph reference

Before you use GQL, create a graph data source. For this article, we use an in-memory make-graph operator, but it's recommended to use a graph snapshop for production scenarios.

<!-- csl -->
```gql
.create-or-alter function G() {
    let nodes = datatable(id:string, lbl:string, name:string, age:int)
    [
        "p1","Person","Alice",25,
        "p2","Person","Bob",30,
        "p3","Person","Carol",28,
        "p4","Person","David",35,
        "p5","Person","Emma",26,
        "c1","Company","TechCorp",0,
        "c2","Company","DataSoft",0,
        "c3","Company","CloudInc",0,
        "ct1","City","Seattle",0,
        "ct2","City","Portland",0,
        "ct3","City","San Francisco",0
    ];
    let edges = datatable(source:string, target:string, lbl:string, since:int)
    [
        "p1","c1","works_at",2020,
        "p2","c1","works_at",2022,
        "p3","c2","works_at",2023,
        "p4","c3","works_at",2021,
        "p5","c1","works_at",2024,
        "p1","ct1","located_at",2019,
        "p2","ct1","located_at",2021,
        "p3","ct2","located_at",2022,
        "p4","ct3","located_at",2020,
        "p5","ct2","located_at",2023,
        "c1","ct1","located_at",2015,
        "c2","ct2","located_at",2018,
        "c3","ct3","located_at",2017,
        "p1","p2","knows",2019,
        "p2","p3","knows",2021,
        "p3","p4","knows",2022,
        "p4","p5","knows",2023,
        "p1","p4","likes",2020,
        "p4","p1","likes",2020,
        "p5","p2","likes",2022
    ];
    edges
    | make-graph source --> target with nodes on id
}
```

## Step 2: Configure client request properties

To run GQL queries, set three client request properties. Set these properties through the SDK, API, or directly in the ADX query interface by using directives.

### Use Azure Data Explorer to set client request properties

> [!IMPORTANT]
> Run each directive separately before running your GQL query. The directives set up the query environment for GQL execution.

<!-- csl -->
```kql
#crp query_language=gql
```

<!-- csl -->
```kql
#crp query_graph_reference=G()
```

To use labels in GQL, define the label column name:

<!-- csl -->
```kql
#crp query_graph_label_name=lbl
```

> [!TIP]
> Labels are optional in GQL, but they're often used to filter nodes and edges by type. Setting the label column name lets you use labels in your GQL queries.

### Use SDK/API  to set client request properties

For programmatic access, set these client request properties:

- `query_language`: Set to `"gql"`
- `query_graph_reference`: Set to your graph function name (for example, `"G()"`)
- `query_graph_label_name`: Set to your label column name (for example, `"lbl"`)

## Step 3: Execute GQL queries

After you finish setup, run GQL queries using standard GQL syntax. Start with the examples below to explore basic and advanced GQL features.

> [!TIP]
> GQL queries in Azure Data Explorer use standard GQL syntax and translate to KQL with graph operators. Start with simple patterns and build complexity gradually.

## Example GQL query for basic pattern matching
<!-- csl -->
```gql
MATCH (n)-[e]->(n2)
RETURN COUNT(*) as CNT
```

**Output**

This table shows the result of the query.

| CNT |
|-----|
| 20  |

## Example GQL query with labels

<!-- csl -->
```gql
MATCH (p:Person)-[e]->(target)
RETURN p.name, target.name, e.lbl
ORDER BY p.name, target.name
LIMIT 2
```

**Output**

This table shows the result of the query.

| p.name | target.name | e.lbl |
|--------|-------------|-------|
| Alice  | Bob         | knows |
| Alice  | David       | likes |

## Performance optimization

When you work with GQL queries in production environments, use these performance optimization strategies:

> [!TIP]
> Start with simple patterns, then increase complexity as needed. Monitor query performance, and adjust path lengths and filters to improve results.

**Limit path matching scope**:

- Use specific label filters to reduce the search space: `MATCH (start:SpecificType)` instead of `MATCH (start)`
- Limit variable length paths with reasonable bounds: `MATCH (a)-[]->{1,3}(b)` instead of unbounded paths
- Apply `WHERE` clauses early to filter results before expensive operations

**Use COUNT(*) for existence checks**:

If you only need to check if a pattern exists, use `COUNT(*)` instead of returning full results:

```gql
MATCH (user:User)-[:SUSPICIOUS_ACTIVITY]->(target)
WHERE user.id = 'user123'
RETURN COUNT(*) > 0 AS HasSuspiciousActivity
```

## Limitations

- **Reserved keywords**: GQL has reserved keywords that can't be used as identifiers in queries. Some of these reserved keywords might not be immediately obvious to users (for example, `DATE` is a reserved keyword). If your graph data has properties with names that conflict with GQL reserved keywords, use different property names in your graph schema or rename them to avoid parsing conflicts.

    > [!IMPORTANT]
    > When designing your graph schema, certain common property names might conflict with GQL reserved keywords and should be avoided or renamed.

- **No `INSERT`/`CREATE` support**: GQL in Azure Data Explorer doesn't support `INSERT` or `CREATE` operations to modify graph structures. Instead, use KQL's [`make-graph`](make-graph-operator.md) operator or [graph snapshots](graph-operators.md) to create and manage graph structures. Use KQL for all graph creation, change, and management tasks.

- **Optional matches not supported**: GQL's `OPTIONAL MATCH` clause isn't supported in Azure Data Explorer. All pattern matches are required. To get similar results, use separate queries or KQL operators for optional relationships.

## Related content

* [Graph operators overview](graph-operators.md)
* [make-graph operator](make-graph-operator.md)
* [graph-match operator](graph-match-operator.md)
* [Tutorial: Create your first graph](tutorials/your-first-graph.md)
* [Graph functions reference](graph-functions.md)
