---
title:  autocluster plugin
description: Learn how to use the autocluster plugin to find common patterns in data. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/13/2023
---
# autocluster plugin

`autocluster` finds common patterns of discrete attributes (dimensions) in the data. It then reduces the results of the original query, whether it's 100 or 100,000 rows, to a few patterns. The plugin was developed to help analyze failures (such as exceptions or crashes) but can potentially work on any filtered dataset. The plugin is invoked with the [`evaluate`](evaluateoperator.md) operator.

> [!NOTE]
> `autocluster` is largely based on the Seed-Expand algorithm from the following paper: [Algorithms for Telemetry Data Mining using Discrete Attributes](https://www.scitepress.org/DigitalLibrary/PublicationsDetail.aspx?ID=d5kcrO+cpEU=&t=1).

## Syntax

*T* `|` `evaluate` `autocluster` `(`[*SizeWeight* [`,` *WeightColumn* [`,` *NumSeeds* [`,` *CustomWildcard* [`,` ... ]]]]]`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

The parameters must be ordered as specified in the [syntax](#syntax). To indicate that the default value should be used, put the string tilde value `~`. For more information, see [Examples](#examples).

| Name | Type | Required | Description |
|------|------|----------|-------------|
| *T* | string | &check; | The input tabular expression. |
| *SizeWeight* | double | | A double between 0 and 1 that controls the balance between generic (high coverage) and informative (many shared) values. Increasing this value typically reduces the quantity of patterns while expanding coverage. Conversely, decreasing this value generates more specific patterns characterized by increased shared values and a smaller percentage coverage. The default is `0.5`. The formula is a weighted geometric mean with weights `SizeWeight` and `1-SizeWeight`. |
| *WeightColumn* | string | | Considers each row in the input according to the specified weight. Each row has a default weight of `1`. The argument must be a name of a numeric integer column. A common usage of a weight column is to take into account sampling or bucketing or aggregation of the data that is already embedded into each row. |
| *NumSeeds* | int | | Determines the number of initial local search points. Adjusting the number of seeds impacts result quantity or quality based on data structure. Increasing seeds can enhance results but with a slower query tradeoff. Decreasing below five yields negligible improvements, while increasing above 50 rarely generates more patterns. The default is `25`.|
| *CustomWildcard* | string | | A type literal that sets the wildcard value for a specific type in the results table, indicating no restriction on this column. The default is `null`, which represents an empty string. If the default is a good value in the data, a different wildcard value should be used, such as `*`. You can include multiple custom wildcards by adding them consecutively.|

## Returns

The `autocluster` plugin usually returns a small set of patterns. The patterns capture portions of the data with shared common values across multiple discrete attributes. Each pattern in the results is represented by a row.

The first column is the segment ID. The next two columns are the count and percentage of rows out of the original query that are captured by the pattern. The remaining columns are from the original query. Their value is either a specific value from the column, or a wildcard value (which are by default null) meaning variable values.

The patterns aren't distinct, may be overlapping, and usually don't cover all the original rows. Some rows may not fall under any pattern.

> [!TIP]
> Use [where](./whereoperator.md) and [project](./projectoperator.md) in the input pipe to reduce the data to just what you're interested in.
>
> When you find an interesting row, you might want to drill into it further by adding its specific values to your `where` filter.

## Examples

### Using evaluate

```kusto
T | evaluate autocluster()
```

### Using autocluster

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAy1OPQ+CMBDd/RUvTBCNYdENF2VVk7I4NngIhrbkONAm/nhbcbr3lfdOiWNTzmRlXH3waokJxllpXeNJc6pEs1SdoQxFgV3I0FvI3nHSRj8IBbqmSRdyZDeMWP+ta2DE4nFAjg2SW6mSeM+XJAs1A7sn1YIwIBT03w+VHyJeCuLWrPsp+noSV/fTKMRpvt1nX4BZevm3AAAA" target="_blank">Run the query</a>

```kusto
StormEvents
| where monthofyear(StartTime) == 5
| extend Damage = iff(DamageCrops + DamageProperty > 0 , "YES" , "NO")
| project State , EventType , Damage
| evaluate autocluster(0.6)
```

**Output**

|SegmentId|Count|Percent|State|EventType|Damage|
|---|---|---|---|---|---|---|---|---|
|0|2278|38.7||Hail|NO
|1|512|8.7||Thunderstorm Wind|YES
|2|898|15.3|TEXAS||

### Using custom wildcards

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAzVOMQ6CQBDsfcWEBlBiiIklNkqrJtBYXnARDMeRZUFJjG/3TrTZ2ZnZzGwmhnU6Uiv94oVHRUzQppXKlBMpDjJRLHmtKUSSYGtv6CnUXnFQWt0ICeqyDGayZ9P1WP2ss2XEMmGHGBG8S5p5Do8nL7QxHZs7FQJbIGT17w/51Ll9DnBdo2oG56tBTNEMvRAH8XoTwX/7/7H0ww9RvGz7xgAAAA==" target="_blank">Run the query</a>

```kusto
StormEvents
| where monthofyear(StartTime) == 5
| extend Damage = iff(DamageCrops + DamageProperty > 0 , "YES" , "NO")
| project State , EventType , Damage
| evaluate autocluster(0.2, '~', '~', '*')
```

**Output**

|SegmentId|Count|Percent|State|EventType|Damage|
|---|---|---|---|---|---|---|---|---|
|0|2278|38.7|\*|Hail|NO
|1|512|8.7|\*|Thunderstorm Wind|YES
|2|898|15.3|TEXAS|\*|\*

## See also

* [basket](./basketplugin.md)
* [reduce](./reduceoperator.md)
