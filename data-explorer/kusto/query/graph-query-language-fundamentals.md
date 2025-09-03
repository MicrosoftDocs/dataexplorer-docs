---
title: Graph Query Language (GQL) Fundamentals
description: Learn the fundamental concepts of Graph Query Language (GQL) including graph patterns, morphism, and core principles for graph data analysis.
ms.reviewer: herauch
ms.topic: reference
ms.date: 09/02/2025

#CustomerIntent: As a developer, I want to understand GQL fundamentals so that I can effectively query graph data.
---
# Graph Query Language (GQL) fundamentals (preview)

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

This article covers the fundamental concepts of Graph Query Language (GQL), including graph patterns, graph morphism, and core principles that form the foundation of graph data analysis.

> [!NOTE]
> GQL support is in preview. Features and syntax can change based on feedback and ongoing development.

## Overview

Graph Query Language (GQL) is built on mathematical graph theory concepts that provide a solid foundation for querying graph data. Understanding these fundamentals helps you write more effective queries and better understand how GQL processes your data.

## Graph patterns

Graph patterns are the core building blocks of GQL queries. They describe the structure you want to find in your graph data using a declarative syntax that mirrors the visual representation of graphs.

### Node patterns

Node patterns specify how to match individual nodes in your graph:

```gql
(n)              -- Any node
(n:Person)       -- Node with Person label  
(n:Person&City)  -- Node with Person AND City label
(:Person)        -- Person node, don't bind variable
```

**Key concepts:**

- **Variable binding**: `(n)` creates a variable `n` that you can reference later in the query
- **Anonymous nodes**: `(:Person)` matches nodes without creating a variable
- **Label filtering**: `:Person` restricts matches to nodes with the Person label
- **Label combinations**: Use `&` for AND, `|` for OR operations

### Edge patterns

Edge patterns define how nodes connect to each other:

```gql
-[e]->                -- Directed outgoing edge, any label
-[e:works_at]->       -- Directed edge, works_at label
-[e:knows|likes]->    -- knows OR likes edge
<-[e]-                -- Directed incoming edge
-[e]-                 -- Undirected (any direction)
```

**Key concepts:**

- **Direction**: `->` for outgoing, `<-` for incoming, `-` for any direction
- **Edge types**: Use labels like `:works_at` to filter by relationship type
- **Multiple types**: `knows|likes` matches either relationship type

### Label expressions

Labels provide semantic meaning to nodes and edges. GQL supports complex label expressions:

```gql
:Person&Company                  -- Both Person AND Company labels
:Person|Company                  -- Person OR Company labels
:!Company                        -- NOT Company label
:(Person|!Company)&City          -- Complex expressions with parentheses
```

**Operators:**

- `&` (AND): Node must have all specified labels
- `|` (OR): Node must have at least one specified label  
- `!` (NOT): Node must not have the specified label
- `()`: Parentheses for grouping complex expressions

### Path patterns

Path patterns describe multi-hop relationships in your graph:

```gql
(a)-[e1]->(b)-[e2]->(c)              -- 2-hop path
(a)-[e]->{2,4}(b)                    -- 2 to 4 hops
(a)-[e]->{1,}(b)                     -- 1 or more hops
(a)-[:knows|likes]->{1,3}(b)         -- 1-3 hops via knows/likes
p=()-[:works_at]->()                 -- Binding a path variable
```

**Variable-length paths:**

- `{2,4}`: Exactly 2 to 4 hops
- `{1,}`: 1 or more hops (unbounded)
- `{,3}`: Up to 3 hops
- `{5}`: Exactly 5 hops

**Path variables:**

- `p=()->()`: Captures the entire path for later analysis
- Access with `NODES(p)`, `RELATIONSHIPS(p)`, `PATH_LENGTH(p)`

### Multiple patterns

GQL supports complex, non-linear graph structures:

```gql
(a)->(b), (a)->(c)               -- Multiple edges from same node
(a)->(b)<-(c), (b)->(d)          -- Non-linear structures
```

**Pattern composition:**

- Use commas `,` to separate multiple patterns
- All patterns must match simultaneously
- Variables can be shared across patterns

GQL supports different path matching modes that control how patterns are matched against graph data. These modes affect performance, result completeness, and the types of paths that are returned.

## Match modes

Match modes control how graph elements can be reused across pattern variables within a single MATCH clause.

### DIFFERENT EDGES (default)

The default mode in Kusto. A matched edge cannot bind to more than one edge variable, but nodes can be reused freely.

```gql
MATCH (a)-[r1]->(b)-[r2]->(c)
-- r1 and r2 must be different edges
-- a, b, c can be the same or different nodes
```

### REPEATABLE ELEMENTS

Allows both edges and nodes to be reused across pattern variables without restrictions.

```gql
MATCH REPEATABLE ELEMENTS (a)-[r1]->(b)-[r2]->(c)
-- r1 and r2 can be the same edge
-- a, b, c can be the same or different nodes
```

## Path modes

Path modes control which types of paths are included in results based on repetition constraints.

### WALK (default)

The default GQL path mode. Includes all possible paths with no restrictions on node or edge repetition.

```gql
MATCH WALK (a)-[]->{1,3}(b)
-- Allows paths with repeating nodes and edges
```

### TRAIL

Filters out paths that have repeating edges. Nodes may repeat, but each edge can only appear once per path.

```gql
MATCH TRAIL (a)-[]->{1,3}(b)
-- No edge can appear twice in the same path
-- Nodes may repeat
```

### ACYCLIC

Filters out paths that have repeating nodes. Each node can only appear once per path.

```gql
MATCH ACYCLIC (a)-[]->{1,3}(b)
-- No node can appear twice in the same path
-- Prevents cycles entirely
```

### SIMPLE

Same as ACYCLIC but allows the first and last nodes in the path to be the same (forming a simple cycle).

```gql
MATCH SIMPLE (a)-[]->{1,3}(b)
-- No node repetition except first/last can match
-- Currently not supported in implementation
```

## Mode combinations and Kusto cycles parameter

Different combinations of match modes and path modes map to specific Kusto `cycles` parameter values:

### DIFFERENT EDGES mode

| Path Mode | Single Path | Multi-path ("star" pattern) |
|-----------|-------------|----------------------------|
| WALK      | `cycles=unique_edges` | `cycles=unique_edges` (only if all paths are WALK/TRAIL) |
| TRAIL     | `cycles=unique_edges` | `cycles=unique_edges` (only if all paths are WALK/TRAIL) |
| ACYCLIC   | `cycles=none` | Not supported |
| SIMPLE    | Not supported | Not supported |

### REPEATABLE ELEMENTS mode

| Path Mode | Single Path | Multi-path ("star" pattern) |
|-----------|-------------|----------------------------|
| WALK      | `cycles=all` | `cycles=all` (only if all paths are WALK) |
| TRAIL     | `cycles=unique_edges` | Not supported |
| ACYCLIC   | `cycles=none` | Not supported |
| SIMPLE    | Not supported | Not supported |

## Syntax examples

### Basic path modes

```gql
-- Default (WALK with DIFFERENT EDGES)
MATCH (n)-[]->(m)
RETURN n, m

-- Explicit WALK mode
MATCH WALK (n)-[]->(m)
RETURN n, m

-- TRAIL mode - no repeating edges
MATCH TRAIL (n)-[]->{1,3}(m)
RETURN n, m

-- ACYCLIC mode - no repeating nodes
MATCH ACYCLIC (n)-[]->{1,3}(m)
RETURN n, m
```

### Match mode combinations

```gql
-- DIFFERENT EDGES with WALK (default)
MATCH DIFFERENT EDGES WALK (n)-[]->(m)
RETURN n, m

-- REPEATABLE ELEMENTS with WALK
MATCH REPEATABLE ELEMENTS WALK (n)-[]->(m)
RETURN n, m

-- REPEATABLE ELEMENTS with TRAIL
MATCH REPEATABLE ELEMENTS TRAIL (n)-[]->(m)
RETURN n, m
```

### Multi-pattern queries

```gql
-- Multiple WALK patterns (star pattern)
MATCH WALK (n)-[]->(a), WALK (n)-[]->(b)
RETURN n, a, b

-- Mixed path modes (both must be WALK/TRAIL for multi-path)
MATCH WALK (n)-[]->(a), TRAIL (n)-[]->(b)
RETURN n, a, b
```

## Related content

- [Graph Query Language (GQL) overview](graph-query-language.md)
- [GQL query patterns, examples, and use cases](graph-query-language-use-cases.md)
- [Graph Query Language functions](graph-query-language-functions.md)
- [Graph operators overview](graph-operators.md)
