---
title: GQL Guide
description: This article describes GQL guide
ms.reviewer: mbrichko
ms.topic: reference
ms.date: 07/09/2026
---

# GQL guide

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

GQL (Graph Query Language) is an ISO standard ([ISO/IEC 39075:2024](https://www.iso.org/standard/76120.html)) for querying graphs by matching patterns of paths, nodes, and edges.

## Prerequisites

* Create a graph and set a graph reference before running queries. See [Create a graph and set a graph reference](run-graph-query-with-graph-reference.md). Every query begins with `MATCH`.

* Use the sample movies graph G() referenced in the prerequisites. The graph contains Person nodes (Name, Born), Movie nodes (Title, Description, Year), and ACTED_IN and DIRECTED edges (Role), with labels stored in the Label2 column.

* For the complete list of supported clauses, see [GQL clauses](graph-query-language-clauses.md).

* For the complete list of supported functions, see [GQL scalar functions](graph-query-language-functions.md).

> [!NOTE]
> * Some examples use illustrative labels that aren't included in the sample movies graph.
> * All graph queries begin with the MATCH clause.

## Query basic structure

A GQL query starts with a `MATCH` clause and follows a pipeline structure, where each clause operates on the results of the previous clause:

1. `MATCH` finds patterns in the graph.
2. `WHERE` filters the matched rows.
3. `RETURN` projects the output columns, optionally with `DISTINCT` and aggregations.
4. `ORDER BY`, then `OFFSET` and `LIMIT`, sort and paginate the result.

Combine several statements with a composite `MATCH` sequence, a `NEXT` pipeline (the rows returned by one statement feed the next), or `UNION` to concatenate results.

## MATCH

`MATCH` describes a pattern to find in the graph. A pattern is a chain of node patterns connected by edge patterns. Bind variables to entities to filter or return them.

Each element pattern (node or edge) can be filtered by **label** (`:Person`), by **inline properties** (`{Year: 1995}`), and by **predicate** (`WHERE` inside the element, such as `(n:Person WHERE n.Born > 1950)`).

### Node patterns

A node pattern includes parentheses, optionally with a variable, a label, and inline properties.


| Pattern | Matches |
|---|---|
| `()` | any node |
| `(m)` | any node, bound to variable `m` |
| `(:Movie)` | nodes labeled `Movie` |
| `(m:Movie)` | `Movie` nodes, bound to variable `m` |
| `(m:Movie {Year: 1995})` | `Movie` nodes where `Year` equals 1995 |
| `(p:Adventure & !Horror)` | nodes with the `Adventure` label but not `Horror`. Combine labels with `&`, `\|` and `!` (see [Labels](#labels)) |

<!-- csl -->
```gql
match (m:Movie) return m.Title as MovieTitle
```

| MovieTitle |
|---|
| m.Title |
| Movie1 |
| Movie2 |
| Movie3 |

### Edge patterns

An edge pattern includes square brackets between two nodes, with dashes and arrows that set direction.

| Pattern | Direction |
|---|---|
| `(a)-[e]->(b)` | from `a` to `b` |
| `(a)<-[e]-(b)` | from `b` to `a` |
| `(a)-[e]-(b)` | either direction |
| `(a)->(b)`, `(a)<-(b)`, `(a)-(b)` | direction without a bound edge |
| `(a)-[e:ACTED_IN \| DIRECTED]->(b)` | from `a` to `b`, matching `ACTED_IN` or `DIRECTED` edges. Combine labels with `&`, `\|`, `!`, and `()` (see [Labels](#labels)) |

The shorthand `->`, `<-`, and `-` may be used in place of `-[]->`, `<-[]-`, and `-[]-`. Edge variables and labels work like nodes: `[e]`, `[:ACTED_IN]`, `[e:ACTED_IN]`, `[e {Role: 'Director'}]`.

<!-- csl -->
```gql
match (p:Person)-[:ACTED_IN]->(m:Movie) return p.Name as actor, m.Title as movie
```

|actor|movie|
|---|---|
|Actor1|Movie1|
|Actor1|Movie2|
|Actor1|Movie3|
|Actor2|Movie1|

Count the matched patterns:

<!-- csl -->
```gql
match (p:Person)-[:ACTED_IN]->(m:Movie) return count(*) as patternsCount
```

|patternsCount|
|---|
|4|

### Chained patterns

Connect multiple patterns to follow relationships across several hops. Use the same variable to refer to the same node more than once.

<!-- csl -->
```gql
match (p1:Person)-[:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-(p2:Person)
return p1.Name as firstActor, m.Title as movie, p2.Name as secondActor
```

|firstActor|movie|secondActor|
|---|---|---|
|Actor1|Movie1|Actor2|
|Actor2|Movie1|Actor1|

### Multiple sequences (Multi-path or "star" pattern)

GQL supports multiple comma-separated patterns in a single MATCH clause. The patterns must share at least one node variable, so they form a single connected pattern. For example, the following query finds people who acted in one movie and directed another.

<!-- csl -->
```gql
match (p:Person)-[:ACTED_IN]->(m:Movie), (p)-[:DIRECTED]->(m2:Movie)
return p.Name as person, m.Title as firstTitle, m2.Title as secondTitle
```

|person|firstTitle|secondTitle|
|---|---|---|
|Actor1|Movie1|Movie2|
|Actor1|Movie2|Movie2|
|Actor1|Movie3|Movie2|

### Variable-length edges

Use a quantifier to follow a relationship across multiple hops. Assign the path to a variable (p = ...) to return the full path, or reference specific edges or nodes at index i with expressions such as p[i].

<!-- csl -->
```gql
match p = (n1)-[e]->{2,2}(n2) return p
```

| Quantifier | Hops |
|---|---|
| `{m,n}` | between `m` and `n` hops |
| `{m,}` | `m` or more hops |
| `{,n}` | up to `n` hops |
| `{,}` | any number of hops |
| `{n}` | exactly `n` |
| `*` | zero or more (same as `{,}`) |
| `+` | one or more (same as `{1,}`) |

Example:

<!-- csl -->
```gql
match (e:Employee)->*(m:Manager) return m.Name as managerName
```

## Labels

Labels select nodes and edges by category. Filter with `:` followed by a label expression. Any logical combination of AND (`&`), OR (`|`), and NOT (`!`), nested with parentheses to any depth, is supported for both node and edge patterns. Label names are case-sensitive; quote names that collide with keywords using backticks.

For the following examples, set the graph label name to `Label2` as described in [Create a graph and set a graph reference](run-graph-query-with-graph-reference.md).

| Operator | Meaning |
|---|---|
| `:A` | has label `A` |
| `A & B` | has both |
| `A \| B` | has either |
| `!A` | does not have `A` |

Next query finds all entities with label `Female`:

<!-- csl -->
```gql
match (p :Female) return p.Name as name
```

|name|
|---|
|Actor4|

Next query showcases a group label expression:

<!-- csl -->
```gql
match ()-[e: !ACTED_IN & (DIRECTED | A) | E]->(m:Movie) return m.Title as title
```

|title|
|---|
|Movie1|
|Movie2|

Reference the same variable with two labels to require both:

<!-- csl -->
```gql
match (n:Male), (n:BestActorAward) return n.Name as name
```

|name|
|---|
|Actor1|

The [`labels()`](graph-query-language-functions.md#graph-and-path-functions) function returns an element's labels as a list. It's useful in `WHERE` and `RETURN` clauses. For example, `'DIRECTED' IN labels(e)`.

<!-- csl -->
```gql
match (p:Person)-[e:ACTED_IN]->(m:Movie)
return p.Name as name, labels(e) as EdgeLabels
```

|name|EdgeLabels|
|---|---|
|Actor1|["ACTED_IN"]|
|Actor1|["ACTED_IN"]|
|Actor1|["ACTED_IN"]|
|Actor2|["ACTED_IN"]|

## Access node properties

Access a property of a node or an edge by name using dot notation: the bound variable, a `.`, and the property name.

<!-- csl -->
```gql
match (m:Movie)
return m.Title as title, m.Year as year
```

|title|year|
|---|---|
|Movie1|1995|
|Movie2|2011|
|Movie3|2020|

The `[]` indexer accesses an element of a list or path by its integer position (zero-based), not a property by name. Combine it with dot notation to read a property of a path element. For example, `p[0]` is the first node of the path `p`, so `p[0].Name` returns that node's `Name`:

<!-- csl -->
```gql
match p = (:Person)-[:ACTED_IN]->(:Movie)
return p[0].Name as name
```

|name|
|---|
|Actor1|
|Actor1|
|Actor1|
|Actor2|

## Comparisons

GQL supports the standard comparison operators on scalar values: `=`, `<>` (not equal), `<`, `<=`, `>`, and `>=`.

Next query filters out movies with title 'Movie1' from matched patterns:

<!-- csl -->
```gql
match (p:Person)-[:ACTED_IN]->(m:Movie)
where m.Title <> 'Movie1'
return p.Name as name, m.Title as title
```

|name|title|
|---|---|
|Actor1|Movie2|
|Actor1|Movie3|

You can't compare two nodes or edges directly with `=` or `<>`. To test whether two entities are different, compare their identities with [`element_id()`](graph-query-language-functions.md#graph-and-path-functions) instead. For example, the following query finds pairs of distinct actors who appeared in the same movie:

<!-- csl -->
```gql
match (p1:Person)-[:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-(p2:Person)
where element_id(p1) <> element_id(p2)
return p1.Name as firstName, p2.Name as secondName, m.Title as title
```

|firstName|secondName|title|
|---|---|---|
|Actor1|Actor2|Movie1|
|Actor2|Actor1|Movie1|

#### Filtering edges in a variable-length path

Inside the edge pattern, label and `WHERE` filters apply to *every* edge along the path; only paths whose hops all match are kept.

<!-- csl -->
```gql
match ()-[e:DIRECTED]->+() return e[0].Name as personName, e[0].Role as personRole
```

|personName|personRole|
|---|---|
|Actor3|Director|
|Actor1|Director|

<!-- csl -->
```gql
match ()-[e where 'DIRECTED' in labels(e)]->+() return e[0].Role as role
```

|role|
|---|
|Director|
|Director|

Outside the pattern, the edge variable `e` is an array of the traversed edges, so index it (`e[0]`, `e[1]`) to access individual hops.

The following example finds the distinct roles. The `CAST` to string is required to deduplicate the values, because the type of `Role` is unknown in this context.

<!-- csl -->
```kusto
match ()-[e where 'DIRECTED' in labels(e)]->+() return distinct cast(e[0].Role as string) as role
```

|role|
|---|
|Director|

The following example finds all patterns with one or two hops and filters every edge by `Role`. The query returns all paths of length 1, and each path is returned as a JSON string.

<!-- csl -->
```gql
match p = (n1)-[e {Role: "Role2"}]->{1,2}(n2)
where path_length(p) = 1
return to_json_string(p) as myPath
```

|myPath|
|---|
|[{"Name":"Actor2", ... "Description":"A movie about space","Year":1995}]|

## Operators

Beyond comparison operators, GQL supports arithmetic, concatenation, and boolean logic:

- **Arithmetic (`+`, `-`)**: Operate on numeric values, and add or subtract a `timespan` (`duration(...)`) to or from a `datetime` to shift a point in time.
- **Concatenation (`||`)**: Joins two strings, or two lists, into a single value.
- **Boolean (`AND`, `OR`, `NOT`, `IN`)**: Combine predicates in `WHERE`, `CASE`, and other conditions; group them with parentheses.

<!-- csl -->
```gql
match (p:Person)
return p.Name || ' born ' || cast(p.Born as string) as `Label`, p.Born + 1 as NextYear
```

|Label|NextYear|
|---|---|
|Actor1 born 1956|1957|
|Actor2 born 1958|1959|
|Actor3 born 1954|1955|
|Actor4 born 1967|1968|

> [!NOTE]
> The `Label` variable is escaped because label is a reserved keyword. To differentiate between GQL syntax and user variables, escape user variables. Alternatively, add a prefix or suffix `_`.

## Paths

A path is the full route a pattern traverses. Bind it with a path variable using `name = pattern`; the variable holds an alternating sequence of nodes and edges, which you can return, index (`p[0]`), or pass to a path function.

<!-- csl -->
```gql
match `path` = (n1)-[e]->{1,2}(n2) 
where `path`[0].Born = 1958
return `path`
```

|path|
|---|
|[{"Name": "Actor2" ,..., "Drama", "History"]}]|

> [!TIP]
> The path alias `path` is escaped because path is a reserved keyword. To differentiate between GQL syntax and user variables, you can escape user variables. Alternatively, add a prefix or suffix `_`.

<!-- csl -->
```gql
match p1 = (n1)-[e]->{1,2}(n2), p2 = (:Movie & War) return p1, p2
```

|p1|p2|
|---|---|
|[{  "Name": "Actor1" ,..., "War"  ]}]|[{ ,..., "War"  ]}]|

The available path functions are `path_length`, `nodes`, and `edges` (also spelled `relationships`), which operate on a path variable. For details, see [Graph and path functions](graph-query-language-functions.md#graph-and-path-functions).

<!-- csl -->
```gql
match p = (n1)-[]->{1,3}(n2)
where p[0].Name starts with 'K'
return nodes(p)[0] as firstNode, edges(p) as `edges`, path_length(p) as pathLength
```

|firstNode|edges|pathLength|
|---|---|---|
|{  "Name": "Actor2",  ...|[ ..."ACTED_IN"...  }]|1|

> [!NOTE]
> The `edges` variable is escaped because edges is a reserved keyword. To differentiate between GQL syntax and user variables, you can escape user variables. Alternatively, add a prefix or suffix `_`.

You can combine these functions to return the nodes, edges, and length of a matched path:

<!-- csl -->
```gql
match p = (n0:Person)-[:DIRECTED]->(m:Movie {Title: 'Movie1'})
return nodes(p), edges(p), path_length(p)
```

|nodes(p)|edges(p)|path_length(p)|
|---|---|---|
|[{"Name": "Actor3",...},{"Title": "Movie1", ...}]|[{..."DIRECTED"...}]|1|

### Shortest paths

`ANY SHORTEST` returns a single shortest path for each source and target pair.

<!-- csl -->
```gql
match P = any shortest (n {station:"South-West"})->{1,3}(a {station: "North"}) 
return P
```

### All shortest paths

`ALL SHORTEST` returns all shortest paths of equal minimum length.

<!-- csl -->
```gql
match P = all shortest (n {station:"South-West"})->{1,3}(a {station: "North"}) 
return P
```

#### Limitations

* A shortest path `MATCH` clause can't contain multiple pattern sequences.

## MATCH and PATH modes

A `MATCH` clause can specify how to handle cycles and repeated elements. The structure is:

```
MATCH [DIFFERENT EDGES | REPEATABLE ELEMENTS] [WALK | TRAIL | ACYCLIC | SIMPLE] PATTERN_1, ..., [WALK | TRAIL | ACYCLIC | SIMPLE] PATTERN_N WHERE ...
```

- **Match mode** — one setting per `MATCH` clause, either `DIFFERENT EDGES` (No edge matched twice) or `REPEATABLE ELEMENTS` (As many results as possible). The default is `DIFFERENT EDGES`.
- **Path mode** — each path in the clause can be prefixed with `WALK` (No restrictions), `TRAIL` (No repeated edges), `ACYCLIC` (No repeated nodes), or `SIMPLE` (No repeated interior nodes). The GQL default is `WALK`.

The following tables show which combinations are supported. Multi-path is a "star" pattern with several paths.

**`DIFFERENT EDGES` (default):**

| Path mode | Single path | Multi-path ("star") |
|---|---|---|
| WALK | Supported | Supported (only if all paths are WALK/TRAIL) |
| TRAIL | Supported | Supported (only if all paths are WALK/TRAIL) |
| ACYCLIC | Supported | Not supported |
| SIMPLE | Not supported | Not supported |

**`REPEATABLE ELEMENTS`:**

| Path mode | Single path | Multi-path ("star") |
|---|---|---|
| WALK | Supported | Supported (only if all paths are WALK) |
| TRAIL | Supported | Not supported |
| ACYCLIC | Supported | Not supported |
| SIMPLE | Not supported | Not supported |

<!-- csl -->
```gql
match different edges trail (p:Person)-[]->{1,3}(m:Movie) return p.Name as name, m.Title as title
```

With `REPEATABLE ELEMENTS`, the same node or edge can be revisited within a match:

<!-- csl -->
```gql
match repeatable elements walk (p:Person)-[:ACTED_IN]->(m:Movie) return p.Name as name, m.Title as title
```

## Aggregations

Aggregate expressions in `RETURN` compute over the matched rows. The non-aggregated columns form the grouping key. Supported [aggregations](graph-query-language-functions.md#aggregations) are `count`, `sum`, `avg`, `min`, `max`, and `collect_list`; each accepts `DISTINCT`.

For example, find all actors who acted in a movie:

<!-- csl -->
```gql
match (p:Person)-[:ACTED_IN]->(m:Movie)
return m.Title as Title, count(*) as Actors, collect_list(p.Name) as ActorNames
```

|Title|Actors|ActorNames|
|---|---|---|
|Movie3|1|[ "Actor1"]|
|Movie2|1|[ "Actor1"]|
|Movie1|2|[ "Actor1", "Actor2"]|

Next query calculates count of patterns:

<!-- csl -->
```gql
match (p:Person)-[:ACTED_IN]->(m:Movie)
return count(*) as countOfPatterns
```

|countOfPatterns|
|---|
|4|

Combine several aggregations in one `RETURN`; the non-aggregated columns form the grouping key:

<!-- csl -->
```gql
match (p:Person)-[:ACTED_IN]->(m:Movie)
return m.Title as Title, min(p.Born) as Earliest, max(p.Born) as Latest, avg(p.Born) as AvgBorn
```

|Title|Earliest|Latest|AvgBorn|
|---|---|---|---|
|Movie3|1956|1956|1956|
|Movie2|1956|1956|1956|
|Movie1|1956|1958|1957|

`sum` adds up a numeric expression across each group:

<!-- csl -->
```gql
match (p:Person)-[:ACTED_IN]->(m:Movie)
return m.Title as Title, sum(p.Born) as BornSum
```

|Title|BornSum|
|---|---|
|Movie3|1956|
|Movie2|1956|
|Movie1|3914|

### Aggregate by entity

To group by an entire node, edge, or path instead of a scalar property, use `to_json_string(entity)`. This function serializes the entity and its properties to a JSON string and uses that string as the grouping key.

<!-- csl -->
```gql
match (p:Person)-[:ACTED_IN]->(m:Movie)
return to_json_string(m) as Movie, count(*) as Actors
```

|Movie|Actors|
|---|---|
|{"Title":"Movie3", ... }|1|
|{"Title":"Movie2", ... }|1|
|{"Title":"Movie1", ... }|2|

Alternatively, convert the entity to a string with `CAST(entity AS string)`. This conversion also works as a grouping key:

<!-- csl -->
```gql
match (p:Person)-[:ACTED_IN]->(m:Movie)
return cast(m as string) as Movie, count(*) as Actors
```

|Movie|Actors|
|---|---|
|{"Title":"Movie3", ... }|1|
|{"Title":"Movie2", ... }|1|
|{"Title":"Movie1", ... }|2|

## Composite queries

A query can contain more than one `MATCH` statement. How the statements relate depends on whether they share variables.

**Cross join.** When two `MATCH` statements don't share variables, the result is the cartesian product of their rows (every combination).

<!-- csl -->
```gql
match (p:Person where p.Name starts with 'J')
match (m:Movie where m.Title starts with 'G')
return p.Name as name, m.Title as title
```

|name|title|
|---|---|
|Actor4|Movie3|

**Match sequence.** When a later `MATCH` reuses a variable bound by an earlier one, it continues from those bindings, joining the patterns on the shared variable.

<!-- csl -->
```gql
match (p:Person {Name: 'Actor1'})
match (p)-[:ACTED_IN]->(m:Movie)
return m.Title as title
```

|title|
|---|
|Movie3|
|Movie2|
|Movie1|

> [!TIP]
> Each additional `MATCH` may introduce another join. Whenever a relationship can be expressed within a single pattern, prefer fewer `MATCH` statements for better performance. For example, the query above is equivalent to, and faster when written as, a single statement:

<!-- csl -->
 ```gql
 match (p:Person {Name: 'Actor1'}), (p)-[:ACTED_IN]->(m:Movie)
 return m.Title as title
 ```

|title|
|---|
|Movie3|
|Movie2|
|Movie1|

## Optional match

`OPTIONAL MATCH` works like a left outer join. It keeps the rows from the preceding statement even when the optional pattern has no match. Unmatched variables are null or empty. The first `MATCH` in a query can't be `OPTIONAL`; an `OPTIONAL MATCH` must follow another statement.

<!-- csl -->
```gql
match (p:Person)
optional match (p)-[:DIRECTED]->(m:Movie)
return p.Name as name, m.Title as title
```

|name|title|
|---|---|
|Actor3|Movie1|
|Actor1|Movie2|
|Actor4| |
|Actor2| |

## Supported types

GQL values map to the underlying [Kusto scalar types](scalar-data-types/index.md). The following types are supported:

| Kusto type | Description | GQL literal example |
|---|---|---|
| `string` | Unicode text. | `'Actor1'` |
| `bool` | Boolean value. | `true`, `false` |
| `int` | 32-bit signed integer. | `42` |
| `long` | 64-bit signed integer. | `9000000000` |
| `real` | 64-bit floating-point number. | `3.14` |
| `decimal` | 128-bit decimal number. | `CAST('19.99' AS decimal)` |
| `datetime` | Point in time (UTC). | `zoned_datetime('2020-01-01 00:00:00.0')` |
| `timespan` | Duration. | `duration({days: 1, hours: 6})` |
| `dynamic` | `List` or `record` (the GQL key-value pair type, a JSON value). | `[1, 2, 3]`, `{a: 1}` |
| `null` | Absence of a value. | `null` |

`CAST(value AS type)` accepts these GQL type names (case-insensitive), each mapping to a Kusto type:

| Kusto type | Accepted GQL type names |
|---|---|
| `string` | `string`, `char`, `varchar` |
| `bool` | `bool`, `boolean` |
| `int` | `int`, `int32`, `integer` |
| `long` | `int64`, `integer64`, `uint`, `uint32`, `uint64` |
| `real` | `float`, `float32`, `real`, `double`, `float64` |
| `decimal` | `decimal` |
| `dynamic` | `list`, `record`, `any record` |

<!-- csl -->
```gql
match (p:Person)
return p.Name || ' (' || cast(p.Born as string) || ')' as `Label`
```

|Label|
|---|
|Actor1 (1956)|
|Actor2 (1958)|
|Actor3 (1954)|
|Actor4 (1967)|

> [!NOTE]
> The `Label` variable is escaped because label is a reserved keyword. To differentiate between GQL syntax and user variables, you can escape user variables. Alternatively, add a prefix or suffix `_`.

## Temporal data analysis

GQL provides comprehensive support for temporal data analysis using duration functions. These functions enable you to perform time-based filtering, calculations, and comparisons on graph data with timestamps. For the full list of temporal functions such as `duration()`, `duration_between()`, and `zoned_datetime()`, see [GQL date and time functions](graph-query-language-functions.md#date-and-time-functions).

### Supported duration units

The `duration()` function supports a wide range of time units with flexible, case-insensitive syntax and returns a `timespan` object:

| Time unit | Supported names | Example | Timespan output |
|---|---|---|---|
| Days | `days`, `day` | `duration({days: 7})` | `7.00:00:00` |
| Hours | `hours`, `hour` | `duration({hours: 24})` | `1.00:00:00` |
| Minutes | `minutes`, `minute` | `duration({minutes: 30})` | `00:30:00` |
| Seconds | `seconds`, `second` | `duration({seconds: 45})` | `00:00:45` |
| Milliseconds | `milliseconds`, `millisecond` | `duration({milliseconds: 500})` | `00:00:00.5000000` |
| Microseconds | `microseconds`, `microsecond` | `duration({microseconds: 1000})` | `00:00:00.0010000` |
| Nanoseconds | `nanoseconds`, `nanosecond` | `duration({nanoseconds: 1000000})` | `00:00:00.0010000` |

You can combine multiple units in a single duration object: `duration({days: 1, minutes: 8, seconds: 7})` returns `1.00:08:07`.

> [!NOTE]
> `duration()` accepts only a `record` of units (for example, `duration({days: 14, hours: 16})`); ISO 8601 duration strings such as `duration('P14DT16H12M')` aren't supported. The `timestamp()` function isn't supported either; use `zoned_datetime()` to construct a `datetime`.

Example:

Combine duration functions with timestamp arithmetic for precise temporal filtering. For example, the following query finds alerts generated within a three-minute time window.

<!-- csl -->
```gql
match (system:System)-[event:generated]->(alert:Alert)
where event.event_timestamp > zoned_datetime("2012-01-01 08:00:00.0") and event.event_timestamp <= zoned_datetime("2012-01-01 08:00:00.0") + duration({minutes: 3})
return
    system.name,
    alert.severity,
    event.event_timestamp,
    duration_between(zoned_datetime("2012-01-01 08:00:00.0"), event.event_timestamp) as time_since_baseline
order by event.event_timestamp
```

## Work with JSON

In GQL, a JSON object is a `record` value (the key-value pair type, written with `{...}`), or a `list` object value (written with `[...]`) which maps to the Kusto `dynamic` type. Two [JSON functions](graph-query-language-functions.md#json-functions) convert between JSON text and `record` values:

- `parse_json_string(s)` parses a JSON string into a `record` or a `list`.
- `to_json_string(x)` serializes a value, including a node, edge, or path, into a JSON string.

**Read JSON.** After parsing, access `record` members with `.` and `list` elements with `[index]`. Because the result is a [dynamic type](scalar-data-types/dynamic.md), cast it before you compare or compute with it as needed.

<!-- csl -->
```gql
match ()
return
    parse_json_string('{"a":{"b":3}}').a.b as Nested,
    cast(parse_json_string('[10,20,30]')[1] as int) as Second
limit 1
```

|Nested|Second|
|---|---|
|3|20|

**Write JSON.** Use `to_json_string` to serialize a node, edge, path, or value.

<!-- csl -->
```gql
match (n:Person {Name: 'Actor4'})
return to_json_string(n) as `Json`
```

|Json|
|---|
|{"Name":"Actor4","Born":1967,"Label2":["Female","BestActressAward"]}|

> [!NOTE]
> The `Json` variable is escaped because json is a reserved keyword. To differentiate between GQL syntax and user variables, you can escape user variables. Alternatively, add a prefix or suffix `_`.

## Work with nulls

Test for null by using `IS NULL` and `IS NOT NULL`.

Find entities where a property is not null:

<!-- csl -->
```gql
match (p:Person)
where p.Born is not null
return count(*) as `count`
```

Find entities where a property is null:

<!-- csl -->
```gql
match (p:Person)
where p.Born is null
return p.Name as name
```

> [!NOTE]
> * In Kusto, `string` values can't be null. You can instead test the number of characters.
> * The `count` variable is escaped because count is a reserved keyword. To differentiate between GQL syntax and user variables, escape user variables. Alternatively, add a prefix or suffix `_`.

## Limitations

For the full list of unsupported clauses, functions, aggregates, and predicates, see the limitations [here](graph-query-language.md#limitations).

## Related content

- [GQL (Graph Query Language)](graph-query-language.md)
- [GQL clauses](graph-query-language-clauses.md)
- [GQL scalar functions](graph-query-language-functions.md)
- [Create a graph and set a graph reference](run-graph-query-with-graph-reference.md)
