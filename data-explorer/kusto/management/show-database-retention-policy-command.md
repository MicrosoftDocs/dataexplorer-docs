---
title: .show database retention policy command- Azure Data Explorer
description: This article describes the .show database retention policy command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 10/03/2021
---
# .show database retention policy

Display a database's [retention policy](retentionpolicy.md). The retention policy controls the mechanism that automatically removes data from tables or materialized views. It is used to remove data whose relevance is age-based. The retention policy can be configured for a specific table or materialized view, or for an entire database. The policy then applies to all tables in the database that don't override it.

## Permissions

This command requires at least Database User, Database Viewer, or Database Monitor permissions. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.show` `database` *DatabaseName* `policy` `retention` 

## Arguments

*DatabaseName* - Specify the name of the database.

## Returns

Returns a JSON representation of the policy.

### Example

Display a retention policy:

```kusto
.show database MyDatabase policy retention 
```
