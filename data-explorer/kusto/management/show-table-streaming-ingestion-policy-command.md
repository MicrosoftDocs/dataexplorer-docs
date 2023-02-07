---
title: .show table streaming ingestion policy command - Azure Data Explorer
description: This article describes the .show table streaming ingestion policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 10/10/2021
---
# .show table streaming ingestion policy

Display the table streaming ingestion policy. Use the [streaming policy](../management/streamingingestionpolicy.md) to manage streaming ingestion for databases and tables.  

Streaming ingestion is targeted for scenarios that require low latency, with an ingestion time of less than 10 seconds for varied volume data. It's used to optimize operational processing of many tables, in one or more databases, where the stream of data into each table is relatively small (a few records per second) but the overall data ingestion volume is high (thousands of records per second).

Use the classic (bulk) ingestion instead of streaming ingestion when the amount of data grows to more than 4 Gb per hour per table. 

* To learn how to implement streaming ingestion, see [streaming ingestion](../../ingest-data-streaming.md).

## Permissions

This command requires at least Database User, Database Viewer, or Database Monitor permissions on the database containing the table or Table Admin permissions on the specific table. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `table` *TableName* `policy` `streamingingestion`

## Arguments

*TableName* - Specify the name of the database. 

## Example

The following command displays the streaming ingestion policy:

```kusto
.show table MyTable policy streamingingestion 
```
