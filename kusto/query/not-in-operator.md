---
title:  The case-insensitive !in~ string operator
description: Learn how to use the !in~ string operator to filter records for data without a case-insensitive string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# !in~ operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Filters a record set for data without a case-insensitive string.

[!INCLUDE [in-operator-comparison](../includes/in-operator-comparison.md)]

## Performance tips

[!INCLUDE [performance-tip-note](../includes/performance-tip-note.md)]

When possible, use the case-sensitive [!in](not-in-cs-operator.md).

## Syntax

*T* `|` `where` *col* `!in~` `(`*expression*`,` ... `)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | `string` |  :heavy_check_mark: | The tabular input to filter.|
| *col* | `string` |  :heavy_check_mark: | The column by which to filter.|
| *expression* | scalar or tabular |  :heavy_check_mark: | An expression that specifies the values for which to search. Each expression can be a [scalar](scalar-data-types/index.md) value or a [tabular expression](tabular-expression-statements.md) that produces a set of values. If a tabular expression has multiple columns, the first column is used. The search will consider up to 1,000,000 distinct values. |

## Returns

Rows in *T* for which the predicate is `true`.

## Example

### List of scalars

The following query shows how to use `!in~` with a comma-separated list of scalar values.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSjPSC1KVQguSSxJVVDMzKtT0FByy8kvykxJVNJRUHJPzS9KzwQz/VLLFSLzi7KVNEHakvNL80oA5o2K+ksAAAA=" target="_blank">Run the query</a>
::: moniker-end

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

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSjPSC1KVQguSSxJVVDMzKtT0EipzEvMzUzWiFZyy8kvykxJVNJRUHJPzS9KzwQz/VLLFSLzi7KVYjU1QSYk55fmlQAAs+z4r1YAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents 
| where State !in~ (dynamic(["Florida", "Georgia", "New York"])) 
| count
```

**Output**

|Count|
|---|
|54291|  

The same query can also be written with a [let statement](let-statement.md).

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAyWMvQrCQBAG+zzF51V34BtISrWzSSXB4kwWXczdwt7GEJE8uz/pBmaYgQzFolFBjX7OMXHnW3cYRLmPbgt3JNEb//FEE86iD3cJu6ox0bR/UraC6o3pTkpofitsOC/w6zZ8XRlTisovQidjNh9wndf0A62lrc5/AAAA" target="_blank">Run the query</a>
::: moniker-end

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

The following query shows how to use `!in~` with an inline tabular expression. Notice that an inline tabular expression must be enclosed with double parentheses.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSjPSC1KVQguSSxJVVDMzKtT0NAIyC8ozUksyczPc0ksSVSAqUEIK9gpmBqAAVCyoCg/KzW5BGKEpibQyOLS3NzEosyqVIXk/NK8Eg1NhaRKiDQAEmmU0nwAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents 
| where State !in~ (PopulationData | where Population > 5000000 | project State)
| summarize count() by State
```

**Output**

|State|count_|
|--|--|
|KANSAS|3166|
|IOWA|2337|
|NEBRASKA|1766|
|OKLAHOMA|1716|
|SOUTH DAKOTA|1567|
|...|...|

The same query can also be written with a [let statement](let-statement.md). Notice that the double parentheses as provided in the last example aren't necessary in this case.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVHISSxKT40vLkksSS1WsFUIyC8ozUksyczPc0ksSVSoUSjPSC1KRRJWsFMwNQADoGRBUX5WanKJQjBIuzVXcEl+Ua5rWWpeSbECF0wrWE5BMTOvTkED2TJNoIri0tzcxKLMqlSF5PzSvBINTYWkSogGANAXanqbAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let large_states = PopulationData | where Population > 5000000 | project State;
StormEvents 
| where State !in~ (large_states)
| summarize count() by State
```

**Output**

|State|count_|
|--|--|
|KANSAS|3166|
|IOWA|2337|
|NEBRASKA|1766|
|OKLAHOMA|1716|
|SOUTH DAKOTA|1567|
|...|...|
