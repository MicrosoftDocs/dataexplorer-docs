---
title:  make_timespan()
description: Learn how to use the make_timespan() function to create a timespan scalar value from the specified time period.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# make_timespan()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Creates a [timespan](scalar-data-types/timespan.md) scalar value from the specified time period.

## Syntax

`make_timespan(`*hour*, *minute*`)`

`make_timespan(`*hour*, *minute*, *second*`)`

`make_timespan(`*day*, *hour*, *minute*, *second*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*day*| `int` |  :heavy_check_mark:| The day.|
|*hour*| `int` |  :heavy_check_mark:| The hour. A value from 0-23.|
|*minute*| `int` || The minute. A value from 0-59.|
|*second*| `real` || The second. A value from 0 to 59.9999999.|

## Returns

If the creation is successful, the result will be a [timespan](scalar-data-types/timespan.md) value. Otherwise, the result will be null.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUYhWL8nMTS0uSMxTj1WwVchNzE6Nh4loGOoYGukYG+iYmuoZGhlrAgBc6MUYMgAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print ['timespan'] = make_timespan(1,12,30,55.123)
```

**Output**

| `timespan` |
|---|
|1.12:30:55.1230000|
