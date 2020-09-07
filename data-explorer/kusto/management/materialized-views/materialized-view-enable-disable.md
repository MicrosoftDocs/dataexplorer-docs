---
title: Materialized views enable and disable commands - Azure Data Explorer
description: This article describes enable/disable materialized view command in Azure Data Explorer.
services: data-explorer
author: yifats
ms.author: yifats
ms.reviewer: yifats
ms.service: data-explorer
ms.topic: reference
ms.date: 08/30/2020
---

# Disable or enable materialized view

Disabling a materialized view can occur in one of the following cases:

* **Automatic disable by the system:** can occur if materialization fails with a permanent
error. Specifically, schema changes that are inconsistent with the view
definition or changes to source table that result in the materialized view query being semantically
invalid (see [create materialized-view](materialized-view-create-alter.md#create-materialized-view)
command for details).
* **Explicitly disabling the materialized view:** one can choose to disable the view,
using the command below, in case the materialized view is negatively impacting the
cluster's health (for example, consuming too much CPU), for example.

If a materialized view is disabled, it will pause materializing itself and won't consume resources from the cluster.
Querying the materialized view is possible even when it is disabled, but performance can be
poor (depending on the number of records that were ingested to the source table since it was disabled).
 When enabled, it will continue materializing from the point it left off, and no records will be skipped.
If the view was disabled for a long time, it will have much catching up to do when enabled, and may take a long time to recover.

Disabling a view is only recommended if you suspect that the view is impacting your clusters' health. 

**Syntax:**

`.enable` | `disable` `materialized-view` *MaterializedViewName*

**Properties:**

|Property|Type|Description
|----------------|-------|---|
|MaterializedViewName|String|Name of the Materialized View.|
