---
title: count_distinct() (aggregation function) - Azure Data Explorer
description: This article describes count_distinct() (aggregation function) in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 10/18/2022
---
# count_distinct() (aggregation function)

Counts unique values specified by the scalar expression per summary group, or the total number of unique values if the summary group is omitted.

[!INCLUDE [data-explorer-agg-function-summarize-note](../../includes/data-explorer-agg-function-summarize-note.md)]

If estimation of unique values count is good enough, use less resource consuming [dcount](dcount-aggfunction.md) aggregation function.

Use the [count_distinctif](count-distinctif-aggfunction.md) aggregation function to count only records for which a predicate returns `true`.

> [!NOTE]
> The `count_distinct()` is limited by 100M of unique values; an attemt to apply the function on an expression returning more unique values than this limit will produce a runtime error (HRESULT: 0x80DA0012).

## Syntax

`count_distinct` `(`*Expr*`)`

## Arguments

| Name | Type | Required | Description |
|--|--|--|--|
| *Expr*| scalar | &check; | A scalar expression whose unique values are to be counted. |

## Returns

Long integer value indicating the number of unique values of *`Expr`* per summary group.

## Example

This example shows how many types of storm events happened in each state.

```kusto
StormEvents
| summarize UniqueEvents=count_distinct(EventType) by State
| top 5 by UniqueEvents
```

**Results**

| State                | UniqueEvents  |
| -------------------- | ------------- |
| TEXAS                | 27            |
| CALIFORNIA           | 26            |
| PENNSYLVANIA         | 25            |
| GEORGIA              | 24            |
| NORTH CAROLINA       | 23            |
