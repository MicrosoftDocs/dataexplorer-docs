---
title: Drop continuous data export - Azure Data Explorer
description: This article describes how to drop continuous data export in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 08/03/2020
---
# Drop continuous export

Drops a continuous-export job.

## Permissions

You must have at least [Database Admin](../access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.drop` `continuous-export` *ContinuousExportName*

## Properties

| Property             | Type   | Description                |
|----------------------|--------|----------------------------|
| ContinuousExportName | String | Name of continuous export |

## Output

The remaining continuous exports in the database (post deletion). Output schema as in the [show continuous export command](show-continuous-export.md).
