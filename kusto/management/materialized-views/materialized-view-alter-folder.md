---
title:  .alter materialized view folder
description:  This article describes alter materialized view folder.
ms.reviewer: yifats
ms.topic: reference
ms.date: 03/01/2023
---
# .alter materialized-view folder

Alters the folder value of an existing materialized view.

## Permissions

You must have at least [Materialized View Admin](../../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `materialized-view` *MaterializedViewName* `folder` *Folder*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name                   | Type   | Required | Description                                                                                                                                                                   |
|------------------------|--------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| *MaterializedViewName* | `string` |  :heavy_check_mark:  | Name of the materialized view.                                                                                                                                                |
| *Folder*               | `string` |  :heavy_check_mark:  | A folder path that is used to organize materialized views in the UI. The value of this parameter doesn't change the way in which the view works or is referred to in queries. |

## Returns

[!INCLUDE [materialized-view-show-command-output-schema.md](../../includes/materialized-view-show-command-output-schema.md)]

## Examples

### Set the folder of a materialized view to one under root

The following command sets the folder in which a materialized view must be shown to one named **Updated folder** under **Materialized Views** folder:

```kusto
.alter materialized-view MyView folder "Updated folder"
```

**Output**

| Name   | SourceTable | Query                                       | MaterializedTo                   | LastRun                      | LastRunResult | IsHealthy | IsEnabled | Folder           | DocString | AutoUpdateSchema | EffectiveDateTime            | Lookback   |
|--------|-------------|---------------------------------------------|----------------------------------|------------------------------|---------------|-----------|-----------|------------------|-----------|------------------|------------------------------|------------|
| MyView | MyTable     | MyTable \| summarize take_any(*) by Column1 | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      | "Updated folder" |           | true             | 2023-02-23T14:01:42.5172342Z |            |

### Set the folder of a materialized view to two levels under root

The following command sets the folder in which a materialized view must be shown to two levels under **Materialized Views** folder:

```kusto
.alter materialized-view MyView folder @"First Level\Second Level"
```

**Output**

| Name   | SourceTable | Query                                       | MaterializedTo                   | LastRun                      | LastRunResult | IsHealthy | IsEnabled | Folder                     | DocString | AutoUpdateSchema | EffectiveDateTime            | Lookback   |
|--------|-------------|---------------------------------------------|----------------------------------|------------------------------|---------------|-----------|-----------|----------------------------|-----------|------------------|------------------------------|------------|
| MyView | MyTable     | MyTable \| summarize take_any(*) by Column1 | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      | "First Level\Second Level" |           | true             | 2023-02-23T14:01:42.5172342Z | 6:00:00:00 |
