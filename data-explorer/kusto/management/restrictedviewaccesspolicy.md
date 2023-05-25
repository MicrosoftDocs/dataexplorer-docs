---
title: Restricted view access policy
description: Learn how to use the restricted view access policy to limit the principals who can query specified tables in a database.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/24/2023
---
# Restricted view access policy

*RestrictedViewAccess* is an optional policy that can be enabled for tables of a database.

When this policy is enabled for a table, data in the table can only be queried by principals who have an [UnrestrictedViewer](./access-control/role-based-access-control.md) role in the database.
Any principal that isn't registered with an [UnrestrictedViewer](access-control/role-based-access-control.md) database-level role won't be able to query data in the table. Even an unregistered table/database/cluster admin.

The [UnrestrictedViewer](./access-control/role-based-access-control.md) role grants view permission to *all* tables in the database that have the policy enabled.
The current principal, a database admin/user/viewer, is already authorized to query the database.
Adding or removing principals can be done by a [DatabaseAdmin](./access-control/role-based-access-control.md).

> [!NOTE]
> RestrictedViewAccess policy can't be configured on a table on which a [Row Level Security policy](./rowlevelsecuritypolicy.md) is enabled.

> [!IMPORTANT]
> A table with RestrictedViewAccess policy enabled cannot be used as the source of a materialized view. For more information, see [materialized views limitations and known issues](materialized-views/materialized-views-limitations.md#the-materialized-view-source).

For more information, see the control commands for managing the [RestrictedViewAccess policy](./show-table-restricted-view-access-policy-command.md).
