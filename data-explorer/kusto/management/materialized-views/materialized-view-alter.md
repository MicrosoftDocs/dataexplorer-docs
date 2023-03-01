---
title: Alter materialized view - Azure Data Explorer
description: This article describes how to Alter materialized views in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 03/01/2023
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
*MaterializedViewName* `on table` *SourceTableName*  
`{`  
    &nbsp;&nbsp;&nbsp;&nbsp;*query*  
`}`

## Parameters

| Name                   | Type   | Required | Description                                        |
|------------------------|--------|----------|----------------------------------------------------|
| *MaterializedViewName* | string | &check;  | The materialized view name.                        |
| *SourceTableName*      | string | &check;  | Name of source table on which the view is defined. |
| *Query*                | string | &check;  | The materialized view query.                       |

## Returns

| Name              | Type     | Description                                                                                                                                                                                 |
|-------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Name              | string   | The name of the materialized view.                                                                                                                                                          |
| SourceTable       | string   | The source table of the materialized view.                                                                                                                                                  |
| Query             | string   | The materialized view query.                                                                                                                                                                |
| MaterializedTo    | datetime | The max materialized ingestion_time() timestamp in source table. For more information, see [how materialized views work](materialized-view-overview.md#how-materialized-views-work).        |
| LastRun           | datetime | The last time materialization was run.                                                                                                                                                      |
| LastRunResult     | string   | Result of last run. Returns `Completed` for successful runs, otherwise `Failed`.                                                                                                            |
| IsHealthy         | bool     | `true` when view is considered healthy, `false` otherwise. View is considered healthy if it was successfully materialized up to the last hour (`MaterializedTo` is greater than `ago(1h)`). |
| IsEnabled         | bool     | `true` when view is enabled (see [Disable or enable materialized view](materialized-view-enable-disable.md)).                                                                               |
| Folder            | string   | The materialized view folder.                                                                                                                                                               |
| DocString         | string   | The materialized view doc string.                                                                                                                                                           |
| AutoUpdateSchema  | bool     | Whether the view is enabled for auto updates.                                                                                                                                               |
| EffectiveDateTime | datetime | The effective date time of the view, determined during creation time (see [`.create materialized-view`](materialized-view-create.md#create-materialized-view)).                             |
| Lookback          | timespan | The time span limiting the period of time in which duplicates are expected.                                                                                                                 |

## Examples

### Modify the query definition of a materialized view

The following command modifies the query definition of materialized view MyView:

```kusto
.alter materialized-view MyView on table MyTable
{
    MyTable | summarize arg_max(Column3, *) by Column1
}
```

**Output:**

| Name   | SourceTable | Query                                               | MaterializedTo                   | LastRun                      | LastRunResult | IsHealthy | IsEnabled | Folder           | DocString | AutoUpdateSchema | EffectiveDateTime            | Lookback   |
|--------|-------------|-----------------------------------------------------|----------------------------------|------------------------------|---------------|-----------|-----------|------------------|-----------|------------------|------------------------------|------------|
| MyView | MyTable     | MyTable \| summarize arg_max(Column3, *) by Column1 | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      |                  |           | false            | 2023-02-23T14:01:42.5172342Z |            |

## Remarks

The `dimensionTables` and `lookback` properties are the only supported properties in the `.alter materialized-view` command. For more information about these properties, see the [`.create materialized-view`](materialized-view-create.md) command.

## Use cases

* Add aggregations to the view - for example, add `avg` aggregation to `T | summarize count(), min(Value) by Id`, by altering view query to `T | summarize count(), min(Value), avg(Value) by Id`.
* Change operators other than the summarize operator. For example, filter out some records by altering  `T | summarize arg_max(Timestamp, *) by User` to `T | where User != 'someone' | summarize arg_max(Timestamp, *) by User`.
* Alter with no change to the query because of a change in source table. For example, assume a view of `T | summarize arg_max(Timestamp, *) by Id`, which isn't set to `autoUpdateSchema` (see [`.create materialized-view`](materialized-view-create.md) command). If a column is added or removed from the source table of the view, the view is automatically disabled. Execute the alter command, with the exact same query, to change the materialized view's schema to align with new table schema. The view still must be explicitly enabled following the change, using the [enable materialized view](materialized-view-enable-disable.md) command.

## Limitations

* **Changes not supported:**
  * Changing column type isn't supported.
  * Renaming columns isn't supported. For example, altering a view of `T | summarize count() by Id` to `T | summarize Count=count() by Id` drops column `count_` and creates a new column `Count`, which initially contains nulls only.
  * Changes to the materialized view group by expressions aren't supported.

* **Impact on existing data:**
  * Altering the materialized view has no impact on existing data.
  * New columns receive nulls for all existing records until records ingested after the alter command modify the null values.
    * For example: if a view of `T | summarize count() by bin(Timestamp, 1d)` is altered to `T | summarize count(), sum(Value) by bin(Timestamp, 1d)`, then for a particular `Timestamp=T` for which records have already been processed before altering the view, the `sum` column contains partial data. This view only includes records processed after the alter execution.
  * Adding filters to the query doesn't change records that have already been materialized. The filter will only apply to newly ingested records.
