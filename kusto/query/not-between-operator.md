---
title:  The !between operator
description: Learn how to use the !between operator to match the input that is outside of the inclusive range.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# !between operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Matches the input that is outside of the inclusive range.

`!between` can operate on any numeric, datetime, or timespan expression.

## Syntax

*T* `|` `where` *expr* `!between` `(`*leftRange*` .. `*rightRange*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | `string` |  :heavy_check_mark:| The tabular input whose records are to be matched.|
| *expr* | scalar |  :heavy_check_mark: | The expression to filter.|
| *leftRange* | int, long, real, or datetime |  :heavy_check_mark: | The expression of the left range. The range is inclusive.|
| *rightRange* | int, long, real, datetime, or timespan |  :heavy_check_mark: | The expression of the right range. The range is inclusive.<br/><br/>This value can only be of type [timespan](scalar-data-types/timespan.md) if *expr* and *leftRange* are both of type `datetime`. See [example](#filter-datetime-using-a-timespan-range).|

## Returns

Rows in *T* for which the predicate of (*expr* < *leftRange* or *expr* > *rightRange*) evaluates to `true`.

## Examples  

### Filter numeric values

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAytKzEtPVahQSCvKz1UwVCjJVzA0UCguSS1QMOSqUSjPSC0CySompZaUp6bmKWiYKujpKVhqAgAyiN4KNwAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
range x from 1 to 10 step 1
| where x !between (5 .. 9)
```

**Output**

|x|
|---|
|1|
|2|
|3|
|4|
|10|

### Filter datetime  

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVCC5JLCoJycxNVVBMSi0pT03NU9BISSxJLQEKaRgZGJjrApGRuaaCnp4ChrixgaYm0KTk/NK8EgDn7tLlXQAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| where StartTime !between (datetime(2007-07-27) .. datetime(2007-07-30))
| count 
```

**Output**

|Count|
|---|
|58590|

### Filter datetime using a timespan range

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRKM9ILUpVCC5JLCoJycxNVVBMSi0pT03NU9BISSxJLQEKaRgZGJjrApGRuaaCnp6CcYomUF9yfmleCQDBjXU5SwAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| where StartTime !between (datetime(2007-07-27) .. 3d)
| count 
```

**Output**

|Count|
|---|
|58590|
