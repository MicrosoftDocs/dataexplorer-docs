---
title: Enable or disable continuous data export - Azure Data Explorer
description: This article describes how to disable or enable continuous data export in Azure Data Explorer.
ms.reviewer: yifats
ms.topic: reference
ms.date: 02/16/2023
---
# Disable or enable continuous export

Disables or enables the continuous-export job. A disabled continuous export won't be executed, but its current state is persisted and can be resumed when the continuous export is enabled. 

When enabling a continuous export that has been disabled for a long time, exporting will continue from where it last stopped when the exporting was disabled. This continuation may result in a long running export, blocking other exports from running, if there isn't sufficient cluster capacity to serve all processes. 
Continuous exports are executed by last run time in ascending order (oldest export will run first, until catch up is complete). 

## Syntax

`.enable` `continuous-export` *ContinuousExportName* 

`.disable` `continuous-export` *ContinuousExportName* 

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *ContinuousExportName* | string | &check; | The name of the continuous export. |

## Returns

The result of the [show continuous export command](show-continuous-export.md) of the altered continuous export. 
