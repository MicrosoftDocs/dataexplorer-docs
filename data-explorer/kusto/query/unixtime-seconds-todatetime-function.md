---
title:  unixtime_seconds_todatetime()
description: Learn how to use the unixtime_seconds_todatetime() function to convert unix-epoch seconds to UTC datetime.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/28/2023
---
# unixtime_seconds_todatetime()

Converts unix-epoch seconds to UTC datetime.

## Syntax

`unixtime_seconds_todatetime(`*seconds*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *seconds* | `real` |  :heavy_check_mark: | The epoch timestamp in seconds. A `datetime` value that occurs before the epoch time (1970-01-01 00:00:00) has a negative timestamp value.|

## Returns

If the conversion is successful, the result is a [datetime](./scalar-data-types/datetime.md) value. Otherwise, the result is null.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUhJLEmNL8nMTVWwVSjNy6wAMeOLU5Pz81KK40vyQdIgIQ1DUxMzYwMDCwMDTQDkH54GOQAAAA==" target="_blank">Run the query</a>

```kusto
print date_time = unixtime_seconds_todatetime(1546300800)
```

**Output**

|date_time|
|---|
|2019-01-01 00:00:00.0000000|

## Related content

* Convert unix-epoch milliseconds to UTC datetime using [unixtime_milliseconds_todatetime()](unixtime-milliseconds-todatetime-function.md).
* Convert unix-epoch microseconds to UTC datetime using [unixtime_microseconds_todatetime()](unixtime-microseconds-todatetime-function.md).
* Convert unix-epoch nanoseconds to UTC datetime using [unixtime_nanoseconds_todatetime()](unixtime-nanoseconds-todatetime-function.md).
