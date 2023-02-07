---
title: ".alter-merge table streaming ingestion policy command - Azure Data Explorer"
description: "This article describes the .alter-merge table streaming ingestion policy command in Azure Data Explorer."
ms.reviewer: yonil
ms.topic: reference
ms.date: 01/13/2022
---
# .alter-merge table streaming ingestion policy

Change the table streaming ingestion policy. Use the [streaming policy](../management/streamingingestionpolicy.md) to manage streaming ingestion for databases and tables.  

Use in low latency scenarios, where ingestion time is less than 10 seconds for varying data volume. You can optimize processing for many tables in one or more databases, when tables receive a few records per second, whereas the ingestion volume is thousands of records per second.

Use the classic bulk ingestion instead of streaming ingestion when the amount of data grows to more than 4 Gb per hour per table.

* To learn how to implement streaming ingestion, see [streaming ingestion](../../ingest-data-streaming.md).

## Permissions

This command requires at least [Table Admin](access-control/role-based-access-control.md) permissions.

## Syntax

`.alter-merge` `table` *TableName* `policy` `streamingingestion` *PolicyObject*

## Arguments

- *TableName* - Specify the name of the table.*ArrayOfPolicyObjects* - An array with one or more JSON policy objects.
- *PolicyObject* - Define a policy object, see also [streaming policy](../management/streamingingestionpolicy.md).

## Returns

Returns a JSON representation of the policy.

## Example

The following command returns enables streaming ingestion and determines the suggestion allocated rate for the table:

```kusto
.alter-merge table MyTable policy streamingingestion 
'{"IsEnabled": true, "HintAllocatedRate": 1.5}'
```

The following command disables the streaming ingestion policy:

```kusto
.alter-merge table MyTable policy streamingingestion 
'{"IsEnabled": false}'
```
