---
title: GQL Functions
description: This article describes GQL scalar functions, operators, and predicates
ms.reviewer: mbrichko
ms.topic: reference
ms.date: 07/09/2026
---

# GQL functions, operators and predicates

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

This article lists the scalar functions, operators, and predicates supported in [GQL (Graph Query Language)](graph-query-language.md).

The examples use the movies graph `G()` from [Create a graph and set a graph reference](run-graph-query-with-graph-reference.md): `Person` nodes (`Name`, `Born`), `Movie` nodes (`Title`, `Description`, `Year`), and `ACTED_IN` / `DIRECTED` edges (`Role`).

## Access operators

Use these operators to read a property or element from a node, edge, map, list, or path.

| Operator | Description |
|---|---|
| `x.property` | Access a property of a node, edge, or map by name. |
| `x[i]` | Access a list or path element by zero-based position, or a map member by key. |

<!-- csl -->
```gql
match () limit 1 return [10, 20, 30][1] as byIndex, {a: 1, b: 2}.a as byDot, {a: 1, b: 2}['b'] as byKey
```

|byIndex|byDot|byKey|
|---|---|---|
|20|1|2|

## String functions

| Function | Description |
|---|---|
| `LEFT(s, n)` | First `n` characters of `s`. |
| `RIGHT(s, n)` | Last `n` characters of `s`. |
| `UPPER(s)` | Convert `s` to uppercase. |
| `LOWER(s)` | Convert `s` to lowercase. |
| `TRIM(s)`, `BTRIM(s)` | Remove spaces from both ends of `s`. `BTRIM` is a synonym of `TRIM(s)`. |
| `LTRIM(s)` | Remove spaces from the start (left) of `s`. |
| `RTRIM(s)` | Remove spaces from the end (right) of `s`. |
| `TRIM([BOTH \| LEADING \| TRAILING] [chars] FROM s)` | Remove `chars` (or spaces when `chars` is omitted) from the chosen end of `s`. The default is `BOTH`. |
| `CHAR_LENGTH(s)`, `CHARACTER_LENGTH(s)` | Number of characters in `s`. |
| `STRING_JOIN(list, separator)` | Concatenate list items into a string. |
| `s1 \|\| s2` | Concatenate strings `s1` and `s2`. |

String predicates:

| Predicate | Description |
|---|---|
| `s STARTS WITH prefix` | `true` when `s` begins with `prefix`. Add `NOT` to negate: `s NOT STARTS WITH prefix`. |
| `s ENDS WITH suffix` | `true` when `s` ends with `suffix`. Add `NOT` to negate: `s NOT ENDS WITH suffix`. |
| `s CONTAINS substring` | `true` when `substring` occurs anywhere in `s`. Add `NOT` to negate: `s NOT CONTAINS substring`. |

<!-- csl -->
```gql
match () limit 1 return upper("abc") as result
```

|result|
|---|
|ABC|

<!-- csl -->
```gql
match () limit 1 return trim(leading 'a' from 'aabc') as result
```

|result|
|---|
|bc|

<!-- csl -->
```gql
match () limit 1 return string_join(["a", "bc"], "") as result
```
|result|
|---|
|abc|


<!-- csl -->
```gql
MATCH (p :Person)
WHERE p.Name starts with 'Tom' or (p.Name ends with 's' and p.Name contains 'Han')
RETURN p.Name as actorName
```

|actorName|
|---|
|Actor1|

## Numeric functions

| Function | Description |
|---|---|
| `ABS(x)` | Absolute value of `x`. |
| `SQRT(x)` | Square root. |
| `EXP(x)` | e raised to `x`. |
| `LN(x)` | Natural logarithm. |
| `LOG10(x)` | Base-10 logarithm. |
| `FLOOR(x)` | Largest integer ≤ `x`. |
| `CEIL(x)`, `CEILING(x)` | Smallest integer ≥ `x`. |
| `MOD(x, y)` | Remainder of `x` divided by `y`. |
| `SIN(x)`, `COS(x)`, `TAN(x)`, `COT(x)` | Trigonometric functions (radians). |
| `ASIN(x)`, `ACOS(x)`, `ATAN(x)` | Inverse trigonometric functions. |
| `DEGREES(x)` | Convert radians to degrees. |
| `RADIANS(x)` | Convert degrees to radians. |

Numbers combine with the arithmetic operators `+`, `-`, `*`, and `/`:

| Operator | Description |
|---|---|
| `x + y` | Addition. |
| `x - y` | Subtraction. |
| `x * y` | Multiplication. |
| `x / y` | Division. |
| `-x` | Negation. |

<!-- csl -->
```gql
match () limit 1 return 2 + 3 * 4 as a, 10 - 6 as b, mod(10, 4) as c, abs(-7) as d
```

|a|b|c|d|
|---|---|---|---|
|14|4|2|7|

<!-- csl -->
```gql
match () limit 1 return sqrt(9) as `sqrt`, 9 / 3 as divideResult
```

|sqrt|divideResult|
|---|---|
|3|3|

## Conditional expressions

### CASE

`CASE` returns a value based on conditions, in searched form (evaluate independent predicates) or simple form (compare one expression to a series of values).

Searched form evaluates each `WHEN` predicate in turn:

<!-- csl -->
```gql
match (m:Movie)
return m.Title as Title, case when m.Year < 2000 then 'C' else 'M' end as Era
```

|Title|Era|
|---|---|
|Movie1|C|
|Movie2|M|
|Movie3|M|

Simple form compares one expression against each `WHEN` value:

<!-- csl -->
```gql
match (m:Movie)
return m.Title as Title,
    case m.Title
        when 'Movie1' then 'A'
        when 'Movie3' then 'G'
        else 'O'
    end as Name
```

|Title|Name|
|---|---|
|Movie1|A|
|Movie2|O|
|Movie3|G|

> [!NOTE]
> Every `CASE` expression must include an `ELSE` clause. A `CASE` without `ELSE` isn't supported.

## Type conversion

### CAST

`CAST(value AS type)` converts a value to another type, such as `string`, `int64`. It's required in two common situations.

**Nested property access.** When a property is reached through a nested or indexed expression, such as an element of a path or a member of a map, the result is a `dynamic` value whose type isn't known in advance. Cast it to the expected type before you compare or compute with it.

See [here](graph-query-language-guide.md#supported-types) the supported types.

<!-- csl -->
```gql
match p = (a:Person)-[:ACTED_IN]->(m:Movie)
return m.Title as Title, cast(nodes(p)[0].Born as int) as ActorBorn
```

|Title|ActorBorn|
|---|---|
|Movie3|1956|
|Movie2|1956|
|Movie1|1956|
|Movie1|1958|

<!-- csl -->
```gql
MATCH (p:Person)
RETURN p.Name || ', ' || CAST(p.Born as string) as nameAndYear
```

|nameAndYear|
|---|
|Actor1, 1956|
|Actor2, 1958|
|Actor3, 1954|
|Actor4, 1967|

**Aggregating on object keys.** An aggregation key can't be an object (`dynamic`) value such as a node, edge, or property map. Convert the object value to a string first, using `to_json_string(...)` or `CAST(... AS string)`.

<!-- csl -->
```gql
match (p:Person)->(m:Movie)
return to_json_string(p), count(m) as participatedInMoviesCount
```

|to_json_string(p)|participatedInMoviesCount|
|---|---|
|{"Name":"Actor1", ... }|4|
|{"Name":"Actor2", ... }|1|
|{"Name":"Actor3", ... }|1|

## JSON functions

| Function | Description |
|---|---|
| `PARSE_JSON_STRING(s)` | Parse a JSON string into an object or array. Access members with `.` or `[index]`. |
| `TO_JSON_STRING(x)` | Serialize a value (including a node or edge) to a JSON string. |

<!-- csl -->
```gql
MATCH (n:Person {Name: 'Actor4'})
RETURN TO_JSON_STRING(n) AS `json`
```

|json|
|---|
|{"Name":"Actor4","Born":1967,"Label2":["Person ","Female ","BestActressAward "],"Label":"Person"}|

> [!TIP]
> The result alias `json` is escaped because json is a reserved keyword

<!-- csl -->
```gql
MATCH (p:Person)
limit 1
RETURN parse_json_string('{"a":"Michael", "b":"John"}'.a as string) AS name
```

|name|
|---|
|Michael|

<!-- csl -->
```gql
MATCH (p:Person)
limit 1
RETURN cast(parse_json_string('{"a":1, "b":2}').a as integer) AS a
```

|a|
|---|
|1|

<!-- csl -->
```gql
MATCH () limit 1 RETURN PARSE_JSON_STRING('[1,2,3]')[1] as second
```

|second|
|---|
|2|

> [!TIP]
> When using `parse_json_string()` it might be needed to cast the retrieved value from json if a specific type is needed

## List and Map functions and predicates

| Function | Description |
|---|---|
| `SIZE(list)` | Number of elements in a list. |
| `KEYS(element)` | Property names of a node, edge, or map, as a string list. |
| `l1 \|\| l2` | Concatenate lists `l1` and `l2`. |
| `value IN [list]` | True when `value` is a member of the list. |
| `x[i]` | Access a list or path element by zero-based position, or a map member by key. |

<!-- csl -->
```gql
match () limit 1 return ["a", "b", "c"][1] as second
```

|second|
|---|
|b|

<!-- csl -->
```gql
match () limit 1 return size([1, 2, 3]) as `size`
```

|size|
|---|
|3|

> [!TIP]
> The result alias `size` is escaped because size is a reserved keyword

<!-- csl -->
```gql
match () limit 1 return keys({"a":1, "b":2}) as my_keys
```

|my_keys|
|---|
|["a", "b" ]|

<!-- csl -->
```gql
MATCH (p:Person)
WHERE p.Name IN ['Actor1', 'Actor2']
RETURN p.Name as actor
```

|actor|
|---|
|Actor1|
|Actor2|

<!-- csl -->
```gql
match () limit 1 return ["a"] || ["b"] as lst
```

|lst|
|---|
|["a", "b"]|

## Date and Time functions

| Function | Description |
|---|---|
| `ZONED_DATETIME()`, `CURRENT_TIMESTAMP` | Current UTC timestamp. |
| `ZONED_DATETIME("...")` | Parse a timestamp from a string. |
| `DURATION({...})` | Duration from a map of units: `days`, `hours`, `minutes`, `seconds`, `milliseconds`, `microseconds`, `nanoseconds`. Accepts RECORD type value. `years` and `months` aren't supported. |
| `DURATION_BETWEEN(start, end)` | Duration between two timestamps. |

<!-- csl -->
```gql
match () limit 1 return duration ({minutes: 5}) as "5min"
```
|5min|
|---|
|00:05:00|

<!-- csl -->
```gql
match () limit 1 return duration ({minutes: 5, seconds:25}) as "5min25sec"
```
|5min25sec|
|---|
|00:05:25|

If nodes in the graph have a property such as `event_timestamp` of [KQL type datetime](scalar-data-types/datetime.md), you can find all graph nodes with an event that occurred in the last 10 minutes, measured from now or from a specific timestamp:

<!-- csl -->
```gql
MATCH (n) where n.event_timestamp < CURRENT_TIMESTAMP - duration({minutes:10}) return n
```

<!-- csl -->
```gql
MATCH (n) where n.event_timestamp < zoned_datetime('2025-09-15 09:00:00.0') - duration({minutes:10}) return n
```

<!-- csl -->
```gql
MATCH () limit 1
RETURN DURATION_BETWEEN(zoned_datetime('2025-09-15 09:00:00.0'), zoned_datetime()) AS Elapsed
```

> [!NOTE]
> The engine operates in UTC.

## Graph and path functions

| Function | Description |
|---|---|
| `LABELS(element)` | Labels of a node or edge, as a list. |
| `ELEMENT_ID(node)` | Identifier of a node. Edges aren't supported. |
| `NODES(path)` | Nodes of a path, as a list. |
| `EDGES(path)`, `RELATIONSHIPS(path)` | Edges of a path, as a list. |
| `PATH_LENGTH(path)` | Number of edges (hops) in a path. |

<!-- csl -->
```gql
match (m: Movie) limit 1 return labels(m) as lbls
```

|lbls|
|---|
|["Movie"]|

<!-- csl -->
```gql
match p = (n:Person)-[e: ACTED_IN]->(m: Movie) return p, path_length(p), nodes(p), edges(p)
```

## Aggregations

Aggregate functions summarize the matched rows. When an aggregate appears next to non-aggregated expressions, those expressions become the grouping keys.

| Function | Description |
|---|---|
| `COUNT(x)`, `COUNT(*)` | Number of values, or number of rows with `COUNT(*)`. |
| `SUM(x)` | Sum of numeric values. |
| `AVG(x)` | Average of numeric values. |
| `MIN(x)`, `MAX(x)` | Smallest and largest value. |
| `COLLECT_LIST(x)` | Gather values into a list. |

<!-- csl -->
```gql
MATCH (p:Person)
RETURN COUNT(*) AS people, MIN(p.Born) AS earliest, MAX(p.Born) AS latest, SUM(p.Born) AS bornSum, AVG(p.Born) AS bornAvg
```

|people|earliest|latest|bornSum|bornAvg|
|---|---|---|---|---|
|4|1954|1967|7835|1958.75|

Count the actors in each movie:

<!-- csl -->
```gql
MATCH (p:Person)-[:ACTED_IN]->(m:Movie)
RETURN m.Title as Movie, COUNT(*) AS ActorsCount
```

|Movie|ActorsCount|
|---|---|
|Movie1|2|
|Movie2|1|
|Movie3|1|

<!-- csl -->
```gql
MATCH (n:Person)-[:ACTED_IN]->(m:Movie)
RETURN collect_list(distinct n.Name) as actors
```
|actors|
|---|
|["Actor1", "Actor2"]|

Find how many movies each actor acted in:

<!-- csl -->
```gql
MATCH (n:Person)-[:ACTED_IN]->(m:Movie)
RETURN TO_JSON_STRING(n) as actor, count(m) as moviesCount
```

|actor|moviesCount|
|---|---|
|{"Name":"Actor1", ... ,"Label":"Person"}|3|
|{"Name":"Actor2", ... ,"Label":"Person"}|1|

> [!NOTE]
> To group by or aggregate a node, edge, or path, first convert it to a string with `TO_JSON_STRING()` or `CAST(object AS string)`, because objects can't be used as grouping keys directly.

For more, see [Aggregations](graph-query-language-guide.md#aggregations) in the GQL guide.


## Predicates

Comparison operators compare two scalar values and return a Boolean. They apply to scalar values, not to nodes or edges.

| Operator | Description |
|---|---|
| `x = y` | Equal. |
| `x <> y` | Not equal. |
| `x < y`, `x <= y` | Less than, less than or equal. |
| `x > y`, `x >= y` | Greater than, greater than or equal. |

Other operators:

| Predicate | Description |
|---|---|
| `value IN [list]` | True when `value` is a member of the list. |

<!-- csl -->
```gql
match (p:Person)
where p.Name in ['Actor1', 'Actor4']
return p.Name as name
```

|name|
|---|
|Actor1|
|Actor4|

Negate the test with `NOT` to keep only values that are absent from the list:

<!-- csl -->
```gql
match (p:Person)
where not p.Name in ['Actor1', 'Actor2', 'Actor3']
return p.Name as name
```

|name|
|---|
|Actor4|

Other predicates:

| Predicate | Description |
|---|---|
| `expr IS NULL`, `expr IS NOT NULL` | Test for null. [string type](scalar-data-types/string.md) can't be null|
| `expr IS [NOT] TRUE`, `expr IS [NOT] FALSE` | Test a Boolean expression. |
| `NOT expr` | Negate a Boolean condition. |

<!-- csl -->
```gql
MATCH (p:Person)
WHERE p.Name IN ['Actor1', 'Actor2'] AND p.Born IS NOT NULL
RETURN p.Name as name
```

|name|
|---|
|Actor1|
|Actor2|

It's possible to use `IS TRUE` or `IS FALSE` to test the result of a Boolean expression:

<!-- csl -->
```gql
MATCH (p:Person)
WHERE (p.Born > 1960) IS TRUE
RETURN p.Name
```

|name|
|---|
|Actor4|

## Related content

- [GQL (Graph Query Language)](graph-query-language.md)
- [GQL guide](graph-query-language-guide.md)
- [GQL clauses](graph-query-language-clauses.md)
- [Create a graph and set a graph reference](run-graph-query-with-graph-reference.md)
