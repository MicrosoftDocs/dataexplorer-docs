---
title: GQL
description: This article describes GQL (Graph Query Language)
ms.reviewer: mbrichko
ms.topic: reference
ms.date: 07/09/2026
---

# GQL (Graph Query Language)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

GQL (Graph Query Language) is an emerging ISO standard for querying graph databases that uses standardized graph pattern matching. It follows the [ISO GQL standard](https://www.iso.org/obp/ui/en/#iso:std:iso-iec:39075:ed-1:v1:en).

## Getting started

To use GQL, you need a graph data source that is either a [persistent graph](..\management\graph\graph-persistent-overview.md) (recommended for production scenarios) or a function that returns a transient graph (ending with a [make-graph](make-graph-operator.md) operator).

## Prerequisites

Create a graph and set a graph reference for querying. Follow the steps described [here](run-graph-query-with-graph-reference.md).

## Query example

A typical GQL query starts with a `MATCH` pattern, optionally filters and aggregates the matched rows, and can chain more processing stages with `NEXT`. The following query uses the movies graph to find actors whose name starts with `T` or with `K` who appeared in more than one movie released in 1990 or later, ordered from the most movies to the fewest:

<!-- csl -->
```gql
MATCH (p:Person)-[:ACTED_IN]->(m:Movie)
WHERE m.Year >= 1990 AND p.Name STARTS WITH 'T'
RETURN p.Name AS actor, COUNT(m) AS movieCount
NEXT
FILTER movieCount > 1
RETURN actor, movieCount
ORDER BY movieCount DESC
LIMIT 1
```

| actor | movieCount |
|---|---|
| Tom | 3 |

Reading the query clause by clause:

- `MATCH (p:Person)-[:ACTED_IN]->(m:Movie)` describes the pattern to find: a node with the `Person` label bound to the variable `p`, connected by an edge with the `ACTED_IN` label, to a node with the `Movie` label bound to the variable `m`. Labels (`:Person`, `:ACTED_IN`, `:Movie`) restrict which entities match, and the variables (`p`, `m`) let you refer to the matched entities in later clauses. The arrow `->` sets the direction, from actor to movie. Every query must begin with `MATCH`.
- `WHERE` m.Year >= 1990 AND p.Name STARTS WITH 'T' filters the matched rows by a predicate before they're returned, here keeping only movies released in 1990 or later whose actor's name starts with `T`. `STARTS WITH` is a string predicate; you can also match the end of a value with `ENDS WITH`, or find a substring anywhere in the value with `CONTAINS`.
- `RETURN p.Name AS actor, COUNT(m) AS movieCount` projects the output columns and renames them with `AS`. It includes an aggregation, `COUNT(m)`, which groups by the other returned column (`p.Name`) and produces one row per actor with the number of matching movies.
- `NEXT` pipes the result of the preceding segment into a new query segment, so you can keep processing the rows you just produced, including the `movieCount` aggregate.
- `FILTER movieCount > 1` keeps only the rows that satisfy a predicate. `FILTER` is the same as `WHERE` but acts as a standalone statement while `WHERE` comes with `MATCH`. `WHERE` is more performant as it allows to eliminate redundant data earlier in the query.
- `RETURN actor, movieCount` projects the final columns, and `ORDER BY movieCount DESC` sorts the result from the highest movie count to the lowest.
- `LIMIT 1` caps the result at the first row after sorting.

Each clause is optional except `MATCH`. Omit the aggregation, `NEXT`, `FILTER`, and `LIMIT` for simple lookups, and combine them when you need to aggregate and then filter on the aggregated values.

> [!TIP]
> For better performance, use as few `MATCH` clauses as possible, ideally one per query. A single `MATCH` clause can still be as complex as needed: the pattern can be nontrivial and can include connected components, variable-length edges, and more.

> [!TIP]
> Whenever a condition can be expressed against the matched pattern, prefer `WHERE` over a standalone `FILTER`. `WHERE` is coupled to `MATCH` and is evaluated as part of pattern matching, so the whole query runs more efficiently. Use `FILTER` only when you need to filter on values produced by a later stage, such as after `NEXT` or an aggregation.

> [!TIP]
> Use `RETURN COUNT(*)` for existence checks. If you only need to check whether a pattern exists, return `COUNT(*)` instead of returning the full results.

For the official International Standard for GQL, see [ISO/IEC 39075 Information Technology - Database Languages - GQL](https://www.iso.org/standard/76120.html).

## GQL guide
For the GQL guide and supported features, see the [GQL guide](graph-query-language-guide.md). For all supported clauses see [GQL clauses](graph-query-language-clauses.md) and for functions, operators and predicates see [GQL scalar functions](graph-query-language-functions.md).

## Limitations

- **Query structure**: All queries must start with a `MATCH` statement.

- **No graph modification operations**: Operations to change graph structures (such as `CREATE`/`DROP`/`ALTER` GRAPH, `INSERT`/`SET`/`REMOVE`/`DELETE`) and transactions (START `TRANSACTION`/`COMMIT`/`ROLLBACK`) are not supported. Use KQL for all graph creation, modification, and management tasks.

- **Unsupported clauses**: `EXISTS`, `VALUE`, `CALL`, `EXCEPT`, `INTERSECT`.

- **Unsupported functions, aggregates and predicates**: `SINH`, `COSH`, `TANH`, `DATE`, `TIME`, `LOCAL_TIME`, `LOCAL_DATETIME`, `ZONED_TIME`, `IS TYPED`, `DIRECTED`, `IS LABELED`, `SOURCE OF`, `DESTINATION OF`, `IS NORMALIZED`, `ALL_DIFFERENT`, `SAME`, `REGEXP_CONTAINS`, `POWER`, `LOG(base, x)`, `BYTE_LENGTH`, `OCTET_LENGTH`, `ROW_ID`, `BINARY_SEARCH`, `NORMALIZE`, `SOURCE`, `DESTINATION`, `ELEMENTS`, `RANGE`, `INNER_NODES`, `NULLIF`, `COALESCE`, `STDDEV_POP`,`STDDEV_SAMP`, `PERCENTILE_CONT`, `DISC`, `COLLECT_ELEMENTS`, `COLLECT_ONE`

- **Unsupported types**: `BYTES`, `BINARY`, `VARBINARY`, `DATE`, `TIME`

- **Pattern matching**: `MATCH` and `OPTIONAL MATCH` are supported only for node entities, not for edge patterns. For multiple sequences per single `MATCH` clause, only single connected component patterns are supported. Undirected edges (`~`, `<~`, `~>`) are not supported. Quantified paths are not supported.

- **Entity equivalence checks**: Checking entity equivalence using operators like `=` or `<>` between nodes or relationships (for example, `MATCH (n)-[]-(m) WHERE n <> m`) is not supported. Use the `element_id()` function or explicit field comparisons instead, such as `n.id <> m.id`.

- **Distinct**: Applying `DISTINCT` directly to entities is not supported. As an alternative, convert the entity to a string, for example: `MATCH p = (n :Person) RETURN DISTINCT tostring(p)`.

- **Duration granularity**: Durations support up to days and smaller units down to nanoseconds. Larger-than-day units (for example, weeks, months, years) aren't supported.

> [!Note]
> * Reserved keywords: Some GQL keywords cannot be used as identifiers in queries, and some reserved keywords are not immediately obvious. If your graph data has property names that conflict with GQL reserved keywords, use different property names in your graph schema or rename them to avoid parsing conflicts. A good practice is to escape these names with `backticks` or add a prefix or suffix such as `_`.
>
> * Time and timezone: The engine operates in UTC. Datetime literals must use appropriate formats; only the UTC time zone is supported via ZONED_DATETIME("2011-12-31 23:59:59.9").

## Related content

- [Tutorial: Create your first graph](tutorials/your-first-graph.md)
- [GQL Guide](graph-query-language-guide.md)
- [GQL Clauses](graph-query-language-clauses.md)
- [GQL Functions](graph-query-language-functions.md)
- [Create a graph and set a graph reference for querying](run-graph-query-with-graph-reference.md)
- [ISO/IEC 39075 Information Technology - Database Languages - GQL](https://www.iso.org/standard/76120.html)
- [ISO GQL standard](https://www.iso.org/obp/ui/en/#iso:std:iso-iec:39075:ed-1:v1:en)
- [make-graph operator](make-graph-operator.md)
- [Create persistent graph](..\management\graph\graph-persistent-overview.md)