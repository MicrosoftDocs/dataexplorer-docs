---
title: .show tables command
description: Learn how to use the `.show tables` command to show a set that contains the specified tables in the database.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 12/09/2024
---
# .show tables command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Returns a set that contains the specified tables or all tables in the database.

> [!NOTE]
> For table statistics, see the [.show table data statistics](show-table-data-statistics.md) command.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `tables` [`(`*TableName* [`,` ...]`)`]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*TableName*| `string` ||The name of the table to show.|

## Returns


|Output parameter |Type |Description
|---|---|---
|TableName  | `string` |The name of the table.
|DatabaseName  | `string` |The database that the table belongs to.
|Folder | `string` |The table's folder.
|DocString | `string` |A string documenting the table.

## Examples

```kusto
.show tables
```


**Output example**

|Table Name|Database Name|Folder|DocString|
|---|---|---|---|
|StormEvents|Samples|Storm_Events|US storm events. Data source: https://www.ncdc.noaa.gov/stormevents|
|demo_make_series1|Samples|TimeSeries_and_ML||
|demo_series2|Samples|TimeSeries_and_ML||
|demo_series3|Samples|TimeSeries_and_ML||
|demo_many_series1|Samples|TimeSeries_and_ML||
|ConferenceSessions|Samples|ADX_Conferences||



```kusto
.show tables (PopulationData, StormEvents, Trips, GeoRegions)
```

**Output example**

|Table Name |Database Name |Folder | DocString
|---|---|---|---
|StormEvents|	Samples	|Storm_Events|	US storm events. Data source: https://www.ncdc.noaa.gov/stormevents|
|PopulationData|Samples|	Storm_Events|	
|GeoRegions|	Samples|	NYC Taxi	|
|Trips|	Samples|	NYC Taxi	|

