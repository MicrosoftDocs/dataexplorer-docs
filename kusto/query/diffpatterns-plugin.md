---
title:  diffpatterns plugin
description: Learn how to use the diffpatterns plugin to compare two datasets of the same structure to find the differences between the two datasets. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# diffpatterns plugin

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Compares two datasets of the same structure and finds patterns of discrete attributes (dimensions) that characterize differences between the two datasets. The plugin is invoked with the [`evaluate`](evaluate-operator.md) operator.

`diffpatterns` was developed to help analyze failures (for example, by comparing failures to non-failures in a given time frame), but can potentially find differences between any two datasets of the same structure.

> [!NOTE]
> `diffpatterns` aims to find significant patterns (that capture portions of the data difference between the sets) and isn't meant for row-by-row differences.

## Syntax

`T | evaluate diffpatterns(`*SplitColumn*`,` *SplitValueA*`,` *SplitValueB* [`,` *WeightColumn*`,`*Threshold*`,` *MaxDimensions*`,` *CustomWildcard*`,` ...]`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*SplitColumn*| `string` | :heavy_check_mark:|The column name that tells the algorithm how to split the query into datasets. According to the specified values for the *SplitValueA* and *SplitValueB* arguments, the algorithm splits the query into two datasets, “A” and “B”, and analyzes the differences between them. As such, the split column must have at least two distinct values.|
|*SplitValueA*| `string` | :heavy_check_mark:|A string representation of one of the values in the *SplitColumn* that was specified. All the rows that have this value in their *SplitColumn* considered as dataset “A”.|
|*SplitValueB*| `string` | :heavy_check_mark:|A string representation of one of the values in the *SplitColumn* that was specified. All the rows that have this value in their *SplitColumn* considered as dataset “B”.|
|*WeightColumn*| `string` ||The column used to consider each row in the input according to the specified weight. Must be a name of a numeric column, such as `int`, `long`, `real`. By default each row has a weight of '1'. To use the default value, input the tilde: `~`. A common usage of a weight column is to take into account sampling or bucketing/aggregation of the data that is already embedded into each row.<br/><br/>Example: `T | extend splitColumn= iff(request_responseCode == 200, "Success" , "Failure") | evaluate diffpatterns(splitColumn, "Success","Failure", sample_Count)`|
|*Threshold*| `long` ||A long in the range of 0.015 to 1. This value sets the minimal pattern ratio difference between the two sets. The default is 0.05. To use the default value, input the tilde: `~`.<br/><br/>Example:  `T | extend splitColumn = iff(request-responseCode == 200, "Success" , "Failure") | evaluate diffpatterns(splitColumn, "Success","Failure", "~", 0.04)`|
|*MaxDimensions*| `int` ||Sets the maximum number of uncorrelated dimensions per result pattern. By specifying a limit, you decrease the query runtime. The default is unlimited. To use the default value, input the tilde: `~`.<br/><br/>Example:  `T | extend splitColumn = iff(request-responseCode == 200, "Success" , "Failure") | evaluate diffpatterns(splitColumn, "Success","Failure", "~", "~", 3)`|
|*CustomWildcard*| `string` ||Sets the wildcard value for a specific type in the result table that will indicate that the current pattern doesn't have a restriction on this column. The default is null, except for string columns for which the default is an empty string. If the default is a viable value in the data, a different wildcard value should be used. For example, `*`. To use the default value, input the tilde: `~`.<br/><br/>Example: `T | extend splitColumn = iff(request-responseCode == 200, "Success" , "Failure") | evaluate diffpatterns(splitColumn, "Success","Failure", "~", "~", "~", int(-1), double(-1), long(0), datetime(1900-1-1))`|

## Returns

`diffpatterns` returns a small set of patterns that capture different portions of the data in the two sets (that is, a pattern capturing a large percentage of the rows in the first dataset and low percentage of the rows in the second set). Each pattern is represented by a row in the results.

The result of `diffpatterns` returns the following columns:

* SegmentId: the identity assigned to the pattern in the current query (note: IDs aren't guaranteed to be the same in repeating queries).

* CountA: the number of rows captured by the pattern in Set A (Set A is the equivalent of `where tostring(splitColumn) == SplitValueA`).

* CountB: the number of rows captured by the pattern in Set B (Set B is the equivalent of `where tostring(splitColumn) == SplitValueB`).

* PercentA: the percentage of rows in Set A captured by the pattern (100.0 * CountA / count(SetA)).

* PercentB: the percentage of rows in Set B captured by the pattern (100.0 * CountB / count(SetB)).

* PercentDiffAB: the absolute percentage point difference between A and B (|PercentA - PercentB|) is the main measure of significance of patterns in describing the difference between the two sets.

* Rest of the columns: are the original schema of the input and describe the pattern, each row (pattern) represents the intersection of the non-wildcard values of the columns (equivalent of `where col1==val1 and col2==val2 and ... colN=valN` for each non-wildcard value in the row).

For each pattern, columns that aren't set in the pattern (that is, without restriction on a specific value) will contain a wildcard value, which is null by default. See in the Arguments section below how wildcards can be manually changed.

* Note: the patterns are often not distinct. They may be overlapping, and usually don't cover all the original rows. Some rows may not fall under any pattern.

> [!TIP]
>
> * Use [where](where-operator.md) and [project](project-operator.md) in the input pipe to reduce the data to just what you're interested in.
> * When you find an interesting row, you might want to drill into it further by adding its specific values to your `where` filter.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAzVNvQ6CYAzcfYoLE0QHGBxxUXcTeIEvUATj95NSUBIf3n6gQ9u79npXiWd7ncnJiN0Hr56YYL2T3ncLGU4rMSz1YClDWeKoGnoLuRYXY82dUGLounQjZ/ZhxP53uikjlgUn5Dig0Moz/Q/sH9QI1FlIl2t6vYSIKz9xE8Fm8Z+rcYyezXOKX62GBiNC7Mb0r03yRFuRIPsCQuCK6dYAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents 
| where monthofyear(StartTime) == 5
| extend Damage = iff(DamageCrops + DamageProperty > 0 , 1 , 0)
| project State , EventType , Source , Damage, DamageCrops
| evaluate diffpatterns(Damage, "0", "1" )
```

**Output**

|SegmentId|CountA|CountB|PercentA|PercentB|PercentDiffAB|State|EventType|Source|DamageCrops|
|---|---|---|---|---|---|---|---|---|---|
|0|2278|93|49.8|7.1|42.7||Hail||0|
|1|779|512|17.03|39.08|22.05||Thunderstorm Wind|||
|2|1098|118|24.01|9.01|15|||Trained Spotter|0|
|3|136|158|2.97|12.06|9.09|||Newspaper||
|4|359|214|7.85|16.34|8.49||Flash Flood|||
|5|50|122|1.09|9.31|8.22|IOWA||||
|6|655|279|14.32|21.3|6.98|||Law Enforcement||
|7|150|117|3.28|8.93|5.65||Flood|||
|8|362|176|7.91|13.44|5.52|||Emergency Manager||
