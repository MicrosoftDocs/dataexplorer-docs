---
title:  format_datetime()
description: Learn how to use the format_datetime() function to format a datetime according to the provided format.
ms.reviewer: alexans
ms.topic: reference
ms.date: 07/27/2023
---
# format_datetime()

Formats a datetime according to the provided format.

## Syntax

`format_datetime(`*date* `,` *format*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *date* | `datetime` |  :heavy_check_mark: | The value to format.|
| *format* | `string` |  :heavy_check_mark:| The output format comprised of one or more of the [supported format elements](#supported-format-elements).

### Supported format elements

The *format* parameter should include one or more of the following elements:

|Format specifier| Description| Examples|
|--|--|--|
|`d`| The day of the month, from 1 through 31.| 2009-06-01T13:45:30 -> 1, 2009-06-15T13:45:30 -> 15
|`dd`| The day of the month, from 01 through 31.| 2009-06-01T13:45:30 -> 01, 2009-06-15T13:45:30 -> 15
|`f`| The tenths of a second in a date and time value.| 2009-06-15T13:45:30.6170000 -> 6, 2009-06-15T13:45:30.05 -> 0
|`ff`| The hundredths of a second in a date and time value.| 2009-06-15T13:45:30.6170000 -> 61, 2009-06-15T13:45:30.0050000 -> 00
|`fff`| The milliseconds in a date and time value.| 6/15/2009 13:45:30.617 -> 617, 6/15/2009 13:45:30.0005 -> 000
|`ffff`| The ten thousandths of a second in a date and time value.| 2009-06-15T13:45:30.6175000 -> 6175, 2009-06-15T13:45:30.0000500 -> 0000
|`fffff`| The hundred thousandths of a second in a date and time value. |2009-06-15T13:45:30.6175400 -> 61754, 2009-06-15T13:45:30.000005 -> 00000
|`ffffff`| The millionths of a second in a date and time value.| 2009-06-15T13:45:30.6175420 -> 617542, 2009-06-15T13:45:30.0000005 -> 000000
|`fffffff`| The ten millionths of a second in a date and time value.| 2009-06-15T13:45:30.6175425 -> 6175425, 2009-06-15T13:45:30.0001150 -> 0001150
|`F`| If non-zero, the tenths of a second in a date and time value.| 2009-06-15T13:45:30.6170000 -> 6, 2009-06-15T13:45:30.0500000 -> (no output)
|`FF`| If non-zero, the hundredths of a second in a date and time value.| 2009-06-15T13:45:30.6170000 -> 61, 2009-06-15T13:45:30.0050000 -> (no output)
|`FFF`| If non-zero, the milliseconds in a date and time value.| 2009-06-15T13:45:30.6170000 -> 617, 2009-06-15T13:45:30.0005000 -> (no output)
|`FFFF`| If non-zero, the ten thousandths of a second in a date and time value.|2009-06-15T13:45:30.5275000 -> 5275, 2009-06-15T13:45:30.0000500 -> (no output)
|`FFFFF`| If non-zero, the hundred thousandths of a second in a date and time value.| 2009-06-15T13:45:30.6175400 -> 61754, 2009-06-15T13:45:30.0000050 -> (no output)
|`FFFFFF`| If non-zero, the millionths of a second in a date and time value.| 2009-06-15T13:45:30.6175420 -> 617542, 2009-06-15T13:45:30.0000005 -> (no output)
|`FFFFFFF`| If non-zero, the ten millionths of a second in a date and time value.| 2009-06-15T13:45:30.6175425 -> 6175425, 2009-06-15T13:45:30.0001150 -> 000115
|`h`| The hour, using a 12-hour clock from 1 to 12.| 2009-06-15T01:45:30 -> 1, 2009-06-15T13:45:30 -> 1
|`hh`| The hour, using a 12-hour clock from 01 to 12.| 2009-06-15T01:45:30 -> 01, 2009-06-15T13:45:30 -> 01
|`H`| The hour, using a 24-hour clock from 0 to 23.| 2009-06-15T01:45:30 -> 1, 2009-06-15T13:45:30 -> 13
|`HH`| The hour, using a 24-hour clock from 00 to 23.| 2009-06-15T01:45:30 -> 01, 2009-06-15T13:45:30 -> 13
|`m`| The minute, from 0 through 59.| 2009-06-15T01:09:30 -> 9, 2009-06-15T13:29:30 -> 29
|`mm`| The minute, from 00 through 59.| 2009-06-15T01:09:30 -> 09, 2009-06-15T01:45:30 -> 45
|`M`| The month, from 1 through 12.| 2009-06-15T13:45:30 -> 6
|`MM`| The month, from 01 through 12.| 2009-06-15T13:45:30 -> 06
|`s`| The second, from 0 through 59.| 2009-06-15T13:45:09 -> 9
|`ss`| The second, from 00 through 59.| 2009-06-15T13:45:09 -> 09
|`y`| The year, from 0 to 99.| 0001-01-01T00:00:00 -> 1, 0900-01-01T00:00:00 -> 0, 1900-01-01T00:00:00 -> 0, 2009-06-15T13:45:30 -> 9, 2019-06-15T13:45:30 -> 19
|`yy`| The year, from 00 to 99.| 0001-01-01T00:00:00 -> 01, 0900-01-01T00:00:00 -> 00, 1900-01-01T00:00:00 -> 00, 2019-06-15T13:45:30 -> 19
|`yyyy`| The year as a four-digit number.| 0001-01-01T00:00:00 -> 0001, 0900-01-01T00:00:00 -> 0900, 1900-01-01T00:00:00 -> 1900, 2009-06-15T13:45:30 -> 2009
|`tt`| AM / PM hours| 2009-06-15T13:45:09 -> PM

### Supported delimiters

The format specifier can include the following delimiters:

|Delimiter|Comment|
|---------|-------|
|`' '`| Space|
|`'/'`||
|`'-'`|Dash|
|`':'`||
|`','`||
|`'.'`||
|`'_'`||
|`'['`||
|`']'`||

## Returns

A string with *date* formatted as specified by *format*.

## Examples

The following three examples return differently formatted datetimes.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVFIKVGwVUhJLEktycxN1TAyMDTXNTDUNbJUMLC0MjCwMjDVtOblKijKzCtR4OUqM7RNyy/KTSyJh+tIKdFRr6zU9fXVTUlRiPbwsMrNtSoujlXXBAC5cbYnXQAAAA" target="_blank">Run the query</a>

```kusto
let dt = datetime(2017-01-29 09:00:05);
print 
v1=format_datetime(dt,'yy-MM-dd [HH:mm:ss]')
```

**Output** 

|v1|
|--|
|17-01-29 [09:00:05]|

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVFIKVGwVUhJLEktycxN1TAyMDTXNTDUNbJUMLC0MjCwMjDVtOblKijKzCtR4OUqM7JNyy/KTSyJh+tIKdFRUK8EAl1f3ZQUhWgPq9xcq+LiWHVNAPGQ6QdeAAAA" target="_blank">Run the query</a>

```kusto
let dt = datetime(2017-01-29 09:00:05);
print 
v2=format_datetime(dt, 'yyyy-M-dd [H:mm:ss]')
```

**Output** 

|v2|
|--|
|2017-1-29 [9:00:05]|

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA8tJLVFIKVGwVUhJLEktycxN1TAyMDTXNTDUNbJUMLC0MjCwMjDVtOblKijKzCtR4OUqM7ZNyy/KTSyJh+tIKdFRUK+s1PX11U1JUYjOyLDKzbUqLlYoKYlV1wQA0Nc3NmEAAAA" target="_blank">Run the query</a>

```kusto
let dt = datetime(2017-01-29 09:00:05);
print 
v3=format_datetime(dt, 'yy-MM-dd [hh:mm:ss tt]')
```

**Output** 

|v3|
|--|
|17-01-29 [09:00:05 AM]|

## Related content

* To convert from UTC to local, see [datetime_utc_to_local()](datetime-utc-to-local-function.md)
* To convert a datetime from local to UTC, see [datetime_local_to_utc()](datetime-local-to-utc-function.md)
