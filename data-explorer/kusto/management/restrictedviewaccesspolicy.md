---
title: Kusto RestrictedViewAccess policy controls queries - Azure Data Explorer
description: This article describes RestrictedViewAccess policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 02/19/2020
---
# Restricted view access policy

*RestrictedViewAccess* is an optional policy that can be enabled on tables in a database.

When this policy is enabled on a table, data in the table can be queried *only* to principals added 
to the [UnrestrictedViewer](../management/access-control/role-based-authorization.md) role in the database.

When a policy is enabled on a table, any principal (even a table/database/cluster admin) which isn't included in the 
[UnrestrictedViewer](../management/access-control/role-based-authorization.md) database-level role, won't be able to query data in the table.

The [UnrestrictedViewer](../management/access-control/role-based-authorization.md) role grants view permission to *all* tables in the database which have the policy enabled,
assuming the current principal is already authorized to query the database (a database admin/user/viewer). Adding or removing principals
to or from the role can be done by a [DatabaseAdmin](../management/access-control/role-based-authorization.md).

> [!NOTE]
> RestrictedViewAccess policy can't be configured on a table on which a [Row Level Security policy](./rowlevelsecuritypolicy.md) is enabled.

For more on the control commands for managing the RestrictedViewAccess policy,
[see here](../management/restrictedviewaccess-policy.md).