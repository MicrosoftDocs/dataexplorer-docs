---
title: .show restricted view access policy command - Azure Data Explorer
description: This article describes the .show restricted view access policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: yonil
ms.service: data-explorer
ms.topic: reference
ms.date: 10/03/2021
---
# .show restricted view access policy

Display the optional table [restricted view access policy](restrictedviewaccesspolicy.md). When this policy is enabled for a table, data in the table can only be queried by principals who have an [UnrestrictedViewer](../management/access-control/role-based-authorization.md) role in the database. Deleting a policy is similar to disabling a policy. 

## Syntax

Display the policy for a table:

`.show` `table` *TableName* `policy` `restricted-view-access`

Display the policy for all tables:

`.show` `table` * `policy` `restricted-view-access`

## Arguments

*TableName* - Specify the name of the table. 

## Example

Display the policy for a table:

```kusto
.show table Table1 policy restricted-view-access
```

Display the policies for all tables:

```kusto
.show table * policy restricted-view-access
```