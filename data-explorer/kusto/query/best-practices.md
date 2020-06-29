---
title: Query best practices  - Azure Data Explorer
description: This article describes Query best practices  in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/03/2020
---
# Best practices 

## General

There are several "Dos and Don'ts" you can follow to make your query run faster.

### Do

*  Use time filters first. Kusto is highly optimized to utilize time filters.
*  When using string operators:
   *	Use the `has` operator, instead of `contains`, when looking for full tokens. `has` works better, since it doesn't look for substrings.
   *	Use case-sensitive operators when applicable, since they work better. 
   *    For example, use:
         * `==` rather than `=~`
         * `in` rather than `in~`
         *  `contains_cs` rather than `contains`. If you can avoid `contains`/`contains_cs`, and use `has`/`has_cs`, that's even better.
*   Look in a specific column rather than using `*`, that does a full text search across all columns.
*   If you find that most of your queries deal with extracting fields from [dynamic objects](./scalar-data-types/dynamic.md) across millions of rows, consider
materializing this column at ingestion time. This way, you will only pay once for column extraction.  
*   If you have a `let` statement with a value that you use more than once, use the [materialize() function](./materializefunction.md).
    For more information on how to use `materialize()`, see [best practices](#materialize-function).
*   If you find that you're applying conversions (JSON, string, and so on) on over 1 billion records, then reshape your query to reduce the amount of data fed into the conversion.

### Don't

*   Don't try new queries without `limit [small number]` or `count` at the end.
    Running unbound queries over unknown data sets may yield GBs of results to be returned to the client, resulting in a slow response and a busy cluster.
*   Don't use `tolower(Col) == "lowercasestring"` to do case insensitive comparisons. Instead, use `Col =~ "lowercasestring"`.
    *   If your data is already in lowercase (or uppercase), then avoid using case insensitive comparisons, and use `Col == "lowercasestring"` (or `Col == "UPPERCASESTRING"`) instead.
*   Don't filter on a calculated column if you can filter on a table column. In other words: instead of `T | extend _value = <expression> | where predicate(_value)`, do: `T | where predicate(<expression>)`.

## summarize operator

*   When the `group by keys` of the summarize operator are with high cardinality, best above 1 million, use the [hint.strategy=shuffle](./shufflequery.md).

## join operator

*   When using [join operator](./joinoperator.md), select the table with the fewer rows, to be the first one (left-most). 
*   When using [join operator](./joinoperator.md) data across clusters, run the query on the "right" side of the join, where most of the data is located.
*   When the left side is small, up to 100,000 records, and the right side is big, use [hint.strategy=broadcast](./broadcastjoin.md).
*   When both sides of the join are too big and the the join key has high cardinality, use [hint.strategy=shuffle](./shufflequery.md).
    
## parse operator and extract() function

* [parse operator](./parseoperator.md) (simple mode) is useful when the values in the target column contain strings that all share the same format or pattern.
For example, for a column with values like `"Time = <time>, ResourceId = <resourceId>, Duration = <duration>, ...."`, when extracting the values of each field, use the `parse` operator instead of several `extract()` statements.
* [extract() function](./extractfunction.md) is useful when the parsed strings do not all follow the same format or pattern.
In such cases, extract the required values by using a REGEX.

## materialize() function

* When using the [materialize() function](./materializefunction.md), try to push all possible operators that will reduce the materialized data set and still keep the semantics of the query. For example, filters, or project only required columns.
    
    **Example:**

    ```kusto
    let materializedData = materialize(Table
    | where Timestamp > ago(1d));
    union (materializedData
    | where Text !has "somestring"
    | summarize dcount(Resource1)), (materializedData
    | where Text !has "somestring"
    | summarize dcount(Resource2))
    ```

* The filter on Text is mutual and can be pushed to the materialize expression.
    The query only needs columns `Timestamp`, `Text`, `Resource1`, and `Resource2`. Project these columns inside the materialized expression.
    
    ```kusto
    let materializedData = materialize(Table
    | where Timestamp > ago(1d)
    | where Text !has "somestring"
    | project Timestamp, Resource1, Resource2, Text);
    union (materializedData
    | summarize dcount(Resource1)), (materializedData
    | summarize dcount(Resource2))
    ```
    
*	If the filters are not identical like in this query:  

    ```kusto
    let materializedData = materialize(Table
    | where Timestamp > ago(1d));
    union (materializedData
    | where Text has "String1"
    | summarize dcount(Resource1)), (materializedData
    | where Text has "String2"
    | summarize dcount(Resource2))
    ```

*	Consider, when the combined filter reduces the materialized result drastically, combining both filters on the materialized result by a logical `or` expression like in the query below. However, keep the filters in each union leg to preserve the semantics of the query:
     
    ```kusto
    let materializedData = materialize(Table
    | where Timestamp > ago(1d)
    | where Text has "String1" or Text has "String2"
    | project Timestamp, Resource1, Resource2, Text);
    union (materializedData
    | where Text has "String1"
    | summarize dcount(Resource1)), (materializedData
    | where Text has "String2"
    | summarize dcount(Resource2))
    ```
    
