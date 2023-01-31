---
title: The case-insensitive has_any string operator - Azure Data Explorer
description: Learn how to use the has_any operator to filter data with any set of case-insensitive strings.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/28/2022
---
# has_any operator

Filters a record set for data with any set of case-insensitive strings. `has_any` searches for indexed terms, where an indexed [term](datatypes-string-operators.md#what-is-a-term) is three or more characters. If your term is fewer than three characters, the query scans the values in the column, which is slower than looking up the term in the term index.

For more information about other operators and to determine which operator is most appropriate for your query, see [datatype string operators](datatypes-string-operators.md).

## Performance tips

[!INCLUDE [performance-tip-note](../../includes/performance-tip-note.md)]

## Syntax

*T* `|` `where` *col* `has_any` `(`*scalar_value* [`,` *scalar_value_2*`,` *scalar_value_3*`,` ... ]`)`

*T* `|` `where` *col* `has_any` `((`*tabular_expr*`))`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | string | &check; | The tabular input whose records are to be filtered.|
| *col* | string | &check; | The column used to filter the records.|
| *scalar_value* | scalar | &check; | A value or comma-separated set of values to search for in *col*.|
| *tabular_expr* | string | &check; | A tabular expression that produces a set of values to search for in *col*. If the tabular expression has multiple columns, the first column is used. The *tabular_expr* can produce up to 10,000 distinct results.|

## Returns

Rows in *T* for which the predicate is `true`.

## Examples

### List of values

The following query shows how to use `has_any` with a list of values.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuDlqlEoz0gtSlUILkksSVXISCyOT8yrVNBQcnYM8vfx9HNU0lFQcnH09g8Bs/xcw5U0wbqKS3NzE4syq1IVkvNL80o0NBWSKiGGAACHltT/YAAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents 
| where State has_any ("CAROLINA", "DAKOTA", "NEW") 
| summarize count() by State
```

**Output**

|State|count_|
|---|---|
|NEW YORK|1750|
|NORTH CAROLINA|1721|
|SOUTH DAKOTA|1567|
|NEW JERSEY|1044|
|SOUTH CAROLINA|915|
|NORTH DAKOTA|905|
|NEW MEXICO|527|
|NEW HAMPSHIRE|394|

### Dynamic array

The following query shows how to use `has_any` with a dynamic array.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuDlqlEoz0gtSlUILkksSVXISCyOT8yrVNBIqcxLzM1M1ohWL84vLclQ11FQz8svAjJiNTVBmopLc3MTizKrUhWS80vzSjQ0FZIqIWYAAIx5b2ZfAAAA" target="_blank">Run the query</a>

```kusto
StormEvents 
| where State has_any (dynamic(['south', 'north']))
| summarize count() by State
```

**Output**

|State|count_|
|---|---|
|NORTH CAROLINA|1721|
|SOUTH DAKOTA|1567|
|SOUTH CAROLINA|915|
|NORTH DAKOTA|905|
|ATLANTIC SOUTH|193|
|ATLANTIC NORTH|188|

### Inline tabular expression

The following query shows how to use `has_any` with an inline tabular expression.

> [!IMPORTANT]
> An inline tabular expression must be enclosed with double parenthesis to be properly parsed.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuDlqlEoz0gtSlUILkksSVXISCyOT8yrVNDQCMgvKM1JLMnMz3NJLElUgClDCCvYKZgagAFQsqAoPys1uQRiiqYmyNji0tzcxKLMqlSF5PzSvBINTYWkSog8AMlS+PGBAAAA" target="_blank">Run the query</a>

```kusto
StormEvents 
| where State has_any ((PopulationData | where Population > 5000000 | project State))
| summarize count() by State
```

### Tabular expression from a let statement

The following query shows how to use `has_any` with a tabular expression from a [let statement](letstatement.md). Notice that the double parentheses as provided in the last example aren't necessary in this case.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA02NsQrCQBBE+0D+Ycqks7ESrbQX8gFhDYuJ3N2G3b1IxI/XRIRMOW8eE9gRSO/cmpOz4YirjDmQD5LO5IQ3nj0rb2qcsN+t+cJR5cGdo1n0Q1k0LhovEyc3lMVfXil6spbSjGr7WC8ryzGSDi9GJzl5VeM2/6QPjBKdkqEAAAA=" target="_blank">Run the query</a>

```kusto
let large_states = PopulationData | where Population > 5000000 | project State;
StormEvents 
| where State has_any (large_states)
| summarize count() by State
```
