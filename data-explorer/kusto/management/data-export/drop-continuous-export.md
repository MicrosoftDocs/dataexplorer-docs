---
title:  .drop continuous-export
description:  This article describes how to drop continuous data export.
ms.reviewer: yifats
ms.topic: reference
ms.date: 12/08/2024
---
# .drop continuous-export

> [!INCLUDE [applies](../../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../../includes/applies-to-version/azure-data-explorer.md)]

Drops a continuous-export job.

## Permissions

You must have at least [Database Admin](../../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.drop` `continuous-export` *ContinuousExportName*

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *ContinuousExportName* | `string` |  :heavy_check_mark: | The name of the continuous export. |

## Returns

The remaining continuous exports in the database (post deletion). Output schema as in the [show continuous export command](show-continuous-export.md).

## Related content

* [Continuous export overview](continuous-data-export.md)
* [External tables](../../query/schema-entities/external-tables.md)
* [.create or alter continuous-export](create-alter-continuous.md)
* [.disable or enable continuous-export](disable-enable-continuous.md)
* [.show continuous-export](show-continuous-export.md)
* [.show continuous-export failures](show-continuous-failures.md)