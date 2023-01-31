---
title: The case-sensitive in string operator - Azure Data Explorer
description: Learn how to use the in operator to filter data with a case-sensitive string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 12/28/2022
---
# in operator

Filters a record set for data with a case-sensitive string.

[!INCLUDE [in-operator-comparison](../../includes/in-operator-comparison.md)]

## Performance tips

[!INCLUDE [performance-tip-note](../../includes/performance-tip-note.md)]

## Syntax

*T* `|` `where` *col* `in` `(`*scalar_expr*`,` [*scalar_expr_2*`,` *scalar_expr3*`,` ... ]`)`
*T* `|` `where` *col* `in` `(`*tabular_expr*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | string | &check; | The tabular input whose records are to be filtered.|
| *col* | string | &check; | The column used to filter the records.|
| *scalar_expr* | scalar | | An expression or list of expressions to search for in *col*.|
| *tabular_expr* | string | | A tabular expression that has a set of values to search for in *col*. If the tabular expression has multiple columns, the first column is used.|

> [!NOTE]
> At least one *scalar_expr* or a single *tabular_expr* is required.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

### Use in operator

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

### Use dynamic array

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

### Subquery

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA02NMQ6EMAwE+7xiS6ioqE6UvACoIzhZEIkkkDh3CuLxQKBgO9sz3qJA55UZ4cOwBnJRzMRo7SJL2XDP5FFB4EzD1un6R4Z9mvdT0bp3aiN8bTCc5RgikvQAbBeU1zLd5Qfi9QRix38iR7cCZZC9e/MLSOIBuKIWsKQAAAA=" target="_blank">Run the query</a>

```kusto
// Using subquery
let Top_5_States = 
    StormEvents
    | summarize count() by State
    | top 5 by count_; 
StormEvents 
| where State in (Top_5_States) 
| count
```

The same query can be written as:

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA9PXV/DMy8nMS1UoLk0qLE0tqlTgCi7JL8p1LUvNKylW4KpRKM9ILUpVCC5JLElVyMxT0OBSAAIIiaQSzK8BmpKbm1iUWZWqkJxfmleioamQVAnRC1VQkl+gYAoSBMvHa4KFNUH2gAUAL2+/vJAAAAA=" target="_blank">Run the query</a>

```kusto
// Inline subquery 
StormEvents 
| where State in (
    (
    StormEvents
    | summarize count() by State
    | top 5 by count_)
    ) 
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
