---
title: The case-insensitive !in~ string operator - Azure Data Explorer
description: Learn how to use the !in~ string operator to filter records for data without a case-insensitive string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/02/2023
---
# !in~ operator

Filters a record set for data without a case-insensitive string.

[!in~CLUDE [in-operator-comparison](../../includes/in-operator-comparison.md)]

## Performance tips

[!in~CLUDE [performance-tip-note](../../includes/performance-tip-note.md)]

When possible, use the case-sensitive [!in~](not-in-cs-operator.md).

## Syntax

*T* `|` `where` *col* `!in~` `(`*scalar_values*`)`

*T* `|` `where` *col* `!in~` `(`*dynamic_array*`)`

*T* `|` `where` *col* `!in~` `((`*tabular_expression*`))`

> [!NOTE]
> An inline tabular expression must be enclosed with double parentheses to be properly parsed. See [example](#tabular-expression).

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | string | &check; | The tabular input to filter.|
| *col* | string | &check; | The column used to filter the records.|
| *scalar_values* | scalar | &check; | A value or comma-separated set of values to search for in *col*.|
| *dynamic_array* | dynamic | &check; | An array of values to search for in *col*.|
| *tabular_expression* | string | &check; | A tabular expression that produces a set of values to search for in *col*. If the tabular expression has multiple columns, the first column is used. The *tabular_expr* can produce up to 1,000,000 distinct results.|

> [!NOTE]
> Depending on the chosen [syntax](#syntax), either *scalar_values*, *dynamic_array*, or *tabular_expression* is required.

## Returns

Rows in *T* for which the predicate is `true`.

## Example

### List of scalars

The following query shows how to use `!in~` with a comma-separated list of scalar values.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSjPSC1KVQguSSxJVVDMzKtT0FByy8kvykxJVNJRUHJPzS9KzwQz/VLLFSLzi7KVNEHakvNL80oA5o2K+ksAAAA=" target="_blank">Run the query</a>

```kusto
StormEvents 
| where State !in~ ("Florida", "Georgia", "New York") 
| count
```

**Output**

|Count|
|---|
|54,291|  

### Dynamic array

The following query shows how to use `!in~` with a dynamic array.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSjPSC1KVQguSSxJVVDMzKtT0EipzEvMzUzWiFZyy8kvykxJVNJRUHJPzS9KzwQz/VLLFSLzi7KVYjU1QSYk55fmlQAAs+z4r1YAAAA=" target="_blank">Run the query</a>

```kusto
StormEvents 
| where State !in~ (dynamic(["Florida", "Georgia", "New York"])) 
| count
```

**Output**

|Count|
|---|
|54291|  

The same query can also be written with a [let statement](letstatement.md).

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAyWMvQrCQBAG+zzF51V34BtISrWzSSXB4kwWXczdwt7GEJE8uz/pBmaYgQzFolFBjX7OMXHnW3cYRLmPbgt3JNEb//FEE86iD3cJu6ox0bR/UraC6o3pTkpofitsOC/w6zZ8XRlTisovQidjNh9wndf0A62lrc5/AAAA" target="_blank">Run the query</a>

```kusto
let states = dynamic(["Florida", "Georgia", "New York"]);
StormEvents 
| where State !in~ (states)
| summarize count() by State
```

**Output**

|Count|
|---|
|54291|

### Tabular expression

The following query shows how to use `!in~` with an inline tabular expression. Notice that an inline tabular expression must be enclosed with double parentheses to be properly parsed.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSjPSC1KVQguSSxJVVDMzKtT0NAIyC8ozUksyczPc0ksSVSAqUEIK9gpmBqAAVCyoCg/KzW5BGKEpibQyOLS3NzEosyqVIXk/NK8Eg1NhaRKiDQAEmmU0nwAAAA=" target="_blank">Run the query</a>

```kusto
StormEvents 
| where State !in~ ((PopulationData | where Population > 5000000 | project State))
| summarize count() by State
```

**Output**

|State|Count|
|--|--|
|KANSAS|3166|
|IOWA|2337|
|NEBRASKA|1766|
|OKLAHOMA|1716|
|SOUTH DAKOTA|1567|
|...|...|

The same query can also be written with a [let statement](letstatement.md). Notice that the double parentheses as provided in the last example aren't necessary in this case.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVHISSxKT40vLkksSS1WsFUIyC8ozUksyczPc0ksSVSoUSjPSC1KRRJWsFMwNQADoGRBUX5WanKJQjBIuzVXcEl+Ua5rWWpeSbECF0wrWE5BMTOvTkED2TJNoIri0tzcxKLMqlSF5PzSvBINTYWkSogGANAXanqbAAAA" target="_blank">Run the query</a>

```kusto
let large_states = PopulationData | where Population > 5000000 | project State;
StormEvents 
| where State !in~ (large_states)
| summarize count() by State
```

**Output**

|State|Count|
|--|--|
|KANSAS|3166|
|IOWA|2337|
|NEBRASKA|1766|
|OKLAHOMA|1716|
|SOUTH DAKOTA|1567|
|...|...|
