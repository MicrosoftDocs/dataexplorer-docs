---
title: Role-based access control in Kusto - Azure Data Explorer
description: This article describes role-based access control in Kusto in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 12/20/2021
---
# Azure Data Explorer role-based access control

Azure Data Explorer uses a role-based access control (RBAC) model in which [principals](../../access-control/principals-and-identity-providers.md) get access to resources according to the roles they're assigned.

Roles are defined within the scope of a cluster, database, table, materialized view, or function. If defined within the scope of a cluster, the role applies to all databases in the cluster. If defined within the scope of a database, the role applies to all tables in the database.

## Roles and permissions

The following table outlines the roles and permissions available at each scope.

The 'Permissions' column lists the access granted to each role, while the 'Dependencies' column specifies any additional roles that must be held in order to gain the listed access. The 'Manage' column directs you to methods for adding or removing principals of the given role.

|Scope|Role|Permissions|Dependencies|Manage|
|--|--|--|--|
|Cluster|AllDatabasesAdmin |Full permission to all databases in the cluster. May show and alter certain cluster-level policies. Includes all lower `AllDatabases` permissions. ||[Azure portal](../../../../../manage-cluster-permissions.md)|
|Cluster|AllDatabasesViewer |Read all data and metadata of any database in the cluster. ||[Azure portal](../../../../../manage-cluster-permissions.md)|
|Cluster|AllDatabasesMonitor |Execute `.show` commands in the context of any database in the cluster.||[Azure portal](../../../../../manage-cluster-permissions.md)|
|Database|admin|Full permission in the scope of a particular database. Includes all lower level permissions.  ||[Azure portal](../../../../../manage-database-permissions.md) or [management commands](../../../security-roles.md)|
|Database|user|Read all data and metadata of the database. Create tables and functions, and become the admin for those tables and functions.||[Azure portal](../../../../../manage-database-permissions.md) or [management commands](../../../security-roles.md)|
|Database|viewer |Read all data and metadata, except for tables with the [RestrictedViewAccess policy](../../../show-table-restricted-view-access-policy-command.md) enabled. ||[Azure portal](../../../../../manage-database-permissions.md) or [management commands](../../../security-roles.md#managing-database-security-roles)|
|Database|unrestrictedviewer |Read all data and metadata, including in tables with the [RestrictedViewAccess policy](../../../show-table-restricted-view-access-policy-command.md) enabled. | Database viewer or Database user |[Azure portal](../../../../../manage-database-permissions.md) or [management commands](../../../security-roles.md#managing-database-security-roles)|
|Database|ingestor |Ingest data to all tables in the database without access to query the data. ||[Azure portal](../../../../../manage-database-permissions.md) or [management commands](../../../security-roles.md#managing-database-security-roles)|
|Database|monitor |Execute `.show` commands in the context of the database and its child entities. ||[Azure portal](../../../../../manage-database-permissions.md) or [management commands](../../../security-roles.md#managing-database-security-roles)|
|Table| admin | Full permission in the scope of a particular table.| Database user |[Management commands](../../../security-roles.md#managing-table-security-roles)|
|Table|ingestor |Ingest data to the table without access to query the data. | Database user or Database ingestor |[Management commands](../../../security-roles.md#managing-table-security-roles)|
|Materialized view|admin |Full permission to alter the view, delete the view, and grant admin permissions to another principal. | Database user or Table admin |[Management commands](../../../security-roles.md#managing-materialized-view-security-roles)|
|Function|admin |Full permission to alter the function, delete the function, and grant admin permissions to another principal. | Database user or Table admin |[Management commands](../../../security-roles.md#managing-function-security-roles)|

## Next steps

* To set cluster level permissions, see [manage cluster permissions](../../../../../manage-cluster-permissions.md).
* To set permissions for a database, use the [Azure portal](../../../../../manage-database-permissions.md) or [use management commands](../../../security-roles.md#managing-database-security-roles)
* To set permissions for a table, function, or materialized view, [use management commands](../../../security-roles.md#commands-overview).
* To grant a principal from a different tenant access to your cluster, see [Allow cross-tenant queries and commands](../../../../../cross-tenant-query-and-commands.md).
