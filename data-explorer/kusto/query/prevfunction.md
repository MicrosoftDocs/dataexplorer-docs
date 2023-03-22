---
title: prev() - Azure Data Explorer
description: Learn how to use the prev() function to return the value of a specific column in a specified row.
ms.reviewer: alexans
ms.topic: reference
ms.date: 03/22/2023
---
# prev()

Returns the value of a specific column in a specified row.
The specified row is at a specified offset from the current row in a [serialized row set](./windowsfunctions.md#serialized-row-set).

## Syntax

`prev(`*column*`,` [ *offset* ]`,` [ *default_value* ] `)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *column*| string | &check; | The column from which to get the values.|
| *offset*| int | | The offset to go back in rows. The default is 1.|
| *default_value*| scalar | | The default value to be used when there are no previous rows from which to take the value. The default is `null`.|

## Examples

### Filter data based on comparison between adjacent rows

The following query returns rows that show breaks longer than a quarter of a second between calls to `sensor-9`.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/SampleIoTData?query=H4sIAAAAAAAAA3WOvQoCMRCEe8F32C53cIIKFhZndY2FNl4v62WDgUtyZBd/wIc30SI2djPzDcP0ET2bEB3pE3kOkTsUnM9ecL9SJPiGR3QEbQuKP3axVbmRlMDlCb11xIJuAuQhA3oIeQ2S8s4as/cHO46WaQheM7SgUSjDs060Uq5Q1ZS1BqZIt+rHr+q6PPuzvoP1ZvkGO/YBANYAAAA=" target="_blank">Run the query</a>

```kusto
TransformedSensorsData
| where SensorName == 'sensor-9'
| sort by Timestamp asc
| extend timeDiffInMilliseconds = datetime_diff('millisecond', Timestamp, prev(Timestamp, 1))
| where timeDiffInMilliseconds > 250
```

**Output**

|Timestamp|SensorName|Value|PublisherId|MachineId|timeDiff|
|--|--|--|--|--|--|
|2022-04-13T00:58:53.048506Z|sensor-9|0.39217481975439894|fdbd39ab-82ac-4ca0-99ed-2f83daf3f9bb|M100|251|
|2022-04-13T01:07:09.63713Z|sensor-9|0.46645392778288297|e3ed081e-501b-4d59-8e60-8524633d9131|M100|313|
|2022-04-13T01:07:10.858267Z|sensor-9|0.693091598493419|278ca033-2b5e-4f2c-b493-00319b275aea|M100|254|
|2022-04-13T01:07:11.203834Z|sensor-9|0.52415808840249778|4ea27181-392d-4947-b811-ad5af02a54bb|M100|331|
|2022-04-13T01:07:14.431908Z|sensor-9|0.35430645405452|0af415c2-59dc-4a50-89c3-9a18ae5d621f|M100|268|
|...|...|...|...|...|...|

### Perform aggregation based on comparison between adjacent rows

The following query calculates the average time difference in milliseconds between calls to `sensor-9`.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/SampleIoTData?query=H4sIAAAAAAAAA22NvQ6CQBCEexPfYbuDBAtLi+toLLSB3qzcopewB7ld8Sc+vBwWWNjNzDeZqSMGafvI5CoK0kcpUXG9esP9SpHgGx6RCawFI7Pd7ExqTErh/ITaM4kiD4DSJEAPpeBAp7z0bbsPB991XqjpgxOw4FApwZObaGZ4oaZY1goYIo3Zj9/m+fx7Y8boXwQ4XrL/L/kHqqI6JdkAAAA=" target="_blank">Run the query</a>

```kusto
TransformedSensorsData
| where SensorName == 'sensor-9'
| sort by Timestamp asc
| extend timeDiffInMilliseconds = datetime_diff('millisecond', Timestamp, prev(Timestamp, 1))
| summarize avg(timeDiffInMilliseconds)
```

**Output**

|avg_timeDiffInMilliseconds|
|--|
|30.726900061254298

### Extend row with data from the previous row

In the following query, a new column called `prevA` is added to the table with data from column `A` of the previous row. A default value of 10 is used for rows without any data in column `A`. Then, the difference between the values in column `A` and the corresponding value in `prevA` is calculated and stored in a new column called `diff`. Finally, the table is filtered based on whether the value in column `A` is 1 greater than the corresponding value in `prevA`.

```kusto
Table
| serialize 
| extend prevA = prev(A,1,10)
| extend diff = A - prevA
| where diff > 1
```
