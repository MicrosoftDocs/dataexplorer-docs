---
title:  Role-based access control in Kusto
description: This article describes role-based access control in Kusto.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 05/30/2023
---
# Kusto role-based access control

Kusto uses a role-based access control (RBAC) model in which [principals](/azure/data-explorer/kusto/management/access-control/referencing-security-principals) get access to resources based on their assigned roles. Roles are defined for a specific cluster, database, table, external table, materialized view, or function. When defined for a cluster, the role applies to all databases in the cluster. When defined for a database, the role applies to all entities in the database.

Azure Resource Manager (ARM) roles, such as subscription owner or cluster owner, grant access permissions for resource administration. For data administration, you need the roles described in this document.

> [!NOTE]
> To delete a database, you need at least **Contributor** ARM permissions on the cluster. To assign ARM permissions, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

## Roles and permissions

The following table outlines the roles and permissions available at each scope.

The **Permissions** column displays the access granted to each role.

The **Dependencies** column lists the minimum roles required to obtain the role in that row. For example, to become a Table Admin, you must first have a role like Database User or a role that includes the permissions of Database User, such as Database Admin or AllDatabasesAdmin. When multiple roles are listed in the **Dependencies** column, only one of them is needed to obtain the role.

The **Manage** column offers ways to add or remove role principals.

|Scope|Role|Permissions|Dependencies|Manage|
|--|--|--|--|
|Cluster|AllDatabasesAdmin |Full permission to all databases in the cluster. May show and alter certain cluster-level policies. Includes all permissions. ||[Azure portal](../../manage-cluster-permissions.md)|
|Cluster|AllDatabasesViewer |Read all data and metadata of any database in the cluster. ||[Azure portal](../../manage-cluster-permissions.md)|
|Cluster|AllDatabasesMonitor |Execute `.show` commands in the context of any database in the cluster.||[Azure portal](../../manage-cluster-permissions.md)|
|Database|Admin|Full permission in the scope of a particular database. Includes all lower level permissions.  ||[Azure portal](../../manage-database-permissions.md) or [management commands](../management/manage-database-security-roles.md)|
|Database|User|Read all data and metadata of the database. Create tables and functions, and become the admin for those tables and functions.||[Azure portal](../../manage-database-permissions.md) or [management commands](../management/manage-database-security-roles.md)|
|Database|Viewer |Read all data and metadata, except for tables with the [RestrictedViewAccess policy](../management/show-table-restricted-view-access-policy-command.md) turned on. ||[Azure portal](../../manage-database-permissions.md) or [management commands](../management/manage-database-security-roles.md)|
|Database|Unrestrictedviewer |Read all data and metadata, including in tables with the [RestrictedViewAccess policy](../management/show-table-restricted-view-access-policy-command.md) turned on. | Database User or Database Viewer |[Azure portal](../../manage-database-permissions.md) or [management commands](../management/manage-database-security-roles.md)|
|Database|Ingestor |Ingest data to all tables in the database without access to query the data. ||[Azure portal](../../manage-database-permissions.md) or [management commands](../management/manage-database-security-roles.md)|
|Database|Monitor |Execute `.show` commands in the context of the database and its child entities. ||[Azure portal](../../manage-database-permissions.md) or [management commands](../management/manage-database-security-roles.md)|
|Table|Admin | Full permission in the scope of a particular table.| Database User |[Management commands](../management/manage-table-security-roles.md)|
|Table|Ingestor |Ingest data to the table without access to query the data. | Database User or Database Ingestor |[Management commands](../management/manage-table-security-roles.md)|
|External Table|Admin | Full permission in the scope of a particular external table.| Database User or Database Viewer |[Management commands](../management/manage-external-table-security-roles.md)|
|Materialized view|Admin |Full permission to alter the view, delete the view, and grant admin permissions to another principal. | Database User or Table Admin |[Management commands](../management/manage-materialized-view-security-roles.md)|
|Function|Admin |Full permission to alter the function, delete the function, and grant admin permissions to another principal. | Database User or Table Admin |[Management commands](../management/manage-function-security-roles.md)|

## Related content

* [Manage cluster permissions](../../manage-cluster-permissions.md)
* [Allow cross-tenant queries and commands](cross-tenant-query-and-commands.md)
* [Manage view access to tables within the same database](../management/manage-table-view-access.md)
