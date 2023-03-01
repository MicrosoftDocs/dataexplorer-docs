---
title: .create-or-alter materialized view - Azure Data Explorer
description: This article describes `.create-or-alter materialized view` in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 03/01/2023
---
# .create-or-alter materialized-view

Creates a materialized view or alters an existing materialized view.

## Permissions

You must have at least [Materialized View Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.create-or-alter` `materialized-view` <br>
[ `with` `(`*PropertyName* `=` *PropertyValue*`,`...`)`] <br>
*MaterializedViewName* `on table` *SourceTableName* <br>
`{`<br>&nbsp;&nbsp;&nbsp;&nbsp;*Query*<br>`}`

## Parameters

| Name                   | Type   | Required | Description                                                                                                                                                                                                                       |
|------------------------|--------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| *MaterializedViewName* | string | &check;  | The materialized view name. The view name can't conflict with table or function names in the same database and must adhere to the [identifier naming rules](../../query/schema-entities/entity-names.md#identifier-naming-rules). |
| *SourceTableName*      | string | &check;  | Name of source table on which the view is defined.                                                                                                                                                                                |
| *Query*                | string | &check;  | The materialized view query.                                                                                                                                                                                                      |

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
| Lookback          | timespan |  The time span limiting the period of time in which duplicates are expected.                                                                                                                |

## Examples

### Create or alter one materialized view

The following command creates a new or alters an existing materialized view called ArgMax:

```kusto
.create-or-alter materialized-view ArgMax on table T
{
    T | summarize arg_max(Timestamp, *) by User
}
```

**Output:**

| Name   | SourceTable | Query                                               | MaterializedTo                   | LastRun                      | LastRunResult | IsHealthy | IsEnabled | Folder           | DocString | AutoUpdateSchema | EffectiveDateTime            | Lookback   |
|--------|-------------|-----------------------------------------------------|----------------------------------|------------------------------|---------------|-----------|-----------|------------------|-----------|------------------|------------------------------|------------|
| ArgMax | T           | T \| summarize arg_max(Timestamp, *) by User        | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      |                  |           | false            | 2023-02-23T14:01:42.5172342Z |            |

## Remarks

If the materialized view does not exist, this command behaves just like [.create materialized-view](materialized-view-create.md).

If it does exist already, it allows you to change the values of SourceTableName, Query or any of the properties except for 'backfill'.

For more information, see the [Query parameter](materialized-view-create.md#query-parameter) and [Properties](materialized-view-create.md#properties) sections.

## Limitations

The command has the following limitations:

* See limitations in [alter materialized view limitations](materialized-view-alter.md#limitations).
* The `backfill` property isn't supported if the materialized view already exists. If the materialized view already exists, it can't be backfilled.
