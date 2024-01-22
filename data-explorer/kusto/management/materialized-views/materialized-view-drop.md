---
title:  Materialized views drop
description: This article describes drop materialized view command in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 03/01/2023
---
# .drop materialized-view

Drops a materialized view.

## Permissions

You must have at least [Materialized View Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.drop` `materialized-view` *MaterializedViewName* [`ifexists`]

[!INCLUDE [syntax-conventions-note](../../../includes/syntax-conventions-note.md)]

## Parameters

| Name                   | Type   | Required | Description                    |
|------------------------|--------|----------|--------------------------------|
| *MaterializedViewName* | `string` |  :heavy_check_mark:  | Name of the materialized view. |

## Returns

The command returns all materialized views in the database, after the drop, which is the output of the [show materialized view](materialized-view-show-command.md#show-materialized-views) command.

[!INCLUDE [materialized-view-show-command-output-schema.md](../../../includes/materialized-view-show-command-output-schema.md)]

## Examples

### Drop one materialized view

The following command drops materialized view ViewName:

```kusto
.drop materialized-view ViewName
```

**Output:**

| Name   | SourceTable | Query                                               | MaterializedTo                   | LastRun                      | LastRunResult | IsHealthy | IsEnabled | Folder           | DocString | AutoUpdateSchema | EffectiveDateTime            | Lookback   |
|--------|-------------|-----------------------------------------------------|----------------------------------|------------------------------|---------------|-----------|-----------|------------------|-----------|------------------|------------------------------|------------|
| ArgMax | T           | T \| summarize arg_max(Timestamp, *) by User        | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      |                  |           | false            | 2023-02-23T14:01:42.5172342Z |            |
| MyView | MyTable     | MyTable \| summarize arg_max(Column3, *) by Column1 | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      |                  |           | true             | 2023-02-23T14:01:42.5172342Z |            |
