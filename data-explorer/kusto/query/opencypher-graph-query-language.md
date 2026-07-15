---
title: openCypher
description: This article describes openCypher, an open-source graph query language
ms.reviewer: mbrichko
ms.topic: reference
ms.date: 06/22/2026
---
# openCypher

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

openCypher is an [open-source specification](https://s3.amazonaws.com/artifacts.opencypher.org/openCypher9.pdf) for querying property graph databases. You can run openCypher queries over KQL graph semantics by using a declarative, pattern-matching syntax that makes it intuitive to express complex graph patterns and relationships.

## Getting started

To use openCypher, you need a graph data source that is either a [persistent graph](..\management\graph\graph-persistent-overview.md) (recommended for production scenarios) or a function that returns a transient graph (ending with a [make-graph](make-graph-operator.md) operator).

## Prerequisites

Create a graph and set a graph reference for querying. Follow the steps described [here](run-graph-query-with-graph-reference.md).

## Example

Find all actors who acted in a movie.

<!-- csl -->
```openCypher
MATCH (n :Person)-[e :ACTED_IN]->(m: Movie)
WHERE m.Title starts with 'A'
RETURN n.Name as actorName, m.Title as movieTitle
ORDER BY actorName desc
LIMIT 2
```

**Output**

|  actorName  | movieTitle |
|-------------| ---------  |
| Actor1      | Movie1     |
| Actor2      | Movie1     |

For more openCypher examples, see the [openCypher specification](https://s3.amazonaws.com/artifacts.opencypher.org/openCypher9.pdf).

## Limitations

- **Query structure**: All queries must start with a `MATCH` statement.

- **No graph modification operations**: Operations to change graph structures (such as `CREATE`, `MERGE`, `DELETE`, `SET`, `REMOVE`, `DETACH`) are not supported. Use KQL for all graph creation, modification, and management tasks.

- **Unsupported clauses**: `EXISTS`, `SET`, `CALL`.

- **Unsupported functions and aggregates**: `percentileDisc()`, `percentileCont()`, `stDev()`, `stDevP()`, `properties()`, `type()`, `range()`, `exists()`, `startNode()`, `endNode()`, `tail()`, `replace()`, `split()`, `substring()`, `rand()`, `round()`, `sign()`, `atan2()`, `e()`, `pi()`.

- **Pattern matching**: `MATCH` and `OPTIONAL MATCH` are supported only for node entities, not for edge patterns. For multiple sequences per single `MATCH` clause, only single connected component patterns are supported.

- **Entity equivalence checks**: Checking entity equivalence using operators like `=` or `<>` between nodes or relationships (for example, `MATCH (n)-[]-(m) WHERE n <> m`) is not supported. Use the `id()` function or explicit field comparisons instead, such as `n.id <> m.id`.

- **Distinct**: Applying `DISTINCT` directly to entities is not supported. As an alternative, convert the entity to a string, for example: `MATCH p = (n :Person) RETURN DISTINCT tostring(p)`.

## Notes

> [!NOTE]
> Performance improvement suggestion:
>
> For better performance, use as few `MATCH` clauses as possible, ideally one per query. A single `MATCH` clause can still be as complex as needed: the pattern can be nontrivial and can include connected components, variable-length edges, and more.

- **Reserved keywords**: Some openCypher keywords cannot be used as identifiers in queries, and some reserved keywords are not immediately obvious. If your graph data has property names that conflict with openCypher reserved keywords, use different property names in your graph schema or rename them to avoid parsing conflicts.

> [!IMPORTANT]
> When you design your graph schema, some common property names might conflict with openCypher reserved keywords. Avoid or rename these property names. A good practice is to escape these names with `backticks` or add a prefix or suffix such as `_`.

- **Time and timezone**: The engine operates in UTC. Datetime literals must use appropriate formats; only the UTC time zone is supported.

## Related content

- [Tutorial: Create your first graph](tutorials/your-first-graph.md)
- [openCypher specification](https://s3.amazonaws.com/artifacts.opencypher.org/openCypher9.pdf)
- [openCypher project website](https://opencypher.org/)
- [make-graph operator](make-graph-operator.md)
- [Create persistent graph](..\management\graph\graph-persistent-overview.md)
