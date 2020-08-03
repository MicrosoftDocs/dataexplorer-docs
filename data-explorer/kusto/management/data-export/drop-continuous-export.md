---
title: Drop continuous data export - Azure Data Explorer
description: This article describes how to drop continuous data export in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 08/03/2020
---
# Drop continuous export

## Syntax

`.drop` `continuous-export` *ContinuousExportName*

## Properties

| Property             | Type   | Description                |
|----------------------|--------|----------------------------|
| ContinuousExportName | String | Name of continuous export |

## Output

The remaining continuous exports in the database (post deletion). Output schema as in the [show continuous export command](show-continuous-export.md).
