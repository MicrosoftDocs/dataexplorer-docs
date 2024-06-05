---
title:  Enable and disable materialized view commands
description:  This article describes how to enable or disable materialized view commands.
ms.reviewer: yifats
ms.topic: reference
ms.date: 03/01/2023
---

# .disable | .enable materialized-view

Disables or enables the materialization process for a materialized view.

> [!NOTE]
> Because there are some important performance implications associated with disabling/enabling a materialized view, make sure you are familiarized with them before you proceed with the use of this command. For more information, see the [Performance implications of enabling/disabling materialized views](#performance-implications-of-enablingdisabling-materialized-views) section.

## Permissions

You must have at least [Materialized View Admin](../access-control/role-based-access-control.md) to run these commands.

## Syntax

`.enable` | `disable` `materialized-view` *MaterializedViewName*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name                   | Type   | Required | Description                    |
|------------------------|--------|----------|--------------------------------|
| *MaterializedViewName* | `string` |  :heavy_check_mark:  | Name of the materialized view. |

## Returns

If the materialized view is already in the state in which the command is trying to set it to, the command fails with an error indicating that is the case.

Otherwise, it returns the details about the materialized view whose IsEnabled property has been changed.

[!INCLUDE [materialized-view-show-command-output-schema.md](../../includes/materialized-view-show-command-output-schema.md)]

## Examples

### Enable a materialized view

The following command enables materialized view ViewName:

```kusto
.enable materialized-view ViewName
```

**Output**

| Name     | SourceTable | Query                                                 | MaterializedTo                   | LastRun                      | LastRunResult | IsHealthy | IsEnabled | Folder           | DocString | AutoUpdateSchema | EffectiveDateTime            | Lookback   |
|----------|-------------|-------------------------------------------------------|----------------------------------|------------------------------|---------------|-----------|-----------|------------------|-----------|------------------|------------------------------|------------|
| ViewName | TableName   | TableName \| summarize arg_max(Column3, *) by Column1 | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      |                  |           | false            | 2023-02-23T14:01:42.5172342Z |            |

### Disable a materialized view

The following command disables materialized view ViewName:

```kusto
.disable materialized-view ViewName
```

**Output**

| Name     | SourceTable | Query                                                 | MaterializedTo                   | LastRun                      | LastRunResult | IsHealthy | IsEnabled | Folder           | DocString | AutoUpdateSchema | EffectiveDateTime            | Lookback   |
|----------|-------------|-------------------------------------------------------|----------------------------------|------------------------------|---------------|-----------|-----------|------------------|-----------|------------------|------------------------------|------------|
| ViewName | TableName   | TableName \| summarize arg_max(Column3, *) by Column1 | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | false     |                  |           | false            | 2023-02-23T14:01:42.5172342Z |            |

## Remarks

### Disabling materialized views

A materialized view can be disabled in any of the following ways:

* **Automatic disable by the system:**  Materialized view is automatically disabled if materialization fails with a permanent error. This process can occur in the following instances:
  * Schema changes that are inconsistent with the view definition.  
  * Changes to source table that result in the materialized view query being semantically invalid.
* **Explicitly disable the materialized view:**  If the materialized view is negatively impacting the cluster's health (for example, consuming too much CPU), disable the view using the [`.disable materialized-view` command](#syntax).

### Materialized views and Row Level Security

If a materialized view is disabled, and while the view is disabled someone defines a [row level security policy](materialized-view-policies.md#row-level-security-policy) on the source table of the view, but the materialized view doesn't have a row level security policy defined, then enabling the view fails for security reasons. To mitigate this error, you can:
  
* Define the row level security policy over the materialized view.
* Choose to ignore the error by adding `allowMaterializedViewsWithoutRowLevelSecurity` property to the enable policy command. For example:

```kusto
    .enable materialized-view MV with (allowMaterializedViewsWithoutRowLevelSecurity=true)
```

### Performance implications of enabling/disabling materialized views

* When a materialized view is disabled, materializing will be paused and won't consume resources from the cluster. Querying the materialized view is possible even when disabled, but performance can be poor. Performance on a disabled materialized view depends on the number of records that were ingested to the source table since it was disabled.
* You can enable a materialized view that has previously been disabled. When re-enabled, the materialized view will continue materializing from the point it left off, and no records will be skipped. If the view was disabled for a long time, it may take a long time to catch up.
* Disabling a view is only recommended if you suspect that the view is impacting your cluster's health.
