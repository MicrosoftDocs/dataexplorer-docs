---
title:  sort operator
description: Learn how to use the sort operator to sort the rows of the input table by one or more columns.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/09/2023
---
# sort operator

Sorts the rows of the input table into order by one or more columns.

> The `sort` and `order` operators are equivalent

## Syntax

*T* `| sort by` *column* [`asc` | `desc`] [`nulls first` | `nulls last`] [`,` ...]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | `string` |  :heavy_check_mark: | The tabular input to sort. |
| *column* | scalar |  :heavy_check_mark: | The column of *T* by which to sort. The type of the column values must be numeric, date, time or string.|
| `asc` or `desc` | `string` | | `asc` sorts into ascending order, low to high. Default is `desc`, high to low. |
| `nulls first` or `nulls last`  | `string` | | `nulls first` will place the null values at the beginning and `nulls last` will place the null values at the end. Default for `asc` is `nulls first`. Default for `desc` is `nulls last`.|

## Returns

A copy of the input table sorted in either ascending or descending order based on the provided column.

## Sort operator behavior with special floating point values

When the input to the sort operator contains the special values `null`, `NaN`, `-inf` and `+inf` the behavior will be as follows:
|           | asc | desc|
|nulls first|`null`,`NaN`,`-inf`,`-5`,`0`,`5`,`+inf`|`null`,`NaN`,`+inf`,`5`,`0`,`-5`|
|nulls last |`-inf`,`-5`,`0`,`+inf`,`NaN`,`null`|`+inf`,`5`,`0`,`-5`,`NaN`,`null`|

• Nulls and NaNs always come as a "group".
• The order between nulls and NaNs is determined by the "first / last" property, not "asc / desc" property(since they have no asc / desc relationship).

## Example

The following example shows storm events by state in alphabetical order with the most recent storms in each state appearing first.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRyC9KSS1SSKpUCC5JLElVSCxO1gExi0pCMnNTFVJSi5MBfa8LRzAAAAA=" target="_blank">Run the query</a>

```kusto
StormEvents
| sort by State asc, StartTime desc
```

This table only shows the top 10 query results.

|StartTime|State|EventType|...|
|--|--|--|--|
|2007-12-28T12:10:00Z|ALABAMA|Hail|...|
|2007-12-28T04:30:00Z|ALABAMA|Hail|...|
|2007-12-28T04:16:00Z|ALABAMA|Hail|...|
|2007-12-28T04:15:00Z|ALABAMA|Hail|...|
|2007-12-28T04:13:00Z|ALABAMA|Hail|...|
|2007-12-21T14:30:00Z|ALABAMA|Strong Wind|...|
|2007-12-20T18:15:00Z|ALABAMA|Strong Wind|...|
|2007-12-20T18:00:00Z|ALABAMA|Strong Wind|...|
|2007-12-20T18:00:00Z|ALABAMA|Strong Wind|...|
|2007-12-20T17:45:00Z|ALABAMA|Strong Wind|...|
|2007-12-20T17:45:00Z|ALABAMA|Strong Wind|...|
