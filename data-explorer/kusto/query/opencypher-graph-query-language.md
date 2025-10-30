---
title: openCypher (preview)
description: This article describes openCypher, an open-source graph query language
ms.reviewer: herauch
ms.topic: reference
ms.date: 10/29/2025
---
# openCypher (preview)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

openCypher is an [open-source specification](https://s3.amazonaws.com/artifacts.opencypher.org/openCypher9.pdf) for querying property graph databases. You can now run openCypher queries on KQL graph semantics, using a declarative syntax with ASCII-art style pattern matching that makes it intuitive to express complex graph patterns and relationships.

> [!NOTE]
> openCypher support is in preview. Features and syntax can change based on feedback and ongoing development.

## Getting started

To use openCypher, you need:

- A graph data source that's either a [graph model](graph-operators.md) or a function returning a transient graph ending with a [make-graph](make-graph-operator.md) operator (see step 1)
- Set specific client request properties (see step 2)

### Step 1: Create a graph reference

Before you use openCypher, create a graph data source. This article uses an in-memory make-graph operator, but we recommend using a graph snapshot for production scenarios.

<!-- csl -->
```openCypher
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

### Step 2: Configure client request properties

::: moniker range="azure-data-explorer"
To run openCypher queries, set three client request properties. Set these properties through the SDK, API, or directly in the [Kusto Explorer](../tools/kusto-explorer.md) or [Azure Data Explorer web UI](/azure/data-explorer/web-ui-query-overview) by using directives.
::: moniker-end
::: moniker range="microsoft-fabric"
To run openCypher queries, set three client request properties. Set these properties through the SDK, API, or directly in the [KQL queryset](/fabric/real-time-intelligence/kusto-query-set) by using directives.
::: moniker-end

#### Set client request properties

> [!IMPORTANT]
> Run each directive separately before you run your openCypher query. The directives set up the query environment for openCypher execution.

<!-- csl -->
```kql
#crp query_language=opencypher
```

<!-- csl -->
```kql
#crp query_graph_reference=G_doc()
```

To use labels in openCypher, set the label column name:

<!-- csl -->
```kql
#crp query_graph_label_name=lbl
```

> [!TIP]
> Labels are optional in openCypher, but they're often used to filter nodes and edges by type. Set the label column name to use labels in your openCypher queries.

#### Set client request properties programmatically

For programmatic access, set these client request properties:

- `query_language`: Set to `"opencypher"`.
- `query_graph_reference`: Set to your graph function name (for example, `"G_doc()"`).
- `query_graph_label_name`: Set to your label column name (for example, `"lbl"`).

### Step 3: Run openCypher queries

After you finish setup, run openCypher queries using the standard syntax. Use the examples below to explore basic openCypher features.

## Examples

The following examples demonstrate core openCypher query patterns. openCypher uses ASCII-art style syntax where nodes are represented in parentheses `()` and relationships in square brackets `[]` with arrows `-->` or `<--` to indicate direction.

### Example 1: Basic pattern matching

Find all relationships in the graph and count them.

<!-- csl -->
```openCypher
MATCH (n)-[e]->(n2)
RETURN COUNT(*) as CNT
```

**Output**

The following table shows the result of the query.

| CNT |
|-----|
| 20  |

This query matches any node `n` connected to another node `n2` through a relationship `e` and returns the total count of such patterns.

### Example 2: Pattern matching with labels

Find people and their connections, filtering by node labels.

<!-- csl -->
```openCypher
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

This query finds all `Person` nodes and returns their names, the names of connected nodes, and the relationship type. The `:Person` label filters the source node to only match Person nodes.

### Example 3: Filtering with WHERE clause

Find people over 25 years old and return their details.

<!-- csl -->
```openCypher
MATCH (person:Person)
WHERE person.properties.age > 25
RETURN person.name, person.properties.age
ORDER BY person.name
```

**Output**

| person.name | person.properties.age |
|-------------|------------------------|
| Bob         | 30                     |
| Carol       | 28                     |
| David       | 35                     |
| Emma       | 26                     |

This query demonstrates property filtering using the `WHERE` clause to find people whose age property is greater than 25.

### Example 4: Variable length paths

Find all persons reachable from Alice through 1 to 3 hops.

<!-- csl -->
```openCypher
MATCH (center)-[*1..3]->(connected:Person)
WHERE center.name = 'Alice'
RETURN DISTINCT connected.name
ORDER BY connected.name
```

**Output**

|connected.name|
|---|
|Alice|
|Bob|
|Carol|
|David|
|Emma|

This query uses variable length paths `[*1..3]` to find all persons reachable from Alice through one to three hops. The `DISTINCT` keyword ensures each connected node appears only once.

### Example 5: Aggregation and grouping

Count how many people work at each company.

<!-- csl -->
```openCypher
MATCH (person:Person)-[:works_at]->(company:Company)
RETURN company.name AS Company, COUNT(person) AS EmployeeCount
ORDER BY EmployeeCount DESC
```

**Output**

| Company   | EmployeeCount |
|-----------|---------------|
| TechCorp  | 3             |
| CloudInc  | 1             |
| DataSoft  | 1             |

This query demonstrates aggregation by grouping people by their company and counting employees at each company. The `[:works_at]` syntax filters relationships by type.

## Limitations

openCypher support has the following limitations:

- **Query structure**: All openCypher queries must start with a `MATCH` statement.

- **Unsupported language constructs**: The following openCypher language constructs are not currently supported:
  - **WITH clause**: Not supported for query composition
  - **Subqueries**: Including `EXISTS` subqueries and pattern predicates

- **Unsupported keywords**: The following openCypher keywords are not supported:
  - `MANDATORY MATCH`
  - `UNWIND`
  - `UNION`
  - `SKIP`

- **Unsupported scalar functions**: The following openCypher scalar functions are not yet implemented:
  - Mathematical functions: `sin()`, `cos()`, `tan()`, `log()`, `round()`, `sign()`, `rand()`
  - Statistical functions: `percentileDisc()`, `percentileCont()`, `stDev()`, `stDevP()`
  - Utility functions: `coalesce()`, `id()`, `properties()`, `type()`, `range()`
  - Case expressions: `CASE` statements

- **Partial support**: `CALL` procedures have only partial support.

- **Reserved keywords**: Some openCypher keywords can't be used as identifiers in queries. Some reserved keywords aren't immediately obvious. If your graph data has property names that conflict with openCypher reserved keywords, use different property names in your graph schema or rename them to avoid parsing conflicts.

    > [!IMPORTANT]
    > When you design your graph schema, some common property names might conflict with openCypher reserved keywords. Avoid or rename these property names.

- **No graph modification operations**: Operations to change graph structures (such as `CREATE`, `MERGE`, `DELETE`, `SET`, `REMOVE`) are not supported. Use KQL for all graph creation, change, and management tasks.

- **Optional pattern matching**: `OPTIONAL MATCH` is supported only for node patterns, not for edge patterns.

- **Entity equivalence checks**: Entity equivalence checks using operators like `=` or `<>` between nodes or relationships (for example, `MATCH (n)-[]-(m) WHERE n <> m`) are not supported. Use explicit field comparisons instead, such as `n.id <> m.id`.

- **Time and timezone**: The engine operates in UTC. Datetime literals must use appropriate formats; only the UTC timezone is supported.

## Related content

- [Graph operators overview](graph-operators.md)
- [make-graph operator](make-graph-operator.md)
- [graph-match operator](graph-match-operator.md)
- [Tutorial: Create your first graph](tutorials/your-first-graph.md)
- [Graph functions reference](graph-function.md)
- [openCypher project website](https://opencypher.org/)
