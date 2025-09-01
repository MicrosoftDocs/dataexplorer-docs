---
title: Graph Query Language Functions
description: Learn graph query language (GQL) functions and operators for working with nodes, edges, and properties. Find practical examples and KQL equivalents.
ms.reviewer: hraunch 
ms.topic: reference
ms.date: 08/14/2025

#CustomerIntent: As a data engineer, I want to learn GQL functions so that I can query graph data efficiently.
---
# Graph query language (GQL) functions and operators (preview)

Graph Query Language (GQL) is a powerful language for querying graph data. It provides a rich set of functions and operators to work with graph patterns, nodes, edges, and properties.

> [!NOTE]
> GQL support is currently in preview. Features and syntax can change based on feedback and ongoing development.

> [!TIP]
>
> GQL uses standardized syntax for graph operations. Use GQL for standardized graph pattern matching, and combine it with KQL operators for more data processing options.

## Core GQL functions and operators

This table lists the core GQL functions and operators, along with their Kusto Query Language (KQL) equivalents and examples.

| GQL Function/Operator | Description | GQL Example |
|---|---|---|
| **Pattern Matching** |
| `MATCH` | Find graph patterns | `MATCH (a)-[r]->(b)` |
| `OPTIONAL MATCH` | Find patterns that might not exist | `OPTIONAL MATCH (p)->(c:City)` |
| **Filtering** |
| `WHERE` | Filter patterns and properties | `WHERE person.age > 25` |
| `IS NULL` | Check for null values | `WHERE person.age IS NULL` |
| `IS NOT NULL` | Check for non-null values | `WHERE person.age IS NOT NULL` |
| **Projection** |
| `RETURN` | Project results | `RETURN person.name, person.age` |
| `DISTINCT` | Return unique values | `RETURN DISTINCT person.name` |
| **Aggregation Functions** |
| `COUNT(*)` | Count all rows | `RETURN COUNT(*)` |
| `COUNT()` | Count non-null values | `RETURN COUNT(person.name)` |
| `SUM()` | Sum numeric values | `RETURN SUM(person.age)` |
| `MIN()` | Minimum value | `RETURN MIN(person.age)` |
| `MAX()` | Maximum value | `RETURN MAX(person.age)` |
| `AVG()` | Average value | `RETURN AVG(person.age)` |
| `COLLECT_LIST()` | Collect values into array | `RETURN COLLECT_LIST(person.name)` |
| `SIZE()` | Array length | `RETURN SIZE(COLLECT_LIST(n.firstName))` |
| **Graph Functions** |
| `Labels()` | Show labels for a node or edge | `RETURN labels(entity)` |
| **String Functions** |
| `UPPER()` | Convert to uppercase | `RETURN UPPER(person.name)` |
| `LOWER()` | Convert to lowercase | `RETURN LOWER(person.name)` |
| `LEFT()` | Extract left substring | `WHERE LEFT(person.name, 3) = 'Tom'` |
| `RIGHT()` | Extract right substring | `WHERE RIGHT(person.name, 5) = 'Hanks'` |
| `STARTS WITH` | String starts with pattern | `WHERE person.name STARTS WITH 'Tom'` |
| `ENDS WITH` | String ends with pattern | `WHERE person.name ENDS WITH 'Hanks'` |
| `CONTAINS` | String contains pattern | `WHERE person.name CONTAINS 'Tom'` |
| `\|\|` | String concatenation | `RETURN n.firstName \|\| ' ' \|\| n.lastName` |
| **Type Conversion** |
| `CAST()` | Convert data types | `CAST(person.age AS STRING)` |
| **Date/Time Functions** |
| `ZONED_DATETIME()` | Create datetime from string | `ZONED_DATETIME('2024-01-01')` |
| `CURRENT_TIMESTAMP` | Current timestamp | `WHERE created < CURRENT_TIMESTAMP` |
| `DURATION()` | Construct a duration (timespan) | `DURATION({days:3})` |
| **Path Functions** |
| `NODES()` | Extract nodes from a path | `RETURN NODES(path_variable)` |
| `RELATIONSHIPS()` | Extract edges from a path | `RETURN RELATIONSHIPS(path_variable)` |
| `PATH_LENGTH()` | Get the length of a path | `RETURN PATH_LENGTH(path_variable)` |
| **Ordering and Limiting** |
| `ORDER BY` | Sort results | `ORDER BY person.age DESC` |
| `LIMIT` | Limit result count | `LIMIT 10` |
| **Label Operations** |
| `&` (AND) | Label intersection | `MATCH (p:Person & Male)` |
| `|` (OR) | Label union | `MATCH (n:Person | Movie)` |
| `!` (NOT) | Label negation | `MATCH (p:!Female)` |

## Best practices

- KQL supports dynamic types, but GQL does not clearly define how these should be handled. To avoid runtime errors, explicitly cast nested fields to their expected type (see `CAST`).

- Because GQL runs on KQL, some operations inherit KQL semantics. For instance, `COLLECT_LIST` (the GQL equivalent of `make_list`) will flatten arrays if the field is already an array. If results differ from expectations, consult the KQL documentation for the equivalent function.

## Performance optimization

Use these strategies to optimize GQL query performance in production environments:

> [!TIP]
> Start with simple patterns, then increase complexity if needed. Monitor query performance, and adjust path lengths and filters to improve results.

**Limit path matching scope**:

- Use specific label filters to reduce the search space: `MATCH (start:SpecificType)` instead of `MATCH (start)`
- Limit variable length paths with reasonable bounds: `MATCH (a)-[]->{1,3}(b)` instead of unbounded paths
- Apply `WHERE` clauses early to filter results before expensive operations.

**Use COUNT(*) for existence checks**:

If you only need to check if a pattern exists, use `COUNT(*)` instead of returning full results.

```gql
MATCH (user:User)-[:SUSPICIOUS_ACTIVITY]->(target)
WHERE user.id = 'user123'
RETURN COUNT(*) > 0 AS HasSuspiciousActivity
```

## Limitations

- **Reserved keywords**: Some GQL keywords can't be used as identifiers in queries. Some reserved keywords aren't immediately obvious (for example, `DATE` is a reserved keyword). If your graph data has property names that conflict with GQL reserved keywords, use different property names in your graph schema or rename them to avoid parsing conflicts.

    > [!IMPORTANT]
    > When you design your graph schema, some common property names might conflict with GQL reserved keywords. Avoid or rename these property names.

- **No `INSERT`/`CREATE` support**: Operations to change graph structures are not supported. Instead, use KQL for all graph creation, change, and management tasks.

- **Optional matches**: Supported only for node patterns (not edges) and only on persistent graphs. Optional matching isn't available for transient, in-query graphs.

- **Entity equivalence checks not supported**: GQL's`(MATCH (n)-[]-(n2) WHERE n1 <> n2)` is not supported. Use explicit field comparisons instead, for example, `n.id <> n2.id`.

- **Time and timezone**: The engine operates in UTC. Datetime literals must use zoned datetime; only the UTC zone is supported via `ZONED_DATETIME("2011-12-31 23:59:59.9")`.

- **Duration granularity**: Durations support up to days and smaller units down to nanoseconds. Larger-than-day units (for example, weeks, months, years) aren't supported.

- **Traversal modes**: GQL defines configurable traversal modes for matching and paths. For `MATCH`, the modes are `'DIFFERENT EDGES'` and `'REPEATABLE EDGES'`; for `PATH`, the modes are `'WALK'`, `'TRAIL'`, `'ACYCLIC'`, and `'SIMPLE'`. The current implementation defaults to `'DIFFERENT EDGES'` and `'WALK'`, respectively.
Some combinations are not supported.

## Labels() custom GQL function

The `labels()` function shows the labels for a node or edge as an array.

**Syntax:**

`labels(`*entity*`)

**Parameters:**

- `entity`: A node or edge variable from a matched pattern.

**Returns:**

Returns an array of strings with all labels for the specified entity.

**Examples:**

Show labels for matched nodes:
<!-- csl -->
```gql
MATCH (entity)
RETURN entity.name, labels(entity)
```

**Output**

This query shows the name and all labels for each node in the graph.

| entity.name | labels(entity) |
|--|--|
| john.doe | ["User"] |
| admin.user | ["User"] |
| web-server | ["System"] |
| database | ["System"] |
| domain-controller | ["System"] |

Show labels in projections with aliases:
<!-- csl -->
```gql
MATCH (n)-[e]->(target)
RETURN n.name, labels(n) AS n_labels, labels(e) AS edge_labels, target.name
```

**Output**

This query shows node names, their labels, and the labels of connecting edges.

| n.name | n_labels | edge_labels | target.name |
|--|--|--|--|
| john.doe | ["User"] | ["CAN_ACCESS"] | web-server |
| admin.user | ["User"] | ["CAN_ACCESS"] | domain-controller |
| web-server | ["System"] | ["CAN_ACCESS"] | database |
| domain-controller | ["System"] | ["CAN_ACCESS"] | database |

## Related Context

* [Graph Query Language (GQL)](graph-query-language.md)
* [Graph Query Language (GQL) use cases](graph-query-language-use-cases.md)