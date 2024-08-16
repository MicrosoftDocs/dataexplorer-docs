---
title:  make_datetime()
description: Learn how to use the make_datetime() function to create a datetime scalar value from the specified date and time.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# make_datetime()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Creates a [datetime](scalar-data-types/datetime.md) scalar value between the specified date and time.

## Syntax

`make_datetime(`*year*, *month*, *day*`)`

`make_datetime(`*year*, *month*, *day*, *hour*, *minute*`)`

`make_datetime(`*year*, *month*, *day*, *hour*, *minute*, *second*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*year*| `int` |  :heavy_check_mark: | The year value between 0 to 9999.|
|*month*| `int` |  :heavy_check_mark: | The month value between 1 to 12. |
|*day*| `int` |  :heavy_check_mark: | The day value between 1 to 28-31, depending on the month.|
|*hour*| `int` | | The hour value between 0 to 23.|
|*minute*| `int` | | The minute value between 0 to 59.|
|*second*| double | | The second value between 0 to 59.9999999.|

## Returns

If successful, the result will be a [datetime](scalar-data-types/datetime.md) value, otherwise, the result will be null.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUahMTSyKz83PK8mIT0msVLBVyE3MTgUyS1JLMnNTNYwMDM11DA10DAw1AS/izjAwAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print year_month_day = make_datetime(2017,10,01)
```

**Output**

|year_month_day|
|---|
|2017-10-01 00:00:00.0000000|

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUahMTSyKz83PK8mIT0msjM/ILwVyM/NKS1IVbBVyE7NTgcIlqSWZuakaRgaG5jqGBjoGhjqGRkCGJgB7AoRjQgAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print year_month_day_hour_minute = make_datetime(2017,10,01,12,10)
```

**Output**

|year_month_day_hour_minute|
|---|
|2017-10-01 12:10:00.0000000|

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAw3JSwqAIBAA0Ku4LBjCsY+rzjJIDijhGDYuvH0tH+9pWdQMDo1KFU0Uw6BU+88sXZlevqpEc5oSbv5XWXPhyVn0gBYsAjpABLugW7f98PMHKbr/e1MAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print year_month_day_hour_minute_second = make_datetime(2017,10,01,12,11,0.1234567)
```

**Output**

|year_month_day_hour_minute_second|
|---|
|2017-10-01 12:11:00.1234567|
