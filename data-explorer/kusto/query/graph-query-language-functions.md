---
title: Graph Query Language Functions in Azure Data Explorer
description: Leaern Azure Data Explorer graph query language (GQL) functions and operators for working with nodes, edges, and properties. Find practical examples and KQL equivalents.
ms.reviewer: hraunch 
ms.topic: reference
ms.date: 08/14/2025

#CustomerIntent: As a data engineer, I want to learn GQL functions in Azure Data Explorer so that I can query graph data efficiently.
---
# Graph query language (GQL) functions and operators (preview)

Graph Query Language (GQL) is a powerful language for querying graph data in Azure Data Explorer. It provides a rich set of functions and operators to work with graph patterns, nodes, edges, and properties.

> [!NOTE]
> GQL support in Azure Data Explorer is currently in preview. Features and syntax can change based on feedback and ongoing development.

## Core GQL functions and operators

This table lists the core GQL functions and operators, along with their Kusto Query Language (KQL) equivalents and examples.

| GQL Function/Operator | Description | Comparable KQL Operator | GQL Example |
|---|---|---|---|
| **Pattern Matching** |
| `MATCH` | Find graph patterns | `graph-match` | `MATCH (a)-[r]->(b)` |
| **Filtering** |
| `WHERE` | Filter patterns and properties | `where` | `WHERE person.age > 25` |
| `IS NULL` | Check for null values | `isnull()` | `WHERE person.age IS NULL` |
| `IS NOT NULL` | Check for non-null values | `isnotnull()` | `WHERE person.age IS NOT NULL` |
| **Projection** |
| `RETURN` | Project results | `project` | `RETURN person.name, person.age` |
| `DISTINCT` | Return unique values | `distinct` | `RETURN DISTINCT person.name` |
| **Aggregation Functions** |
| `COUNT(*)` | Count all rows | `count()` | `RETURN COUNT(*)` |
| `COUNT()` | Count non-null values | `count()` | `RETURN COUNT(person.name)` |
| `SUM()` | Sum numeric values | `sum()` | `RETURN SUM(person.age)` |
| `MIN()` | Minimum value | `min()` | `RETURN MIN(person.age)` |
| `MAX()` | Maximum value | `max()` | `RETURN MAX(person.age)` |
| `AVG()` | Average value | `avg()` | `RETURN AVG(person.age)` |
| `COLLECT_LIST()` | Collect values into array | `make_list()` | `RETURN COLLECT_LIST(person.name)` |
| **Graph Functions** |
| `labels()` | Get labels of a node or edge | Custom graph function. See the details in [Labels() (GQL function)](#labels-gql-function) | `RETURN labels(person)` |
| **String Functions** |
| `UPPER()` | Convert to uppercase | `toupper()` | `RETURN UPPER(person.name)` |
| `LOWER()` | Convert to lowercase | `tolower()` | `RETURN LOWER(person.name)` |
| `LEFT()` | Extract left substring | `substring()` | `WHERE LEFT(person.name, 3) = 'Tom'` |
| `RIGHT()` | Extract right substring | `substring()` | `WHERE RIGHT(person.name, 5) = 'Hanks'` |
| `STARTS WITH` | String starts with pattern | `startswith()` | `WHERE person.name STARTS WITH 'Tom'` |
| `ENDS WITH` | String ends with pattern | `endswith()` | `WHERE person.name ENDS WITH 'Hanks'` |
| `CONTAINS` | String contains pattern | `contains()` | `WHERE person.name CONTAINS 'Tom'` |
| **Type Conversion** |
| `CAST()` | Convert data types | `tostring()`, `toint()`, etc. | `CAST(person.age AS STRING)` |
| **Date/Time Functions** |
| `ZONED_DATETIME()` | Create datetime from string | `todatetime()` | `ZONED_DATETIME('2024-01-01')` |
| `CURRENT_TIMESTAMP` | Current timestamp | `now()` | `WHERE created < CURRENT_TIMESTAMP` |
| **Path Operations** |
| Variable length paths | Multi-hop traversal | `graph-match` with quantifiers | `MATCH (a)-[*1..3]->(b)` |
| Path variables | Named path assignment | Path variables in `graph-match` | `MATCH p = (a)-[]->(b)` |
| **Ordering and Limiting** |
| `ORDER BY` | Sort results | `sort` | `ORDER BY person.age DESC` |
| `LIMIT` | Limit result count | `take` | `LIMIT 10` |
| **Label Operations** |
| `&` (AND) | Label intersection | Multiple label filters | `MATCH (p:Person & Male)` |
| `|` (OR) | Label union | Label alternatives | `MATCH (n:Person | Movie)` |
| `!` (NOT) | Label negation | Negative label filter | `MATCH (p:!Female)` |

## Labels() (Custom GQL function)

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

> [!NOTE]
> GQL uses standardized syntax for graph operations. Many GQL functions work like KQL functions, but use different syntax and operators.

> [!TIP]
> Use GQL for standardized graph pattern matching, and combine it with KQL operators for more data processing options.

## Related Context

* [Graph Query Language (GQL) in Azure Data Explorer](graph-query-language.md)
* [Graph Query Language (GQL) use cases](graph-query-language-use-cases.md)