---
title: ".alter database ingestion batching policy command - Azure Data Explorer"
description: "This article describes the .alter database ingestion batching policy command in Azure Data Explorer."
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 11/29/2021
---
# .alter database ingestion batching policy

Change the database ingestion batching policy. The [ingestionBatching policy](batchingpolicy.md) is a policy object that determines when data aggregation should stop during data ingestion according to specified settings.

## Syntax

* `.alter` `database` *DatabaseName* `policy` `ingestionbatching` *ArrayOfPolicyObjects*

## Arguments

*DatabaseName* - Specify the name of the database.
*ArrayOfPolicyObjects* - An array with one or more policy objects defined.

## Example

The following example changes the database ingestion batching policy:

```kusto
// Change the IngestionBatching policy on database `MyDatabase` to batch ingress data by 300MB 
.alter database MyDatabase policy ingestionbatching @'{"MaximumRawDataSizeMB": 300}'
```
