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

## Get more from your data by using Kusto with machine learning

Many interesting use cases use machine learning algorithms and derive interesting insights from telemetry data. Often, these algorithms require a strictly structured dataset as their input. The raw log data usually doesn't match the required structure and size.

Start by looking for anomalies in the error rate of a specific Bing inferences service. The logs table has 65 billion records. The following basic query filters 250,000 errors, and then creates a time series of error count that uses the anomaly detection function [series_decompose_anomalies](series-decompose-anomaliesfunction.md). The anomalies are detected by the Kusto service and are highlighted as red dots on the time series chart.

```kusto
Logs
| where Timestamp >= datetime(2015-08-22) and Timestamp < datetime(2015-08-23)
| where Level == "e" and Service == "Inferences.UnusualEvents_Main"
| summarize count() by bin(Timestamp, 5min)
| render anomalychart
```

The service identified few time buckets that had suspicious error rates. Use Kusto to zoom into this timeframe. Then, run a query that aggregates on the `Message` column. Try to find the top errors.

The relevant parts of the entire stack trace of the message are trimmed out, so the results fit better on the page.

You can see successful identification of the top eight errors. However, next is a long series of errors, because the error message was created by using a format string that contained changing data:

```kusto
Logs
| where Timestamp >= datetime(2015-08-22 05:00) and Timestamp < datetime(2015-08-22 06:00)
| where Level == "e" and Service == "Inferences.UnusualEvents_Main"
| summarize count() by Message
| top 10 by count_
| project count_, Message
```

**Output**

|count_|Message
|---|---
|7125|ExecuteAlgorithmMethod for method 'RunCycleFromInterimData' has failed...
|7125|InferenceHostService call failed..System.NullReferenceException: Object reference not set to an instance of an object...
|7124|Unexpected Inference System error..System.NullReferenceException: Object reference not set to an instance of an object...
|5112|Unexpected Inference System error..System.NullReferenceException: Object reference not set to an instance of an object..
|174|InferenceHostService call failed..System.ServiceModel.CommunicationException: There was an error writing to the pipe:...
|10|ExecuteAlgorithmMethod for method 'RunCycleFromInterimData' has failed...
|10|Inference System error..Microsoft.Bing.Platform.Inferences.Service.Managers.UserInterimDataManagerException:...
|3|InferenceHostService call failed..System.ServiceModel.CommunicationObjectFaultedException:...
|1|Inference System error... SocialGraph.BOSS.OperationResponse...AIS TraceId:8292FC561AC64BED8FA243808FE74EFD...
|1|Inference System error... SocialGraph.BOSS.OperationResponse...AIS TraceId: 5F79F7587FF943EC9B641E02E701AFBF...

At this point, using the `reduce` operator helps. The operator identified 63 different errors that originated at the same trace instrumentation point in the code. `reduce` helps focus on additional meaningful error traces in that time window.

```kusto
Logs
| where Timestamp >= datetime(2015-08-22 05:00) and Timestamp < datetime(2015-08-22 06:00)
| where Level == "e" and Service == "Inferences.UnusualEvents_Main"
| reduce by Message with threshold=0.35
| project Count, Pattern
```

**Output**

|Count|Pattern
|---|---
|7125|ExecuteAlgorithmMethod for method 'RunCycleFromInterimData' has failed...
|  7125|InferenceHostService call failed..System.NullReferenceException: Object reference not set to an instance of an object...
|  7124|Unexpected Inference System error..System.NullReferenceException: Object reference not set to an instance of an object...
|  5112|Unexpected Inference System error..System.NullReferenceException: Object reference not set to an instance of an object...
|  174|InferenceHostService call failed..System.ServiceModel.CommunicationException: There was an error writing to the pipe:...
|  63|Inference System error..Microsoft.Bing.Platform.Inferences.\*: Write \* to write to the Object BOSS.\*: SocialGraph.BOSS.Reques...
|  10|ExecuteAlgorithmMethod for method 'RunCycleFromInterimData' has failed...
|  10|Inference System error..Microsoft.Bing.Platform.Inferences.Service.Managers.UserInterimDataManagerException:...
|  3|InferenceHostService call failed..System.ServiceModel.\*: The object, System.ServiceModel.Channels.\*+\*, for \*\* is the \*... at Syst...

Now, you have a good view into the top errors that contributed to the detected anomalies.

To understand the effect of these errors across the sample system, consider that:

* The `Logs` table contains additional dimensional data, like `Component` and `Cluster`.
* The new autocluster plugin can help derive component and cluster insight with a simple query.

In the following example, you can clearly see that each of the top four errors is specific to a component. Also, although the top three errors are specific to the DB4 cluster, the fourth error happens across all clusters.

```kusto
Logs
| where Timestamp >= datetime(2015-08-22 05:00) and Timestamp < datetime(2015-08-22 06:00)
| where Level == "e" and Service == "Inferences.UnusualEvents_Main"
| evaluate autocluster()
```

**Output**

|Count |Percentage (%)|Component|Cluster|Message
|---|---|---|---|---
|7125|26.64|InferenceHostService|DB4|ExecuteAlgorithmMethod for method...
|7125|26.64|Unknown Component|DB4|InferenceHostService call failed...
|7124|26.64|InferenceAlgorithmExecutor|DB4|Unexpected Inference System error...
|5112|19.11|InferenceAlgorithmExecutor|*|Unexpected Inference System error...

## Map values from one set to another

A common query use case is static mapping of values. Static mapping can help make results more presentable.

For example, in the next table, `DeviceModel` specifies a device model. Using the device model isn't a convenient form of referencing the device name. 

|DeviceModel |Count
|---|---
|iPhone5,1 |32
|iPhone3,2 |432
|iPhone7,2 |55
|iPhone5,2 |66

 Using a friendly name is more convenient:

|FriendlyName |Count
|---|---
|iPhone 5 |32
|iPhone 4 |432
|iPhone 6 |55
|iPhone5 |66

The next two examples demonstrate how to change from using a device model to a friendly name to identify a device. 

### Map by using a dynamic dictionary

You can achieve mapping by using a dynamic dictionary and dynamic accessors. For example:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
// Dataset definition
let Source = datatable(DeviceModel:string, Count:long)
[
  'iPhone5,1', 32,
  'iPhone3,2', 432,
  'iPhone7,2', 55,
  'iPhone5,2', 66,
];
// Query start here
let phone_mapping = dynamic(
  {
    "iPhone5,1" : "iPhone 5",
    "iPhone3,2" : "iPhone 4",
    "iPhone7,2" : "iPhone 6",
    "iPhone5,2" : "iPhone5"
  });
Source
| project FriendlyName = phone_mapping[DeviceModel], Count
```

**Output**

|FriendlyName|Count|
|---|---|
|iPhone 5|32|
|iPhone 4|432|
|iPhone 6|55|
|iPhone5|66|

### Map by using a static table

You also can achieve mapping by using a persistent table and a `join` operator.

1. Create the mapping table only once:

    ```kusto
    .create table Devices (DeviceModel: string, FriendlyName: string)

    .ingest inline into table Devices
        ["iPhone5,1","iPhone 5"]["iPhone3,2","iPhone 4"]["iPhone7,2","iPhone 6"]["iPhone5,2","iPhone5"]
    ```

1. Create a table of the device contents:

    |DeviceModel |FriendlyName
    |---|---
    |iPhone5,1 |iPhone 5
    |iPhone3,2 |iPhone 4
    |iPhone7,2 |iPhone 6
    |iPhone5,2 |iPhone5

1. Create a test table source:

    ```kusto
    .create table Source (DeviceModel: string, Count: int)

    .ingest inline into table Source ["iPhone5,1",32]["iPhone3,2",432]["iPhone7,2",55]["iPhone5,2",66]
    ```

1. Join the tables and run the project:

   ```kusto
   Devices
   | join (Source) on DeviceModel
   | project FriendlyName, Count
   ```

Here's the output:

|FriendlyName |Count
|---|---
|iPhone 5 |32
|iPhone 4 |432
|iPhone 6 |55
|iPhone5 |66

## Create and use query-time dimension tables

Often, you'll want to join the results of a query with an ad-hoc dimension table that isn't stored in the database. You can define an expression whose result is a table scoped to a single query.

For example:

<!-- csl: https://help.kusto.windows.net/Samples -->
```kusto
// Create a query-time dimension table using datatable
let DimTable = datatable(EventType:string, Code:string)
  [
    "Heavy Rain", "HR",
    "Tornado",    "T"
  ]
;
DimTable
| join StormEvents on EventType
| summarize count() by Code
```

Here's a slightly more complex example:

```kusto
// Create a query-time dimension table using datatable
let TeamFoundationJobResult = datatable(Result:int, ResultString:string)
  [
    -1, 'None', 0, 'Succeeded', 1, 'PartiallySucceeded', 2, 'Failed',
    3, 'Stopped', 4, 'Killed', 5, 'Blocked', 6, 'ExtensionNotFound',
    7, 'Inactive', 8, 'Disabled', 9, 'JobInitializationError'
  ]
;
JobHistory
  | where PreciseTimeStamp > ago(1h)
  | where Service  != "AX"
  | where Plugin has "Analytics"
  | sort by PreciseTimeStamp desc
  | join kind=leftouter TeamFoundationJobResult on Result
  | extend ExecutionTimeSpan = totimespan(ExecutionTime)
  | project JobName, StartTime, ExecutionTimeSpan, ResultString, ResultMessage
```

## Retrieve the latest records (by timestamp) per identity

Suppose you have a table that includes:

* An `ID` column that identifies the entity with which each row is associated, such as a user ID or a node ID
* A `timestamp` column that provides the time reference for the row
* Other columns

You can use the [top-nested operator](topnestedoperator.md) to make a query that returns the latest two records for each value of the `ID` column, where *latest* is defined as having the highest value of `timestamp`:

```kusto
datatable(id:string, timestamp:datetime, bla:string)           // #1
  [
  "Barak",  datetime(2015-01-01), "1",
  "Barak",  datetime(2016-01-01), "2",
  "Barak",  datetime(2017-01-20), "3",
  "Donald", datetime(2017-01-20), "4",
  "Donald", datetime(2017-01-18), "5",
  "Donald", datetime(2017-01-19), "6"
  ]
| top-nested   of id        by dummy0=max(1),                  // #2
  top-nested 2 of timestamp by dummy1=max(timestamp),          // #3
  top-nested   of bla       by dummy2=max(1)                   // #4
| project-away dummy0, dummy1, dummy2                          // #5
```

Here's a step-by-step explanation of the preceding query (the numbering refers to the numbers in the code comments):

1. The `datatable` is a way to produce some test data for demonstration purposes. Normally, you'd use real data here.
1. This line essentially means _return all distinct values of `id`_.
1. This line then returns, for the top two records that maximize:
     * The `timestamp` column
     * The columns of the preceding level (here, just `id`)
     * The column specified at this level (here, `timestamp`)
1. This line adds the values of the `bla` column for each of the records returned by the preceding level. If the table has other columns you're interested in, you can repeat this line for each of those columns.
1. The final line uses the [project-away operator](projectawayoperator.md) to remove the "extra" columns that are introduced by `top-nested`.

## Extend a table by a percentage of the total calculation

A tabular expression that includes a numeric column is more useful to the user when it's accompanied by its value as a percentage of the total.

For example, assume that a query produces the following table:

|SomeSeries|SomeInt|
|----------|-------|
|Apple       |    100|
|Banana       |    200|

You want to show the table like this:

|SomeSeries|SomeInt|Pct |
|----------|-------|----|
|Apple       |    100|33.3|
|Banana       |    200|66.6|

To change the way the table appears, calculate the total (sum) of the `SomeInt` column, and then divide each value of this column by the total. For arbitrary results, use the [as operator](asoperator.md).

For example:

```kusto
// The following table literally represents a long calculation
// that ends up with an anonymous tabular value:
datatable (SomeInt:int, SomeSeries:string) [
  100, "Apple",
  200, "Banana",
]
// We now give this calculation a name ("X"):
| as X
// Having this name we can refer to it in the sub-expression
// "X | summarize sum(SomeInt)":
| extend Pct = 100 * bin(todouble(SomeInt) / toscalar(X | summarize sum(SomeInt)), 0.001)
```

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

## Find the preceding event

The next example demonstrates how to find a preceding event between two datasets.

You have two datasets, A and B. For each record in dataset B, find its preceding event in dataset A (that is, the `arg_max` record in A that is still _older_ than B).

Here are the sample datasets:

```kusto
let A = datatable(Timestamp:datetime, ID:string, EventA:string)
[
    datetime(2019-01-01 00:00:00), "x", "Ax1",
    datetime(2019-01-01 00:00:01), "x", "Ax2",
    datetime(2019-01-01 00:00:02), "y", "Ay1",
    datetime(2019-01-01 00:00:05), "y", "Ay2",
    datetime(2019-01-01 00:00:00), "z", "Az1"
];
let B = datatable(Timestamp:datetime, ID:string, EventB:string)
[
    datetime(2019-01-01 00:00:03), "x", "B",
    datetime(2019-01-01 00:00:04), "x", "B",
    datetime(2019-01-01 00:00:04), "y", "B",
    datetime(2019-01-01 00:02:00), "z", "B"
];
A; B
```

**Output**

|Timestamp|ID|EventB|
|---|---|---|
|2019-01-01 00:00:00.0000000|x|Ax1|
|2019-01-01 00:00:00.0000000|z|Az1|
|2019-01-01 00:00:01.0000000|x|Ax2|
|2019-01-01 00:00:02.0000000|y|Ay1|
|2019-01-01 00:00:05.0000000|y|Ay2|

</br>

|Timestamp|ID|EventA|
|---|---|---|
|2019-01-01 00:00:03.0000000|x|B|
|2019-01-01 00:00:04.0000000|x|B|
|2019-01-01 00:00:04.0000000|y|B|
|2019-01-01 00:02:00.0000000|z|B|

Expected output:

|ID|Timestamp|EventB|A_Timestamp|EventA|
|---|---|---|---|---|
|x|2019-01-01 00:00:03.0000000|B|2019-01-01 00:00:01.0000000|Ax2|
|x|2019-01-01 00:00:04.0000000|B|2019-01-01 00:00:01.0000000|Ax2|
|y|2019-01-01 00:00:04.0000000|B|2019-01-01 00:00:02.0000000|Ay1|
|z|2019-01-01 00:02:00.0000000|B|2019-01-01 00:00:00.0000000|Az1|

We recommend two different approaches for this problem. You can test both on your specific dataset to find the one that is most suitable for your scenario.

> [!NOTE]
> Each approach might run differently on different datasets.

### Approach 1

This approach serializes both datasets by ID and timestamp. Then, it groups all events in dataset B with all their preceding events in dataset A. Finally, it picks the `arg_max` out of all the events in dataset A in the group.

```kusto
A
| extend A_Timestamp = Timestamp, Kind="A"
| union (B | extend B_Timestamp = Timestamp, Kind="B")
| order by ID, Timestamp asc
| extend t = iff(Kind == "A" and (prev(Kind) != "A" or prev(Id) != ID), 1, 0)
| extend t = row_cumsum(t)
| summarize Timestamp=make_list(Timestamp), EventB=make_list(EventB), arg_max(A_Timestamp, EventA) by t, ID
| mv-expand Timestamp to typeof(datetime), EventB to typeof(string)
| where isnotempty(EventB)
| project-away t
```

### Approach 2

This approach to solving the problem requires a maximum lookback period. The approach looks at how much _older_ the record in dataset A might be compared to dataset B. The method then joins the two datasets based on ID and this lookback period.

The `join` produces all possible candidates, all dataset A records that are older than records in dataset B and within the lookback period. Then, the closest one to dataset B is filtered by `arg_min (TimestampB - TimestampA)`. The shorter the lookback period is, the better the query results will be.

In the following example, the lookback period is set to `1m`. The record with ID `z` doesn't have a corresponding `A` event because its `A` event is older by two minutes.

```kusto
let _maxLookbackPeriod = 1m;
let _internalWindowBin = _maxLookbackPeriod / 2;
let B_events = B
    | extend ID = new_guid()
    | extend _time = bin(Timestamp, _internalWindowBin)
    | extend _range = range(_time - _internalWindowBin, _time + _maxLookbackPeriod, _internalWindowBin)
    | mv-expand _range to typeof(datetime)
    | extend B_Timestamp = Timestamp, _range;
let A_events = A
    | extend _time = bin(Timestamp, _internalWindowBin)
    | extend _range = range(_time - _internalWindowBin, _time + _maxLookbackPeriod, _internalWindowBin)
    | mv-expand _range to typeof(datetime)
    | extend A_Timestamp = Timestamp, _range;
B_events
    | join kind=leftouter (
        A_events
) on ID, _range
| where isnull(A_Timestamp) or (A_Timestamp <= B_Timestamp and B_Timestamp <= A_Timestamp + _maxLookbackPeriod)
| extend diff = coalesce(B_Timestamp - A_Timestamp, _maxLookbackPeriod*2)
| summarize arg_min(diff, *) by ID
| project ID, B_Timestamp, A_Timestamp, EventB, EventA
```

**Output**

|ID|B_Timestamp|A_Timestamp|EventB|EventA|
|---|---|---|---|---|
|x|2019-01-01 00:00:03.0000000|2019-01-01 00:00:01.0000000|B|Ax2|
|x|2019-01-01 00:00:04.0000000|2019-01-01 00:00:01.0000000|B|Ax2|
|y|2019-01-01 00:00:04.0000000|2019-01-01 00:00:02.0000000|B|Ay1|
|z|2019-01-01 00:02:00.0000000||B||

## Next steps

Walk through a [a tutorial on the Kusto Query Language](/azure/data-explorer/kusto/query/tutorials/learn-common-operators?pivots=azuredataexplorer).

::: zone-end