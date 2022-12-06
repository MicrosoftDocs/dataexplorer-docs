---
title: Role-based Authorization in Kusto - Azure Data Explorer
description: This article describes Role-based Authorization in Kusto in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 12/20/2021
---
# Role-based authorization

Authorization is the process of allowing or disallowing a security principal permission to carry out an action.
Azure Data Explorer uses a role-based access control model in which principals—users, groups, and apps—are mapped to roles. Principals get access to resources according to the roles they're assigned.

Roles are assigned at various levels: cluster, database, table, function, or materialized view. If a role is assigned at the cluster level, then it applies to all databases in the cluster. If a role is assigned at the database level, then it applies to all tables in the database.

The following table describes the possible roles at each level:

|Level|Role |Permissions |
|---|---|---|
|Cluster|`AllDatabasesAdmin` |Can do anything in the scope of any database. Includes all lower level `AllDatabases` permissions. Can show and alter certain cluster-level policies. |
|Cluster|`AllDatabasesViewer` |Can read all data and metadata of any database. |
|Cluster|`AllDatabasesMonitor` |Can execute `.show` commands in the context of any database and its child entities. |
|Database|`admin`|Can do anything in the scope of a particular database. Includes all lower level permissions.  |
|Database|`user`|Can read all data and metadata of the database. Can create tables and become the table admin for those tables, and create functions in the database.|
|Database|`viewer` |Can read all data and metadata of a particular database if the [RestrictedViewAccess policy](../show-table-restricted-view-access-policy-command.md) isn't enabled. |
|Database|`unrestrictedviewer` |Can query all tables in the database that have the [RestrictedViewAccess policy](../show-table-restricted-view-access-policy-command.md) enabled. |
|Database|`ingestor` |Can ingest data into all existing tables in the database, but can't query the data. |
|Database|`monitor` |Can execute `.show` commands in the context of the database and its child entities.  |
|Table| `admin` |Can do anything in the scope of a particular table. |
|Table|`ingestor` |Can ingest data in the scope of a particular table, but can't query the data. |
|Function|`admin` |Can alter function, delete function, or grant admin permissions to another principal. |
|Materialized view|`admin` |Can alter or delete the materialized view and grant admin permissions to another principal. |

To set cluster level permissions, see [LINK TO NEW DOC THAT I WROTE].

To set permissions for a specific database, table, function, or materialized view, [use management commands](../security-roles.md#managing-security-roles) or [use the Azure portal](../../../manage-database-permissions.md).

> [!NOTE]
> To grant a principal from a different tenant access to your cluster, see [Allow cross-tenant queries and commands](../../../cross-tenant-query-and-commands.md).
