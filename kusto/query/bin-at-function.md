---
title:  bin_at()
description: Learn how to use the bin_at() function to round values down to a fixed-size bin. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 04/15/2024
---
# bin_at()

Returns the value rounded down to the nearest bin size, which is aligned to a fixed reference point.

In contrast to the [bin()](bin-function.md) function, where the point of alignment is predefined, bin_at() allows you to define a fixed point for alignment. Results can align before or after the fixed point.

## Syntax

`bin_at` `(`*value*`,`*bin_size*`,`*fixed_point*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | `int`, `long`, `real`, `timespan`, or `datetime` |  :heavy_check_mark: | The value to round. |
| *bin_size* | `int`, `long`, `real`, or `timespan` |  :heavy_check_mark: | The size of each bin. |
| *fixed_point* | `int`, `long`, `real`, `timespan`, or `datetime` |  :heavy_check_mark: | A constant of the same type as *value*, which is used as a fixed reference point.|

> [!NOTE]
> If *value* is a `timespan` or `datetime`, then the *bin_size* must be a `timespan`.

## Returns

The nearest multiple of *bin_size* below the given *value* that aligns to the specified *fixed_point*.

## Examples

In the following example, *value* is rounded down to the nearest *bin_size* that aligns to the *fixed_point*.
  
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUjKzItPLNEw0zPVUTACEeaaALSGJjMZAAAA" target="_blank">Run the query</a>

```kusto
print bin_at(6.5, 2.5, 7)
```

**Output**

|print_0|
|-------|
| 4.5 |

In the following example, the time interval is binned into daily bins aligned to a 12 hour fixed point. The return value is -12 since a daily bin aligned to 12 hours rounds down to 12 on the previous day.
  
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUjKzItPLNEoycxN1TDM0NRRMEwBYqMMTQDWMdZPHwAAAA%3D%3D" target="_blank">Run the query</a>

```kusto
print bin_at(time(1h), 1d, 12h)
```

**Output**

|print_0|
|-------|
| -12:00:00 |

In the following example, daily bins align to noon.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUjKzItPLNFISSxJLcnMTdUwMjA01zUw1TU0VTA0sDIysDIw0DPQ1FEwTNFRgCsytDQ30DUwBCIFQyOgCogiTQA0H6zaUgAAAA%3D%3D" target="_blank">Run the query</a>

```kusto
print bin_at(datetime(2017-05-15 10:20:00.0), 1d, datetime(1970-01-01 12:00:00.0))
```

**Output**

|print_0|
|-------|
| 2017-05-14T12:00:00Z |

In the following example, bins are weekly and align to the start of Sunday June 6, 2017. The example returns a bin aligned to Sundays.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUjKzItPLNFISSxJLcnMTdUwMjA01zUw1TU0VzA0sDIysDIw0DPQ1FEwT9FRQFNkpmtgomAAUgFRpAkAjzZv9FIAAAA%3D" target="_blank">Run the query</a>

```kusto
print bin_at(datetime(2017-05-17 10:20:00.0), 7d, datetime(2017-06-04 00:00:00.0))
```

**Output**

|print_0|
|-------|
| 2017-05-14T00:00:00Z |

In the following example, the total number of events are grouped into daily bins aligned to the *fixed_point* date and time. The *fixed_point* value is included in one of the returned bins.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0tJLAHCpJxUDZfEklSrFCBRkpmbqqPgV5prlZlXohnNywUT1DAyMLTQNTDSNTIJMTS1MjTR1DHWwSZtHGJoBpY2wSptBtNtGsvLVaNQXJqbm1iUWZUKYmkA7dVUSKpUSMrMi08sAbtKR8EwRUcBiysUwOZYGRjoGUCApiYAxLxe/tAAAAA=" target="_blank">Run the query</a>

```kusto
datatable(Date:datetime, NumOfEvents:int)[
datetime(2018-02-24T15:14),3,
datetime(2018-02-24T15:24),4,
datetime(2018-02-23T16:14),4,
datetime(2018-02-23T17:29),4,
datetime(2018-02-26T15:14),5]
| summarize TotalEvents=sum(NumOfEvents) by bin_at(Date, 1d, datetime(2018-02-24 15:14:00.0000000)) 
```

**Output**

|Date|TotalEvents|
|---|---|
| 2018-02-23T15:14:00Z|8|
| 2018-02-24T15:14:00Z |7|
| 2018-02-26T15:14:00Z |5|

## Related content

* [`bin()`](./bin-function.md)
