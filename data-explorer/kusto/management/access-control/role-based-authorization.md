---
title: Role-based access control in Kusto - Azure Data Explorer
description: This article describes role-based access control in Kusto in Azure Data Explorer.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 12/20/2021
---
# Role-based access control

Azure Data Explorer uses a role-based access control (RBAC) model in which [principals](principals-and-identity-providers.md) get access to resources according to the roles they're assigned.

Roles are defined within the scope of a cluster, database, table, materialized view, or function. If defined within the scope of a cluster, the role applies to all databases in the cluster. If defined within the scope of a database, the role applies to all tables in the database.

Manage roles with the Azure portal or management commands. Roles set through the Azure portal are stored within the greater Azure RBAC model. Roles set by management commands are stored on the Azure Data Explorer level. The permissions work the same in both cases.

> [!NOTE]
> Cluster level roles can only be assigned through the Azure portal.

## Roles and permissions

The following table describes the possible roles at each level.

|Scope|Role|Permissions|
|---|---|---|
|Cluster|`AllDatabasesAdmin` |Full permission to all databases in the cluster. May show and alter certain cluster-level policies. Includes all lower `AllDatabases` permissions. |
|Cluster|`AllDatabasesViewer` |Read all data and metadata of any database in the cluster. |
|Cluster|`AllDatabasesMonitor` |Execute `.show` commands in the context of any database in the cluster.|
|Database|`admin`|Full permission in the scope of a particular database. Includes all lower level permissions.  |
|Database|`user`|Read all data and metadata of the database. Create tables and functions, and become the admin for those tables and functions.|
|Database|`viewer` |Read all data and metadata of a particular database without a [RestrictedViewAccess policy](../show-table-restricted-view-access-policy-command.md). |
|Database|`unrestrictedviewer` |Read all data and metadata of a particular database even with a [RestrictedViewAccess policy](../show-table-restricted-view-access-policy-command.md). |
|Database|`ingestor` |Ingest data to all tables in the database without access to query the data. |
|Database|`monitor` |Execute `.show` commands in the context of the database and its child entities.  |
|Table| `admin` | To query a table, a principal needs access in the database scope as well. Even without database access, a table admin can ingest data to the table or drop the table.|
|Table|`ingestor` |Ingest data to the table without access to query the data. |
|Materialized view|`admin` |Full permission to alter the view, delete the view, and grant admin permissions to another principal. |
|Function|`admin` |Full permission to alter the function, delete the function, and grant admin permissions to another principal. |

## Next steps

* To set cluster level permissions, see [LINK TO NEW DOC - NOT MERGED YET].
* To set permissions for a specific database, table, function, or materialized view, [use management commands](../security-roles.md#commands-overview) or [use the Azure portal](../../../manage-database-permissions.md).
* To grant a principal from a different tenant access to your cluster, see [Allow cross-tenant queries and commands](../../../cross-tenant-query-and-commands.md).
