---
title:  funnel_sequence_completion plugin
description: Learn how to use the funnel_sequence_completion plugin to calculate a funnel of completed sequence steps while comparing different time periods.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# funnel_sequence_completion plugin

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] 

Calculates a funnel of completed sequence steps while comparing different time periods. The plugin is invoked with the [`evaluate`](evaluate-operator.md) operator.

## Syntax

*T* `| evaluate` `funnel_sequence_completion(`*IdColumn*`,` *TimelineColumn*`,` *Start*`,` *End*`,` *BinSize*`,` *StateColumn*`,` *Sequence*`,` *MaxSequenceStepWindows*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *T* | `string` |  :heavy_check_mark: | The input tabular expression. |
| *IdColum* | `string` |  :heavy_check_mark: | The column reference representing the ID. The column must be present in *T*.|
| *TimelineColumn* | `string` |  :heavy_check_mark: | The column reference representing the timeline. The column must be present in *T*.|
| *Start* | datetime, timespan, or long |  :heavy_check_mark: | The analysis start period.|
| *End* | datetime, timespan, or long |  :heavy_check_mark: | The analysis end period.|
| *BinSize* | datetime, timespan, or long |  :heavy_check_mark: | The analysis window size. Each window is analyzed separately.|
| *StateColumn* | `string` |  :heavy_check_mark: | The column reference representing the state. The column must be present in *T*.|
| *Sequence* | `dynamic` |  :heavy_check_mark: | An array with the sequence values that are looked up in `StateColumn`.|
| *MaxSequenceStepPeriods* | `dynamic` |  :heavy_check_mark: | An array with the values of the max allowed timespan between the first and last sequential steps in the sequence. Each period in the array generates a funnel analysis result.|

## Returns

Returns a single table useful for constructing a funnel diagram for the analyzed sequence:

* `TimelineColumn`: the analyzed time window (bin), each bin in the analysis timeframe (*Start* to *End*) generates a funnel analysis separately.
* `StateColumn`: the state of the sequence.
* `Period`: the maximal period allowed for completing steps in the funnel sequence measured from the first step in the sequence. Each value in *MaxSequenceStepPeriods* generates a funnel analysis with a separate period.
* `dcount`: distinct count of `IdColumn` in time window that transitioned from first sequence state to the value of `StateColumn`.

## Examples

### Exploring Storm Events

The following query checks the completion funnel of the sequence: `Hail` -> `Tornado` -> `Thunderstorm Wind`
in "overall" time of 1hour, 4hours, 1day.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA1WQywrCMBBF937F7FohQusbxKWg6xZciEjojBhIJzVJFcWPNylVFBIIw8nh3tHk4eS8tB7WgNKTVzWl4yxbjLI8nOFqoCNCjAH4I5b/xF0xmnuhnhTAyXyG/dzRtSWu4hQfLGtVpYdkK5VOBCSlsSzRdM9Ly0jWeWNr2AdZcvyoG7LKoPs15BcB03BzjFQRP21uxN4NXkA3qdsQFM4tM+lvglNl6iYIleF00yhnkHYooIjty1BK9JsQXV3xW0lAZy8fTUf1QvGNNnwDOQRUXkgBAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
let _start = datetime(2007-01-01);
let _end =  datetime(2008-01-01);
let _windowSize = 365d;
let _sequence = dynamic(['Hail', 'Tornado', 'Thunderstorm Wind']);
let _periods = dynamic([1h, 4h, 1d]);
StormEvents
| evaluate funnel_sequence_completion(EpisodeId, StartTime, _start, _end, _windowSize, EventType, _sequence, _periods) 
```

**Output**

|`StartTime`|`EventType`|`Period`|`dcount`|
|---|---|---|---|
|2007-01-01 00:00:00.0000000|Hail|01:00:00|2877|
|2007-01-01 00:00:00.0000000|Tornado|01:00:00|208|
|2007-01-01 00:00:00.0000000|Thunderstorm Wind|01:00:00|87|
|2007-01-01 00:00:00.0000000|Hail|04:00:00|2877|
|2007-01-01 00:00:00.0000000|Tornado|04:00:00|231|
|2007-01-01 00:00:00.0000000|Thunderstorm Wind|04:00:00|141|
|2007-01-01 00:00:00.0000000|Hail|1.00:00:00|2877|
|2007-01-01 00:00:00.0000000|Tornado|1.00:00:00|244|
|2007-01-01 00:00:00.0000000|Thunderstorm Wind|1.00:00:00|155|

Understanding the results:  
The outcome is three funnels (for periods: One hour, 4 hours, and one day). For each funnel step, a number of distinct counts of  are shown. You can see that the more time is given to complete the whole sequence of `Hail` -> `Tornado` -> `Thunderstorm Wind`, the higher `dcount` value is obtained. In other words, there were more occurrences of the sequence reaching the funnel step.

## Related content

* [scan operator](scan-operator.md)
