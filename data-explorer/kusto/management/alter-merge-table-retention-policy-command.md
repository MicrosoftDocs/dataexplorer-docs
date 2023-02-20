---
title: .alter-merge table retention policy command- Azure Data Explorer
description: This article describes the .alter-merge table retention policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 10/03/2021
---
# .alter-merge table retention policy

Change a table's [retention policy](retentionpolicy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. It is used to remove data whose relevance is age-based. The retention policy can be configured for a specific table or materialized view, or for an entire database. The policy then applies to all tables in the database that don't override it.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `table` *TableName* `policy` `retention` *PolicyParameters* 

## Arguments

*TableName* - Specify the name of the table. 
*PolicyParameters* - Define policy parameters, see also [retention policy](retentionpolicy.md).

### Example

Sets a retention policy with a 10-day soft-delete period, and disables data recoverability:

```kusto
.alter-merge table Table1 policy retention softdelete = 10d recoverability = disabled
```
