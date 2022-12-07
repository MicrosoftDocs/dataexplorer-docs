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

Principals are assigned roles either through the Azure portal or by management commands. If done through the portal, the roles are saved on the Azure level. If done my management commands, they are stored within the Azure Data Explorer service.
The following table describes the possible roles at each level:

|Level|Role |Permissions |
|---|---|---|
|Cluster|`AllDatabasesAdmin` |Full permission to all databases in the cluster. Show and alter certain cluster-level policies. Includes all lower `AllDatabases` permissions. |
|Cluster|`AllDatabasesViewer` |Read all data and metadata of any database in the cluster. |
|Cluster|`AllDatabasesMonitor` |Execute `.show` commands in the context of any database in the cluster.|
|Database|`admin`|Full permission in the scope of a particular database. Includes all lower level permissions.  |
|Database|`user`|Read all data and metadata of the database. Create tables and functions, and become the admin for those tables and functions.|
|Database|`viewer` |Read all data and metadata of a particular database without a [RestrictedViewAccess policy](../show-table-restricted-view-access-policy-command.md). |
|Database|`unrestrictedviewer` |Read all data and metadata of a particular database even with a [RestrictedViewAccess policy](../show-table-restricted-view-access-policy-command.md). |
|Database|`ingestor` |Ingest data into all existing tables in the database, but can't query the data. |
|Database|`monitor` |Execute `.show` commands in the context of the database and its child entities.  |
|Table| `admin` |Full permission in the scope of a particular table. |
|Table|`ingestor` |Ingest data in the scope of a particular table, but can't query the data. |
|Function|`admin` |Alter function, delete function, or grant admin permissions to another principal. |
|Materialized view|`admin` |Alter or delete the materialized view and grant admin permissions to another principal. |

To set cluster level permissions, see [LINK TO NEW DOC THAT I WROTE].

To set permissions for a specific database, table, function, or materialized view, [use management commands](../security-roles.md#commands-overview) or [use the Azure portal](../../../manage-database-permissions.md).

> [!NOTE]
> To grant a principal from a different tenant access to your cluster, see [Allow cross-tenant queries and commands](../../../cross-tenant-query-and-commands.md).
