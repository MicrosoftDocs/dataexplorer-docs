---
title: next() - Azure Data Explorer
description: Learn how to use the next() function to return the value of the next column at an offset. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 03/22/2023
---
# next()

Returns the value of a column in a row that is at some offset following the
current row in a [serialized row set](./windowsfunctions.md#serialized-row-set).

## Syntax

`next(`*column*`,` [ *offset*`,` *default_value* ]`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *column*| string |  &check; | The column from which to get the values.|
| *offset*| int | | The amount of rows to move from the current row. Default is 1. |
| *default_value*| scalar | | The default value when there's no value in the next row. When no default value is specified, `null` is used.|

## Examples

### Filter data based on comparison between adjacent rows

The following query returns rows that show breaks longer than a quarter of a second between calls to `sensor-9`.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/SampleIoTData?query=H4sIAAAAAAAAA3WOMQvCMBCFd8H/8La0UEEFB4c4dXHQxe5yNhcMNKnkAir4400U7OR27313710XKYgdo2dz4iBjlJYSzWcv3K8cGV/zSJ6hNZR85GKrykaeEi5PdM6zJPI3kPQF8CNxMEjZb521+3Bww+CE+zEYgYahxAWeTaaV8hNVDUK+rn6RDVZ1MzXU02d/0ndYb5ZvMSIuUtYAAAA=" target="_blank">Run the query</a>

```kusto
TransformedSensorsData
| where SensorName == 'sensor-9'
| sort by Timestamp asc
| extend timeDiffInMilliseconds = datetime_diff('millisecond', next(Timestamp, 1), Timestamp)
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
| extend timeDiffInMilliseconds = datetime_diff('millisecond', next(Timestamp, 1), Timestamp)
| summarize avg(timeDiffInMilliseconds)
```

**Output**

|avg_timeDiffInMilliseconds|
|--|
|30.726900061254298

### Extend row with data from the next row

In the following query, a new column called `nextA` is added to the table with data from column `A` of the next row. A default value of 10 is used for rows without any data in column `A`. Then, the difference between the values in column `A` and the corresponding value in `nextA` is calculated and stored in a new column called `diff`. Finally, the table is filtered based on whether the value in column `A` is 1 greater than the corresponding value in `nextA`.

```kusto
Table
| serialize
| extend nextA = next(A,1,10)
| extend diff = A - nextA
| where diff > 1
```
