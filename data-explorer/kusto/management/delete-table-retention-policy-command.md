---
title: .delete table retention policy command- Azure Data Explorer
description: Learn how to use the `.delete table retention policy` command to delete a table's retention policy.
ms.reviewer: yonil
ms.topic: reference
ms.date: 05/14/2023
---
# .delete table retention policy

Delete a table's [retention policy](retentionpolicy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. It's used to remove data whose relevance is age-based. The retention policy can be configured for a specific table or materialized view, or for an entire database. The policy then applies to all tables in the database that don't override it.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.delete` `table` *TableName* `policy` `retention` 

### Example

Delete a retention policy:

```kusto
.delete table Table1 policy retention
```
