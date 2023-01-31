---
title: The case-sensitive != (not equals) string operator - Azure Data Explorer
description: Learn how to use the != (not equals) string operator to filter records for data that doesn't match a case-sensitive string.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/09/2023
---
# != (not equals) operator

Filters a record set for data that doesn't match a case-sensitive string.

The following table provides a comparison of the `==` (equals) operators:

|Operator   |Description   |Case-Sensitive  |Example (yields `true`)  |
|-----------|--------------|----------------|-------------------------|
|[`==`](equals-cs-operator.md)|Equals |Yes|`"aBc" == "aBc"`|
|[`!=`](not-equals-cs-operator.md)|Not equals |Yes |`"abc" != "ABC"`|
|[`=~`](equals-operator.md) |Equals |No |`"abc" =~ "ABC"`|
|[`!~`](not-equals-operator.md) |Not equals |No |`"aBc" !~ "xyz"`|

For more information about other operators and to determine which operator is most appropriate for your query, see [datatype string operators](datatypes-string-operators.md).

## Performance tips

[!INCLUDE [performance-tip-note](../../includes/performance-tip-note.md)]

## Syntax

*T* `|` `where` *col* `!=` `(`*list of scalar expressions*`)`

## Arguments

* *T* - The tabular input whose records are to be filtered.
* *col* - The column to filter.
* *expression* - Scalar or literal expression.

## Returns

Rows in *T* for which the predicate is `true`.

## Example

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
StormEvents
    | summarize event_count=count() by State
    | where (State != "FLORIDA") and (event_count > 4000)
    | project State, event_count
```

**Output**

|State|event_count|
|-----|-----------|
|TEXAS|4,701|
