---
title:  unixtime_microseconds_todatetime()
description: Learn how to use the unixtime_microseconds_todatetime() function to convert unix-epoch microseconds to UTC datetime.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# unixtime_microseconds_todatetime()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Converts unix-epoch microseconds to UTC datetime.

## Syntax

`unixtime_microseconds_todatetime(`*microseconds*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *microseconds* | `real` |  :heavy_check_mark: | The epoch timestamp in microseconds. A `datetime` value that occurs before the epoch time (1970-01-01 00:00:00) has a negative timestamp value.|

## Returns

If the conversion is successful, the result is a [datetime](scalar-data-types/datetime.md) value. Otherwise, the result is null.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUhJLEmNL8nMTVWwVSjNy6wAMeNzM5OL8otTk/PzUorjS/JBakDiGoamJmbGBgYWBlCgCQC7i8BNRAAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print date_time = unixtime_microseconds_todatetime(1546300800000000)
```

**Output**

|date_time|
|---|
|2019-01-01 00:00:00.0000000|

## Related content

* Convert unix-epoch seconds to UTC datetime using [unixtime_seconds_todatetime()](unixtime-seconds-todatetime-function.md).
* Convert unix-epoch milliseconds to UTC datetime using [unixtime_milliseconds_todatetime()](unixtime-milliseconds-todatetime-function.md).
* Convert unix-epoch nanoseconds to UTC datetime using [unixtime_nanoseconds_todatetime()](unixtime-nanoseconds-todatetime-function.md).
