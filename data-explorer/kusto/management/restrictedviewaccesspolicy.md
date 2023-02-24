---
title: Restricted view access policy - Azure Data Explorer
description: This article describes the restricted view access policy in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 02/19/2020
---
# Restricted view access policy

*RestrictedViewAccess* is an optional policy that can be enabled for tables of a database.

When this policy is enabled for a table, data in the table can only be queried by principals who have an [UnrestrictedViewer](./access-control/role-based-access-control.md) role in the database.
Any principal,  who isn't registered with an [UnrestrictedViewer](./access-control/role-based-access-control.md) database-level role, won't be able to query data in the table. Even an unregistered table/database/cluster admin.

The [UnrestrictedViewer](./access-control/role-based-access-control.md) role grants view permission to *all* tables in the database that have the policy enabled.
The current principal, a database admin/user/viewer, is already authorized to query the database. 
Adding or removing principals can be done by a [DatabaseAdmin](./access-control/role-based-access-control.md).

> [!NOTE]
> RestrictedViewAccess policy can't be configured on a table on which a [Row Level Security policy](./rowlevelsecuritypolicy.md) is enabled.

> [!WARNING]
>
> A table with RestrictedViewAccess policy enabled cannot be used as the source of a materialized view. See [materialized views limitations and known issues](./materialized-views/materialized-views-limitations#the-materialized-view-source) for more details.

For more information, see the control commands for managing the [RestrictedViewAccess policy](./show-table-restricted-view-access-policy-command.md).
