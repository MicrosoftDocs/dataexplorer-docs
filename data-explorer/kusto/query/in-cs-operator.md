---
title: The case-sensitive in string operator - Azure Data Explorer
description: Learn how to use the in operator to filter data with a case-sensitive string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/02/2023
---
# in operator

Filters a record set for data with a case-sensitive string.

[!INCLUDE [in-operator-comparison](../../includes/in-operator-comparison.md)]

## Performance tips

[!INCLUDE [performance-tip-note](../../includes/performance-tip-note.md)]

## Syntax

*T* `|` `where` *col* `in` `(`*list_of_scalars*`)`

*T* `|` `where` *col* `in` `(`*dynamic_array*`)`

*T* `|` `where` *col* `in` `((`*tabular_expression*`))`

> [!NOTE]
> An inline tabular expression must be enclosed with double parentheses to be properly parsed. See [example](#tabular-expression).

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | string | &check; | The tabular input to filter.|
| *col* | string | &check; | The column used to filter the records.|
| *list_of_scalars* | scalar | &check; | A value or comma-separated set of values to search for in *col*.|
| *dynamic_array* | dynamic | &check; | An array of values to search for in *col*.|
| *tabular_expression* | string | &check; | A tabular expression that produces a set of values to search for in *col*. If the tabular expression has multiple columns, the first column is used. The *tabular_expr* can produce up to 1,000,000 distinct results.|

> [!NOTE]
> Depending on the chosen [syntax](#syntax), either *list_of_scalars*, *dynamic_array*, or *tabular_expression* is required.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

### List of scalars

The following query shows how to use `in` with a list of scalar values.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSjPSC1KVQguSSxJVcjMU9BQcvPxD/J0cVTSUVByd/UPcvcEM/1cwxUi/YO8lTRBmpLzS/NKAJNAy9pJAAAA" target="_blank">Run the query</a>

```kusto
StormEvents 
| where State in ("FLORIDA", "GEORGIA", "NEW YORK") 
| count
```

**Output**

|Count|
|---|
|4775|  

### Dynamic array

The following query shows how to use `in` with a dynamic array.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVEoLkksSS1WsFVIqcxLzM1M1ohWd/PxD/J0cVTXUVB3DPFx9AvxdFYI9g8N8QCJuLv6B7l7OqrHalpzBZfkF+W6lqXmlRQrcNUolGekFqUqBIMMVMjMU9CAGK0JlEnOL80rAQDj7kmUbgAAAA==" target="_blank">Run the query</a>

```kusto
let states = dynamic(['FLORIDA', 'ATLANTIC SOUTH', 'GEORGIA']);
StormEvents 
| where State in (states)
| count
```

**Output**

|Count|
|---|
|3218|

### Tabular expression

The following query shows how to use `in` with a tabular expression.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVEIyS+IN40PLkksSS1WsFXg5VIAguCS/KJc17LUvJJiiECNQnFpbm5iUWZVqkJyfmleiYamQlKlAlgbTEVJfoGCKUgUrCDeGmgWkjlAXo1CeUZqUSpEl0JmnoIGsuWaYBVgvQBWFNNCmAAAAA==" target="_blank">Run the query</a>

```kusto
let Top_5_States = 
    StormEvents
    | summarize count() by State
    | top 5 by count_; 
StormEvents 
| where State in (Top_5_States) 
| count
```

The same query can be written with an inline tabular expression statement. Notice that an inline tabular expression must be enclosed with double parentheses to be properly parsed.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuDlqlEoz0gtSlUILkksSVXIzFPQ0ODlUgCCYIQyiECNQnFpbm5iUWZVqkJyfmleiYamQlIlRCNMRUl+gYIpSBSsIB4irKkJtgcsBAD4wHSifQAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents 
| where State in ((
    StormEvents
    | summarize count() by State
    | top 5 by count_
    )) 
| count
```

**Output**

|Count|
|---|
|14242|  

### Top with other example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA22PPQuDMBCG9/yKFxcVXJ3EpdCt0EF3sfaqKZpIPEst/vhGpVZqs+Tg7nk/amKcZFmxkqrMDkOWcM6EGI39jMxr+SIvYW2a44MUdwL2jej6psmN3aFeYZoPLFroXrG8eTORDq2Vi+GuLq6Py4DZx49EbQOkus3CxXni/+QZwbpFOIE7wxGt0XcqeNGMIPYCYgQ9mdQVn37SBlxmqeBtE/jBchTAOXNFxvHFtrCdvN8M30ZvE2wmM1ABAAA=" target="_blank">Run the query</a>

```kusto
let Lightning_By_State = materialize(StormEvents
    | summarize lightning_events = countif(EventType == 'Lightning') by State);
let Top_5_States = Lightning_By_State | top 5 by lightning_events | project State; 
Lightning_By_State
| extend State = iff(State in (Top_5_States), State, "Other")
| summarize sum(lightning_events) by State 
```

**Output**

| State     | sum_lightning_events |
|-----------|----------------------|
| ALABAMA   | 29                   |
| WISCONSIN | 31                   |
| TEXAS     | 55                   |
| FLORIDA   | 85                   |
| GEORGIA   | 106                  |
| Other     | 415                  |

### Use a static list returned by a function

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSspVuCqUSjPSC1KVQguSSxJVcjMU9DwzCsBChSXZOalgwWLNTQ1QeqS80vzSgAtnqHrPAAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents 
| where State in (InterestingStates()) 
| count
```

**Output**

|Count|
|---|
|4775|  

The function definition.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA9MrzsgvV0grzUsuyczPU/DMK0ktSi0uycxLDy5JLEktBgBVrDk7IAAAAA==" target="_blank">Run the query</a>

```kusto
.show function InterestingStates
```

**Output**

|Name|Parameters|Body|Folder|DocString|
|---|---|---|---|---|
|InterestingStates|()|{ dynamic(["WASHINGTON", "FLORIDA", "GEORGIA", "NEW YORK"]) }
