---
title:  .alter materialized view lookback
description: This article describes alter materialized view lookback in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 03/01/2023
---
# .alter materialized-view lookback

Alters the `lookback` value of an existing materialized view. For more information on the lookback property, see [materialized view create command properties](materialized-view-create.md#supported-properties).

## Permissions

You must have at least [Materialized View Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `materialized-view` *MaterializedViewName* `lookback` *LookbackPeriod*

[!INCLUDE [syntax-conventions-note](../../../includes/syntax-conventions-note.md)]

## Parameters

| Name                   | Type     | Required | Description                                                                   |
|------------------------|----------|----------|-------------------------------------------------------------------------------|
| *MaterializedViewName* | `string` |  :heavy_check_mark:  | Name of the materialized view.                                                |
| *LookbackPeriod*       | `timespan` |  :heavy_check_mark:  | Time span limiting the period of time in which duplicates are expected.       |

## Returns

[!INCLUDE [materialized-view-show-command-output-schema.md](../../../includes/materialized-view-show-command-output-schema.md)]

## Examples

### Set the lookback property of a materialized view

The following command sets the lookback period of materialized view MyView to six hours:

```kusto
.alter materialized-view MyView lookback 6h
```

**Output**

| Name   | SourceTable | Query                                       | MaterializedTo                   | LastRun                      | LastRunResult | IsHealthy | IsEnabled | Folder           | DocString | AutoUpdateSchema | EffectiveDateTime            | Lookback   |
|--------|-------------|---------------------------------------------|----------------------------------|------------------------------|---------------|-----------|-----------|------------------|-----------|------------------|------------------------------|------------|
| MyView | MyTable     | MyTable \| summarize take_any(*) by Column1 | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      |                  |           | true             | 2023-02-23T14:01:42.5172342Z | 6:00:00:00 |

### Remove the lookback of a materialized view

The following command removes the lookback period of materialized view MyView:

```kusto
.alter materialized-view MyView lookback timespan(null)
```

**Output**

| Name   | SourceTable | Query                                       | MaterializedTo                   | LastRun                      | LastRunResult | IsHealthy | IsEnabled | Folder           | DocString | AutoUpdateSchema | EffectiveDateTime            | Lookback   |
|--------|-------------|---------------------------------------------|----------------------------------|------------------------------|---------------|-----------|-----------|------------------|-----------|------------------|------------------------------|------------|
| MyView | MyTable     | MyTable \| summarize take_any(*) by Column1 | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      |                  |           | true             | 2023-02-23T14:01:42.5172342Z |            |
