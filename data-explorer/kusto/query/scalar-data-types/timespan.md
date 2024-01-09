---
title:  The timespan data type
description: This article describes The timespan data type in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 01/08/2024
---
# The timespan data type

The `timespan` data type represents a time interval.

> The `timespan` and `time` data types are equivalent.

## `timespan` literals

To specify a `timespan` literal, use one of the following syntax options:

| Syntax | Description | Example | Length of time |
|--|--|--|--|
| *n*`d` | A timespan represented by one or more digits followed by `d` for days. | `2d` | 2 days |
| *n*`h` | A timespan represented by one or more digits followed by `h` for hours. | `1.5h` | 1.5 hours |
| *n*`m` | A timespan represented by one or more digits followed by `m` for minutes. | `30m` | 30 minutes |
| *n*`s` | A timespan represented by one or more digits followed by `s` for seconds. | `10s` | 10 seconds |
| *n*`ms` | A timespan represented by one or more digits followed by `ms` for milliseconds. | `100ms` | 100 milliseconds |
| *n*`microsecond` | A timespan represented by one or more digits followed by `microsecond`. | `10microsecond` | 10 microseconds |
| *n*`tick` | A timespan represented by one or more digits followed by `tick` to indicate nanoseconds. | `1tick` | 100 ns |
| `timespan(`*n* `seconds)` | A timespan in seconds. | `timespan(15 seconds)` | 15 seconds |
| `timespan(`*n*`)` | A timespan in days. | `timespan(2)` | 2 days |
| `timespan(`*days*`.`*hours*`:`*minutes*`:`*seconds*`.`*milliseconds*`)` | A timespan in days, hours, minutes, and seconds passed.| `timespan(0.12:34:56.7)` | `0d+12h+34m+56.7s` |
| `timespan(null)` | Represents the [null value](null-values.md). | | |

## `timespan` operators

Two values of type `timespan` may be added, subtracted, and divided.
The last operation returns a value of type `real` representing the
fractional number of times one value can fit the other.

## Examples

The following example calculates how many seconds are in a day in several ways:

```kusto
print
    result1 = 1d / 1s,
    result2 = time(1d) / time(1s),
    result3 = 24 * 60 * time(00:01:00) / time(1s)
```

This example converts the number of seconds in a day (represented by an integer value) to a timespan unit:

```kusto
print 
    seconds = 86400
| extend t = seconds * 1s
```

## Related content

* [totimespan()](../../query/totimespanfunction.md)
