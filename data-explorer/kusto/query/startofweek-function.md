---
title:  startofweek()
description: Learn how to use the startofweek() function to return the start of the week for the given date.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# startofweek()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns the start of the week containing the date, shifted by an offset, if provided.

Start of the week is considered to be a Sunday.

## Syntax

`startofweek(`*date* [`,` *offset* ]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *date* | `datetime` |  :heavy_check_mark: | The date for which to find the start of week.|
| *offset* | `int` | | The number of weeks to offset from the input date. The default is 0.|

## Returns

A datetime representing the start of the week for the given *date* value, with the offset, if specified.

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAy2MQQqAMAwE775ijxYUGi8FwVf4gqKpqNSUGvDi421BGFiYhcn+2hgSws2KkCWiJ6iAcCsnUPMiZTl4UTzM56w+K6ZylpVQVbt6Zd0jt4Ml11sqgOxYcab72+YDGdMCYmkAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
range offset from -1 to 1 step 1
| project weekStart = startofweek(datetime(2017-01-01 10:10:17), offset) 
```

**Output**

|weekStart|
|---|
|2016-12-25 00:00:00.0000000|
|2017-01-01 00:00:00.0000000|
|2017-01-08 00:00:00.0000000|

The following example returns the start of the week as Monday for the specified date.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3XQwQrCMAwA0Hu%2FIuxiCxV0uAmTHQTx5knBg4hUGsdwdlA7dKj%2Fbro59DB7KE37kpAW6ODqlHXl6YZ4XtrysiqNVjWkwLVyOLdZAv7g8gsKeDCg1cUHpTUfkB5IGMvfQryPDMl8agoh2GvGCmpPNyr1m1PHAvmCwLejT6gTqmxzkwm2Y90DD0dhJCGmxhMhIVgrV1mygewjUUMq8xfEHrST94OpB5sKr16w%2FcwbBewJeHdoNLS5Wxo97f3PZi7xBi07C4NvAQAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
let startofweekFromMonday = (dateArg: datetime) {
    datetime_add('day', 1, startofweek(datetime_add('day', -1, dateArg)))
};
let data=datatable(Date: datetime, day: string)
[
datetime(2025, 6, 14), "Saturday",
datetime(2025, 6, 15), "Sunday",
datetime(2025, 6, 16), "Monday",
datetime(2025, 6, 17), "Tuesday"
];
data 
| extend MondayWeek=startofweekFromMonday(Date)
```

**Output**

|Date|day|MondayWeek|
|---|---|---|
|2025-06-14 00:00:00.0000000|Saturday|2025-06-09 00:00:00.0000000|
|2025-06-15 00:00:00.0000000|Sunday|2025-06-09 00:00:00.0000000|
|2025-06-16 00:00:00.0000000|Monday|2025-06-16 00:00:00.0000000|
|2025-06-17 00:00:00.0000000|Tuesday|2025-06-16 00:00:00.0000000|

## Related content

* [dayofweek function](./day-of-week-function.md)
* [endofweek function](./endofweek-function.md)
* [week_of_year function](./week-of-year-function.md)
* [ago function](./ago-function.md)
* [bin function](./bin-function.md)