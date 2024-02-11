---
title:  .alter materialized view autoUpdateSchema
description: This article describes alter materialized view autoUpdateSchema in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 03/01/2023
---

# .alter materialized-view autoUpdateSchema

Sets the `autoUpdateSchema` value of an existing materialized view to `true` or `false`. For information on the autoUpdateSchema property, see [materialized view create command properties](materialized-view-create.md#supported-properties).

## Permissions

You must have at least [Materialized View Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `materialized-view` *MaterializedViewName* `autoUpdateSchema` *Boolean*

[!INCLUDE [syntax-conventions-note](../../../includes/syntax-conventions-note.md)]

## Parameters

| Name                   | Type   | Required | Description                    |
|------------------------|--------|----------|--------------------------------|
| *MaterializedViewName* | `string` |  :heavy_check_mark:  | Name of the materialized view. |
| *Boolean* | `bool` |  :heavy_check_mark:  | `autoUpdateSchema` value to be updated. |

## Returns

[!INCLUDE [materialized-view-show-command-output-schema.md](../../../includes/materialized-view-show-command-output-schema.md)]

## Examples

### Enable auto update schema for a materialized view

The following command enables `autoUpdateSchema` for materialized view *MyView*, so that when the schema of the source table on which the view is based changes, the schema of the view is automatically updated to reflect those changes.

```kusto
.alter materialized-view MyView autoUpdateSchema true
```

**Output:**

| Name   | SourceTable | Query                            | MaterializedTo                   | LastRun                      | LastRunResult | IsHealthy | IsEnabled | Folder | DocString | AutoUpdateSchema | EffectiveDateTime            | Lookback   |
|--------|-------------|----------------------------------|----------------------------------|------------------------------|---------------|-----------|-----------|--------|-----------|------------------|------------------------------|------------|
| MyView | MyTable     | summarize take_any(*) by Column1 | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      |        |           | true             | 2023-02-23T14:01:42.5172342Z |            |

### Disable auto update schema for a materialized view

The following command disables `autoUpdateSchema` for materialized view *MyView*, so that when the schema of the source table on which the view is based changes, the schema of the view doesn't update automatically to reflect those changes.

```kusto
.alter materialized-view MyView autoUpdateSchema false
```

**Output:**

| Name   | SourceTable | Query                                       | MaterializedTo                   | LastRun                      | LastRunResult | IsHealthy | IsEnabled | Folder | DocString | AutoUpdateSchema | EffectiveDateTime            | Lookback   |
|--------|-------------|---------------------------------------------|----------------------------------|------------------------------|---------------|-----------|-----------|--------|-----------|------------------|------------------------------|------------|
| MyView | MyTable     | MyTable \| summarize take_any(*) by Column1 | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      |        |           | false            | 2023-02-23T14:01:42.5172342Z |            |
