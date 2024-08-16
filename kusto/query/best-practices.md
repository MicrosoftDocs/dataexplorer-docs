---
title: Best practices for Kusto Query Language queries
description:  This article describes Query best practices.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
adobe-target: true
---
# Best practices for Kusto Query Language queries

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)] 

Here are several best practices to follow to make your query run faster.

## In short

:::moniker range="azure-data-explorer"
| Action | Use | Don't use | Notes |
|--|--|--|--|
| **Reduce the amount of data being queried** | Use mechanisms such as the `where` operator to reduce the amount of data being processed. |  | See below for efficient ways to reduce the amount of data being processed. |
| **Avoid using redundant qualified references** | When referencing local entities, use the unqualified name. | | See below for more on the subject. |
| **`datetime` columns** | Use the `datetime` data type. | Don't use the `long` data type. | In queries, don't use unix time conversion functions, such as `unixtime_milliseconds_todatetime()`. Instead, use update policies to convert unix time to the `datetime` data type during ingestion. |
| **String operators** | Use the `has` operator | Don't use `contains` | When looking for full tokens, `has` works better, since it doesn't look for substrings. |
| **Case-sensitive operators** | Use `==` | Don't use  `=~` | Use case-sensitive operators when possible. |
|  | Use `in` | Don't use `in~` |
|  | Use `contains_cs` | Don't use `contains` | If you can use `has`/`has_cs` and not use `contains`/`contains_cs`, that's even better. |
| **Searching text** | Look in a specific column | Don't use  `*` | `*` does a full text search across all columns. |
| **Extract fields from [dynamic objects](scalar-data-types/dynamic.md) across millions of rows** | Materialize your column at ingestion time if most of your queries extract fields from dynamic objects across millions of rows. |  | This way, you'll only pay once for column extraction. |
| **Lookup for rare keys/values in [dynamic objects](scalar-data-types/dynamic.md)** | Use `MyTable | where DynamicColumn has "Rare value" | where DynamicColumn.SomeKey == "Rare value"` | Don't use `MyTable | where DynamicColumn.SomeKey == "Rare value"` | This way, you filter out most records, and do JSON parsing only of the rest. |
| **`let` statement with a value that you use more than once** | Use the [materialize() function](materialize-function.md) |  | For more information on how to use `materialize()`, see [materialize()](materialize-function.md). For more information, see [Optimize queries that use named expressions](named-expressions.md).|
| **Apply conversions on more than 1 billion records** | Reshape your query to reduce the amount of data fed into the conversion. | Don't convert large amounts of data if it can be avoided. |  |
| **New queries** | Use `limit [small number]` or `count` at the end. |  | Running unbound queries over unknown datasets may yield GBs of results to be returned to the client, resulting in a slow response and a busy cluster. |
| **Case-insensitive comparisons** | Use `Col =~ "lowercasestring"` | Don't use `tolower(Col) == "lowercasestring"` |
| **Compare data already in lowercase (or uppercase)** | `Col == "lowercasestring"` (or `Col == "UPPERCASESTRING"`) | Avoid using case insensitive comparisons. |  |
| **Filtering on columns** | Filter on a table column. | Don't filter on a calculated column. |  |
|  | Use `T | where predicate(*Expression*)` | Don't use `T | extend _value = *Expression* | where predicate(_value)` |  |
| **summarize operator** | Use the [hint.shufflekey=\<key>](shuffle-query.md) when the `group by keys` of the summarize operator are with high cardinality. |  | High cardinality is ideally above 1 million. |
| **[join operator](join-operator.md)** | Select the table with the fewer rows to be the first one (left-most in query). |  |
|  | Use `in` instead of left semi `join` for filtering by a single column. |  |
| Join across clusters | Across clusters, run the query on the "right" side of the join, where most of the data is located. |  |
| Join when left side is small and right side is large | Use [hint.strategy=broadcast](broadcast-join.md) |  | Small refers to up to 100MB of data. |
| Join when right side is small and left side is large | Use the [lookup operator](lookup-operator.md) instead of the `join` operator | | If the right side of the lookup is larger than several tens of MBs, the query will fail. |
| Join when both sides are too large | Use [hint.shufflekey=\<key>](shuffle-query.md) |  | Use when the join key has high cardinality. |
| **Extract values on column with strings sharing the same format or pattern** | Use the [parse operator](parse-operator.md) | Don't use several `extract()` statements. | For example, values like `"Time = <time>, ResourceId = <resourceId>, Duration = <duration>, ...."` |
| **[extract() function](extract-function.md)** | Use when parsed strings don't all follow the same format or pattern. |  | Extract the required values by using a REGEX. |
| **[materialize() function](materialize-function.md)** | Push all possible operators that will reduce the materialized dataset and still keep the semantics of the query. |  | For example, filters, or project only required columns. For more information, see [Optimize queries that use named expressions](named-expressions.md). |
| **Use materialized views** | Use [materialized views](../management/materialized-views/materialized-view-overview.md) for storing commonly used aggregations. Prefer using the `materialized_view()` function to query materialized part only |  | `materialized_view('MV')` |
::: moniker-end

:::moniker range="microsoft-fabric"
| Action | Use | Don't use | Notes |
|--|--|--|--|
| **Reduce the amount of data being queried** | Use mechanisms such as the `where` operator to reduce the amount of data being processed. |  | See below for efficient ways to reduce the amount of data being processed. |
| **Avoid using redundant qualified references** | When referencing local entities, use the unqualified name. | | See below for more on the subject. |
| **`datetime` columns** | Use the `datetime` data type. | Don't use the `long` data type. | In queries, don't use unix time conversion functions, such as `unixtime_milliseconds_todatetime()`. Instead, use update policies to convert unix time to the `datetime` data type during ingestion. |
| **String operators** | Use the `has` operator | Don't use `contains` | When looking for full tokens, `has` works better, since it doesn't look for substrings. |
| **Case-sensitive operators** | Use `==` | Don't use  `=~` | Use case-sensitive operators when possible. |
|  | Use `in` | Don't use `in~` |
|  | Use `contains_cs` | Don't use `contains` | If you can use `has`/`has_cs` and not use `contains`/`contains_cs`, that's even better. |
| **Searching text** | Look in a specific column | Don't use  `*` | `*` does a full text search across all columns. |
| **Extract fields from [dynamic objects](scalar-data-types/dynamic.md) across millions of rows** | Materialize your column at ingestion time if most of your queries extract fields from dynamic objects across millions of rows. |  | This way, you'll only pay once for column extraction. |
| **Lookup for rare keys/values in [dynamic objects](scalar-data-types/dynamic.md)** | Use `MyTable | where DynamicColumn has "Rare value" | where DynamicColumn.SomeKey == "Rare value"` | Don't use `MyTable | where DynamicColumn.SomeKey == "Rare value"` | This way, you filter out most records, and do JSON parsing only of the rest. |
| **`let` statement with a value that you use more than once** | Use the [materialize() function](materialize-function.md) |  | For more information on how to use `materialize()`, see [materialize()](materialize-function.md). For more information, see [Optimize queries that use named expressions](named-expressions.md).|
| **Apply conversions on more than 1 billion records** | Reshape your query to reduce the amount of data fed into the conversion. | Don't convert large amounts of data if it can be avoided. |  |
| **New queries** | Use `limit [small number]` or `count` at the end. |  | Running unbound queries over unknown datasets may yield GBs of results to be returned to the client, resulting in a slow response and a busy database. |
| **Case-insensitive comparisons** | Use `Col =~ "lowercasestring"` | Don't use `tolower(Col) == "lowercasestring"` |
| **Compare data already in lowercase (or uppercase)** | `Col == "lowercasestring"` (or `Col == "UPPERCASESTRING"`) | Avoid using case insensitive comparisons. |  |
| **Filtering on columns** | Filter on a table column. | Don't filter on a calculated column. |  |
|  | Use `T | where predicate(*Expression*)` | Don't use `T | extend _value = *Expression* | where predicate(_value)` |  |
| **summarize operator** | Use the [hint.shufflekey=\<key>](shuffle-query.md) when the `group by keys` of the summarize operator are with high cardinality. |  | High cardinality is ideally above 1 million. |
| **[join operator](join-operator.md)** | Select the table with the fewer rows to be the first one (left-most in query). |  |
|  | Use `in` instead of left semi `join` for filtering by a single column. |  |
| Join when left side is small and right side is large | Use [hint.strategy=broadcast](broadcast-join.md) |  | Small refers to up to 100MB of data. |
| Join when right side is small and left side is large | Use the [lookup operator](lookup-operator.md) instead of the `join` operator | | If the right side of the lookup is larger than several tens of MBs, the query will fail. |
| Join when both sides are too large | Use [hint.shufflekey=\<key>](shuffle-query.md) |  | Use when the join key has high cardinality. |
| **Extract values on column with strings sharing the same format or pattern** | Use the [parse operator](parse-operator.md) | Don't use several `extract()` statements. | For example, values like `"Time = <time>, ResourceId = <resourceId>, Duration = <duration>, ...."` |
| **[extract() function](extract-function.md)** | Use when parsed strings don't all follow the same format or pattern. |  | Extract the required values by using a REGEX. |
| **[materialize() function](materialize-function.md)** | Push all possible operators that will reduce the materialized dataset and still keep the semantics of the query. |  | For example, filters, or project only required columns. For more information, see [Optimize queries that use named expressions](named-expressions.md). |
| **Use materialized views** | Use [materialized views](../management/materialized-views/materialized-view-overview.md) for storing commonly used aggregations. Prefer using the `materialized_view()` function to query materialized part only |  | `materialized_view('MV')` |
::: moniker-end

## Reduce the amount of data being processed

A query's performance depends directly on the amount of data it needs to process.
The less data is processed, the quicker the query (and the fewer resources it consumes).
Therefore, the most important best-practice is to structure the query in such a way that
reduces the amount of data being processed.

> [!NOTE]
> In the discussion below, it is important to have in mind the concept of **filter selectivity**.
> Selectivity is what percentage of the records get filtered-out when filtering by some predicate.
> A highly-selective predicate means that only a handful of records remain after applying
> the predicate, reducing the amount of data that needs to then be processed effectively.

In order of importance:

* Only reference tables whose data is needed by the query. For example, when using the
  `union` operator with wildcard table references, it is better from a performance point-of-view
  to only reference a handful of tables, instead of using a wildcard (`*`) to reference all tables
  and then filter data out using a predicate on the source table name.

* Take advantage of a table's data scope if the query is relevant only for a specific scope.
  The [table() function](table-function.md) provides an efficient way to eliminate data
  by scoping it according to the caching policy (the *DataScope* parameter).

* Apply the `where` query operator immediately following table references.

* When using the `where` query operator, a judicious use of the order of predicates
  (in a single operator, or with a number of consecutive operators, it doesn't matter which)
  can have a significant effect on the query performance, as explained below.

* Apply whole-shard predicates first. This means that predicates that use the [extent_id() function](extent-id-function.md)
  should be applied first, as are predicates that use the [extent_tags() function](extent-tags-function.md)
  and predicates that are very selective over the table's data partitions (if defined).

* Then apply predicates that act upon `datetime` table columns. Kusto includes a very efficient index on such columns,
  often eliminating whole data shards completely without needing to access those shards.

* Then apply predicates that act upon `string` and `dynamic` columns, especially such predicates
  that apply at the term-level. The predicates should be ordered by the selectivity (for example,
  searching for a user ID when there are millions of users is very selective and usually is a term search
  for which the index is very efficient.)

* Then apply predicates that are selective and are based on numeric columns.

* Last, for queries that scan a table column's data (for example, for predicates such as
  `contains "@!@!" that have no terms and don't benefit from indexing), order the predicates such that the ones
  that scan columns with less data will be first. This reduces the need to decompress and scan large columns.

## Avoid using redundant qualified references

Entities such as tables and materialized views are referenced by name.

:::moniker range="microsoft-fabric"
For example, the table `T` can be referenced as simply `T` (the *unqualified* name), or by using a database qualifier (e.g. `database("DB").T` when the table is in a database called `DB`), or by using a fully-qualified name (e.g. `cluster("<serviceURL>").database("DB").T`).
:::moniker-end

:::moniker range="azure-data-explorer"
For example, the table `T` can be referenced as simply `T` (the *unqualified* name), or by using a database qualifier (e.g. `database("DB").T` when the table is in a database called `DB`), or by using a fully-qualified name (e.g. `cluster("X.Y.kusto.windows.net").database("DB").T`).
::: moniker-end

It is a best practice to avoid using name qualifications when they are redundant, for the following reasons:

1. Unqualified names are easier to identify (for a human reader) as belonging to the database-in-scope.

1. Referencing database-in-scope entities is always at least as fast, and in some cases much faster, then entities that belong to other databases.
:::moniker range="azure-data-explorer"
   (This is especially true when those databases are in a different cluster.)
:::moniker-end
:::moniker range="microsoft-fabric"
   (This is especially true when those databases are in a different Eventhouse.)
:::moniker-end
Avoiding qualified names helps the reader to do the right thing.

:::moniker range="azure-data-explorer"
> [!NOTE]
> This is not to say that qualified names are bad for performance. In fact, Kusto is able in most cases to identify when a fully qualified name
> references an entity belonging to the database-in-scope and "short-circuit" the query so that it is not regarded as a cross-cluster query.
> However, we do recommend to not rely on this when not necessary, for the reasons specified above.
::: moniker-end

:::moniker range="microsoft-fabric"
> [!NOTE]
> This is not to say that qualified names are bad for performance. In fact, Kusto is able in most cases to identify when a fully qualified name
> references an entity belonging to the database-in-scope.
> However, we do recommend to not rely on this when not necessary, for the reasons specified above.
::: moniker-end
