---
title: The case-insensitive !in~ string operator - Azure Data Explorer
description: Learn how to use the !in~ string operator to filter records for data without a case-insensitive string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/02/2023
---
# !in~ operator

Filters a record set for data without a case-insensitive string.

[!INCLUDE [in-operator-comparison](../../includes/in-operator-comparison.md)]

## Performance tips

[!INCLUDE [performance-tip-note](../../includes/performance-tip-note.md)]

When possible, use the case-sensitive [!in~](not-in-cs-operator.md).

## Syntax

*T* `|` `where` *col* `!in~` `(`*scalar* [`,` *scalar2*`,` *scalar3*`,` ... ]`)`

*T* `|` `where` *col* `!in~` `(`*dynamic_array*`)`

*T* `|` `where` *col* `!in~` `((`*tabular_expression*`))`

> [!NOTE]
> An inline tabular expression must be enclosed with double parentheses to be properly parsed. See [example](#tabular-expression).

## Parameters

The following table describes the parameters to use with the `!in~` operator. Depending on the chosen [syntax](#syntax), either *scalar*, *dynamic_array*, or *tabular_expression* is required.

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | string | &check; | The tabular input to filter.|
| *col* | string | &check; | The column by which to filter.|
| *scalar* | scalar | &check; | A value or comma-separated set of [scalar](scalar-data-types/index.md) values used to filter *col*.|
| *dynamic_array* | dynamic | &check; | A [dynamic array](scalar-data-types/dynamic.md) of values to search for in col.|
| *tabular_expression* | string | &check; | A [tabular expression](tabularexpressionstatements.md) that produces a set of values to search for in *col*. The expression can produce up to 1,000,000 distinct results. If the output has multiple columns, only the first column is used.|

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
