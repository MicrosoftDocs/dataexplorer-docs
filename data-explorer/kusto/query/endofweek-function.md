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

The following example returns the end of the week as Sunday for the specified date.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3XQzwuCMBQH8Pv%2BikcXN1hQ0i8UD0Edo4NBh4hY7CmSKeikpPrfe7NECNth7Mdn7%2FFdigYw03l0Q7yEVaZVDQFwrQwui9gDuzDJFQU8GNBo9yelNXdIOxIWsivB%2B8CQxLeiEIK9fJZSWzpRgZ2MOqfIVwS6fvZB7UFpiiSLBTuw9oK7I3cqYSZhPBESBqEyVUF2IPvItCFNrH4ws2CT%2FwdzC3YVllawo2%2BNAvYEvBtKDZ%2Fi60xvoz3lD34%2Bs4kl3jG4Z9ZmAQAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let endofweekSunday = (dateArg: datetime) {
    datetime_add('day', 8, endofweek(datetime_add('day', -8, dateArg)))
};
let data=datatable(Date: datetime, day: string)
[
datetime(2025, 6, 14), "Saturday",
datetime(2025, 6, 15), "Sunday",
datetime(2025, 6, 16), "Monday",
datetime(2025, 6, 17), "Tuesday"
];
data 
| extend SundayEndOfWeek=endofweekSunday(Date)
```

**Output**

|Date|day|SundayEndOfWeek|
|---|---|---|
|2025-06-14 00:00:00.0000000|Saturday|2025-06-15 23:59:59.9999999|
|2025-06-15 00:00:00.0000000|Sunday|2025-06-15 23:59:59.9999999|
|2025-06-16 00:00:00.0000000|Monday|2025-06-22 23:59:59.9999999|
|2025-06-17 00:00:00.0000000|Tuesday|2025-06-22 23:59:59.9999999|

## Related content

* [startofweek function](./startofweek-function.md)
* [endofday function](./endofday-function.md)
* [endofmonth function](./endofmonth-function.md)
* [endofyear function](./endofyear-function.md)
* [dayofweek function](./day-of-week-function.md)
* [week_of_year function](./week-of-year-function.md)
* [ago function](./ago-function.md)