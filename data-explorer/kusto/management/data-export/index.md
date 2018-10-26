---
title: Data export - Azure Data Explorer | Microsoft Docs
description: This article describes Data export in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: v-orspod
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/24/2018
---
# Data export

Data export is the process that executes a Kusto query and then writes its
results somewhere, making the query results available for later inspection.

There are several methods to do data export:

* **Client-side export**:
  In its simplest form, data export can be done on the client side (the client
  runs a query against the service, reads back the results, and then writes them
  somewhere). This form of data export depends on the client tool to do the
  export, most commonly to the local filesystem where the tool runs. Among tools
  that support this model are
  [Kusto.Explorer](../../tools/kusto-explorer.md),
  [Web UI](https://docs.microsoft.com/azure/data-explorer/web-query-data), 




  and others.

* **Service-side export (pull)**:
  If the target of the export is a Kusto table (on the same cluster/database
  as the query or another), it's possible to do it by using the "ingest from query"
  flow on the target table. In this flow a query is run and its results are immediately
  ingested into a Kusto table. See [data ingestion](../data-ingestion/index.md)
  for a details description of the [relevant commands](../data-ingestion/index.md#set-append-set-or-append-set-or-replace).



* **Service-side export (push)**:
  The methods noted above are somewhat limits, as the query results have to be streamed
  through a single network connection between the producer doing the query and
  the consumer writing its results. For scalable data export, Kusto provides a
  "push" export model in which the service running the query also writes its
  results in an optimizes manner. This model is exposed through a set of
  `.export` control commands, supporting exporting query results to
