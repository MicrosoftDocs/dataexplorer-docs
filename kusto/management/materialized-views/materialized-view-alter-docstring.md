---
title:  .alter materialized view docstring
description:  This article describes the alter materialized-view docstring command.
ms.reviewer: yifats
ms.topic: reference
ms.date: 03/01/2023
---
# .alter materialized-view docstring

Alters the *DocString* value associated to an existing materialized view to describe it.

## Permissions

You must have at least [Materialized View Admin](../../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter` `materialized-view` *MaterializedViewName* `docstring` *DocString*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name                   | Type   | Required | Description                                                                                                                                    |
|------------------------|--------|----------|------------------------------------------------------------------------------------------------------------------------------------------------|
| *MaterializedViewName* | `string` |  :heavy_check_mark:  | Name of the materialized view.                                                                                                                 |
| *DocString*            | `string` |  :heavy_check_mark:  | Free text that you can attach to a materialized view to describe it. This string is presented in various UI settings next to the entity names. |

## Returns

[!INCLUDE [materialized-view-show-command-output-schema.md](../../includes/materialized-view-show-command-output-schema.md)]

## Examples

### Set the docstring of a materialized view

The following command sets the description of a materialized via its docstring property:

```kusto
.alter materialized-view MyView docstring "docs here..."
```

**Output**

| Name   | SourceTable | Query                                       | MaterializedTo                   | LastRun                      | LastRunResult | IsHealthy | IsEnabled | Folder | DocString      | AutoUpdateSchema | EffectiveDateTime            | Lookback   |
|--------|-------------|---------------------------------------------|----------------------------------|------------------------------|---------------|-----------|-----------|--------|----------------|------------------|------------------------------|------------|
| MyView | MyTable     | MyTable \| summarize take_any(*) by Column1 | 2023-02-26T16:40:03.3345704Z     | 2023-02-26T16:44:15.9033667Z | Completed     | true      | true      |        | "docs here..." | true             | 2023-02-23T14:01:42.5172342Z |            |
