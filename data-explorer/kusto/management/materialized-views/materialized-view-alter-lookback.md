---
title:  .alter materialized view lookback
description:  This article describes alter materialized view lookback.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/11/2025
---
# .alter materialized-view lookback

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Alters the `lookback` value of an existing materialized view. For more information on the lookback property, see [materialized view create command properties](materialized-view-create.md#supported-properties).

## Permissions

You must have at least [Materialized View Admin](../../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `materialized-view` *MaterializedViewName* `lookback` *LookbackPeriod*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *MaterializedViewName* | `string` | :heavy_check_mark: | The name of the materialized view. |
| *LookbackPeriod* | `timespan` | :heavy_check_mark: | The time span that limits the period during which duplicates or updates are expected. |

## Returns

[!INCLUDE [materialized-view-show-command-output-schema.md](../../includes/materialized-view-show-command-output-schema.md)]

## Examples

The following examples show how to alter the lookback of a materialized view.

### Set the lookback property of a materialized view

The following example sets the lookback period of the materialized view, `MyView`, to six hours.

```kusto
.alter materialized-view MyView lookback 6h
```

**Output**

| Name | SourceTable | Query | MaterializedTo | LastRun | LastRunResult | IsHealthy | IsEnabled | Folder | DocString | AutoUpdateSchema | EffectiveDateTime | Lookback |
|--|--|--|--|--|--|--|--|--|--|--|--|--|
| MyView | MyTable | MyTable \| summarize take_any(*) by Column1 | 2023-02-26T16:40:03.3345704Z | 2023-02-26T16:44:15.9033667Z | Completed | true | true |  |  | true | 2023-02-23T14:01:42.5172342Z | 6:00:00:00 |

### Remove the lookback of a materialized view

The following example removes the lookback period of the materialized view, `MyView`.

```kusto
.alter materialized-view MyView lookback timespan(null)
```

**Output**

| Name | SourceTable | Query | MaterializedTo | LastRun | LastRunResult | IsHealthy | IsEnabled | Folder | DocString | AutoUpdateSchema | EffectiveDateTime | Lookback |
|--|--|--|--|--|--|--|--|--|--|--|--|--|
| MyView | MyTable | MyTable \| summarize take_any(*) by Column1 | 2023-02-26T16:40:03.3345704Z | 2023-02-26T16:44:15.9033667Z | Completed | true | true |  |  | true | 2023-02-23T14:01:42.5172342Z |  |

## Related content

* [Lookback period](materialized-view-create.md#lookback-period)
* [Materialized views](materialized-view-overview.md)
* [Materialized views use cases](materialized-view-use-cases.md)
* [.create materialized-view](materialized-view-create.md)
* [.alter materialized-view](materialized-view-alter.md)
