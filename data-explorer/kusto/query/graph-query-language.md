---
title: GQL Graph Query Language (preview)
description: This article describes Graph Query Language (GQL)
ms.reviewer: herauch
ms.topic: reference
ms.date: 08/24/2025
---
# Graph Query Language (GQL) (preview)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Graph Query Language (GQL) lets you use standardized graph pattern matching. GQL follows the [ISO GQL standard](https://www.iso.org/obp/ui/en/#iso:std:iso-iec:39075:ed-1:v1:en) for graph database queries.

> [!NOTE]
> GQL support is in preview. Features and syntax can change based on feedback and ongoing development.

## Introduction

Graph Query Language (GQL) is an emerging ISO standard for querying graph databases. GQL lets you use SQL-like syntax for graph pattern matching, so it's easier to analyze relationships in your data. This article explains how to use GQL, its benefits, and key features.

GQL provides standardized graph pattern matching capabilities for analyzing relationships in your data using the ISO standard syntax.

## Getting started

To use GQL, you need:

- A graph data source that's either a [graph model](graph-operators.md) or a function returning a transient graph ending with a [make-graph](make-graph-operator.md) operator (see step 1).
- Set specific client request properties (see step 2).

## Step 1: Create a graph reference

Before you use GQL, create a graph data source. This article uses an in-memory make-graph operator, but we recommend using a graph snapshot for production scenarios.

<!-- csl -->
```gql
.create-or-alter function G_doc() {
    let nodes = datatable(id:string, lbl:string, name:string, properties:dynamic)
    [
        "p1","Person","Alice",dynamic({"age": 25}),
        "p2","Person","Bob",dynamic({"age": 30}),
        "p3","Person","Carol",dynamic({"age": 28}),
        "p4","Person","David",dynamic({"age": 35}),
        "p5","Person","Emma",dynamic({"age": 26}),
        "c1","Company","TechCorp",,
        "c2","Company","DataSoft",,
        "c3","Company","CloudInc",,
        "ct1","City","Seattle",,
        "ct2","City","Portland",,
        "ct3","City","San Francisco",
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

::: moniker range="azure-data-explorer"
To run GQL queries, set three client request properties. Set these properties through the SDK, API, or directly in the [Kusto Explorer](../tools/kusto-explorer.md) or [Azure Data Explorer web  UI](/azure/data-explorer/web-ui-query-overview) by using directives.
::: moniker-end
::: moniker range="microsoft-fabric"
To run GQL queries, set three client request properties. Set these properties through the SDK, API, or directly in the [Kusto Explorer](../tools/kusto-explorer.md) or [KQL queryset](/fabric/real-time-intelligence/kusto-query-set) by using directives.
::: moniker-end

### Set client request properties

> [!IMPORTANT]
> Run each directive separately before you run your GQL query. The directives set up the query environment for GQL execution.

<!-- csl -->
```kql
#crp query_language=gql
```

<!-- csl -->
```kql
#crp query_graph_reference=G_doc()
```

To use labels in GQL, set the label column name:

<!-- csl -->
```kql
#crp query_graph_label_name=lbl
```

> [!TIP]
> Labels are optional in GQL, but they're often used to filter nodes and edges by type. Set the label column name to use labels in your GQL queries.

### Set client request properties in programmatically

For programmatic access, set these client request properties:

- `query_language`: Set to `"gql"`.
- `query_graph_reference`: Set to your graph function name (for example, `"G_doc()"`).
- `query_graph_label_name`: Set to your label column name (for example, `"lbl"`).

## Step 3: Run GQL queries

After you finish setup, run GQL queries using standard GQL syntax. Use the examples below to explore basic and advanced GQL features.

## Examples

Find basic examples for pattern matching and labels here. For more complex examples, see [GQL query patterns, examples, and common scenarios](graph-query-language-use-cases.md).

### Example GQL query for basic pattern matching
<!-- csl -->
```gql
MATCH (n)-[e]->(n2)
RETURN COUNT(*) as CNT
```

**Output**

The following table shows the result of the query.

| CNT |
|-----|
| 20  |

### Example GQL query with labels

<!-- csl -->
```gql
MATCH (p:Person)-[e]->(target)
RETURN p.name, target.name, e.lbl
ORDER BY p.name, target.name
LIMIT 2
```

**Output**

The following table shows the result of the query.

| p.name | target.name | e.lbl |
|--------|-------------|-------|
| Alice  | Bob         | knows |
| Alice  | David       | likes |

## Related content

* [Graph Query Language (GQL) fundamentals](graph-query-language-fundamentals.md)
* [Graph operators overview](graph-operators.md)
* [make-graph operator](make-graph-operator.md)
* [graph-match operator](graph-match-operator.md)
* [Tutorial: Create your first graph](tutorials/your-first-graph.md)
* [Graph functions reference](graph-function.md)
