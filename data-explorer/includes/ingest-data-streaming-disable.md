---
title: include file
description: include file
author: orspod
ms.service: data-explorer
ms.topic: include
ms.date: 07/13/2020
ms.author: orspodek
ms.reviewer: alexefro
ms.custom: include file
---
## Disable streaming ingestion on your cluster

> [!WARNING]
> Disabling streaming ingestion may take a few hours.

Before disabling streaming ingestion on your Azure Data Explorer cluster, drop the [streaming ingestion policy](../kusto/management/streamingingestionpolicy.md) from all relevant tables and databases. The removal of the streaming ingestion policy triggers data rearrangement inside your Azure Data Explorer cluster. The streaming ingestion data is moved from the initial storage to permanent storage in the column store (extents or shards). This process can take between a few seconds to a few hours, depending on the amount of data in the initial storage.
