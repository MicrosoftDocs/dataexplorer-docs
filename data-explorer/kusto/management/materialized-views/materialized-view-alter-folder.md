---
title: .alter materialized view folder - Azure Data Explorer
description: This article describes alter materialized view folder in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 03/01/2023
---
# .alter materialized-view folder

Alters the folder value of an existing materialized view.

## Permissions

You must have at least [Materialized View Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `materialized-view` *MaterializedViewName* `folder` '*Folder*'

## Parameters

| Name                   | Type   | Required | Description                                                                                                                                                                   |
|------------------------|--------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| *MaterializedViewName* | string | &check;  | Name of the materialized view.                                                                                                                                                |
| *Folder*               | string | &check;  | A folder path that is used to organize materialized views in the UI. The value of this parameter doesn't change the way in which the view works or is referred to in queries. |

## Returns

Following is the schema of the output returned:

| Name              | Type     | Description                                                                                                                                                                                 |
|-------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Name              | string   | Name of the materialized view.                                                                                                                                                              |
| SourceTable       | string   | Name of source table on which the view is defined.                                                                                                                                          |
| Query             | string   | Query definition of the materialized view.                                                                                                                                                  |
| MaterializedTo    | datetime | Maximum materialized ingestion_time() timestamp in source table. For more information, see [how materialized views work](materialized-view-overview.md#how-materialized-views-work).        |
| LastRun           | datetime | Last time materialization was run.                                                                                                                                                          |
| LastRunResult     | string   | Result of last run. Returns `Completed` for successful runs, otherwise `Failed`.                                                                                                            |
| IsHealthy         | bool     | `true` when view is considered healthy, `false` otherwise. View is considered healthy if it was successfully materialized up to the last hour (`MaterializedTo` is greater than `ago(1h)`). |
| IsEnabled         | bool     | `true` when view is enabled (see [Disable or enable materialized view](materialized-view-enable-disable.md)).                                                                               |
| Folder            | string   | Folder under which the materialized view is created.                                                                                                                                        |
| DocString         | string   | Description assigned to the materialized view.                                                                                                                                              |
| AutoUpdateSchema  | bool     | Whether the view is enabled for auto updates.                                                                                                                                               |
| EffectiveDateTime | datetime | Effective date time of the view, determined during creation time (see [`.create materialized-view`](materialized-view-create.md#create-materialized-view)).                                 |
| Lookback          | timespan | Time span limiting the period of time in which duplicates are expected.                                                                                                                     |

## Examples

### Set the folder of a materialized view to one under root

The following command sets the folder in which a materialized view must be shown to one under the root folder:

```kusto
.alter materialized-view MyView folder "Updated folder"
```

**Output:**

| Name   | SourceTable | Query                                       | MaterializedTo                   | LastRun                      | LastRunResult | IsHealthy | IsEnabled | Folder           | DocString | AutoUpdateSchema | EffectiveDateTime            | Lookback   |
|--------|-------------|---------------------------------------------|----------------------------------|------------------------------|---------------|-----------|-----------|------------------|-----------|------------------|------------------------------|------------|
| MyView | MyTable     | MyTable \| summarize take_any(*) by Column1 | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      | "Updated folder" |           | true             | 2023-02-23T14:01:42.5172342Z |            |

### Set the folder of a materialized view to one two levels under root

The following command sets the folder in which a materialized view must be shown to one two levels under root folder:

```kusto
.alter materialized-view MyView folder @"First Level\Second Level"
```

**Output:**

| Name   | SourceTable | Query                                       | MaterializedTo                   | LastRun                      | LastRunResult | IsHealthy | IsEnabled | Folder                     | DocString | AutoUpdateSchema | EffectiveDateTime            | Lookback   |
|--------|-------------|---------------------------------------------|----------------------------------|------------------------------|---------------|-----------|-----------|----------------------------|-----------|------------------|------------------------------|------------|
| MyView | MyTable     | MyTable \| summarize take_any(*) by Column1 | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      | "First Level\Second Level" |           | true             | 2023-02-23T14:01:42.5172342Z | 6:00:00:00 |
