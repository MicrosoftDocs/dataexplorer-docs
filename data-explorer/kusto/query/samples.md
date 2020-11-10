---
title: Samples - Azure Data Explorer
description: This article describes Samples in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: alexans
ms.service: data-explorer
ms.topic: reference
ms.date: 10/08/2020
zone_pivot_group_filename: data-explorer/zone-pivot-groups.json
zone_pivot_groups: kql-flavors
---
# Samples

::: zone pivot="azuredataexplorer"

Below are a few common query needs and how the Kusto query language can be used
to meet them.

## Display a column chart

Project two or more columns and use them as the x and y axis of a chart.

<!-- csl: https://help.kusto.windows.net/Samples  -->
```kusto 
StormEvents
| where isnotempty(EndLocation) 
| summarize event_count=count() by EndLocation
| top 10 by event_count
| render columnchart
```

* The first column forms the x-axis. It can be numeric, datetime, or string. 
* Use `where`, `summarize`, and `top` to limit the volume of data that you display.
* Sort the results to define the order of the x-axis.

:::image type="content" source="images/samples/060.png" alt-text="Screenshot of a column chart. The y-axis ranges from 0 to around 50. Ten colored columns depict the respective values of 10 locations.":::

## Get sessions from start and stop events

Suppose you have a log of events. Some events mark the start or end of an extended activity or session. 

|Name|City|SessionId|Timestamp|
|---|---|---|---|
|Start|London|2817330|2015-12-09T10:12:02.32|
|Game|London|2817330|2015-12-09T10:12:52.45|
|Start|Manchester|4267667|2015-12-09T10:14:02.23|
|Stop|London|2817330|2015-12-09T10:23:43.18|
|Cancel|Manchester|4267667|2015-12-09T10:27:26.29|
|Stop|Manchester|4267667|2015-12-09T10:28:31.72|

Every event has a SessionId. The problem is to match up the start and stop events with the same ID.

```kusto
let Events = MyLogTable | where ... ;

Events
| where Name == "Start"
| project Name, City, SessionId, StartTime=timestamp
| join (Events 
        | where Name="Stop"
        | project StopTime=timestamp, SessionId) 
    on SessionId
| project City, SessionId, StartTime, StopTime, Duration = StopTime - StartTime
```

1. Use [`let`](./letstatement.md) to name a projection of the table that is pared down as far as possible before going into the join.
1. Use [`Project`](./projectoperator.md) to change the names of the timestamps so that both the start and stop times can appear in the result. 
   It also selects the other columns to see in the result. 
1. Use [`join`](./joinoperator.md) to match up the start and stop entries for the same activity, creating a row for each activity. 
1. Finally, `project` again adds a column to show the duration of the activity.


|City|SessionId|StartTime|StopTime|Duration|
|---|---|---|---|---|
|London|2817330|2015-12-09T10:12:02.32|2015-12-09T10:23:43.18|00:11:40.46|
|Manchester|4267667|2015-12-09T10:14:02.23|2015-12-09T10:28:31.72|00:14:29.49|

### Get sessions, without session ID

Suppose that the start and stop events don't conveniently have a session ID that we can match with. But we do have an IP address of the client where the session took place. Assuming each client address only conducts one session at a time, we can match each start event to the next stop event from the same IP address.

```kusto
Events 
| where Name == "Start" 
| project City, ClientIp, StartTime = timestamp
| join  kind=inner
    (Events
    | where Name == "Stop" 
    | project StopTime = timestamp, ClientIp)
    on ClientIp
| extend duration = StopTime - StartTime 
    // Remove matches with earlier stops:
| where  duration > 0  
    // Pick out the earliest stop for each start and client:
| summarize arg_min(duration, *) by bin(StartTime,1s), ClientIp
```

The join will match every start time with all the stop times from the same client IP address. 
1. Remove matches with earlier stop times.
1. Group by start time and IP to get a group for each session. 
1. Supply a `bin` function for the StartTime parameter. If you don't, Kusto will automatically use 1-hour bins that will match some start times with the wrong stop times.

`arg_min` picks out the row with the smallest duration in each group, and the `*` parameter passes through all the other columns. 
The argument prefixes "min_" to each column name. 

:::image type="content" source="images/samples/040.png" alt-text="A table listing the results, with columns for the start time, client I P, duration, city, and earliest stop for each client-start time combination."::: 

Add code to count the durations in conveniently sized bins. 
In this example, because of a preference for a bar chart, divide by `1s` to convert the timespans to numbers. 

```
    // Count the frequency of each duration:
    | summarize count() by duration=bin(min_duration/1s, 10) 
      // Cut off the long tail:
    | where duration < 300
      // Display in a bar chart:
    | sort by duration asc | render barchart 
```

:::image type="content" source="images/samples/050.png" alt-text="Column chart depicting the number of sessions with durations in specified ranges. Over 400 sessions lasted 10 seconds. Less than 100 were 290 seconds.":::

### Real example

```kusto
Logs  
| filter ActivityId == "ActivityId with Blablabla" 
| summarize max(Timestamp), min(Timestamp)  
| extend Duration = max_Timestamp - min_Timestamp 
 
wabitrace  
| filter Timestamp >= datetime(2015-01-12 11:00:00Z)  
| filter Timestamp < datetime(2015-01-12 13:00:00Z)  
| filter EventText like "NotifyHadoopApplicationJobPerformanceCounters"  	 
| extend Tenant = extract("tenantName=([^,]+),", 1, EventText) 
| extend Environment = extract("environmentName=([^,]+),", 1, EventText)  
| extend UnitOfWorkId = extract("unitOfWorkId=([^,]+),", 1, EventText)  
| extend TotalLaunchedMaps = extract("totalLaunchedMaps=([^,]+),", 1, EventText, typeof(real))  
| extend MapsSeconds = extract("mapsMilliseconds=([^,]+),", 1, EventText, typeof(real)) / 1000 
| extend TotalMapsSeconds = MapsSeconds  / TotalLaunchedMaps 
| filter Tenant == 'DevDiv' and Environment == 'RollupDev2'  
| filter TotalLaunchedMaps > 0 
| summarize sum(TotalMapsSeconds) by UnitOfWorkId  
| extend JobMapsSeconds = sum_TotalMapsSeconds * 1 
| project UnitOfWorkId, JobMapsSeconds 
| join ( 
wabitrace  
| filter Timestamp >= datetime(2015-01-12 11:00:00Z)  
| filter Timestamp < datetime(2015-01-12 13:00:00Z)  
| filter EventText like "NotifyHadoopApplicationJobPerformanceCounters"  
| extend Tenant = extract("tenantName=([^,]+),", 1, EventText) 
| extend Environment = extract("environmentName=([^,]+),", 1, EventText)  
| extend UnitOfWorkId = extract("unitOfWorkId=([^,]+),", 1, EventText)   
| extend TotalLaunchedReducers = extract("totalLaunchedReducers=([^,]+),", 1, EventText, typeof(real)) 
| extend ReducesSeconds = extract("reducesMilliseconds=([^,]+)", 1, EventText, typeof(real)) / 1000 
| extend TotalReducesSeconds = ReducesSeconds / TotalLaunchedReducers 
| filter Tenant == 'DevDiv' and Environment == 'RollupDev2'  
| filter TotalLaunchedReducers > 0 
| summarize sum(TotalReducesSeconds) by UnitOfWorkId  
| extend JobReducesSeconds = sum_TotalReducesSeconds * 1 
| project UnitOfWorkId, JobReducesSeconds ) 
on UnitOfWorkId 
| join ( 
wabitrace  
| filter Timestamp >= datetime(2015-01-12 11:00:00Z)  
| filter Timestamp < datetime(2015-01-12 13:00:00Z)  
| filter EventText like "NotifyHadoopApplicationJobPerformanceCounters"  
| extend Tenant = extract("tenantName=([^,]+),", 1, EventText) 
| extend Environment = extract("environmentName=([^,]+),", 1, EventText)  
| extend JobName = extract("jobName=([^,]+),", 1, EventText)  
| extend StepName = extract("stepName=([^,]+),", 1, EventText)  
| extend UnitOfWorkId = extract("unitOfWorkId=([^,]+),", 1, EventText)  
| extend LaunchTime = extract("launchTime=([^,]+),", 1, EventText, typeof(datetime))  
| extend FinishTime = extract("finishTime=([^,]+),", 1, EventText, typeof(datetime)) 
| extend TotalLaunchedMaps = extract("totalLaunchedMaps=([^,]+),", 1, EventText, typeof(real))  
| extend TotalLaunchedReducers = extract("totalLaunchedReducers=([^,]+),", 1, EventText, typeof(real)) 
| extend MapsSeconds = extract("mapsMilliseconds=([^,]+),", 1, EventText, typeof(real)) / 1000 
| extend ReducesSeconds = extract("reducesMilliseconds=([^,]+)", 1, EventText, typeof(real)) / 1000 
| extend TotalMapsSeconds = MapsSeconds  / TotalLaunchedMaps  
| extend TotalReducesSeconds = (ReducesSeconds / TotalLaunchedReducers / ReducesSeconds) * ReducesSeconds  
| extend CalculatedDuration = (TotalMapsSeconds + TotalReducesSeconds) * time(1s) 
| filter Tenant == 'DevDiv' and Environment == 'RollupDev2') 
on UnitOfWorkId 
| extend MapsFactor = TotalMapsSeconds / JobMapsSeconds 
| extend ReducesFactor = TotalReducesSeconds / JobReducesSeconds 
| extend CurrentLoad = 1536 + (768 * TotalLaunchedMaps) + (1536 * TotalLaunchedMaps) 
| extend NormalizedLoad = 1536 + (768 * TotalLaunchedMaps * MapsFactor) + (1536 * TotalLaunchedMaps * ReducesFactor) 
| summarize sum(CurrentLoad), sum(NormalizedLoad) by  JobName  
| extend SaveFactor = sum_NormalizedLoad / sum_CurrentLoad 
```

## Chart concurrent sessions over time

Suppose you have a table of activities with their start and end times. Show a chart over time that displays how many activities are concurrently running at any time.

Here's a sample input, called `X`.

|SessionId | StartTime | StopTime |
|---|---|---|
| a | 10:01:03 | 10:10:08 |
| b | 10:01:29 | 10:03:10 |
| c | 10:03:02 | 10:05:20 |

For a chart in 1-minute bins, create something that, at each 1m interval, there's a count for each running activity.

Here's an intermediate result.

```kusto
X | extend samples = range(bin(StartTime, 1m), StopTime, 1m)
```

`range` generates an array of values at the specified intervals.

|SessionId | StartTime | StopTime  | samples|
|---|---|---|---|
| a | 10:01:33 | 10:06:31 | [10:01:00,10:02:00,...10:06:00]|
| b | 10:02:29 | 10:03:45 | [10:02:00,10:03:00]|
| c | 10:03:12 | 10:04:30 | [10:03:00,10:04:00]|

Instead of keeping those arrays, expand them by using [mv-expand](./mvexpandoperator.md).

```kusto
X | mv-expand samples = range(bin(StartTime, 1m), StopTime , 1m)
```

|SessionId | StartTime | StopTime  | samples|
|---|---|---|---|
| a | 10:01:33 | 10:06:31 | 10:01:00|
| a | 10:01:33 | 10:06:31 | 10:02:00|
| a | 10:01:33 | 10:06:31 | 10:03:00|
| a | 10:01:33 | 10:06:31 | 10:04:00|
| a | 10:01:33 | 10:06:31 | 10:05:00|
| a | 10:01:33 | 10:06:31 | 10:06:00|
| b | 10:02:29 | 10:03:45 | 10:02:00|
| b | 10:02:29 | 10:03:45 | 10:03:00|
| c | 10:03:12 | 10:04:30 | 10:03:00|
| c | 10:03:12 | 10:04:30 | 10:04:00|

Now group these by sample time, counting the occurrences of each activity.

```kusto
X
| mv-expand samples = range(bin(StartTime, 1m), StopTime , 1m)
| summarize count(SessionId) by bin(todatetime(samples),1m)
```

* Use todatetime() because [mv-expand](./mvexpandoperator.md) yields a column of dynamic type.
* Use bin() because, for numeric values and dates, summarize always applies a bin function with a default interval if you don't supply one. 


| count_SessionId | samples|
|---|---|
| 1 | 10:01:00|
| 2 | 10:02:00|
| 3 | 10:03:00|
| 2 | 10:04:00|
| 1 | 10:05:00|
| 1 | 10:06:00|

The results can be rendered as a bar chart or time chart.

## Introduce null bins into summarize

When the `summarize` operator is applied over a group key that consists of a
`datetime` column, "bin" those values to fixed-width bins.

```kusto
let StartTime=ago(12h);
let StopTime=now()
T
| where Timestamp > StartTime and Timestamp <= StopTime 
| where ...
| summarize Count=count() by bin(Timestamp, 5m)
```

The above example produces a table with a single row per group of rows in `T`
that fall into each bin of five minutes. What it doesn't do is add "null bins" --
rows for time bin values between `StartTime` and `StopTime` for which there's
no corresponding row in `T`. 

It's desirable to "pad" the table with those bins. Here's one way to do it.

```kusto
let StartTime=ago(12h);
let StopTime=now()
T
| where Timestamp > StartTime and Timestamp <= StopTime 
| summarize Count=count() by bin(Timestamp, 5m)
| where ...
| union ( // 1
  range x from 1 to 1 step 1 // 2
  | mv-expand Timestamp=range(StartTime, StopTime, 5m) to typeof(datetime) // 3
  | extend Count=0 // 4
  )
| summarize Count=sum(Count) by bin(Timestamp, 5m) // 5 
```

Here's a step-by-step explanation of the above query: 

1. The `union` operator lets you add additional rows to a table. Those
   rows are produced by the `union` expression.
1. The `range` operator produces a table having a single row/column.
   The table is not used for anything other than for `mv-expand` to work on.
1. The `mv-expand` operator over the `range` function creates as many
   rows as there are 5-minute bins between `StartTime` and `EndTime`.
1. Use a `Count` of `0`.
1. The `summarize` operator groups together bins from the original
   (left, or outer) argument to `union`. The operator also bins from the inner argument to it
   (the null bin rows). This process ensures that the output has one row per bin,
   whose value is either zero or the original count.  

## Get more out of your data in Kusto with Machine Learning 

There are many interesting use cases that leverage machine learning algorithms and derive interesting insights out of telemetry data. 
Often, these algorithms require a very structured dataset as their input. The raw log data will usually not match the required structure and size. 

Start by looking for anomalies in the error rate of a specific Bing Inferences service. The logs table has 65B records. 
The simple query below filters 250K errors, and creates a time series data of errors count that uses the anomaly detection function 
[series_decompose_anomalies](series-decompose-anomaliesfunction.md). The anomalies are detected by the Kusto service, and are highlighted as red dots on the time series chart.

```kusto
Logs
| where Timestamp >= datetime(2015-08-22) and Timestamp < datetime(2015-08-23) 
| where Level == "e" and Service == "Inferences.UnusualEvents_Main" 
| summarize count() by bin(Timestamp, 5min)
| render anomalychart 
```

The service identified few time buckets with suspicious error rate. Use Kusto to zoom into this time frame, and run a query that 
aggregates on the ‘Message' column. Try to find the top errors. 

The relevant parts of the entire stack trace of the message are trimmed out to better fit onto the page. 

You can see the successful identification of the top eight errors. However, there follows a long series of errors, since the error message 
was created by a format string that contained changing data. 

```kusto
Logs
| where Timestamp >= datetime(2015-08-22 05:00) and Timestamp < datetime(2015-08-22 06:00)
| where Level == "e" and Service == "Inferences.UnusualEvents_Main"
| summarize count() by Message 
| top 10 by count_ 
| project count_, Message 
```

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

This is where the `reduce` operator helps. 
The operator identified 63 different errors that originated by the same trace instrumentation point in the code, 
and helps focus on additional meaningful error traces in that time window.

```kusto
Logs
| where Timestamp >= datetime(2015-08-22 05:00) and Timestamp < datetime(2015-08-22 06:00)
| where Level == "e" and Service == "Inferences.UnusualEvents_Main"
| reduce by Message with threshold=0.35
| project Count, Pattern
```

|Count|Pattern
|---|---
|7125|ExecuteAlgorithmMethod for method 'RunCycleFromInterimData' has failed...
|  7125|InferenceHostService call failed..System.NullReferenceException: Object reference not set to an instance of an object...
|  7124|Unexpected Inference System error..System.NullReferenceException: Object reference not set to an instance of an object...
|  5112|Unexpected Inference System error..System.NullReferenceException: Object reference not set to an instance of an object..
|  174|InferenceHostService call failed..System.ServiceModel.CommunicationException: There was an error writing to the pipe:...
|  63|Inference System error..Microsoft.Bing.Platform.Inferences.\*: Write \* to write to the Object BOSS.\*: SocialGraph.BOSS.Reques...
|  10|ExecuteAlgorithmMethod for method 'RunCycleFromInterimData' has failed...
|  10|Inference System error..Microsoft.Bing.Platform.Inferences.Service.Managers.UserInterimDataManagerException:...
|  3|InferenceHostService call failed..System.ServiceModel.\*: The object, System.ServiceModel.Channels.\*+\*, for \*\* is the \*...   at Syst...

Now you have a good view into the top errors that contributed to the detected anomalies.

To understand the impact of these errors across the sample system: 
* The 'Logs' table contains additional dimensional data such as 'Component', 'Cluster', and so on.
* The new 'autocluster' plugin can help derive that insight with a simple query. 
* In the example below, you can clearly see that each of the top four errors is specific to a component. Also, while the top three errors are specific to DB4 cluster, 
the fourth one happens across all clusters.

```kusto
Logs
| where Timestamp >= datetime(2015-08-22 05:00) and Timestamp < datetime(2015-08-22 06:00)
| where Level == "e" and Service == "Inferences.UnusualEvents_Main"
| evaluate autocluster()
```

|Count |Percent (%)|Component|Cluster|Message
|---|---|---|---|---
|7125|26.64|InferenceHostService|DB4|ExecuteAlgorithmMethod for method ....
|7125|26.64|Unknown Component|DB4|InferenceHostService call failed....
|7124|26.64|InferenceAlgorithmExecutor|DB4|Unexpected Inference System error...
|5112|19.11|InferenceAlgorithmExecutor|*|Unexpected Inference System error... 

## Map values from one set to another

A common use case is static mapping of values, which can help in make results more presentable.
For example, consider the next table. 
`DeviceModel` specifies a model of the device, which is not a very convenient form of referencing the device name.  


|DeviceModel |Count 
|---|---
|iPhone5,1 |32 
|iPhone3,2 |432 
|iPhone7,2 |55 
|iPhone5,2 |66 

  
The following is a better representation.  

|FriendlyName |Count 
|---|---
|iPhone 5 |32 
|iPhone 4 |432 
|iPhone 6 |55 
|iPhone5 |66 

The two approaches below demonstrate how the representation can be achieved.  

### Mapping using dynamic dictionary

The approach shows mapping with a dynamic dictionary and dynamic accessors.

<!-- csl: https://help.kusto.windows.net:443/Samples -->
```kusto
// Data set definition
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

|FriendlyName|Count|
|---|---|
|iPhone 5|32|
|iPhone 4|432|
|iPhone 6|55|
|iPhone5|66|

### Map using static table

The approach shows mapping with a persistent table and join operator.
 
Create the mapping table, just once.

```kusto
.create table Devices (DeviceModel: string, FriendlyName: string) 

.ingest inline into table Devices 
    ["iPhone5,1","iPhone 5"]["iPhone3,2","iPhone 4"]["iPhone7,2","iPhone 6"]["iPhone5,2","iPhone5"]
```

Content of Devices now.

|DeviceModel |FriendlyName 
|---|---
|iPhone5,1 |iPhone 5 
|iPhone3,2 |iPhone 4 
|iPhone7,2 |iPhone 6 
|iPhone5,2 |iPhone5 

Use the same trick for creating a test table source.

```kusto
.create table Source (DeviceModel: string, Count: int)

.ingest inline into table Source ["iPhone5,1",32]["iPhone3,2",432]["iPhone7,2",55]["iPhone5,2",66]
```

Join and project.

```kusto
Devices  
| join (Source) on DeviceModel  
| project FriendlyName, Count
```

Result:

|FriendlyName |Count 
|---|---
|iPhone 5 |32 
|iPhone 4 |432 
|iPhone 6 |55 
|iPhone5 |66 


## Create and use query-time dimension tables

You will often want to join the results of a query with some ad-hoc dimension
table that is not stored in the database. It's possible to define an expression
whose result is a table scoped to a single query. 
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

Here's a slightly more complex example.

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
* an `ID` column that identifies the entity with which each row is associated, such as a User ID or a Node ID
* a `timestamp` column that provides the time reference for the row
* other columns

A query that returns the latest two records for each value of the `ID` column, where "latest" is defined as "having the highest value of `timestamp`" can be made with the [top-nested operator](topnestedoperator.md).

For example:

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

Notes 
Numbering below refers to numbers in the code sample, far right.

1. The `datatable` is a way to produce some test data for demonstration
   purposes. Normally, you'd use real data here.
1. This line essentially means "return all distinct values of `id`".
1. This line then returns, for the top two records that maximize:
     * the `timestamp` column
     * the columns of the previous level (here, just `id`)
     * the column specified at this level (here, `timestamp`)
1. This line adds the values of the `bla` column for each of the records
   returned by the previous level. If the table has other columns of interest,
   you can repeat this line for every such column.
1. This final line uses the [project-away operator](projectawayoperator.md)
   to remove the "extra" columns introduced by `top-nested`.

## Extend a table with some percent-of-total calculation

A tabular expression that includes a numeric column, is more useful to the user when it is accompanied, alongside, with its value as a percentage of the total. 
For example, assume that there is a query that produces the following table:

|SomeSeries|SomeInt|
|----------|-------|
|Foo       |    100|
|Bar       |    200|

If you want to display this table as:

|SomeSeries|SomeInt|Pct |
|----------|-------|----|
|Foo       |    100|33.3|
|Bar       |    200|66.6|

Then you need to calculate the total (sum) of the `SomeInt` column,
and then divide each value of this column by the total. 
For arbitrary results use the [as operator](asoperator.md).

```kusto
// The following table literal represents a long calculation
// that ends up with an anonymous tabular value:
datatable (SomeInt:int, SomeSeries:string) [
  100, "Foo",
  200, "Bar",
]
// We now give this calculation a name ("X"):
| as X
// Having this name we can refer to it in the sub-expression
// "X | summarize sum(SomeInt)":
| extend Pct = 100 * bin(todouble(SomeInt) / toscalar(X | summarize sum(SomeInt)), 0.001)
```

## Perform aggregations over a sliding window

The following example shows how to summarize columns using a sliding window.
Use the table below, which contains prices of fruits by timestamps. 
Calculate the min, max, and sum costs of each fruit per day, using a sliding window of seven days. Each record in the result set aggregates the previous seven days, and the result contains a record per day in the analysis period.  

The fruits table:

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

The sliding window aggregation query.
An explanation follows the query results:

```kusto
let _start = datetime(2018-09-24);
let _end = _start + 13d; 
Fruits 
| extend _bin = bin_at(Timestamp, 1d, _start) // #1 
| extend _endRange = iif(_bin + 7d > _end, _end, 
                            iff( _bin + 7d - 1d < _start, _start,
                                iff( _bin + 7d - 1d < _bin, _bin,  _bin + 7d - 1d)))  // #2
| extend _range = range(_bin, _endRange, 1d) // #3
| mv-expand _range to typeof(datetime) limit 1000000 // #4
| summarize min(Price), max(Price), sum(Price) by Timestamp=bin_at(_range, 1d, _start) ,  Fruit // #5
| where Timestamp >= _start + 7d; // #6

```

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

Query details:

The query "stretches" (duplicates) each record in the input table throughout the seven days after its actual appearance. 
Each record actually appears seven times.
As a result, the daily aggregation includes all records of the previous seven days.

Step-by-step explanation 
Numbering below refers to numbers in the code sample, far right:
1. Bin each record to one day (relative to _start). 
2. Determine the end of the range per record - _bin + 7d, unless this is out of the _(start, end)_ range, in which case it is adjusted. 
3. For each record, create an array of seven days (timestamps), starting at the current record's day. 
4. mv-expand the array, thus duplicating each record to seven records, 1 day apart from each other. 
5. Perform the aggregation function for each day. Due to #4, this actually summarizes the _past_ seven days. 
6. The data for the first seven days is incomplete. There's no 7d lookback period for the first seven days. The first seven days are excluded from the final result. In the example, they only participate in the aggregation for 2018-10-01.

## Find preceding event
The next example demonstrates how to find a preceding event between 2 data sets.  

*Purpose:*: There are two data sets, A and B. For each record in B find its preceding event in A (that is, the arg_max record in A that is still “older” than B). 
Below is the expected output for the following sample data sets. 

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

There are two different approaches suggested for this problem. You should test both on your specific data set, to find the one most suitable for you.

> [!NOTE] 
> Each method may run differently on different data sets.

### Suggestion #1

This suggestion serializes both data sets by ID and timestamp, then groups all B events with all their preceding A events, and picks the `arg_max` out of all the As in the group.

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

### Suggestion #2

This suggestion requires a max-lookback-period (how much “older” the record in A may be, when compared to B. The method then joins the two data sets on ID and this lookback period. 
The join produces all possible candidates, all A records which are older than B and within the lookback period, and then the closest one to B is filtered by arg_min(TimestampB – TimestampA). The shorter the lookback period is, the better the query results will be.

In the example below, the lookback period is set to 1m, and the record with ID 'z' does not have a corresponding 'A' event, since its 'A' is older by 2m.

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

|Id|B_Timestamp|A_Timestamp|EventB|EventA|
|---|---|---|---|---|
|x|2019-01-01 00:00:03.0000000|2019-01-01 00:00:01.0000000|B|Ax2|
|x|2019-01-01 00:00:04.0000000|2019-01-01 00:00:01.0000000|B|Ax2|
|y|2019-01-01 00:00:04.0000000|2019-01-01 00:00:02.0000000|B|Ay1|
|z|2019-01-01 00:02:00.0000000||B||

::: zone-end

::: zone pivot="azuremonitor"

## String operations
The following sections give examples working with strings in Kusto query language.

### Strings and escaping them
String values are wrapped with either with single or double quote characters. Backslash (\\) is used to escape characters to the character following it, such as \t for tab, \n for newline, and \" the quote character itself.

```Kusto
print "this is a 'string' literal in double \" quotes"
```

```Kusto
print 'this is a "string" literal in single \' quotes'
```

To prevent "\\" from acting as an escape character, add "\@" as a prefix to the string:

```Kusto
print @"C:\backslash\not\escaped\with @ prefix"
```


### String comparisons

Operator       |Description                         |Case-Sensitive|Example (yields `true`)
---------------|------------------------------------|--------------|-----------------------
`==`           |Equals                              |Yes           |`"aBc" == "aBc"`
`!=`           |Not equals                          |Yes           |`"abc" != "ABC"`
`=~`           |Equals                              |No            |`"abc" =~ "ABC"`
`!~`           |Not equals                          |No            |`"aBc" !~ "xyz"`
`has`          |Right-hand-side is a whole term in left-hand-side |No|`"North America" has "america"`
`!has`         |Right-hand-side isn't a full term in left-hand-side       |No            |`"North America" !has "amer"` 
`has_cs`       |Right-hand-side is a whole term in left-hand-side |Yes|`"North America" has_cs "America"`
`!has_cs`      |Right-hand-side isn't a full term in left-hand-side       |Yes            |`"North America" !has_cs "amer"` 
`hasprefix`    |Right-hand-side is a term prefix in left-hand-side         |No            |`"North America" hasprefix "ame"`
`!hasprefix`   |Right-hand-side isn't a term prefix in left-hand-side     |No            |`"North America" !hasprefix "mer"` 
`hasprefix_cs`    |Right-hand-side is a term prefix in left-hand-side         |Yes            |`"North America" hasprefix_cs "Ame"`
`!hasprefix_cs`   |Right-hand-side isn't a term prefix in left-hand-side     |Yes            |`"North America" !hasprefix_cs "CA"` 
`hassuffix`    |Right-hand-side is a term suffix in left-hand-side         |No            |`"North America" hassuffix "ica"`
`!hassuffix`   |Right-hand-side isn't a term suffix in left-hand-side     |No            |`"North America" !hassuffix "americ"`
`hassuffix_cs`    |Right-hand-side is a term suffix in left-hand-side         |Yes            |`"North America" hassuffix_cs "ica"`
`!hassuffix_cs`   |Right-hand-side isn't a term suffix in left-hand-side     |Yes            |`"North America" !hassuffix_cs "icA"`
`contains`     |Right-hand-side occurs as a subsequence of left-hand-side  |No            |`"FabriKam" contains "BRik"`
`!contains`    |Right-hand-side doesn't occur in left-hand-side           |No            |`"Fabrikam" !contains "xyz"`
`contains_cs`   |Right-hand-side occurs as a subsequence of left-hand-side  |Yes           |`"FabriKam" contains_cs "Kam"`
`!contains_cs`  |Right-hand-side doesn't occur in left-hand-side           |Yes           |`"Fabrikam" !contains_cs "Kam"`
`startswith`   |Right-hand-side is an initial subsequence of left-hand-side|No            |`"Fabrikam" startswith "fab"`
`!startswith`  |Right-hand-side isn't an initial subsequence of left-hand-side|No        |`"Fabrikam" !startswith "kam"`
`startswith_cs`   |Right-hand-side is an initial subsequence of left-hand-side|Yes            |`"Fabrikam" startswith_cs "Fab"`
`!startswith_cs`  |Right-hand-side isn't an initial subsequence of left-hand-side|Yes        |`"Fabrikam" !startswith_cs "fab"`
`endswith`     |Right-hand-side is a closing subsequence of left-hand-side|No             |`"Fabrikam" endswith "Kam"`
`!endswith`    |Right-hand-side isn't a closing subsequence of left-hand-side|No         |`"Fabrikam" !endswith "brik"`
`endswith_cs`     |Right-hand-side is a closing subsequence of left-hand-side|Yes             |`"Fabrikam" endswith "Kam"`
`!endswith_cs`    |Right-hand-side isn't a closing subsequence of left-hand-side|Yes         |`"Fabrikam" !endswith "brik"`
`matches regex`|left-hand-side contains a match for Right-hand-side        |Yes           |`"Fabrikam" matches regex "b.*k"`
`in`           |Equals to one of the elements       |Yes           |`"abc" in ("123", "345", "abc")`
`!in`          |Not equals to any of the elements   |Yes           |`"bca" !in ("123", "345", "abc")`


### countof

Counts occurrences of a substring in a string. Can match plain strings or use regex. Plain string matches may overlap while regex matches do not.

```
countof(text, search [, kind])
```

- `text` - The input string 
- `search` - Plain string or regular expression to match inside text.
- `kind` - _normal_ | _regex_ (default: normal).

Returns the number of times that the search string can be matched in the container. Plain string matches may overlap while regex matches do not.

#### Plain string matches

```Kusto
print countof("The cat sat on the mat", "at");  //result: 3
print countof("aaa", "a");  //result: 3
print countof("aaaa", "aa");  //result: 3 (not 2!)
print countof("ababa", "ab", "normal");  //result: 2
print countof("ababa", "aba");  //result: 2
```

#### Regex matches

```Kusto
print countof("The cat sat on the mat", @"\b.at\b", "regex");  //result: 3
print countof("ababa", "aba", "regex");  //result: 1
print countof("abcabc", "a.c", "regex");  // result: 2
```


### extract

Gets a match for a regular expression from a given string. Optionally also converts the extracted substring to the specified type.

```Kusto
extract(regex, captureGroup, text [, typeLiteral])
```

- `regex` - A regular expression.
- `captureGroup` - A positive integer constant indicating the capture group to extract. 0 for the entire match, 1 for the value matched by the first '('parenthesis')' in the regular expression, 2 or more for subsequent parentheses.
- `text` - A string to search.
- `typeLiteral` - An optional type literal (for example, typeof(long)). If provided, the extracted substring is converted to this type.

Returns the substring matched against the indicated capture group captureGroup, optionally converted to typeLiteral.
If there's no match, or the type conversion fails, return null.


The following example extracts the last octet of *ComputerIP* from a heartbeat record:
```Kusto
Heartbeat
| where ComputerIP != "" 
| take 1
| project ComputerIP, last_octet=extract("([0-9]*$)", 1, ComputerIP) 
```

The following example extracts the last octet, casts it to a *real* type (number) and calculates the next IP value
```Kusto
Heartbeat
| where ComputerIP != "" 
| take 1
| extend last_octet=extract("([0-9]*$)", 1, ComputerIP, typeof(real)) 
| extend next_ip=(last_octet+1)%255
| project ComputerIP, last_octet, next_ip
```

In the example below, the string *Trace* is searched for a definition of "Duration". The match is cast to *real* and multiplied by a time constant (1 s) *which casts Duration to type timespan*.
```Kusto
let Trace="A=12, B=34, Duration=567, ...";
print Duration = extract("Duration=([0-9.]+)", 1, Trace, typeof(real));  //result: 567
print Duration_seconds =  extract("Duration=([0-9.]+)", 1, Trace, typeof(real)) * time(1s);  //result: 00:09:27
```


### isempty, isnotempty, notempty

- *isempty* returns true if the argument is an empty string or null (see also *isnull*).
- *isnotempty* returns true if the argument isn't an empty string or a null (see also *isnotnull*). alias: *notempty*.


```Kusto
isempty(value)
isnotempty(value)
```

### Examples

```Kusto
print isempty("");  // result: true

print isempty("0");  // result: false

print isempty(0);  // result: false

print isempty(5);  // result: false

Heartbeat | where isnotempty(ComputerIP) | take 1  // return 1 Heartbeat record in which ComputerIP isn't empty
```


### parseurl

Splits a URL into its parts (protocol, host, port, etc.), and returns a dictionary object containing the parts as strings.

```
parseurl(urlstring)
```

#### Examples

```Kusto
print parseurl("http://user:pass@contoso.com/icecream/buy.aspx?a=1&b=2#tag")
```

The outcome will be:
```
{
	"Scheme" : "http",
	"Host" : "contoso.com",
	"Port" : "80",
	"Path" : "/icecream/buy.aspx",
	"Username" : "user",
	"Password" : "pass",
	"Query Parameters" : {"a":"1","b":"2"},
	"Fragment" : "tag"
}
```


### replace

Replaces all regex matches with another string. 

```
replace(regex, rewrite, input_text)
```

- `regex` - The regular expression to match by. It can contain capture groups in '('parentheses')'.
- `rewrite` - The replacement regex for any match made by matching regex. Use \0 to refer to the whole match, \1 for the first capture group, \2, and so on for subsequent capture groups.
- `input_text` - The input string to search in.

Returns the text after replacing all matches of regex with evaluations of rewrite. Matches don't overlap.


```Kusto
SecurityEvent
| take 1
| project Activity 
| extend replaced = replace(@"(\d+) -", @"Activity ID \1: ", Activity) 
```

Can have the following results:

Activity                                        |replaced
------------------------------------------------|----------------------------------------------------------
4663 - An attempt was made to access an object  |Activity ID 4663: An attempt was made to access an object.


### split

Splits a given string according to a specified delimiter, and returns an array of the resulting substrings.

```
split(source, delimiter [, requestedIndex])
```

- `source` - The string to be split according to the specified delimiter.
- `delimiter` - The delimiter that will be used in order to split the source string.
- `requestedIndex` - An optional zero-based index. If provided, the returned string array will hold only that item (if exists).


#### Examples

```Kusto
print split("aaa_bbb_ccc", "_");    // result: ["aaa","bbb","ccc"]
print split("aa_bb", "_");          // result: ["aa","bb"]
print split("aaa_bbb_ccc", "_", 1);	// result: ["bbb"]
print split("", "_");              	// result: [""]
print split("a__b", "_");           // result: ["a","","b"]
print split("aabbcc", "bb");        // result: ["aa","cc"]
```

### strcat

Concatenates string arguments (supports 1-16 arguments).

```
strcat("string1", "string2", "string3")
```

#### Examples
```Kusto
print strcat("hello", " ", "world")	// result: "hello world"
```


### strlen

Returns the length of a string.

```
strlen("text_to_evaluate")
```

#### Examples
```Kusto
print strlen("hello")	// result: 5
```


### substring

Extracts a substring from a given source string, starting at the specified index. Optionally, the length of the requested substring can be specified.

```
substring(source, startingIndex [, length])
```

- `source` - The source string that the substring will be taken from.
- `startingIndex` - The zero-based starting character position of the requested substring.
- `length` - An optional parameter that can be used to specify the requested length of the returned substring.

#### Examples
```Kusto
print substring("abcdefg", 1, 2);	// result: "bc"
print substring("123456", 1);		// result: "23456"
print substring("123456", 2, 2);	// result: "34"
print substring("ABCD", 0, 2);	// result: "AB"
```


### tolower, toupper

Converts a given string to all lower or upper case.

```
tolower("value")
toupper("value")
```

#### Examples
```Kusto
print tolower("HELLO");	// result: "hello"
print toupper("hello");	// result: "HELLO"
```

## Date and time operations
The following sections give examples working with date and time values in Kusto query language.

### Date time basics
The Kusto query language has two main data types associated with dates and times: datetime and timespan. All dates are expressed in UTC. While multiple datetime formats are supported, the ISO8601 format is preferred. 

Timespans are expressed as a decimal followed by a time unit:

|shorthand   | time unit    |
|:---|:---|
|d           | day          |
|h           | hour         |
|m           | minute       |
|s           | second       |
|ms          | millisecond  |
|microsecond | microsecond  |
|tick        | nanosecond   |

Datetimes can be created by casting a string using the `todatetime` operator. For example, to review the VM heartbeats sent in a specific timeframe, use the `between` operator to specify a time range.

```Kusto
Heartbeat
| where TimeGenerated between(datetime("2018-06-30 22:46:42") .. datetime("2018-07-01 00:57:27"))
```

Another common scenario is comparing a datetime to the present. For example, to see all heartbeats over the last two minutes, you can use the `now` operator together with a timespan that represents two minutes:

```Kusto
Heartbeat
| where TimeGenerated > now() - 2m
```

A shortcut is also available for this function:
```Kusto
Heartbeat
| where TimeGenerated > now(-2m)
```

The shortest and most readable method though is using the `ago` operator:
```Kusto
Heartbeat
| where TimeGenerated > ago(2m)
```

Suppose that instead of knowing the start and end time, you know the start time and the duration. You can rewrite the query as follows:

```Kusto
let startDatetime = todatetime("2018-06-30 20:12:42.9");
let duration = totimespan(25m);
Heartbeat
| where TimeGenerated between(startDatetime .. (startDatetime+duration) )
| extend timeFromStart = TimeGenerated - startDatetime
```

### Converting time units
You may want to express a datetime or timespan in a time unit other than the default. For example, if you're reviewing error events from the last 30 minutes and need a calculated column showing how long ago the event happened:

```Kusto
Event
| where TimeGenerated > ago(30m)
| where EventLevelName == "Error"
| extend timeAgo = now() - TimeGenerated 
```

The `timeAgo` column holds values such as: "00:09:31.5118992", meaning they're formatted as hh:mm:ss.fffffff. If you want to format these values to the `numver` of minutes since the start time, divide that value by "1 minute":

```Kusto
Event
| where TimeGenerated > ago(30m)
| where EventLevelName == "Error"
| extend timeAgo = now() - TimeGenerated
| extend timeAgoMinutes = timeAgo/1m 
```


### Aggregations and bucketing by time intervals
Another common scenario is the need to obtain statistics over a certain time period in a particular time grain. For this scenario, a `bin` operator can be used as part of a summarize clause.

Use the following query to get the number of events that occurred every 5 minutes during the last half hour:

```Kusto
Event
| where TimeGenerated > ago(30m)
| summarize events_count=count() by bin(TimeGenerated, 5m) 
```

This query produces the following table:  

|TimeGenerated(UTC)|events_count|
|--|--|
|2018-08-01T09:30:00.000|54|
|2018-08-01T09:35:00.000|41|
|2018-08-01T09:40:00.000|42|
|2018-08-01T09:45:00.000|41|
|2018-08-01T09:50:00.000|41|
|2018-08-01T09:55:00.000|16|

Another way to create buckets of results is to use functions, such as `startofday`:

```Kusto
Event
| where TimeGenerated > ago(4d)
| summarize events_count=count() by startofday(TimeGenerated) 
```

This query produces the following results:

|timestamp|count_|
|--|--|
|2018-07-28T00:00:00.000|7,136|
|2018-07-29T00:00:00.000|12,315|
|2018-07-30T00:00:00.000|16,847|
|2018-07-31T00:00:00.000|12,616|
|2018-08-01T00:00:00.000|5,416|


### Time zones
Since all datetime values are expressed in UTC, it's often useful to convert these values into the local timezone. For example, use this calculation to convert UTC to PST times:

```Kusto
Event
| extend localTimestamp = TimeGenerated - 8h
```

## Aggregations
The following sections give examples of aggregation the results of a query in Kusto query language.

### count
Count the number of rows in the result set after any filters are applied. The following example returns the total number of rows in the _Perf_ table from the last 30 minutes. The result is returned in a column named *count_* unless you assign it a specific name:


```Kusto
Perf
| where TimeGenerated > ago(30m) 
| summarize count()
```

```Kusto
Perf
| where TimeGenerated > ago(30m) 
| summarize num_of_records=count() 
```

A timechart visualization can be useful to see a trend over time:

```Kusto
Perf 
| where TimeGenerated > ago(30m) 
| summarize count() by bin(TimeGenerated, 5m)
| render timechart
```

The output from this example shows the perf record count trendline in 5 minutes' intervals:

![Count trend](images/samples/count-trend.png)


### dcount, dcountif
Use `dcount` and `dcountif` to count distinct values in a specific column. The following query evaluates how many distinct computers sent heartbeats in the last hour:

```Kusto
Heartbeat 
| where TimeGenerated > ago(1h) 
| summarize dcount(Computer)
```

To count only the Linux computers that sent heartbeats, use `dcountif`:

```Kusto
Heartbeat 
| where TimeGenerated > ago(1h) 
| summarize dcountif(Computer, OSType=="Linux")
```

### Evaluating subgroups
To perform a count or other aggregations on subgroups in your data, use the `by` keyword. For example, to count the number of distinct Linux computers that sent heartbeats in each country/region:

```Kusto
Heartbeat 
| where TimeGenerated > ago(1h) 
| summarize distinct_computers=dcountif(Computer, OSType=="Linux") by RemoteIPCountry
```

|RemoteIPCountry  | distinct_computers  |
------------------|---------------------|
|United States 	  | 19          		|
|Canada        	  | 3       	  		|
|Ireland   	      | 0		       		|
|United Kingdom	  | 0		       		|
|Netherlands	  | 2  					|


To analyze even smaller subgroups of your data, add additional column names to the `by` section. For example, you might want to count the distinct computers from each country/region per OSType:

```Kusto
Heartbeat 
| where TimeGenerated > ago(1h) 
| summarize distinct_computers=dcountif(Computer, OSType=="Linux") by RemoteIPCountry, OSType
```


### Percentile
To find the median value, use the `percentile` function with a value to specify the percentile:

```Kusto
Perf
| where TimeGenerated > ago(30m) 
| where CounterName == "% Processor Time" and InstanceName == "_Total" 
| summarize percentiles(CounterValue, 50) by Computer
```

You can also specify different percentiles to get an aggregated result for each:

```Kusto
Perf
| where TimeGenerated > ago(30m) 
| where CounterName == "% Processor Time" and InstanceName == "_Total" 
| summarize percentiles(CounterValue, 25, 50, 75, 90) by Computer
```

This might show that some computer CPUs have similar median values, but while some are steady around the median, other computers have reported much lower and higher CPU values meaning they experienced spikes.

### Variance
To directly evaluate the variance of a value, use the standard deviation and variance methods:

```Kusto
Perf
| where TimeGenerated > ago(30m) 
| where CounterName == "% Processor Time" and InstanceName == "_Total" 
| summarize stdev(CounterValue), variance(CounterValue) by Computer
```

A good way to analyze the stability of the CPU usage is to combine stdev with the median calculation:

```Kusto
Perf
| where TimeGenerated > ago(130m) 
| where CounterName == "% Processor Time" and InstanceName == "_Total" 
| summarize stdev(CounterValue), percentiles(CounterValue, 50) by Computer
```

### Generating lists and sets
You can use `makelist` to pivot data by the order of values in a particular column. For example, you may want to explore the most common order events take place on your machines. You can essentially pivot the data by the order of EventIDs on each machine. 

```Kusto
Event
| where TimeGenerated > ago(12h)
| order by TimeGenerated desc
| summarize makelist(EventID) by Computer
```

|Computer|list_EventID|
|---|---|
| computer1 | [704,701,1501,1500,1085,704,704,701] |
| computer2 | [326,105,302,301,300,102] |
| ... | ... |

`makelist` generates a list in the order that data was passed into it. To sort events from oldest to newest, use `asc` in the order statement instead of `desc`. 

It is also useful to create a list of just distinct values. This is called a _Set_ and can be generated with `makeset`:

```Kusto
Event
| where TimeGenerated > ago(12h)
| order by TimeGenerated desc
| summarize makeset(EventID) by Computer
```

|Computer|list_EventID|
|---|---|
| computer1 | [704,701,1501,1500,1085] |
| computer2 | [326,105,302,301,300,102] |
| ... | ... |

Like `makelist`, `makeset` also works with ordered data and will generate the arrays based on the order of the rows that are passed into it.

### Expanding lists
The inverse operation of `makelist` or `makeset` is `mvexpand`, which expands a list of values to separate rows. It can expand across any number of dynamic columns, both JSON and array. For example, you could check  the *Heartbeat* table for solutions sending data from computers that sent a heartbeat in the last hour:

```Kusto
Heartbeat
| where TimeGenerated > ago(1h)
| project Computer, Solutions
```

| Computer | Solutions | 
|--------------|----------------------|
| computer1 | "security", "updates", "changeTracking" |
| computer2 | "security", "updates" |
| computer3 | "antiMalware", "changeTracking" |
| ... | ... |

Use `mvexpand` to show each value in a separate row instead of a comma-separated list:

```Kusto
Heartbeat
| where TimeGenerated > ago(1h)
| project Computer, split(Solutions, ",")
| mvexpand Solutions
```

| Computer | Solutions | 
|--------------|----------------------|
| computer1 | "security" |
| computer1 | "updates" |
| computer1 | "changeTracking" |
| computer2 | "security" |
| computer2 | "updates" |
| computer3 | "antiMalware" |
| computer3 | "changeTracking" |
| ... | ... |


You could then use `makelist` again to group items together, and this time see the list of computers per solution:

```Kusto
Heartbeat
| where TimeGenerated > ago(1h)
| project Computer, split(Solutions, ",")
| mvexpand Solutions
| summarize makelist(Computer) by tostring(Solutions) 
```

|Solutions | list_Computer |
|--------------|----------------------|
| "security" | ["computer1", "computer2"] |
| "updates" | ["computer1", "computer2"] |
| "changeTracking" | ["computer1", "computer3"] |
| "antiMalware" | ["computer3"] |
| ... | ... |

### Handling missing bins
A useful application of `mvexpand` is the need to fill default values in for missing bins. For example, suppose you're looking for the uptime of a particular machine by exploring its heartbeat. You also want to see the source of the heartbeat  which is in the _category_ column. Normally, we would use a simple summarize statement as follows:

```Kusto
Heartbeat
| where TimeGenerated > ago(12h)
| summarize count() by Category, bin(TimeGenerated, 1h)
```

| Category | TimeGenerated | count_ |
|--------------|----------------------|--------|
| Direct Agent | 2017-06-06T17:00:00Z | 15 |
| Direct Agent | 2017-06-06T18:00:00Z | 60 |
| Direct Agent | 2017-06-06T20:00:00Z | 55 |
| Direct Agent | 2017-06-06T21:00:00Z | 57 |
| Direct Agent | 2017-06-06T22:00:00Z | 60 |
| ... | ... | ... |

In these results though the bucket associated with "2017-06-06T19:00:00Z" is missing because there isn't any heartbeat data for that hour. Use the `make-series` function to assign a default value to empty buckets. This will generate a row for each category with two extra array columns, one for values, and one for matching time buckets:

```Kusto
Heartbeat
| make-series count() default=0 on TimeGenerated in range(ago(1d), now(), 1h) by Category 
```

| Category | count_ | TimeGenerated |
|---|---|---|
| Direct Agent | [15,60,0,55,60,57,60,...] | ["2017-06-06T17:00:00.0000000Z","2017-06-06T18:00:00.0000000Z","2017-06-06T19:00:00.0000000Z","2017-06-06T20:00:00.0000000Z","2017-06-06T21:00:00.0000000Z",...] |
| ... | ... | ... |

The third element of the *count_* array is a 0 as expected, and there is a matching timestamp of "2017-06-06T19:00:00.0000000Z" in the _TimeGenerated_ array. This array format is difficult to read though. Use `mvexpand` to expand the arrays and produce the same format output as generated by `summarize`:

```Kusto
Heartbeat
| make-series count() default=0 on TimeGenerated in range(ago(1d), now(), 1h) by Category 
| mvexpand TimeGenerated, count_
| project Category, TimeGenerated, count_
```

| Category | TimeGenerated | count_ |
|--------------|----------------------|--------|
| Direct Agent | 2017-06-06T17:00:00Z | 15 |
| Direct Agent | 2017-06-06T18:00:00Z | 60 |
| Direct Agent | 2017-06-06T19:00:00Z | 0 |
| Direct Agent | 2017-06-06T20:00:00Z | 55 |
| Direct Agent | 2017-06-06T21:00:00Z | 57 |
| Direct Agent | 2017-06-06T22:00:00Z | 60 |
| ... | ... | ... |



### Narrowing results to a set of elements: `let`, `makeset`, `toscalar`, `in`
A common scenario is to select the names of some specific entities based on a set of criteria and then filter a different data set down to that set of entities. For example you might find computers that are known to have missing updates and identify IPs that these computers called out to:


```Kusto
let ComputersNeedingUpdate = toscalar(
    Update
    | summarize makeset(Computer)
    | project set_Computer
);
WindowsFirewall
| where Computer in (ComputersNeedingUpdate)
```

## Joins
Joins allow you to analyze data from multiple tables, in the same query. They merge the rows of two data sets by matching values of specified columns.


```Kusto
SecurityEvent 
| where EventID == 4624		// sign-in events
| project Computer, Account, TargetLogonId, LogonTime=TimeGenerated
| join kind= inner (
    SecurityEvent 
    | where EventID == 4634		// sign-out events
    | project TargetLogonId, LogoffTime=TimeGenerated
) on TargetLogonId
| extend Duration = LogoffTime-LogonTime
| project-away TargetLogonId1 
| top 10 by Duration desc
```

In this example, the first dataset filters for all sign-in events. This is joined with a second dataset that filters for all sign-out events. The projected columns are _Computer_, _Account_, _TargetLogonId_, and _TimeGenerated_. The datasets are correlated by a shared column, _TargetLogonId_. The output is a single record per correlation, which 
has both the sign-in and sign-out time.

If both datasets have columns with the same names, the columns of the right-side dataset would be given an index number, so in this example the results would show _TargetLogonId_ with values from the left-side table and _TargetLogonId1_  with values from the right-side table. In this case, the second _TargetLogonId1_ column was removed by using the `project-away` operator.

> [!NOTE]
> To improve performance, keep only the relevant columns of the joined data-sets, using the `project` operator.


Use the following syntax to join two datasets and the joined key has a different name between the two tables:
```
Table1
| join ( Table2 ) 
on $left.key1 == $right.key2
```

### Lookup tables
A common use of joins is using static mapping of values using `datatable` that can help in transforming the results into more presentable way. For example, to enrich the security event data with the event name for each event ID.

```Kusto
let DimTable = datatable(EventID:int, eventName:string)
  [
    4625, "Account activity",
    4688, "Process action",
    4634, "Account activity",
    4658, "The handle to an object was closed",
    4656, "A handle to an object was requested",
    4690, "An attempt was made to duplicate a handle to an object",
    4663, "An attempt was made to access an object",
    5061, "Cryptographic operation",
    5058, "Key file operation"
  ];
SecurityEvent
| join kind = inner
 DimTable on EventID
| summarize count() by eventName
```

| eventName | count_ |
|:---|:---|
| The handle to an object was closed | 290,995 |
| A handle to an object was requested | 154,157 |
| An attempt was made to duplicate a handle to an object | 144,305 |
| An attempt was made to access an object | 123,669 |
| Cryptographic operation | 153,495 |
| Key file operation | 153,496 |

## JSON and data structures

Nested objects are objects that contain other objects in an array or a map of key-value pairs. These objects are represented as JSON strings. This section describes how JSON is used to retrieve data and analyze nested objects.

### Working with JSON strings
Use `extractjson` to access a specific JSON element in a known path. This function requires a path expression that uses the following conventions.

- _$_ to refer to the root folder
- Use the bracket or dot notation to refer to indexes and elements as illustrated in the following examples.


Use brackets for indexes and dots to separate elements:

```Kusto
let hosts_report='{"hosts": [{"location":"North_DC", "status":"running", "rate":5},{"location":"South_DC", "status":"stopped", "rate":3}]}';
print hosts_report
| extend status = extractjson("$.hosts[0].status", hosts_report)
```

This is the same result using only the brackets notation:

```Kusto
let hosts_report='{"hosts": [{"location":"North_DC", "status":"running", "rate":5},{"location":"South_DC", "status":"stopped", "rate":3}]}';
print hosts_report 
| extend status = extractjson("$['hosts'][0]['status']", hosts_report)
```

If there is only one element, you can use only the dot notation:

```Kusto
let hosts_report=dynamic({"location":"North_DC", "status":"running", "rate":5});
print hosts_report 
| extend status = hosts_report.status
```


### parsejson
To access multiple elements in your json structure, it's easier to access it as a dynamic object. Use `parsejson` to cast text data to a dynamic object. Once converted to a dynamic type, additional functions can be used to analyze the data.

```Kusto
let hosts_object = parsejson('{"hosts": [{"location":"North_DC", "status":"running", "rate":5},{"location":"South_DC", "status":"stopped", "rate":3}]}');
print hosts_object 
| extend status0=hosts_object.hosts[0].status, rate1=hosts_object.hosts[1].rate
```



### arraylength
Use `arraylength` to count the number of elements in an array:

```Kusto
let hosts_object = parsejson('{"hosts": [{"location":"North_DC", "status":"running", "rate":5},{"location":"South_DC", "status":"stopped", "rate":3}]}');
print hosts_object 
| extend hosts_num=arraylength(hosts_object.hosts)
```

### mvexpand
Use `mvexpand` to break the properties of an object into separate rows.

```Kusto
let hosts_object = parsejson('{"hosts": [{"location":"North_DC", "status":"running", "rate":5},{"location":"South_DC", "status":"stopped", "rate":3}]}');
print hosts_object 
| mvexpand hosts_object.hosts[0]
```

![Screenshot shows hosts_0 with values for location, status, and rate.](images/samples/mvexpand.png)

### buildschema
Use `buildschema` to get the schema that admits all values of an object:

```Kusto
let hosts_object = parsejson('{"hosts": [{"location":"North_DC", "status":"running", "rate":5},{"location":"South_DC", "status":"stopped", "rate":3}]}');
print hosts_object 
| summarize buildschema(hosts_object)
```

The output is a schema in JSON format:
```json
{
    "hosts":
    {
        "indexer":
        {
            "location": "string",
            "rate": "int",
            "status": "string"
        }
    }
}
```
This output describes the names of the object fields and their matching data types. 

Nested objects may have different schemas such as in the following example:

```Kusto
let hosts_object = parsejson('{"hosts": [{"location":"North_DC", "status":"running", "rate":5},{"status":"stopped", "rate":"3", "range":100}]}');
print hosts_object 
| summarize buildschema(hosts_object)
```

## Charts
The following sections give examples working with charts in Kusto query language.

### Chart the results
Start by reviewing how many computers there are per operating system, during the past hour:

```Kusto
Heartbeat
| where TimeGenerated > ago(1h)
| summarize count(Computer) by OSType  
```

By default, results display as a table:

![Table](images/samples/table-display.png)

To get a better view, select **Chart**, and choose the **Pie** option to visualize the results:

![Pie chart](images/samples/charts-and-diagrams-pie.png)


### Timecharts
Show the average, 50th and 95th percentiles of processor time in bins of 1 hour. The query generates multiple series and you can then select which series to show in the time chart:

```Kusto
Perf
| where TimeGenerated > ago(1d) 
| where CounterName == "% Processor Time" 
| summarize avg(CounterValue), percentiles(CounterValue, 50, 95)  by bin(TimeGenerated, 1h)
```

Select the **Line** chart display option:

![Line chart](images/samples/charts-and-diagrams-multiple-series.png)

#### Reference line

A reference line can help you easily identifying if the metric exceeded a specific threshold. To add a line to a chart, extend the dataset with a constant column:

```Kusto
Perf
| where TimeGenerated > ago(1d) 
| where CounterName == "% Processor Time" 
| summarize avg(CounterValue), percentiles(CounterValue, 50, 95)  by bin(TimeGenerated, 1h)
| extend Threshold = 20
```

![Reference line](images/samples/charts-and-diagrams-multiple-series-threshold.png)

### Multiple dimensions
Multiple expressions in the `by` clause of `summarize` create multiple rows in the results, one for each combination of values.

```Kusto
SecurityEvent
| where TimeGenerated > ago(1d)
| summarize count() by tostring(EventID), AccountType, bin(TimeGenerated, 1h)
```

When you view the results as a chart, it uses the first column from the `by` clause. The following example shows a stacked column chart using the _EventID._ Dimensions must be of `string` type, so in this example the _EventID_ is being cast to string. 

![Bar chart EventID](images/samples/charts-and-diagrams-multiple-dimension-1.png)

You can switch between by selecting the dropdown with the column name. 

![Bar chart AccountType](images/samples/charts-and-diagrams-multiple-dimension-2.png)

## Smart analytics
This section includes examples that use smart analytics functions in Log Analytics to perform analysis of user activity. You can either use these examples to analyze your own applications monitored by Application Insights or use the concepts in these queries for similar analysis on other data. 

### Cohorts analytics

Cohort analysis tracks the activity of specific groups of users, known as cohorts. It attempts to measure how appealing a service is by measuring the rate of returning users. The users are grouped by the time they first used the service. When analyzing cohorts, we expect to find a decrease in activity over the first tracked periods. Each cohort is titled by the week its members were observed for the first time.

The following example analyzes the number of activities users perform over the course of 5 weeks, following their first use of the service.

```Kusto
let startDate = startofweek(bin(datetime(2017-01-20T00:00:00Z), 1d));
let week = range Cohort from startDate to datetime(2017-03-01T00:00:00Z) step 7d;
// For each user we find the first and last timestamp of activity
let FirstAndLastUserActivity = (end:datetime) 
{
    customEvents
    | where customDimensions["sourceapp"]=="ai-loganalyticsui-prod"
    // Check 30 days back to see first time activity
    | where timestamp > startDate - 30d
    | where timestamp < end      
    | summarize min=min(timestamp), max=max(timestamp) by user_AuthenticatedId
};
let DistinctUsers = (cohortPeriod:datetime, evaluatePeriod:datetime) {
    toscalar (
    FirstAndLastUserActivity(evaluatePeriod)
    // Find members of the cohort: only users that were observed in this period for the first time
    | where min >= cohortPeriod and min < cohortPeriod + 7d  
    // Pick only the members that were active during the evaluated period or after
    | where max > evaluatePeriod - 7d
    | summarize dcount(user_AuthenticatedId)) 
};
week 
| where Cohort == startDate
// Finally, calculate the desired metric for each cohort. In this sample we calculate distinct users but you can change
// this to any other metric that would measure the engagement of the cohort members.
| extend 
    r0 = DistinctUsers(startDate, startDate+7d),
    r1 = DistinctUsers(startDate, startDate+14d),
    r2 = DistinctUsers(startDate, startDate+21d),
    r3 = DistinctUsers(startDate, startDate+28d),
    r4 = DistinctUsers(startDate, startDate+35d)
| union (week | where Cohort == startDate + 7d 
| extend 
    r0 = DistinctUsers(startDate+7d, startDate+14d),
    r1 = DistinctUsers(startDate+7d, startDate+21d),
    r2 = DistinctUsers(startDate+7d, startDate+28d),
    r3 = DistinctUsers(startDate+7d, startDate+35d) )
| union (week | where Cohort == startDate + 14d 
| extend 
    r0 = DistinctUsers(startDate+14d, startDate+21d),
    r1 = DistinctUsers(startDate+14d, startDate+28d),
    r2 = DistinctUsers(startDate+14d, startDate+35d) )
| union (week | where Cohort == startDate + 21d 
| extend 
    r0 = DistinctUsers(startDate+21d, startDate+28d),
    r1 = DistinctUsers(startDate+21d, startDate+35d) ) 
| union (week | where Cohort == startDate + 28d 
| extend 
    r0 = DistinctUsers (startDate+28d, startDate+35d) )
// Calculate the retention percentage for each cohort by weeks
| project Cohort, r0, r1, r2, r3, r4,
          p0 = r0/r0*100,
          p1 = todouble(r1)/todouble (r0)*100,
          p2 = todouble(r2)/todouble(r0)*100,
          p3 = todouble(r3)/todouble(r0)*100,
          p4 = todouble(r4)/todouble(r0)*100 
| sort by Cohort asc
```
This example results in the following output.

:::image type="content" source="images/samples/cohorts.png" alt-text="Cohort analysis output":::

### Rolling monthly active users and user stickiness
The following examples uses time-series analysis with the [series_fir](/azure/kusto/query/series-firfunction) function which allows you to perform sliding window computations. The sample application being monitored is an online store that tracks users' activity through custom events. The query tracks two types of user activities, _AddToCart_ and _Checkout_, and defines _active users_ as those who performed a check-out at least once in a given day.



```Kusto
let endtime = endofday(datetime(2017-03-01T00:00:00Z));
let window = 60d;
let starttime = endtime-window;
let interval = 1d;
let user_bins_to_analyze = 28;
// Create an array of filters coefficients for series_fir(). A list of '1' in our case will produce a simple sum.
let moving_sum_filter = toscalar(range x from 1 to user_bins_to_analyze step 1 | extend v=1 | summarize makelist(v)); 
// Level of engagement. Users will be counted as engaged if they performed at least this number of activities.
let min_activity = 1;
customEvents
| where timestamp > starttime  
| where customDimensions["sourceapp"] == "ai-loganalyticsui-prod"
// We want to analyze users who actually checked-out in our web site
| where (name == "Checkout") and user_AuthenticatedId <> ""
// Create a series of activities per user
| make-series UserClicks=count() default=0 on timestamp 
	in range(starttime, endtime-1s, interval) by user_AuthenticatedId
// Create a new column containing a sliding sum. 
// Passing 'false' as the last parameter to series_fir() prevents normalization of the calculation by the size of the window.
// For each time bin in the *RollingUserClicks* column, the value is the aggregation of the user activities in the 
// 28 days that preceded the bin. For example, if a user was active once on 2016-12-31 and then inactive throughout 
// January, then the value will be 1 between 2016-12-31 -> 2017-01-28 and then 0s. 
| extend RollingUserClicks=series_fir(UserClicks, moving_sum_filter, false)
// Use the zip() operator to pack the timestamp with the user activities per time bin
| project User_AuthenticatedId=user_AuthenticatedId , RollingUserClicksByDay=zip(timestamp, RollingUserClicks)
// Transpose the table and create a separate row for each combination of user and time bin (1 day)
| mvexpand RollingUserClicksByDay
| extend Timestamp=todatetime(RollingUserClicksByDay[0])
// Mark the users that qualify according to min_activity
| extend RollingActiveUsersByDay=iff(toint(RollingUserClicksByDay[1]) >= min_activity, 1, 0)
// And finally, count the number of users per time bin.
| summarize sum(RollingActiveUsersByDay) by Timestamp
// First 28 days contain partial data, so we filter them out.
| where Timestamp > starttime + 28d
// render as timechart
| render timechart
```

This example results in the following output.

:::image type="content" source="images/samples/rolling-mau.png" alt-text="Rolling monthly users output":::

The following example turns the above query into a reusable function and uses it to calculate rolling user stickiness. Active users in this query are defined as only those users that performed check-out at least once in a given day.

``` Kusto
let rollingDcount = (sliding_window_size: int, event_name:string)
{
    let endtime = endofday(datetime(2017-03-01T00:00:00Z));
    let window = 90d;
    let starttime = endtime-window;
    let interval = 1d;
    let moving_sum_filter = toscalar(range x from 1 to sliding_window_size step 1 | extend v=1| summarize makelist(v));    
    let min_activity = 1;
    customEvents
    | where timestamp > starttime
    | where customDimensions["sourceapp"]=="ai-loganalyticsui-prod"
    | where (name == event_name)
    | where user_AuthenticatedId <> ""
    | make-series UserClicks=count() default=0 on timestamp 
		in range(starttime, endtime-1s, interval) by user_AuthenticatedId
    | extend RollingUserClicks=fir(UserClicks, moving_sum_filter, false)
    | project User_AuthenticatedId=user_AuthenticatedId , RollingUserClicksByDay=zip(timestamp, RollingUserClicks)
    | mvexpand RollingUserClicksByDay
    | extend Timestamp=todatetime(RollingUserClicksByDay[0])
    | extend RollingActiveUsersByDay=iff(toint(RollingUserClicksByDay[1]) >= min_activity, 1, 0)
    | summarize sum(RollingActiveUsersByDay) by Timestamp
    | where Timestamp > starttime + 28d
};
// Use the moving_sum_filter with bin size of 28 to count MAU.
rollingDcount(28, "Checkout")
| join
(
    // Use the moving_sum_filter with bin size of 1 to count DAU.
    rollingDcount(1, "Checkout")
)
on Timestamp
| project sum_RollingActiveUsersByDay1 *1.0 / sum_RollingActiveUsersByDay, Timestamp
| render timechart
```

This example results in the following output.

:::image type="content" source="images/samples/user-stickiness.png" alt-text="User stickiness output":::

### Regression analysis
This example demonstrates how to create an automated detector for service disruptions based exclusively on an application's trace logs. The detector seeks abnormal  sudden increases in the relative amount of error and warning traces in the application.

Two techniques are used to evaluate the service status based on trace logs data:

- Use [make-series](/azure/kusto/query/make-seriesoperator) to convert semi-structured textual trace logs into a metric that represents the ratio between positive and negative trace lines.
- Use [series_fit_2lines](/azure/kusto/query/series-fit-2linesfunction) and [series_fit_line](/azure/kusto/query/series-fit-linefunction) to perform advanced step-jump detection using time-series analysis with a 2-line linear regression.

``` Kusto
let startDate = startofday(datetime("2017-02-01"));
let endDate = startofday(datetime("2017-02-07"));
let minRsquare = 0.8;  // Tune the sensitivity of the detection sensor. Values close to 1 indicate very low sensitivity.
// Count all Good (Verbose + Info) and Bad (Error + Fatal + Warning) traces, per day
traces
| where timestamp > startDate and timestamp < endDate
| summarize 
    Verbose = countif(severityLevel == 0),
    Info = countif(severityLevel == 1), 
    Warning = countif(severityLevel == 2),
    Error = countif(severityLevel == 3),
    Fatal = countif(severityLevel == 4) by bin(timestamp, 1d)
| extend Bad = (Error + Fatal + Warning), Good = (Verbose + Info)
// Determine the ratio of bad traces, from the total
| extend Ratio = (todouble(Bad) / todouble(Good + Bad))*10000
| project timestamp , Ratio
// Create a time series
| make-series RatioSeries=any(Ratio) default=0 on timestamp in range(startDate , endDate -1d, 1d) by 'TraceSeverity' 
// Apply a 2-line regression to the time series
| extend (RSquare2, SplitIdx, Variance2,RVariance2,LineFit2)=series_fit_2lines(RatioSeries)
// Find out if our 2-line is trending up or down
| extend (Slope,Interception,RSquare,Variance,RVariance,LineFit)=series_fit_line(LineFit2)
// Check whether the line fit reaches the threshold, and if the spike represents an increase (rather than a decrease)
| project PatternMatch = iff(RSquare2 > minRsquare and Slope>0, "Spike detected", "No Match")
```


## Next steps

- [Walk through a tutorial on Kusto query language](tutorial.md?pivots=azuremonitor).


::: zone-end

