---
title:  .show materialized-view command
description:  This article describes show materialized-view command.
ms.reviewer: yifats
ms.topic: reference
ms.date: 03/01/2023
---

# .show materialized-view(s)

Displays definition and current state for one or all materialized views.

## Permissions

You must have at least Database User, Database Viewer, or Database Monitor permissions to run this command. For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `materialized-view` *MaterializedViewName*g

`.show` `materialized-views`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name                   | Type   | Required | Description                    |
|------------------------|--------|----------|--------------------------------|
| *MaterializedViewName* | `string` |  :heavy_check_mark:  | Name of the materialized view. |

### Returns

[!INCLUDE [materialized-view-show-command-output-schema.md](../../includes/materialized-view-show-command-output-schema.md)]

## Examples

### Show details about one materialized view

The following command shows details for materialized view ViewName:

```kusto
.show materialized-view ViewName
```

**Output**

| Name     | SourceTable | Query                                               | MaterializedTo                   | LastRun                      | LastRunResult | IsHealthy | IsEnabled | Folder           | DocString | AutoUpdateSchema | EffectiveDateTime            | Lookback   |
|----------|-------------|-----------------------------------------------------|----------------------------------|------------------------------|---------------|-----------|-----------|------------------|-----------|------------------|------------------------------|------------|
| ViewName | MyTable     | MyTable \| summarize arg_max(Column3, *) by Column1 | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      |                  |           | true             | 2023-02-23T14:01:42.5172342Z |            |

### Show details about all materialized view

The following command shows details for all materialized views:

```kusto
.show materialized-views
```

**Output**

| Name     | SourceTable | Query                                               | MaterializedTo                   | LastRun                      | LastRunResult | IsHealthy | IsEnabled | Folder           | DocString | AutoUpdateSchema | EffectiveDateTime            | Lookback   |
|----------|-------------|-----------------------------------------------------|----------------------------------|------------------------------|---------------|-----------|-----------|------------------|-----------|------------------|------------------------------|------------|
| ViewName | MyTable     | MyTable \| summarize arg_max(Column3, *) by Column1 | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      |                  |           | true             | 2023-02-23T14:01:42.5172342Z |            |
| ArgMax   | T           | T \| summarize arg_max(Timestamp, *) by User        | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      |                  |           | false            | 2023-02-23T14:01:42.5172342Z |            |
