---
title:  getschema operator 
description: Learn how to use the getschema operator to create a tabular schema of the input.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# getschema operator

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Produce a table that represents a tabular schema of the input.

## Syntax

*T* `|` `getschema`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Examples

The following example creates a tabular schema of the input.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAwsuyS/KdS1LzSsp5qpRSE8tKU7OSM1NBADhHoKkFwAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
StormEvents
| getschema
```

**Output**

|ColumnName|ColumnOrdinal|DataType|ColumnType|
|---|---|---|---|
|StartTime|0|System.DateTime|datetime|
|EndTime|1|System.DateTime|datetime|
|EpisodeId|2|System.Int32|int|
|EventId|3|System.Int32|int|
|State|4|System.String|string|
|EventType|5|System.String|string|
|InjuriesDirect|6|System.Int32|int|
|InjuriesIndirect|7|System.Int32|int|
|DeathsDirect|8|System.Int32|int|
|DeathsIndirect|9|System.Int32|int|
|DamageProperty|10|System.Int32|int|
|DamageCrops|11|System.Int32|int|
|Source|12|System.String|string|
|BeginLocation|13|System.String|string|
|EndLocation|14|System.String|string|
|BeginLat|15|System.Double|real|
|BeginLon|16|System.Double|real|
|EndLat|17|System.Double|real|
|EndLon|18|System.Double|real|
|EpisodeNarrative|19|System.String|string|
|EventNarrative|20|System.String|string|
|StormSummary|21|System.Object|dynamic|
