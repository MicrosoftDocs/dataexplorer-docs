---
title:  IngestionTime policy
description: This article describes IngestionTime policy in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/19/2020
---
# IngestionTime policy

The IngestionTime policy is an optional policy that can be set (enabled) on tables.

When enabled, Kusto adds a hidden `datetime` column to the table, called `$IngestionTime`. 
Now, whenever new data is ingested, the time of ingestion is recorded in the hidden column. 
That time is measured by the Kusto cluster just before the data is committed. 

> [!NOTE]
> Every record has its own `$IngestionTime` value.

Since the ingestion time column is hidden, you can't directly query for its value.
Instead, a special function called
[ingestion_time()](../query/ingestiontimefunction.md)
retrieves that value. If there's no `datetime` column in the table,
or the IngestionTime policy wasn't enabled when a record was ingested, a null
value is returned.

The IngestionTime policy is designed for two main scenarios:
* To allow users to estimate the latency in ingesting data.
  Many tables with log data have a timestamp column. The timestamp value
  gets filled by the source and indicates the time when the record was
  produced. By comparing that column's value with the ingestion time column,
  you can estimate the latency for getting the data in. 
  
  > [!NOTE]
  > The calculated value is only an estimate, because the source and Kusto don't necessarily
  have their clocks synchronized.
  
* To support [Database Cursors](../management/databasecursor.md) that let users 
  issue consecutive queries, the query is limited to the data that was ingested since the previous query.

For more information. see the [management commands for managing the IngestionTime policy](./show-table-ingestion-time-policy-command.md).