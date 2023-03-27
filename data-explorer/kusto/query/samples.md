---
title: Samples for Kusto Queries - Azure Data Explorer
description: Learn how to use Kusto Query Language to accomplish specific scenarios.
ms.reviewer: alexans
ms.topic: reference
ms.date: 03/27/2023
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors
---

# Samples for Kusto Queries

::: zone pivot="azuredataexplorer"

This article identifies common queries and how you can use the Kusto Query Language to meet them.

## Perform aggregations over a sliding window

The following example shows how to summarize columns by using a sliding window. For the query, use the following table, which contains prices of fruits by timestamps.

Calculate the minimum, maximum, and sum costs of each fruit per day by using a sliding window of seven days. Each record in the result set aggregates the preceding seven days, and the results contain a record per day in the analysis period.

Fruit table:

|Timestamp|Fruit|Price|
|---|---|---|
|2018-09-24 21:00:00.0000000|Bananas|3|
|2018-09-25 20:00:00.0000000|Apples|9|
|2018-09-26 03:00:00.0000000|Bananas|4|
|2018-09-27 10:00:00.0000000|Plums|8|
|2018-09-28 07:00:00.0000000|Bananas|6|
|2018-09-29 21:00:00.0000000|Bananas|8|
|2018-09-30 01:00:00.0000000|Plums|2|
|2018-10-01 05:00:00.0000000|Bananas|0|
|2018-10-02 02:00:00.0000000|Bananas|0|
|2018-10-03 13:00:00.0000000|Plums|4|
|2018-10-04 14:00:00.0000000|Apples|8|
|2018-10-05 05:00:00.0000000|Bananas|2|
|2018-10-06 08:00:00.0000000|Plums|8|
|2018-10-07 12:00:00.0000000|Bananas|0|

Here's the sliding window aggregation query. See the explanation after the query result.

```kusto
let _start = datetime(2018-09-24);
let _end = _start + 13d;
Fruits
| extend _bin = bin_at(Timestamp, 1d, _start) // #1
| extend _endRange = iff(_bin + 7d > _end, _end,
                            iff( _bin + 7d - 1d < _start, _start,
                                iff( _bin + 7d - 1d < _bin, _bin,  _bin + 7d - 1d)))  // #2
| extend _range = range(_bin, _endRange, 1d) // #3
| mv-expand _range to typeof(datetime) take 1000000 // #4
| summarize min(Price), max(Price), sum(Price) by Timestamp=bin_at(_range, 1d, _start) ,  Fruit // #5
| where Timestamp >= _start + 7d; // #6

```

Here's the output:

|Timestamp|Fruit|min_Price|max_Price|sum_Price|
|---|---|---|---|---|
|2018-10-01 00:00:00.0000000|Apples|9|9|9|
|2018-10-01 00:00:00.0000000|Bananas|0|8|18|
|2018-10-01 00:00:00.0000000|Plums|2|8|10|
|2018-10-02 00:00:00.0000000|Bananas|0|8|18|
|2018-10-02 00:00:00.0000000|Plums|2|8|10|
|2018-10-03 00:00:00.0000000|Plums|2|8|14|
|2018-10-03 00:00:00.0000000|Bananas|0|8|14|
|2018-10-04 00:00:00.0000000|Bananas|0|8|14|
|2018-10-04 00:00:00.0000000|Plums|2|4|6|
|2018-10-04 00:00:00.0000000|Apples|8|8|8|
|2018-10-05 00:00:00.0000000|Bananas|0|8|10|
|2018-10-05 00:00:00.0000000|Plums|2|4|6|
|2018-10-05 00:00:00.0000000|Apples|8|8|8|
|2018-10-06 00:00:00.0000000|Plums|2|8|14|
|2018-10-06 00:00:00.0000000|Bananas|0|2|2|
|2018-10-06 00:00:00.0000000|Apples|8|8|8|
|2018-10-07 00:00:00.0000000|Bananas|0|2|2|
|2018-10-07 00:00:00.0000000|Plums|4|8|12|
|2018-10-07 00:00:00.0000000|Apples|8|8|8|

The query "stretches" (duplicates) each record in the input table throughout the seven days after its actual appearance. Each record actually appears seven times. As a result, the daily aggregation includes all records of the preceding seven days.

Here's a step-by-step explanation of the preceding query:

1. Bin each record to one day (relative to `_start`).
1. Determine the end of the range per record: `_bin + 7d`, unless the value is out of the range of `_start` and `_end`, in which case, it's adjusted.
1. For each record, create an array of seven days (timestamps), starting at the current record's day.
1. `mv-expand` the array, thus duplicating each record to seven records, one day apart from each other.
1. Perform the aggregation function for each day. Due to #4, this step actually summarizes the _past_ seven days.
1. The data for the first seven days is incomplete because there's no seven-day lookback period for the first seven days. The first seven days are excluded from the final result. In the example, they participate only in the aggregation for 2018-10-01.
