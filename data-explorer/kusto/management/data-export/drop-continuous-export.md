---
title: Drop continuous data export - Azure Data Explorer
description: This article describes how to drop continuous data export in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/16/2023
---
# Drop continuous export

Drops a continuous-export job.

## Syntax

`.drop` `continuous-export` *ContinuousExportName*

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *ContinuousExportName* | string | &check; | The name of the continuous export. |

## Returns

The remaining continuous exports in the database (post deletion). Output schema as in the [show continuous export command](show-continuous-export.md).
