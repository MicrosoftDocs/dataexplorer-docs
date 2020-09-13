---
title: Enable and disable materialized view commands - Azure Data Explorer
description: This article describes how to enable or disable materialized view commands in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 08/30/2020
---

# Disable or enable materialized view

Disable a materialized view in any of the following ways:

* **Automatic disable by the system:**  Materialized view is automatically disabled if materialization fails with a permanent error. This process can occur in the following instances: 
    * Schema changes that are inconsistent with the view definition.  
    * Changes to source table that result in the materialized view query being semantically invalid. <br>
    For more information, see [create materialized-view](materialized-view-create-alter. md#create-materialized-view).
* **Explicitly disable the materialized view:**  If the materialized view is negatively impacting the cluster's health (for example, consuming too much CPU), disable the view using the [command](#syntax) below.

> [!NOTE]
> * When a materialized view is disabled, materializing will be paused and won't consume resources from the cluster. Querying the materialized view is possible even when disabled, but performance can be poor. Performance on a disabled materialized view depends on the number of records that were ingested to the source table since it was disabled. 
> * You can enable a materialized view that has previously been disabled. When re-enabled, the materialized view will continue materializing from the point it left off, and no records will be skipped. If the view was disabled for a long time, it may take a long time to catch up.

Disabling a view is only recommended if you suspect that the view is impacting your cluster's health.

## Syntax

`.enable` | `disable` `materialized-view` *MaterializedViewName*

## Properties

|Property|Type|Description
|----------------|-------|---|
|MaterializedViewName|String|Name of the materialized view.|
