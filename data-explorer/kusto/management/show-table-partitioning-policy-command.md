---
title: .show table partitioning policy command- Azure Data Explorer
description: This article describes the .show table partitioning policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 09/29/2021
---
# .show table partitioning policy

Displays a table [partitioning policy](partitioningpolicy.md). The partitioning policy defines if and how [extents (data shards)](../management/extents-overview.md) should be partitioned for a specific table or a [materialized view](materialized-views/materialized-view-overview.md).

## Permissions

This command requires at least Database User, Database Viewer, or Database Monitor permissions on the database containing the table or Table Admin permissions on the specific table. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `table` *TableName* `policy` `partitioning` 

## Arguments

*TableName* - Specify the name of the table. 

## Returns

Returns a JSON representation of the policy.

### Example

Display the policy at the table level:

```kusto
.show table MyTable policy partitioning 
```
