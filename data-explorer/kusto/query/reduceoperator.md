---
title: reduce operator - Azure Data Explorer
description: Learn how to use the reduce operator to group a set of strings together based on value similarity.
ms.reviewer: alexans
ms.topic: reference
ms.date: 1/17/2023
---
# reduce operator

Groups a set of strings together based on value similarity.

For each such group, the operator returns a `pattern`, `count`, and `representative`. The `pattern` best describes the group, in which the `*` character represents a wildcard. The `count` is the number of values in the group, and the `representative` is one of the original values in the group.

## Syntax

*T* `|` `reduce` [`kind` `=` *ReduceKind*] `by` *Expr* [`with` [`threshold` `=` *Threshold*] [`,` `characters` `=` *Characters*]]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *Expr* | string | &check; | The value by which to reduce.|
| *Threshold* | real | | A value in the range 0-1. The default value is 0.1. We recommend setting a small threshold for large inputs. |
| *Characters* | string | | A list of characters that don't break a term. For example, if you want `aaa=bbbb` and `aaa:bbb` to each be a whole term, rather than break on `=` and `:`, use `":="` as the string literal.|
| *ReduceKind* | string | | The only valid value is `source`. If `source` is specified, the operator will append the `Pattern` column to the existing rows in the table instead of aggregating by `Pattern`.|

## Returns

A table with as many rows as there are groups and columns titled `pattern`, `count`, and `representative`. The `pattern` best describes the group, in which the `*` character represents a wildcard, or placeholder for an arbitrary insertion string. The `count` is the number of values in the group, and the `representative` is one of the original values in the group.

For example, the result of `reduce by city` might include:

|Pattern     |Count |Representative|
|------------|------|--------------|
| San *      | 5182 |San Bernard   |
| Saint *    | 2846 |Saint Lucy    |
| Moscow     | 3726 |Moscow        |
| \* -on- \* | 2730 |One -on- One  |
| Paris      | 2716 |Paris         |

Another example with customized tokenization:

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAzWNMQ7CMBAEe16xcmWkCNkPyA9IR5H2cI7YCOzochGJxOO5hq1WGu2sUJ0ZOx7S3ojQhhhCwKq8IJ6+WKQ9OSmG48a7ojciidS7gVIula9MUkudR9fZ2KB1r61U9UJ18jGcLSYSnrbEuB9/FT5FMzQLr7m9pj5cQojokDIJJWVZ7c2N7gefKNUWogAAAA==" target="_blank">Run the query</a>

```kusto
range x from 1 to 1000 step 1
| project MyText = strcat("MachineLearningX", tostring(toint(rand(10))))
| reduce by MyText  with threshold=0.001 , characters = "X" 
```

**Output**

|Pattern         |Count|Representative   |
|----------------|-----|-----------------|
|MachineLearning*|1000 |MachineLearningX4|

## Examples

The following example shows how one might apply the `reduce` operator to a "sanitized"
input, in which GUIDs in the column being reduced are replaced prior to reducing

```kusto
// Start with a few records from the Trace table.
Trace | take 10000
// We will reduce the Text column which includes random GUIDs.
// As random GUIDs interfere with the reduce operation, replace them all
// by the string "GUID".
| extend Text=replace_regex(Text, @"[[:xdigit:]]{8}-[[:xdigit:]]{4}-[[:xdigit:]]{4}-[[:xdigit:]]{4}-[[:xdigit:]]{12}", @"GUID")
// Now perform the reduce. In case there are other "quasi-random" identifiers with embedded '-'
// or '_' characters in them, treat these as non-term-breakers.
| reduce by Text with characters="-_"
```

## See also

[autocluster](./autoclusterplugin.md)

> [!NOTE]
> The implementation of `reduce` operator is largely based on the paper [A Data Clustering Algorithm for Mining Patterns From Event Logs](https://ristov.github.io/publications/slct-ipom03-web.pdf), by Risto Vaarandi.
