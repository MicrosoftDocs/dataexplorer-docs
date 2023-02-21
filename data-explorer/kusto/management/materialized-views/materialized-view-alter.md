---
title: Alter materialized view - Azure Data Explorer
description: This article describes how to Alter materialized views in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/21/2023
---
# .alter materialized-view

Altering the [materialized view](materialized-view-overview.md) can be used for changing the query of a materialized view, while preserving the existing data in the view.

> [!WARNING]
> Be extra cautious when altering a materialized view. Incorrect use may lead to data loss.

## Permissions

You must have at least [Materialized View Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `materialized-view`  
[ `with` `(`*PropertyName* `=` *PropertyValue*`,`...`)`]  
*ViewName* `on table` *SourceTableName*  
`{`  
    &nbsp;&nbsp;&nbsp;&nbsp;*Query*  
`}`

## Parameters

|Name|Type|Required|Description|
|--|--|--|
|*ViewName*|string|&check;|The materialized view name.|
|*PropertyName*, *PropertyValue*|string||A list of [properties](#properties).|
|*SourceTableName*|string|&check;|The name of the source table on which the view is defined.|
|*Query*|string|&check;|The materialized view query.|

## Properties

The `dimensionTables` and `lookback` properties are the only supported properties in the materialized-view alter command. For more information about these, see the [`.create materialized-view`](materialized-view-create.md) command.

## Use cases

* Add aggregations to the view - for example, add `avg` aggregation to `T | summarize count(), min(Value) by Id`, by altering view query to `T | summarize count(), min(Value), avg(Value) by Id`.
* Change operators other than the summarize operator. Tor example, filter out some records by altering  `T | summarize arg_max(Timestamp, *) by User` to `T | where User != 'someone' | summarize arg_max(Timestamp, *) by User`.
* Alter with no change to the query because of a change in source table. Tor example, assume a view of `T | summarize arg_max(Timestamp, *) by Id`, which isn't set to `autoUpdateSchema` (see [`.create materialized-view`](materialized-view-create.md) command). If a column is added or removed from the source table of the view, the view will be automatically disabled. Execute the alter command, with the exact same query, to change the materialized view's schema to align with new table schema. The view still must be explicitly enabled following the change, using the [enable materialized view](materialized-view-enable-disable.md) command.

## Alter materialized view limitations

* **Changes not supported:**
    * Changing column type isn't supported.
    * Renaming columns isn't supported. For example, altering a view of `T | summarize count() by Id` to `T | summarize Count=count() by Id` will drop column `count_` and create a new column `Count`, which will initially contain nulls only.
    * Changes to the materialized view group by expressions aren't supported.

* **Impact on existing data:**
    * Altering the materialized view has no impact on existing data.
    * New columns will receive nulls for all existing records until records ingested post the alter command modify the null values.
        * For example: if a view of `T | summarize count() by bin(Timestamp, 1d)` is altered to `T | summarize count(), sum(Value) by bin(Timestamp, 1d)`, then for a particular `Timestamp=T` for which records have already been processed before altering the view, the `sum` column will contain partial data. This view only includes records processed after the alter execution.
    * Adding filters to the query doesn't change records that have already been materialized. The filter will only apply to newly ingested records.
