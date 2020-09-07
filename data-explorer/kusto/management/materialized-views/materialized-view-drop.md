---
title: Materialized views drop - Azure Data Explorer
description: This article describes drop materialized view command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: yifats
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 08/30/2020
---
# Drop materialized view 

* Drops a materialized view.
* Requires [Database Admin](../access-control/role-based-authorization.md) or
[Materialized view admin](materialized-view-principals.md) permissions.

## Syntax

`.drop` `materialized-view` *MaterializedViewName*

## Properties

|Property|Type|Description
|----------------|-------|---|
|MaterializedViewName|String|Name of the Materialized View.|

## Returns

The command returns the remaining materialized views in the database (output of [show materialized-view](materialized-view-show-commands.md#show-materialized-view) command).
