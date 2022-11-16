---
title: bin_auto() - Azure Data Explorer
description: This article describes bin_auto() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/10/2022
---
# bin_auto()

Rounds values down to a fixed-size bin, with control over the bin size and starting point provided by a query property.

## Syntax

`bin_auto` `(`*Expression*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *Expression* | int, long, real, timespan, or datetime | &check; |  The value to round into bins. |

To control the bin size and starting point, set the following parameters before using the function.

| Name | Type | Required | Description |
|--|--|--|--|
| *query_bin_auto_size* | int, long, real, or timespan | &check; |  Indicates the size of each bin.|
| *query_bin_auto_at* | int, long, real, or timespan | |  A value of *Expression* that is a fixed point, such that `bin_auto(fixed_point)` == `fixed_point`. The default value is 0.|

## Returns

The nearest multiple of `query_bin_auto_size` below *Expression*, shifted so that `query_bin_auto_at`
will be translated into itself.

## Examples

```kusto
set query_bin_auto_size=1h;
set query_bin_auto_at=datetime(2017-01-01 00:05);
range Timestamp from datetime(2017-01-01 00:05) to datetime(2017-01-01 02:00) step 1m
| summarize count() by bin_auto(Timestamp)
```

|Timestamp                    | count_|
|-----------------------------|-------|
|2017-01-01 00:05:00.0000000  | 60    |
|2017-01-01 01:05:00.0000000  | 56    |
