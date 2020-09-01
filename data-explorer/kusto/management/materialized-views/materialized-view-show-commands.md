---
title: show materialized view commands - Azure Data Explorer
description: This article describes show materialized views commands in Azure Data Explorer.
services: data-explorer
author: yifats
ms.author: yifats
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 08/30/2020
---

# Materialized views show commands

## .show materialized-view

Displays information about the materialized view's definition and it's current state.

**Syntax:**

`.show` `materialized-view` *MaterializedViewName*

`.show` `materialized-views`

**Properties:**

|Property|Type|Description
|----------------|-------|---|
|MaterializedViewName|String|Name of the Materialized View.|

**Output:**

|Output parameter |Type |Description
|---|---|---
|Name  |String |The name of the Materialized View.
|SourceTable|String|The source table which the Materialized View is defined on.
|Query|String|The Materialized View query.
|MaterializedTo|datetime|The max materialized ingestion_time() timestamp in source table (see [behind the scenes](materialized-view-behind-the-scenes.md)).
|LastRun|datetime |The last time materialization was run.
|LastRunResult|String|Result of last run. Completed for successful runs, Failed otherwise.
|IsHealthy|bool|True when view is considered healthy, false otherwise. View is considered healthy if it was successfully materialized up to the last hour (`MaterializedTo` is greater than `ago(1h)`).
|IsEnabled|bool|True when view is enabled (see [Disable or enable materialized view](materialized-view-enable-disable.md)).
|Folder|string|The Materialized View folder.
|DocString|string|The Materialized View doc string.
|AutoUpdateSchema|bool|Whether the view is enabled for auto updates.
|EffectiveDateTime|datetime|The effective date time of the view, determined during creation time (see [.create materialized-view](materialized-view-create-alter.md#create-materialized-view)).

## .show materialized-view schema

Gets the schema of the materialized view in CSL/JSON.

**Syntax:**

`.show` `materialized-view` *MaterializedViewName* `cslschema`

`.show` `materialized-view` *MaterializedViewName* `schema` `as` `json`

`.show` `materialized-view` *MaterializedViewName* `schema` `as` `csl`

| Output parameter | Type   | Description                                               |
|------------------|--------|-----------------------------------------------------------|
| TableName        | String | The name of the materialized view.                        |
| Schema           | String | The materialized view csl schema                          |
| DatabaseName     | String | The database to which the materialized view belongs       |
| Folder           | String | Materialized view's folder                                |
| DocString        | String | Materialized view's docstring                             |

## .show materialized-view extents

Returns the extents in the *materialized* part of the materialized view.
See [Materialized views: behind the scenes](materialized-view-behind-the-scenes.md) about
the definition of the *materialized* part.
The command provides the same details as in [show table extents](../show-extents.md#table-level)
command.

**Sytax:** 

`.show` `materialized-view` *MaterializedViewName* `extents` [`hot`]
 
## .show materialized-view failures

Returns failures that occurred as part of the materialization process of the materialized view.

**Syntax:**

`.show` `materialized-view` *MaterializedViewName* `failures`

**Properties:**

|Property|Type|Description
|----------------|-------|---|
|MaterializedViewName|String|Name of the Materialized View.|

**Output:**

|Output parameter |Type |Description
|---|---|---
|Name  |Timestamp |Failure timestamp.
|OperationId  |String |The operation id of the run that failed.
|Name|String|The Materialized View name.
|LastSuccessRun|datetime|The timestamp of the last run that completed successfully.
|FailureKind|String|Type of failure.
|Details|String|Failure details.

**Notes:**

* Materialized view failures do not always indicate that the materialized view is unhealthy. Errors can be transient
and materialization process will continue and can be successful in the next execution.
* In any case, materialization never skips any data, even in the case of constant failures. View is always
guaranteed to return the most up to date snapshot of the query, based on *all* records in the source table.
Constant failures will significantly degrade query performance, but will not cause the view to provide incorrect results.
* Failures can occur due to transient errors (CPU/memory/networking failures) or permanent ones (for example, the source table was changed and the materialized view query is syntactically invalid). The materialized view will be
automatically disabled in case of schema changes (that are inconsistent with the view definition) or in case
the materialized view query is no longer semantically valid. For all other failures, the
system will continue materialization attempts until the root cause is fixed.
