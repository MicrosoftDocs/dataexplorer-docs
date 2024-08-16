---
title:  sequence_detect plugin
description: Learn how to use the sequence_detect plugin to detect sequence occurrences based on provided predicates.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# sequence_detect plugin

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] 

Detects sequence occurrences based on provided predicates. The plugin is invoked with the [`evaluate`](evaluate-operator.md) operator.

## Syntax

*T* `| evaluate` `sequence_detect` `(`*TimelineColumn*`,` *MaxSequenceStepWindow*`,` *MaxSequenceSpan*`,` *Expr1*`,` *Expr2*`,` ..., *Dim1*`,` *Dim2*`,` ...`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T*| `string` |  :heavy_check_mark: | The input tabular expression.|
| *TimelineColumn*| `string` |  :heavy_check_mark: | The column reference representing timeline, must be present in the source expression.|
| *MaxSequenceStepWindow*| `timespan` |  :heavy_check_mark: | The value of the max allowed timespan between 2 sequential steps in the sequence.|
| *MaxSequenceSpan*| `timespan` |  :heavy_check_mark: | The max timespan for the sequence to complete all steps.|
| *Expr1*, *Expr2*, ...| `string` |  :heavy_check_mark: | The boolean predicate expressions defining sequence steps.|
| *Dim1*, *Dim2*, ...| `string` |  :heavy_check_mark: | The dimension expressions that are used to correlate sequences.|

## Returns

Returns a single table where each row in the table represents a single sequence occurrence:

* *Dim1*, *Dim2*, ...: dimension columns that were used to correlate sequences.
* *Expr1*_*TimelineColumn*, *Expr2*_*TimelineColumn*, ...: Columns with time values, representing the timeline of each sequence step.
* *Duration*: the overall sequence time window

## Examples

The following query looks at the table T to search for relevant data from a specified time period.

```kusto
T | evaluate sequence_detect(datetime_column, 10m, 1h, e1 = (Col1 == 'Val'), e2 = (Col2 == 'Val2'), Dim1, Dim2)
```

### Exploring Storm Events

The following query looks on the table StormEvents (weather statistics for 2007) and shows cases where sequence of 'Excessive Heat' was followed by 'Wildfire' within 5 days.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA3WPMQuDMBCFd3/F4aJCilPHjEJ3BccSklcaMNaaM7XQH99QXAz1xnvfx7tr+TG7JmBkn30IQQ2LYpDHc8GocTVgaC4z2k/LaubOOog0ORtBVNfkGRM5tZ44UofQVnMI3qFYlr/7uvcEkpLyZtXw3gbQJaZ5JSi1XnYwNzsjMYt+2xd/nPgR7+qrLywAQRgbAQAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| evaluate sequence_detect(
               StartTime,
               5d,  // step max-time
               5d,  // sequence max-time
               heat=(EventType == "Excessive Heat"), 
               wildfire=(EventType == 'Wildfire'), 
               State
           )
```

**Output**

|State|heat_StartTime|wildfire_StartTime|Duration|
|---|---|---|---|
|CALIFORNIA|2007-05-08 00:00:00.0000000|2007-05-08 16:02:00.0000000|16:02:00|
|CALIFORNIA|2007-05-08 00:00:00.0000000|2007-05-10 11:30:00.0000000|2.11:30:00|
|CALIFORNIA|2007-07-04 09:00:00.0000000|2007-07-05 23:01:00.0000000|1.14:01:00|
|SOUTH DAKOTA|2007-07-23 12:00:00.0000000|2007-07-27 09:00:00.0000000|3.21:00:00|
|TEXAS|2007-08-10 08:00:00.0000000|2007-08-11 13:56:00.0000000|1.05:56:00|
|CALIFORNIA|2007-08-31 08:00:00.0000000|2007-09-01 11:28:00.0000000|1.03:28:00|
|CALIFORNIA|2007-08-31 08:00:00.0000000|2007-09-02 13:30:00.0000000|2.05:30:00|
|CALIFORNIA|2007-09-02 12:00:00.0000000|2007-09-02 13:30:00.0000000|01:30:00|
