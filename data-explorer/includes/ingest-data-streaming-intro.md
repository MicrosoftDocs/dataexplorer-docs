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

Use streaming ingestion when you require optimal performance under the following requirements

* Low latency (less than 10 seconds) between successful completion of ingestion operation and availability of the data for query.
* Ingesting high volume of data (thousands of records per second) spread over large amount (thousands) of tables. Each table receiving relatively low volume of data (few records per second).

Use bulk ingestion instead of streaming ingestion when the amount of data grows to more than 4 GB per hour per table. Read [Data ingestion overview](../ingest-data-overview.md) to learn more about the various methods of ingestion.
