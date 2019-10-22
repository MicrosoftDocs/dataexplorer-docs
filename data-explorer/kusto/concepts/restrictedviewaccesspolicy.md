---
title: RestrictedViewAccess policy - Azure Data Explorer | Microsoft Docs
description: This article describes RestrictedViewAccess policy in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: mblythe
ms.service: data-explorer
ms.topic: reference
ms.date: 09/23/2019
---
# RestrictedViewAccess policy

The *RestrictedViewAccess* policy is an optional policy that can be set (enabled) on tables in a database.

When this policy is enabled on a table, data in the table is queryable *only* to principals which have been added 
to the [UnrestrictedViewer](../management/access-control/role-based-authorization.md) role in the database.

Once a policy is set on a table, any principal (even a table/database/cluster admin) which isn't included in the 
[UnrestrictedViewer](../management/access-control/role-based-authorization.md) database-level role, will not be able to query data in the table.

The [UnrestrictedViewer](../management/access-control/role-based-authorization.md) role grants view permission to *all* tables in the database which have the policy enabled,
assuming the current principal is already authorized to query the database (i.e. is either a database admin/user/viewer). Adding/removing principals
to/from the role can be done by a [DatabaseAdmin](../management/access-control/role-based-authorization.md).

For more on the control commands for managing the RestrictedViewAccess policy,
[see here](../management/restrictedviewaccess-policy.md).