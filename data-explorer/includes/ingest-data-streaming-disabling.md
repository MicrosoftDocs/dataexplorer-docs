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

In order to disable streaming ingestion on your Azure Data Explorer cluster [streaming ingestion policy](../kusto/management/streamingingestionpolicy.md) must be dropped from all relevant tables and databases. The removal of the streaming ingestion policy triggers rearrangement of the data inside Azure Data Explorer cluster. Streaming ingestion data is moved from the initial storage to the permanent storage in the column store (extents or shards). This process can take between a few seconds to a few hours, depending on the amount of data in the initial storage.
