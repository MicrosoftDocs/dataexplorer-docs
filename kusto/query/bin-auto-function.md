---
title:  bin_auto()
description: Learn how to use the bin_auto() function to round values down to a fixed-size bin. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# bin_auto()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Rounds values down to a fixed-size bin, with control over the bin size and starting point provided by a query property.

## Syntax

`bin_auto` `(`*value*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | int, long, real, timespan, or datetime |  :heavy_check_mark: |  The value to round into bins. |

To control the bin size and starting point, set the following parameters before using the function.

| Name | Type | Required | Description |
|--|--|--|--|
| *query_bin_auto_size* | int, long, real, or timespan |  :heavy_check_mark: |  Indicates the size of each bin.|
| *query_bin_auto_at* | int, long, real, or timespan | |  Indicates one value of *value* which is a "fixed point" for which `bin_auto(fixed_point)` == `fixed_point`. Default is 0.|

## Returns

The nearest multiple of `query_bin_auto_size` below *value*, shifted so that `query_bin_auto_at`
will be translated into itself.

## Examples

```kusto
set query_bin_auto_size=1h;
set query_bin_auto_at=datetime(2017-01-01 00:05);
range Timestamp from datetime(2017-01-01 00:05) to datetime(2017-01-01 02:00) step 1m
| summarize count() by bin_auto(Timestamp)
```

**Output**

|Timestamp                    | count_|
|-----------------------------|-------|
|2017-01-01 00:05:00.0000000  | 60    |
|2017-01-01 01:05:00.0000000  | 56    |
