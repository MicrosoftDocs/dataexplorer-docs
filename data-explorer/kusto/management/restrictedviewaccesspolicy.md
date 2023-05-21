---
title: Restricted view access policy - Azure Data Explorer
description: This article describes the restricted view access policy in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/21/2023
---
# Restricted view access policy

The restricted view access policy is an optional security feature that governs view permissions for tables in a database. When enabled, it adds an extra layer of permission requirements for security principals to access and view the table. By default, the policy is disabled.

When the restricted view access policy is enabled, only principals assigned the [UnrestrictedViewer](./access-control/role-based-access-control.md) role have the necessary permissions to query the data in the table. Even principals with roles like Table Admin, Cluster Admin, or Database Admin are restricted unless granted the UnrestrictedViewer role. To see all available security roles and their permissions, see [Azure Data Explorer role-based access control](../access-control/role-based-access-control.md).

While the restricted view access policy is specific to individual tables, the UnrestrictedViewer role operates at the database level. Thereby, a principal with the UnrestrictedViewer role has view permissions for all tables within the database. For more detailed information on managing table view access, see [Manage view access to tables in Azure Data Explorer](manage-table-view-access.md).

> [!NOTE]
> Principals with the [Database Admin](./access-control/role-based-access-control.md) role have the authority to assign or remove roles for other principals.

## Limitations

* The restricted view access policy can't be configured on a table on which a [Row Level Security policy](./rowlevelsecuritypolicy.md) is enabled.
* A table with the restricted view access policy enabled can't be used as the source of a materialized view. For more information, see [materialized views limitations and known issues](materialized-views/materialized-views-limitations.md#the-materialized-view-source).

## See also

* [.show restricted_view_access policy](./show-table-restricted-view-access-policy-command.md)
* [.alter restricted_view_access policy](./alter-table-restricted-view-access-policy-command.md)
* [.delete restricted_view_access policy](./delete-table-restricted-view-access-policy-command.md)
* [Azure Data Explorer role-based access control](../access-control/role-based-access-control.md)
* [Manage view access to tables in Azure Data Explorer](manage-table-view-access.md)
