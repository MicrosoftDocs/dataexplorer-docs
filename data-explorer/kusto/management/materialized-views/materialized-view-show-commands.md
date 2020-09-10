---
title: show materialized view commands - Azure Data Explorer
description: This article describes show materialized views commands in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 08/30/2020
---

# Materialized views show commands

## .show materialized-view

Displays information about the materialized view's definition and its current state.

### Syntax

`.show` `materialized-view` *MaterializedViewName*

`.show` `materialized-views`

### Properties

|Property|Type|Description
|----------------|-------|---|
|MaterializedViewName|String|Name of the materialized view.|

### Output

|Output parameter |Type |Description
|---|---|---
|Name  |String |The name of the materialized view.
|SourceTable|String|The source table of the materialized view.
|Query|String|The materialized view query.
|MaterializedTo|datetime|The max materialized ingestion_time() timestamp in source table. For more information, see [behind the scenes](materialized-view-overview.md#behind-the-scenes).
|LastRun|datetime |The last time materialization was run.
|LastRunResult|String|Result of last run. Completed for successful runs, Failed otherwise.
|IsHealthy|bool|True when view is considered healthy, false otherwise. View is considered healthy if it was successfully materialized up to the last hour (`MaterializedTo` is greater than `ago(1h)`).
|IsEnabled|bool|True when view is enabled (see [Disable or enable materialized view](materialized-view-enable-disable.md)).
|Folder|string|The materialized view folder.
|DocString|string|The materialized view doc string.
|AutoUpdateSchema|bool|Whether the view is enabled for auto updates.
|EffectiveDateTime|datetime|The effective date time of the view, determined during creation time (see [.create materialized-view](materialized-view-create-alter.md#create-materialized-view)).

## .show materialized-view schema

Gets the schema of the materialized view in CSL/JSON.

### Syntax

`.show` `materialized-view` *MaterializedViewName* `cslschema`

`.show` `materialized-view` *MaterializedViewName* `schema` `as` `json`

`.show` `materialized-view` *MaterializedViewName* `schema` `as` `csl`

### Output parameters

| Output parameter | Type   | Description                                               |
|------------------|--------|-----------------------------------------------------------|
| TableName        | String | The name of the materialized view.                        |
| Schema           | String | The materialized view csl schema                          |
| DatabaseName     | String | The database to which the materialized view belongs       |
| Folder           | String | Materialized view's folder                                |
| DocString        | String | Materialized view's docstring                             |

## .show materialized-view extents

Returns the extents in the *materialized* part of the materialized view.

For a definition of the *materialized* portion, see [behind the scenes](materialized-view-overview.md#behind-the-scenes).
This command provides the same details as the [show table extents](../show-extents.md#table-level) command.

### Syntax

`.show` `materialized-view` *MaterializedViewName* `extents` [`hot`]
 
## .show materialized-view failures

Returns failures that occurred as part of the materialization process of the materialized view.

### Syntax

`.show` `materialized-view` *MaterializedViewName* `failures`

### Properties

|Property|Type|Description
|----------------|-------|---|
|MaterializedViewName|String|Name of the Materialized View.|

### Output

|Output parameter |Type |Description
|---|---|---
|Name  |Timestamp |Failure timestamp.
|OperationId  |String |The operation id of the run that failed.
|Name|String|The Materialized View name.
|LastSuccessRun|datetime|The timestamp of the last run that completed successfully.
|FailureKind|String|Type of failure.
|Details|String|Failure details.

