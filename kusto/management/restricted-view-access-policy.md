---
title: Restricted view access policy
description: Learn how to use the restricted view access policy to limit the principals who can query specified tables in a database.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/21/2023
---
# Restricted view access policy

The restricted view access policy is an optional security feature that governs view permissions on a table. By default, the policy is disabled. When enabled, the policy adds an extra layer of permission requirements for principals to access and view the table.

For a table with an enabled restricted view access policy, only principals assigned the [UnrestrictedViewer](../access-control/role-based-access-control.md) role have the necessary permissions to view the table. Even principals with roles like Table Admin or Database Admin are restricted unless granted the UnrestrictedViewer role.

> [!NOTE]
> The UnrestrictedViewer role needs to be combined with another role assigned at the database level, such as Database Admin, Database User, or Database Viewer. If a principal doesn't have any of these prerequisite roles, they won't be able to query the database, which means they won't be able to query any table within the database.

While the restricted view access policy is specific to individual tables, the UnrestrictedViewer role operates at the database level. Thereby, a principal with the UnrestrictedViewer role has view permissions for all tables within the database. For more detailed information on managing table view access, see [Manage view access to tables in Azure Data Explorer](manage-table-view-access.md).

## Limitations

* The restricted view access policy can't be configured on a table on which a [Row Level Security policy](row-level-security-policy.md) is enabled.
* A table with the restricted view access policy enabled can't be used as the source of a materialized view. For more information, see [materialized views limitations and known issues](materialized-views/materialized-views-limitations.md#the-materialized-view-source).

## Related content

* [Azure Data Explorer role-based access control](../access-control/role-based-access-control.md)
* [Manage database security roles](manage-database-security-roles.md)
* [.show restricted_view_access policy](show-table-restricted-view-access-policy-command.md)
* [.alter restricted_view_access policy](alter-table-restricted-view-access-policy-command.md)
* [.delete restricted_view_access policy](delete-table-restricted-view-access-policy-command.md)
