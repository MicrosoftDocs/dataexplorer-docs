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

> [!WARNING]
> Disabling streaming ingestion could take a few hours.

In order to disable streaming ingestion on your Azure Data Explorer cluster [streaming ingestion policy](../kusto/management/streamingingestionpolicy.md) must be dropped from all relevant tables and databases. The streaming ingestion policy removal triggers streaming ingestion data movement from the initial storage to the permanent storage in the column store (extents or shards). The data movement can last between a few seconds to a few hours, depending on the amount of data in the initial storage, and how the CPU and memory is used by the cluster.
