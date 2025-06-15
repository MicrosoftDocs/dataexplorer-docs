---
title:  endofweek()
description: Learn how to use the endofweek() function to return a datetime representing the end of the week for the given date value.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# endofweek()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Provides the end of the week containing the date, shifted by an offset, if provided.

Last day of the week is considered to be a Saturday.

## Syntax

`endofweek(`*date* [, *offset*]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *date* | `datetime` |  :heavy_check_mark:| The date used to find the end of the week. |
| *offset* | `int` | | The number of offset weeks from *date*. Default is 0. |

## Returns

Returns datetime representing the end of the week for the given *date* value, with the *offset*, if specified.

## Examples

The following example returns the end of the week for the specified date.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAy3MMQqAMBBE0d5TTKmgkLURBEsPImYiKmYlLth4eA0Ir/nNT1NcCA3hoiEkPdAITCG4jCekwIMz6cbZcJP7GD0GMHoNOUs/GW09WLZOusbJB+L6rKvqf1y9enVBc2YAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
  range offset from -1 to 1 step 1
 | project weekEnd = endofweek(datetime(2017-01-01 10:10:17), offset)  
```

**Output**

|weekEnd|
|---|
|2016-12-31 23:59:59.9999999|
|2017-01-07 23:59:59.9999999|
|2017-01-14 23:59:59.9999999|

## Related content

* [startofweek function](./startofweek-function.md)
* [endofday function](./endofday-function.md)
* [endofmonth function](./endofmonth-function.md)
* [endofyear function](./endofyear-function.md)
* [dayofweek function](./day-of-week-function.md)
* [week_of_year function](./week-of-year-function.md)
* [ago function](./ago-function.md)