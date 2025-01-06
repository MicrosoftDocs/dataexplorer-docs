---
title:  Enable or disable continuous data export
description:  This article describes how to disable or enable continuous data export.
ms.reviewer: yifats
ms.topic: reference
ms.date: 01/06/2025
---
# Disable or enable continuous export

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Disables or enables the continuous-export job. A disabled continuous export isn't executed, but its current state is persisted and can be resumed when the continuous export is enabled.

When enabling a continuous export that was disabled for a long time, exporting continues from where it last stopped when the exporting was disabled. This continuation might result in a long running export, blocking other exports from running, if there isn't sufficient database capacity to serve all processes. Continuous exports are executed by last run time in ascending order so  the oldest export runs first, until catch up is complete.

## Permissions

You must have at least [Database Admin](../../access-control/role-based-access-control.md) permissions to run these commands.

## Syntax

`.enable` `continuous-export` *ContinuousExportName*

`.disable` `continuous-export` *ContinuousExportName*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *ContinuousExportName* | `string` |  :heavy_check_mark: | The name of the continuous export. |

## Returns

The result of the [show continuous export command](show-continuous-export.md) of the altered continuous export.

## Related content

* [Continuous export overview](continuous-data-export.md)
* [External tables](../../query/schema-entities/external-tables.md)
* [.create or alter continuous-export](create-alter-continuous.md)
* [.drop continuous-export](drop-continuous-export.md)
* [.show continuous-export](show-continuous-export.md)
* [.show continuous-export failures](show-continuous-failures.md)
