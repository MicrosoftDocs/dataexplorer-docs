---
title: in operators - Azure Data Explorer
description: This article describes the in operators Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 09/02/2021
ms.localizationpriority: high
---
# in operators

Filters a record set based on the provided set of values.

> [!NOTE]
>
> * Adding `~` to the operator makes values' search case-insensitive: `x in~ (expression)` or `x !in~ (expression)`.
> * In tabular expressions, the first column of the result set is selected.
> * The expression list can produce up to `1,000,000` values.
> * Nested arrays are flattened into a single list of values. For example, `x in (dynamic([1,[2,3]]))` becomes `x in (1,2,3)`.

The following table provides a comparison of the `in` operators. For further information about other operators and to determine which operator is most appropriate for your query, see [datatype string operators](datatypes-string-operators.md).

|Operator   |Description   |Case-Sensitive  |Example (yields `true`)  |
|-----------|--------------|----------------|-------------------------|
|[`in`](in-cs-operator.md) |Equals to one of the elements |Yes |`"abc" in ("123", "345", "abc")`|
|[`!in`](not-in-cs-operator.md) |Not equals to any of the elements |Yes | `"bca" !in ("123", "345", "abc")` |
|[`in~`](inoperator.md) |Equals to any of the elements |Yes | `"abc" !in ("123", "345", "abc")` |
|[`!in~`](not-in-operator.md) |Not equals to any of the elements |Yes | `"bca" !in ("123", "345", "ABC")` |

## Performance tips

For better performance, when there are two operators that do the same task, use the case-sensitive one.
For example:

* Use `==`, not `=~`
* Use `in`, not `in~`
* Use `contains_cs`, not `contains`

For faster results, if you're testing for the presence of a symbol or alphanumeric word that is bound by non-alphanumeric characters, or the start or end of a field, use `has` or `in`. 
For more information, see [Query best practices](best-practices.md).

## Syntax

### Case sensitive syntax

*T* `|` `where` *col* `in` `(`*list of scalar expressions*`)`   
*T* `|` `where` *col* `in` `(`*tabular expression*`)`   

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *list of expressions* - A comma-separated list of tabular, scalar, or literal expressions.
* *tabular expression* - A tabular expression that has a set of values. If the expression has multiple columns, the first column is used.

## Returns

Rows in *T* for which the predicate is `true`.

## Examples  

### Use in operator

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents 
| where State in ("FLORIDA", "GEORGIA", "NEW YORK") 
| count
```

|Count|
|---|
|4775|  

### Use dynamic array

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let states = dynamic(['FLORIDA', 'ATLANTIC SOUTH', 'GEORGIA']);
StormEvents 
| where State in (states)
| count
```

|Count|
|---|
|3218|

### Subquery

<!-- csl: https://help.kusto.windows.net/Samples -->
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

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
// Inline subquery 
StormEvents 
| where State in (
    ( StormEvents
    | summarize count() by State
    | top 5 by count_ )
) 
| count
```

|Count|
|---|
|14242|  

### Top with other example

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
let Lightning_By_State = materialize(StormEvents | summarize lightning_events = countif(EventType == 'Lightning') by State);
let Top_5_States = Lightning_By_State | top 5 by lightning_events | project State; 
Lightning_By_State
| extend State = iif(State in (Top_5_States), State, "Other")
| summarize sum(lightning_events) by State 
```

| State     | sum_lightning_events |
|-----------|----------------------|
| ALABAMA   | 29                   |
| WISCONSIN | 31                   |
| TEXAS     | 55                   |
| FLORIDA   | 85                   |
| GEORGIA   | 106                  |
| Other     | 415                  |

### Use a static list returned by a function

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents | where State in (InterestingStates()) | count

```

|Count|
|---|
|4775|  

The function definition.

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
.show function InterestingStates
```

|Name|Parameters|Body|Folder|DocString|
|---|---|---|---|---|
|InterestingStates|()|{ dynamic(["WASHINGTON", "FLORIDA", "GEORGIA", "NEW YORK"]) }