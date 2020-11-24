---
title: Streaming ingestion policy - Azure Data Explorer | Microsoft Docs
description: This article describes Streaming ingestion policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/20/2020
---
# Streaming ingestion policy

## Streaming ingestion target scenario

Streaming ingestion is targeted for scenarios that require low latency, with an ingestion time of less than 10 seconds for varied volume data. It's used to optimize operational processing of many tables, in one or more databases, where the stream of data into each table is relatively small (a few records per second) but the overall data ingestion volume is high (thousands of records per second).

Use the classic (bulk) ingestion instead of streaming ingestion when the amount of data grows to more than 4 Gb per hour per table. 

* To learn how to implement this feature, see [streaming ingestion](../../ingest-data-streaming.md).
* For information about streaming ingestion control commands, see [Control commands used for managing the streaming ingestion policy](streamingingestion-policy.md)
 
## Streaming ingestion policy definition

The streaming ingestion policy contains the following properties:

* **IsEnabled**:
  * defines the status of streaming ingestion functionality for the table/database
  * mandatory, no default value, must explicitly be set to *true* or *false*
* **HintAllocatedRate**:
  * if set provides a hint on the hourly volume of data in gigabytes expected for the table. This hint helps the system adjust the amount of resources that are allocated for a table in support of streaming ingestion.
  * default value *null* (unset)

To enable streaming ingestion on a table, define the streaming ingestion policy with *IsEnabled* set to *true*. This definition can be set on a table itself or on the database.
Defining this policy at the database level applies the same settings to all existing and future tables in the database. If the streaming ingestion policy is set at both the table and database levels, the table level setting takes precedence. This setting means that streaming ingestion can be generally enabled for the database but specifically disabled for certain tables, or the other way around.

> [!NOTE]
> If a table doesn't get streaming ingestion directly, but only via an update policy, no streaming ingestion policy has to be defined on this table.


## Set the data rate hint
The streaming ingestion policy can provide a hint about the hourly volume of data expected for the table. This hint will help the system adjust the amount of resources allocated for this table in support of streaming ingestion.
Set the hint if the rate of streaming data ingress into the table will exceed 1 Gb/hour.
If setting _HintAllocatedRate_ in the streaming ingestion policy for the database, set it by the table with the highest expected data rate. It isn't recommended to set the effective hint for a table to a value much higher than the expected peak hourly data rate. This setting may have an adverse effect on the query performance.
