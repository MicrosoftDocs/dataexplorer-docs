---
title: show materialized view commands - Azure Data Explorer
description: This article describes show materialized views commands in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/21/2023
---

# .show materialized-views commands

The following show commands display information about [materialized views](materialized-view-overview.md).

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## .show materialized-view

Displays information about the materialized view's definition and its current state.

### Syntax

`.show` `materialized-view` *MaterializedViewName*

`.show` `materialized-views`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *MaterializedViewName* | string | &check; | The name of the materialized view. |

### Example

```kusto
.show materialized-view ViewName
```

### Output

|Output parameter |Type |Description
|---|---|---
|Name  |String |The name of the materialized view.
|SourceTable|String|The source table of the materialized view.
|Query|String|The materialized view query.
|MaterializedTo|datetime|The max materialized ingestion_time() timestamp in source table. For more information, see [how materialized views work](materialized-view-overview.md#how-materialized-views-work).
|LastRun|datetime |The last time materialization was run.
|LastRunResult|String|Result of last run. Returns `Completed` for successful runs, otherwise `Failed`.
|IsHealthy|bool|`True` when view is considered healthy, `False` otherwise. View is considered healthy if it was successfully materialized up to the last hour (`MaterializedTo` is greater than `ago(1h)`).
|IsEnabled|bool|`True` when view is enabled (see [Disable or enable materialized view](materialized-view-enable-disable.md)).
|Folder|string|The materialized view folder.
|DocString|string|The materialized view doc string.
|AutoUpdateSchema|bool|Whether the view is enabled for auto updates.
|EffectiveDateTime|datetime|The effective date time of the view, determined during creation time (see [`.create materialized-view`](materialized-view-create.md#create-materialized-view)).

## .show materialized-view schema

Returns the schema of the materialized view in CSL/JSON.

### Syntax

`.show` `materialized-view` *MaterializedViewName* `cslschema`

`.show` `materialized-view` *MaterializedViewName* `schema` `as` `json`

`.show` `materialized-view` *MaterializedViewName* `schema` `as` `csl`

### Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *MaterializedViewName* | string | &check; | The name of the materialized view. |

### Output parameters

| Output parameter | Type   | Description                                               |
|------------------|--------|-----------------------------------------------------------|
| TableName        | String | The name of the materialized view.                        |
| Schema           | String | The materialized view csl schema                          |
| DatabaseName     | String | The database to which the materialized view belongs       |
| Folder           | String | Materialized view's folder                                |
| DocString        | String | Materialized view's docstring                             |

## .show materialized-view extents

Returns the extents in the *materialized* part of the materialized view. For a definition of the *materialized* portion, see [how materialized views work](materialized-view-overview.md#how-materialized-views-work).

This command provides the same details as the [show table extents](../show-extents.md#table-scope) command.

### Syntax

`.show` `materialized-view` *MaterializedViewName* `extents` [`hot`]

### Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *MaterializedViewName* | string | &check; | The name of the materialized view. |

## .show materialized-view failures

Returns failures that occurred as part of the materialization process of the materialized view.

### Syntax

`.show` `materialized-view` *MaterializedViewName* `failures`

### Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *MaterializedViewName* | string | &check; | The name of the materialized view. |

### Output

|Output parameter |Type |Description
|---|---|---
|Name  |Timestamp |Failure timestamp.
|OperationId  |String |The operation ID of the run that failed.
|Name|String|The materialized view name.
|LastSuccessRun|datetime|The timestamp of the last run that completed successfully.
|FailureKind|String|Type of failure.
|Details|String|Failure details.

