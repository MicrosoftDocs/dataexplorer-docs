---
title:  The between operator
description: Learn how to use the between operator to return a record set of values in an inclusive range for which the predicate evaluates to true. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/10/2023
---
# between operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Filters a record set for data matching the values in an inclusive range.

`between` can operate on any numeric, datetime, or timespan expression.

## Syntax

*T* `|` `where` *expr* `between` `(`*leftRange*` .. `*rightRange*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | `string` |  :heavy_check_mark: |  The tabular input whose records are to be matched. For example, the table name. |
| *expr* | scalar |  :heavy_check_mark: |  The expression used to filter. |
| *leftRange* | int, long, real, or datetime |  :heavy_check_mark: | The expression of the left range. The range is inclusive.|
| *rightRange* | int, long, real, datetime, or timespan |  :heavy_check_mark: | The expression of the right range. The range is inclusive.<br/><br/>This value can only be of type [timespan](scalar-data-types/timespan.md) if *expr* and *leftRange* are both of type `datetime`. See [example](#filter-using-a-timespan-range).|

## Returns

Rows in *T* for which the predicate of (*expr* >= *leftRange* and *expr* <= *rightRange*) evaluates to `true`.

## Examples

### Filter numeric values

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAytKzEtPVahQSCvKz1UwVCjJVzA0MFAoLkktUDDk5apRKM9ILQLJJ6WWlKem5ilomBoo6OkpmJpqAgBfXYZBOgAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
range x from 1 to 100 step 1
| where x between (50 .. 55)
```

**Output**

|x|
|---|
|50|
|51|
|52|
|53|
|54|
|55|

### Filter by date

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSjPSC1KVQguSSwqCcnMTVVISi0pT03NU9BISSxJLQGKaBgZGJjrApGRuaaCnp4ChrixgaYmyKTk/NK8EgBluyagXgAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| where StartTime between (datetime(2007-07-27) .. datetime(2007-07-30))
| count
```

**Output**

|Count|
|---|
|476|

### Filter by date and time

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVCC5JLCoJycxNVUhKLSlPTc1T0EhJLEktAYpoGBkYmOsaGukaGIYYGFoZG1gZGGgq6OkpYFVgAZQFKdAEGp2cX5pXAgDpcS3kbgAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| where StartTime between (datetime(2007-12-01T01:30:00) .. datetime(2007-12-01T08:00:00))
| count
```

**Output**

|Count|
|---|
|301|

### Filter using a timespan range

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5uWqUSjPSC1KVQguSSwqCcnMTVVISi0pT03NU9BISSxJLQGKaBgZGJjrApGRuaaCnp6CcYomSF9yfmleCQCGAqjRTAAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| where StartTime between (datetime(2007-07-27) .. 3d)
| count
```

**Output**

|Count|
|---|
|476|
