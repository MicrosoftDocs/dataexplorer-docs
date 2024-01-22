---
title:  Alter materialized view
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

`.alter` `materialized-view` [ `with` `(`*PropertyName* `=` *PropertyValue*`,`...`)`] *MaterializedViewName* `on table` *SourceTableName*  `{`  *Query* `}`

[!INCLUDE [syntax-conventions-note](../../../includes/syntax-conventions-note.md)]

## Parameters

| Name                            | Type   | Required | Description                                                                                                   |
|---------------------------------|--------|----------|---------------------------------------------------------------------------------------------------------------|
| *PropertyName*, *PropertyValue* | `string` |          | List of properties in the form of name and value pairs, from the list of [supported properties](#supported-properties). |
| *MaterializedViewName*          | `string` |  :heavy_check_mark:  | Name of the materialized view.                                                                                |
| *SourceTableName*               | `string` |  :heavy_check_mark:  | Name of source table on which the view is defined.                                                            |
| *Query*                         | `string` |  :heavy_check_mark:  | Query definition of the materialized view.                                                                    |

## Supported properties

The following properties are supported in the `with` `(`*PropertyName* `=` *PropertyValue*`)` clause. All properties are optional.

| Name                      | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|---------------------------|--------- |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| lookback                  | `timespan` | Valid only for `arg_max`/`arg_min`/`take_any` materialized views. It limits the period of time in which duplicates are expected. For example, if a lookback of 6 hours is specified on an `arg_max` view, the deduplication between newly ingested records and existing ones will take into consideration only records that were ingested up to 6 hours ago. <br><br>Lookback is relative to `ingestion_time`. Defining the lookback period incorrectly might lead to duplicates in the materialized view. For example, if a record for a specific key is ingested 10 hours after a record for the same key was ingested, and the lookback is set to 6 hours, that key will be a duplicate in the view. The lookback period is applied during both [materialization time](materialized-view-overview.md#how-materialized-views-work) and [query time](materialized-view-overview.md#materialized-views-queries). |
| autoUpdateSchema          | `bool` | Whether to automatically update the view on source table changes. Default is `false`. This option is valid only for views of type `arg_max(Timestamp, *)`/`arg_min(Timestamp, *)`/`take_any(*)` (only when the column's argument is `*`). If this option is set to `true`, changes to the source table will be automatically reflected in the materialized view.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| dimensionTables           | array    | A dynamic argument that includes an array of dimension tables in the view. See [Query parameter](materialized-view-create.md#query-parameter).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| folder                    | `string` | The materialized view's folder.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| docString                 | `string` | A string that documents the materialized view.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

## Returns

[!INCLUDE [materialized-view-show-command-output-schema.md](../../../includes/materialized-view-show-command-output-schema.md)]

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

## Use cases

* Add aggregations to the view - for example, add `avg` aggregation to `T | summarize count(), min(Value) by Id`, by altering view query to `T | summarize count(), min(Value), avg(Value) by Id`.
* Change operators other than the summarize operator. For example, filter out some records by altering  `T | summarize arg_max(Timestamp, *) by User` to `T | where User != 'someone' | summarize arg_max(Timestamp, *) by User`.
* Alter with no change to the query because of a change in source table. For example, assume a view of `T | summarize arg_max(Timestamp, *) by Id`, which isn't set to `autoUpdateSchema` (see [`.create materialized-view`](materialized-view-create.md) command). If a column is added or removed from the source table of the view, the view is automatically disabled. Execute the alter command, with the exact same query, to change the materialized view's schema to align with new table schema. The view still must be explicitly enabled following the change, using the [enable materialized view](materialized-view-enable-disable.md) command.

[!INCLUDE [materialized-view-alter-limitations.md](../../../includes/materialized-view-alter-limitations.md)]
