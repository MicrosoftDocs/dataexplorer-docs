---
title: GQL Clauses
description: This article describes GQL clauses
ms.reviewer: mbrichko
ms.topic: reference
ms.date: 07/09/2026
---

# GQL clauses

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

This article lists the clauses supported in [GQL (Graph Query Language)](graph-query-language.md).

The examples use the movies graph `G()` from [Create a graph and set a graph reference](run-graph-query-with-graph-reference.md): `Person` nodes (`Name`, `Born`), `Movie` nodes (`Title`, `Description`, `Year`), and `ACTED_IN` / `DIRECTED` edges (`Role`).

## WHERE

`WHERE` filters with a Boolean expression. Place it inside a node, inside an edge, or after the pattern. Inline `{property: value}` is shorthand for equality.

### Filter by properties

Use `WHERE` after the pattern to compare element properties with operators such as `=`, `<>`, `>`, `>=`, `<`, and `<=`. Combine conditions with `AND`, `OR`, and `NOT`, and group them with parentheses.

<!-- csl -->
```gql
match (p:Person)-[:ACTED_IN]->(m:Movie)
where (p.Name = 'Tom' or p.Name = 'Ron') and m.Title <> 'T1' and p.Born > 1901
return p.Name as name, m.Title as title
```

|name|title|
|---|---|
|Tom|T3|
|Tom|T2|

### Negate a condition with NOT

`NOT` reverses the result of a Boolean condition. Write it as a prefix, `NOT (condition)`, and combine it with `AND` and `OR`. Many predicates also accept an inline `NOT`, such as `NOT STARTS WITH`, `NOT ENDS WITH`, `NOT CONTAINS`, and `IS NOT NULL`.

<!-- csl -->
```gql
match (p:Person)
where not (p.Born < 1960)
return p.Name as name
```

|name|
|---|
|Julia|

The following two queries are equivalent. The first uses prefix `NOT`; the second uses the inline `NOT CONTAINS` predicate:

<!-- csl -->
```gql
match (p:Person)
where not (p.Name contains 'n')
return p.Name as name
```

|name|
|---|
|Tom|
|Julia|

<!-- csl -->
```gql
match (p:Person)
where p.Name not contains 'n'
return p.Name
```

|name|
|---|
|Tom|
|Julia|

### Inline property filters

An inline `{property: value}` inside an element pattern is shorthand for an equality test on that property. The following two queries are equivalent:

<!-- csl -->
```gql
match (p:Person {Name: 'Tom'})
return p.Name as name, p.Born as born
```

|name|born|
|---|---|
|Tom|1956|

<!-- csl -->
```gql
match (p:Person)
where p.Name = 'Tom'
return p.Name as name, p.Born as born
```

|name|born|
|---|---|
|Tom|1956|

Inline filters apply to edges as well as nodes:

<!-- csl -->
```gql
match (p:Person)-[:ACTED_IN {Role: 'Role2'}]->(m:Movie)
return p.Name as name, m.Title as title
```

|name|title|
|---|---|
|Kevin|T1|

### Multiple inline conditions

List several properties in one inline filter to require all of them; the pairs are combined with `AND`. This pattern matches only `Person` nodes where both `Name` is `'Tom'` and `Born` is `1956`:

<!-- csl -->
```gql
match (p:Person {Name: 'Tom', Born: 1956})
return p.Name as name, p.Born as born
```

|name|born|
|---|---|
|Tom|1956|

Apply inline filters to several elements in the same pattern to constrain each node and edge at once:

<!-- csl -->
```gql
match (p:Person {Name: 'Kevin'})-[:ACTED_IN {Role: 'Role2'}]->(m:Movie {Title: 'T1'})
return p.Name as name, m.Title as title
```

|name|title|
|---|---|
|Kevin|T1|

Inline filters and `WHERE` combine freely: use inline `{...}` for the equality checks and `WHERE` for everything else, such as ranges or `OR`:

<!-- csl -->
```gql
match (p:Person {Name: 'Tom'})-[:ACTED_IN]->(m:Movie)
where m.Year >= 1990
return p.Name as name, m.Title as title
```

|name|title|
|---|---|
|Tom|T1|
|Tom|T2|
|Tom|T3|

Inside a node or edge:

<!-- csl -->
```gql
match (p:Person)-[e where 'DIRECTED' in labels(e)]->(m:Movie where m.Title <> 'T1')
return p.Name as name, m.Title as title
```

|name|title|
|---|---|
|Tom|T2|

The `IN` predicate tests whether a value is one of the items in a list:

<!-- csl -->
```gql
match (p:Person)
where p.Name in ['Tom', 'Kevin']
return p.Name as name
```

|name|
|---|
|Tom|
|Kevin|

To compare entities, use `element_id(n)` or property comparisons (`n.Name <> m.Name`); direct entity equality isn't supported.

## RETURN

`RETURN` shapes the output. Project properties, rename with `AS`, return all bound variables with `*`, and deduplicate with `DISTINCT`.

<!-- csl -->
```gql
match (p:Person)-[:ACTED_IN]->(m:Movie)
return m.Title as Title, p.Name as Name
```

|Title|Name|
|---|---|
|T3|Tom|
|T2|Tom|
|T1|Tom|
|T1|Kevin|

Return every bound variable with `*`:

<!-- csl -->
```gql
match (p:Person)-[:ACTED_IN]->(m:Movie where m.Description starts with 'W')
return *
```

|p|m|
|---|---|
|{"Name": "Tom", .. ,|, .. ,"Description": "War film","Year": 2020}|

## DISTINCT

`DISTINCT` removes duplicate rows from a `RETURN`. It applies to scalar values; to deduplicate entities (nodes, edges, paths) either use some object identifier or `element_id()` function or convert the whole entity to a string, for example with `to_json_string(object_variable_name)` or with `CAST(object_variable_name AS string)`.

Deduplicate projected rows:

<!-- csl -->
```gql
match (p:Person)-[:ACTED_IN]->(m:Movie)
return distinct p.Name as name
```

|name|
|---|
|Tom|
|Kevin|

`DISTINCT` also works inside aggregations, to aggregate over distinct values only:

<!-- csl -->
```gql
match (p:Person)-[:ACTED_IN]->(m:Movie)
return m.Title as Title, count(p.Name) as Actors, collect_list(distinct p.Name) as Names
```

|Title|Actors|Names|
|---|---|---|
|T3|1|["Tom"]|
|T2|1|["Tom"]|
|T1|2|["Tom","Kevin"]|

## ORDER BY

`ORDER BY` sorts rows. Add `ASC` (default) or `DESC` per column. It can sit after `RETURN` or directly after the `MATCH` pattern.

<!-- csl -->
```gql
match (p:Person) return p.Name as name, p.Born as born order by p.Born desc
```

|name|born|
|---|---|
|Julia|1967|
|Kevin|1958|
|Tom|1956|
|Ron|1954|

Sort by multiple keys, each with its own direction:

<!-- csl -->
```gql
match (p:Person)-[:ACTED_IN]->(m:Movie)
return p.Name as Name, m.Title as Title
order by Name desc, Title asc
```

|Name|Title|
|---|---|
|Tom|T1|
|Tom|T3|
|Tom|T2|
|Kevin|T1|

> [!NOTE]
> Using `ORDER BY` directly after `MATCH` might not have an effect if the query has subsequent `NEXT` or join statements.

## LIMIT

`LIMIT` caps the number of rows. Placed after `RETURN` it bounds the final output; placed directly after the `MATCH` pattern it bounds the matched rows before projection and aggregation, which can change the result.

<!-- csl -->
```gql
match (p:Person) return p.Name as name order by p.Born asc limit 2
```

|name|
|---|
|Ron|
|Tom|

<!-- csl -->
```gql
match (p:Person) order by p.Born asc limit 2 return p.Name as name
```

|name|
|---|
|Ron|
|Tom|

## OFFSET

`OFFSET` skips a number of rows before returning the rest; `SKIP` is a synonym. The value must be a positive integer.

<!-- csl -->
```gql
match (m:Movie) return m.Title as title order by m.Title offset 1 limit 1
```

|title|
|---|
|T3|

Like `LIMIT`, `OFFSET` can also sit directly after the `MATCH` pattern, before `RETURN`. In that position it skips matched rows before projection:

<!-- csl -->
```gql
match (m:Movie) order by m.Title offset 1 return m.Title as title
```

|title|
|---|
|T3|

## FOR

`FOR` iterates over the items of a list, producing one row per item. Two optional clauses expose the item's position: `WITH OFFSET` binds a zero-based index, and `WITH ORDINALITY` binds a one-based index.

<!-- csl -->
```gql
match () limit 1
for i in [5, 7]
return i
```

|i|
|---|
|5|
|7|

<!-- csl -->
```gql
match () limit 1
for c in ['a', 'b'] with offset idx
return c, idx
```

|c|idx|
|---|---|
|a|0|
|b|1|

<!-- csl -->
```gql
match () limit 1
for c in ['a', 'b'] with ordinality idx
return c, idx
```

|c|idx|
|---|---|
|a|1|
|b|2|

## LET

`LET` binds a name to a value so you can reuse it later in the query. Separate multiple bindings with commas; a later binding can reference an earlier one. Because every query begins with `MATCH`, `LET` can't be the first statement — place it after a `MATCH` (and after `WHERE`).

Bind a per-row value, then return it:

<!-- csl -->
```gql
match (p:Person)
where p.Name starts with 'K'
let BirthYear = p.Born
return p.Name as Name, BirthYear
```

|Name|BirthYear|
|---|---|
|Kevin|1958|

Bind a constant and use it to filter:

<!-- csl -->
```gql
match (m:Movie)
let threshold = 2000
filter m.Year >= threshold
return m.Title as title
```

|Title|
|---|
|T2|
|T3|

Define multiple values, where one builds on another:

<!-- csl -->
```gql
match (p:Person)
let a = 1
let b = a + 3
return p.Name as name, a, b
```

|name|a|b|
|---|---|---|
|Tom|1|4|
|Kevin|1|4|
|Ron|1|4|
|Julia|1|4|

## NEXT

`NEXT` chains statements into a linear pipeline. The rows produced by one statement become the input of the next, similar to passing a table from one step to another. Only the columns projected by the preceding `RETURN` (either `RETURN *` or explicitly named with `AS`) are visible to the following statement; renaming carries the new name forward. After `NEXT`, you can start another `MATCH`, a `FILTER`, or a `RETURN`. You can chain `NEXT` multiple times.

Project columns, then filter and reshape them:

<!-- csl -->
```gql
match (p:Person)-[:ACTED_IN]->(m:Movie)
return p.Name as Actor, m.Title as Title, m.Year as `Year`
next
filter `Year` = 2020
return Actor, Title
```

|Actor|Title|
|---|---|
|Tom|T3|

Carry a path forward, then compute over it:

<!-- csl -->
```gql
match p = (n0:Person)-[:DIRECTED]->(:Movie {Title: 'T1'})
return *
next
return p, path_length(p) as Hops
order by Hops
```

Pass a node variable into a later `MATCH`:

<!-- csl -->
```gql
match (p:Person {Name: 'Tom'})
return p
next
match (p)-[:ACTED_IN]->(m:Movie)
return m.Title
```

Aggregate the result of an earlier statement:

<!-- csl -->
```gql
match (p:Person)-[:ACTED_IN]->(m:Movie)
return p.Name as Actor
next
return count(*) as Rows
```

## FILTER

`FILTER` is a standalone statement that keeps only the rows satisfying a condition, much like [`WHERE`](#where) but written as its own step in a linear query. It's commonly used after `NEXT` to filter the rows produced by a previous statement, and can also follow a `MATCH` pattern.

> [!TIP]
> Whenever a condition can be expressed against the matched pattern, prefer [`WHERE`](#where) over a standalone `FILTER`. `WHERE` is coupled to `MATCH` and is evaluated as part of pattern matching, so the whole query runs more efficiently. Use `FILTER` only when you need to filter on values produced by a later stage, such as after `NEXT` or an aggregation.

Filter the rows passed forward by `NEXT`:

<!-- csl -->
```gql
match (p:Person)-[:ACTED_IN]->(m:Movie)
return p.Name as Actor, m.Year as Year
next
filter Year >= 2000
return Actor, Year
```

> [!NOTE]
> The `Year` variable is escaped because year is a reserved keyword. To differentiate between GQL syntax and user variables, you can escape user variables. Alternatively, add a prefix or suffix `_`.

Filter directly after a `MATCH` pattern:

<!-- csl -->
```gql
match (p:Person)
filter p.Born = 1956
return p.Name as name
```

|name|
|---|
|Tom|

## UNION

`UNION` combines the results of two or more queries; use `UNION ALL` to keep duplicates. Each query must return matching columns, and each `UNION` leg must end with a `RETURN` statement.

<!-- csl -->
```gql
match (p:Person) return p.Name as name
union
match (m:Movie) return m.Title as name
```

|name|
|---|
|Tom|
|Kevin|
|Ron|
|Julia|
|T1|
|T2|
|T3|

## Related content

- [GQL (Graph Query Language)](graph-query-language.md)
- [GQL guide](graph-query-language-guide.md)
- [Create a graph and set a graph reference](run-graph-query-with-graph-reference.md)