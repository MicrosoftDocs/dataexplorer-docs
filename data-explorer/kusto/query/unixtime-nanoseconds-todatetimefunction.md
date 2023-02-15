---
title: unixtime_nanoseconds_todatetime() - Azure Data Explorer
description: This article describes unixtime_nanoseconds_todatetime() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/15/2023
---
# unixtime_nanoseconds_todatetime()

Converts unix-epoch nanoseconds to UTC datetime.

## Syntax

`unixtime_nanoseconds_todatetime(`*nanoseconds*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *nanoseconds* | real | &check; | The epoch timestamp in nanoseconds. A `datetime` value that occurs before the epoch time (1970-01-01 00:00:00) has a negative timestamp value.|

## Returns

If the conversion is successful, the result will be a [datetime](./scalar-data-types/datetime.md) value. If conversion is not successful, result will be null.

## See also

* Convert unix-epoch seconds to UTC datetime using [unixtime_seconds_todatetime()](unixtime-seconds-todatetimefunction.md).
* Convert unix-epoch milliseconds to UTC datetime using [unixtime_milliseconds_todatetime()](unixtime-milliseconds-todatetimefunction.md).
* Convert unix-epoch microseconds to UTC datetime using [unixtime_microseconds_todatetime()](unixtime-microseconds-todatetimefunction.md).

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUhJLEmNL8nMTVWwVSjNy6wAMePzEvPyi1OT8/NSiuNL8kFKQMIahqYmZsYGBhYGCKAJAOcnRh5GAAAA" target="_blank">Run the query</a>

```kusto
print date_time = unixtime_nanoseconds_todatetime(1546300800000000000)
```

**Output**

|date_time|
|---|
|2019-01-01 00:00:00.0000000|
