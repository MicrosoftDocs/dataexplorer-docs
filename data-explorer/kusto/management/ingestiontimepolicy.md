---
title: IngestionTime policy - Azure Data Explorer
description: This article describes IngestionTime policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/19/2020
---
# IngestionTime policy

The IngestionTime policy is an optional policy that can be set (enabled) on tables.

When enabled, Kusto adds a hidden `datetime` column to the table, 
called `$IngestionTime`. From that moment,
whenever new data is ingested into the table, the time of ingestion
(as measured by the Kusto cluster just before the data is committed)
is recorded in the hidden column for all records being ingested. 

< [NOTE]
> Every record has its own `$IngestionTime` value.

Since the ingestion time column is hidden, you can't directly query for its value.
Instead, a special function called
[ingestion_time()](../query/ingestiontimefunction.md)
retrieves that value. If there is no `datetime` column in the table,
or the IngestionTime policy was not enabled when a record was ingested, a null
value is returned.

The IngestionTime policy is designed for two main scenarios:
* To allow users to estimate the end-to-end latency in ingesting data.
  Many tables holding log data have a timestamp column whose value
  gets filled by the source to indicate the time when the record was
  produced. By comparing that column's value with the ingestion time column
  you can estimate the latency in getting the data in. 
  
  > [NOTE]
  The calculated value is only an estimate, because the source and Kusto don't necessarily
  have their clocks synchronized.
  
* To support [Database Cursors](../management/databasecursor.md) that lets users 
  issue consecutive queries, and each time, to limit the
  query to data that was ingested since the previous query.

For more information on the control commands for managing the IngestionTime policy, [see here](../management/ingestiontime-policy.md).
