---
title: Enable or disable continuous data export - Azure Data Explorer
description: This article describes how to disable or enable continuous data export in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 08/03/2020
---
# Disable or enable continuous export

## Syntax

`.enable` `continuous-export` *ContinuousExportName* 

`.disable` `continuous-export` *ContinuousExportName* 

You can disable or enable the continuous-export job. A disabled continuous export won't be executed, but its current state is persisted and can be resumed when the continuous export is enabled. 
When enabling a continuous export that has been disabled for a long time, exporting will continue from where it last stopped when the exporting disabled. This continuation may result in a long running export, blocking other exports from running, if there isn't sufficient cluster capacity to serve all processes. 
Continuous exports are executed by last run time in ascending order (oldest export will run first, until catch up is complete). 

## Properties

| Property             | Type   | Description                |
|----------------------|--------|----------------------------|
| ContinuousExportName | String | Name of continuous export |

## Output

The result of the [show continuous export command](show-continuous-export.md) of the altered continuous export. 
