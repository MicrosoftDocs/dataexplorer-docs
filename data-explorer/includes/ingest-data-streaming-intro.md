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

Use streaming ingestion to load data when you need low latency between ingestion and query. The streaming ingestion operation completes in under 10 seconds, and your data is immediately available for query after completion. This ingestion method is suitable for ingesting a high volume of data, such as thousands of records per second, spread over thousands of tables. Each table receives a relatively low volume of data, such as a few records per second.

Use bulk ingestion instead of streaming ingestion when the amount of data ingested exceeds 4 GB per hour per table.

To learn more about different ingestion methods, see [data ingestion overview](../ingest-data-overview.md).
