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

The following query returns rows that show breaks longer than 1 minute between calls to `sensor-9`.

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/SampleIoTData?query=H4sIAAAAAAAAA03NsQoCMRAE0F7wH7bLHZzFlRaxutrG62UhEwyYPcmuKOLHmyio5Rt2ZufConEpGeEA0aXoxMbr1ZNuJxTQJ9xzBnlPTt/cbF27UJTE5/RAA+4GCWQpY0oxkqfAhsZjqO5cTnI1uIHmmqlxvgwktdX9eez73+vv1I7GF5kk/q2nAAAA" target="_blank">Run the query</a>

```kusto
TransformedSensorsData
| where SensorName == 'sensor-9'
| serialize
| extend timeDiff = datetime_diff('minute', Timestamp, next(Timestamp, 1))
| where timeDiff > 1
```

**Output**

|Timestamp|SensorName|Value|PublisherId|MachineId|timeDiff|
|--|--|--|--|--|--|
|2022-04-13T01:00:02.310438Z|sensor-9|0.16466848661663813|98a43d44-6a91-4f6d-947d-482a527ac46e|M100|2|
|2022-04-13T01:01:17.841867Z|sensor-9|0.91778436344321279|f650058b-db3d-4bac-9d1d-014d0e554bad|M100|3|
|2022-04-13T01:01:23.286656Z|sensor-9|0.13072103950231728|56799397-35ae-4615-bd71-ec4a96ff231d|M100|3|
|2022-04-13T01:01:28.694515Z|sensor-9|0.88694998371843614|db9fc946-3934-4ed3-86f6-41adc99d1c60|M100|3|
|2022-04-13T01:01:33.337056Z|sensor-9|0.097825966284867713|2c5a8b3c-6bcb-440f-9f34-04e12a689c72|M100|3|
|...|...|...|...|...|...|

### Extend row with data from the next row

In the following query, a new column called `nextA` is added to the table with data from column `A` of the next row. A default value of 10 is used for rows without any data in column `A`. Then, the difference between the values in column `A` and the corresponding value in `nextA` is calculated and stored in a new column called `diff`. Finally, the table is filtered based on whether the value in column `A` is 1 greater than the corresponding value in `nextA`.

```kusto
Table
| serialize
| extend nextA = next(A,1,10)
| extend diff = A - nextA
| where diff > 1
```
