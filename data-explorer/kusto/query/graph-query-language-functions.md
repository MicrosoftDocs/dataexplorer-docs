---
title: #Required; Keep the title body to 60-65 chars max including spaces and brand
description: #Required; Keep the description within 100- and 165-characters including spaces 
author: #Required; your GitHub user alias, with correct capitalization
ms.author: #Required; microsoft alias of author
ms.service: #Required; use the name-string related to slug in ms.product/ms.service
ms.topic: concept-article #Required; leave this attribute/value as-is.
ms.date: #Required; mm/dd/yyyy format.

#CustomerIntent: As a <type of user>, I want <what?> so that <why?>.
---
# Graph query language (GQL) functions and operators

Graph Query Language (GQL) is a powerful language for querying graph data in Azure Data Explorer. It provides a rich set of functions and operators to work with graph patterns, nodes, edges, and properties.

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
| `labels()` | Get labels of a node or edge | Custom graph function | `RETURN labels(person)` |
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

## Labels() function


## Prerequisites
TODO: [List the prerequisites if appropriate]





## Next step
TODO: Add your next step link(s)
> [!div class="nextstepaction"]
> [Write concepts](article-concept.md)

<!-- OR -->

## Related content
TODO: Add your next step link(s)
- [Write concepts](article-concept.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.

-->
