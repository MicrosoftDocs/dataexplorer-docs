---
title: IngestionTime policy - Azure Data Explorer | Microsoft Docs
description: This article describes IngestionTime policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 10/23/2018

---
# IngestionTime policy

The IngestionTime policy is an optional policy that can be set (enabled) on tables.

When this policy is enabled on a table, Kusto adds a hidden `datetime` column
to the table, called `$IngestionTime`. From that point onwards,
whenever new data is ingested into the table, the time of ingestion
(as measured by the Kusto cluster just before the data is committed)
is recorded in the hidden column for all records being ingested. (Note that
every record has its own `$IngestionTime` value, just like any other column.)

As the ingestion time column is hidden, one cannot directly query for its value.
Instead, a special function called
[ingestion_time()](../query/ingestiontimefunction.md)
is provided to retrieve that value. If there is no such column in the table,
or the IngestionTime policy was not enabled when a record was ingested, a null
value is returned.

The IngestionTime policy has been designed for two main scenarios:
* To allow users to estimate the end-to-end latency in ingesting data.
  Many tables holding log data have some timestamp column whose value
  gets filled by the source to indicate the time at which the record was
  produced. By comparing that column's value with the ingestion time column
  one can estimate the latency in getting the data in. (Note that this
  is only an estimate, because the source and Kusto don't necessarily
  have their clocks synchronized.)
* To support [Database Cursors](../management/databasecursor.md),
  allowing users to issue consecutive queries and each time to limit the
  query to data that has been ingested since the previous query.



For more on the control commands for managing the IngestionTime policy, [see here](../management/ingestiontime-policy.md).