---
title: Role-based access control in Kusto - Azure Data Explorer
description: This article describes role-based access control in Kusto in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 12/20/2021
---
# Azure Data Explorer role-based access control

Azure Data Explorer uses a role-based access control (RBAC) model in which [principals](principals-and-identity-providers.md) get access to resources according to the roles they're assigned.

Roles are defined within the scope of a cluster, database, table, materialized view, or function. If defined within the scope of a cluster, the role applies to all databases in the cluster. If defined within the scope of a database, the role applies to all tables in the database.

Set, view, and manage these roles in the Azure portal or with management commands.

> [!NOTE]
> Cluster level roles can only be assigned through the Azure portal.

## Roles and permissions

The following table outlines the roles and permissions available at each scope. The 'Permissions' column lists the access granted to each role, while the 'Dependencies' column specifies any additional roles that must be held in order to gain the listed access.

|Scope|Role|Permissions|Dependencies|
|--|--|--|--|
|Cluster|AllDatabasesAdmin |Full permission to all databases in the cluster. May show and alter certain cluster-level policies. Includes all lower `AllDatabases` permissions. ||
|Cluster|AllDatabasesViewer |Read all data and metadata of any database in the cluster. ||
|Cluster|AllDatabasesMonitor |Execute `.show` commands in the context of any database in the cluster.||
|Database|admin|Full permission in the scope of a particular database. Includes all lower level permissions.  ||
|Database|user|Read all data and metadata of the database. Create tables and functions, and become the admin for those tables and functions.||
|Database|viewer |Read all data and metadata, except for tables with the [RestrictedViewAccess policy](../show-table-restricted-view-access-policy-command.md) enabled. ||
|Database|unrestrictedviewer |Read all data and metadata, including in tables with the [RestrictedViewAccess policy](../show-table-restricted-view-access-policy-command.md) enabled. | Database viewer or Database user |
|Database|ingestor |Ingest data to all tables in the database without access to query the data. ||
|Database|monitor |Execute `.show` commands in the context of the database and its child entities. ||
|Table| admin | Full permission in the scope of a particular table.| Database user |
|Table|ingestor |Ingest data to the table without access to query the data. | Database user or Database ingestor |
|Materialized view|admin |Full permission to alter the view, delete the view, and grant admin permissions to another principal. | Database user or Table admin |
|Function|admin |Full permission to alter the function, delete the function, and grant admin permissions to another principal. | Database user or Table admin |

## Next steps

* To set cluster level permissions, see [manage cluster permissions](../../../manage-cluster-permissions.md).
* To set permissions for a specific database, table, function, or materialized view, [use management commands](../security-roles.md#commands-overview) or [use the Azure portal](../../../manage-database-permissions.md).
* To grant a principal from a different tenant access to your cluster, see [Allow cross-tenant queries and commands](../../../cross-tenant-query-and-commands.md).
