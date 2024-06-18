---
title:  Drop continuous data export
description:  This article describes how to drop continuous data export.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/21/2023
---
# Drop continuous export

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
