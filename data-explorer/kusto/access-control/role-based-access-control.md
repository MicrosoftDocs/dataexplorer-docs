---
title:  Role-based access control
description: This article describes role-based access control.
ms.reviewer: orspodek
ms.topic: reference
ms.date: 07/28/2024
monikerRange: "azure-data-explorer || microsoft-fabric"
---
# Role-based access control

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

::: moniker range="azure-data-explorer"

Azure Data Explorer uses a role-based access control (RBAC) model in which [principals](../management/reference-security-principals.md) get access to resources based on their assigned roles. Roles are defined for a specific cluster, database, table, external table, materialized view, or function. When defined for a cluster, the role applies to all databases in the cluster. When defined for a database, the role applies to all entities in the database.  

Azure Resource Manager (ARM) roles, such as subscription owner or cluster owner, grant access permissions for resource administration. For data administration, you need the roles described in this document.

> [!NOTE]
> To delete a database, you need at least **Contributor** ARM permissions on the cluster. To assign ARM permissions, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

::: moniker-end
::: moniker range="microsoft-fabric"

Real-Time Intelligence in Fabric uses a hybrid role-based access control (RBAC) model in which [principals](../management/reference-security-principals.md) get access to resources based on their assigned roles granted from one or both of two sources: Fabric, and Kusto [management commands](../management/manage-database-security-roles.md). The user will have the union of the roles granted from both sources.

Within Fabric, roles can be assigned or inherited by [assigning a role in a workspace](/fabric/get-started/roles-workspaces), or by sharing a specific [item](/fabric/get-started/share-items) based on the [item permission model](/fabric/get-started/share-items#item-permission-model).

## Fabric roles

| Role                  | Permissions granted on items             |
| --------------------- | ---------------------------------------- |
| Workspace **Admin**       | Admin RBAC role on all items in the workspace.     |
| Workspace **Member**      | Admin RBAC role on all items in the workspace.     |
| Workspace **Contributor** | Admin RBAC role on all items in the workspace.     |
| Workspace **Viewer**      | Viewer RBAC role on all items in the workspace. |
| Item **Editor**          | Admin RBAC role on the item.                       |
| Item **Viewer**           | Viewer RBAC role on the item.                      |

Roles can further be defined on the data plane for for a specific database, table, external table, materialized view, or function, by using [management commands](../management/manage-database-security-roles.md). In both cases, roles applied at a higher level (Workspace, Eventhouse) are inherited by lower levels (Database, Table).
::: moniker-end

## Roles and permissions

The following table outlines the roles and permissions available at each scope.

The **Permissions** column displays the access granted to each role.

::: moniker range="azure-data-explorer"
The **Dependencies** column lists the minimum roles required to obtain the role in that row. For example, to become a Table Admin, you must first have a role like Database User or a role that includes the permissions of Database User, such as Database Admin or AllDatabasesAdmin. When multiple roles are listed in the **Dependencies** column, only one of them is needed to obtain the role.
::: moniker-end

::: moniker range="microsoft-fabric"
The **How the role is obtained** column offers ways that the role can be granted or inherited.
::: moniker-end

::: moniker range="azure-data-explorer"
The **Manage** column offers ways to add or remove role principals.

| Scope             | Role                | Permissions                                                                                                                                                          | Dependencies                       | Manage                                                                                                                                        |
| ----------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Cluster           | AllDatabasesAdmin   | Full permission to all databases in the cluster. May show and alter certain cluster-level policies. Includes all permissions.                                                                            || [Azure portal](/azure/data-explorer/manage-cluster-permissions.md)                                                                            |
| Cluster           | AllDatabasesViewer  | Read all data and metadata of any database in the cluster.                                                                                                                                               || [Azure portal](/azure/data-explorer/management/manage-cluster-permissions.md)                                                                 |
| Cluster           | AllDatabasesMonitor | Execute `.show` commands in the context of any database in the cluster.                                                                                                                                  || [Azure portal](/azure/data-explorer/manage-cluster-permissions.md)                                                                            |
| Database          | Admin               | Full permission in the scope of a particular database. Includes all lower level permissions.                                                                                                             || [Azure portal](/azure/data-explorer/manage-database-permissions.md) or [management commands](../management/manage-database-security-roles.md) |
| Database          | User                | Read all data and metadata of the database. Create tables and functions, and become the admin for those tables and functions.                                                                            || [Azure portal](/azure/data-explorer/manage-database-permissions.md) or [management commands](../management/manage-database-security-roles.md) |
| Database          | Viewer              | Read all data and metadata, except for tables with the [RestrictedViewAccess policy](../management/show-table-restricted-view-access-policy-command.md) turned on.                                       || [Azure portal](/azure/data-explorer/manage-database-permissions.md) or [management commands](../management/manage-database-security-roles.md) |
| Database          | Unrestrictedviewer  | Read all data and metadata, including in tables with the [RestrictedViewAccess policy](../management/show-table-restricted-view-access-policy-command.md) turned on. | Database User or Database Viewer   | [Azure portal](/azure/data-explorer/manage-database-permissions.md) or [management commands](../management/manage-database-security-roles.md) |
| Database          | Ingestor            | Ingest data to all tables in the database without access to query the data.                                                                                                                              || [Azure portal](/azure/data-explorer/manage-database-permissions.md) or [management commands](../management/manage-database-security-roles.md) |
| Database          | Monitor             | Execute `.show` commands in the context of the database and its child entities.                                                                                                                          || [Azure portal](/azure/data-explorer/manage-database-permissions.md) or [management commands](../management/manage-database-security-roles.md) |
| Table             | Admin               | Full permission in the scope of a particular table.                                                                                                                  | Database User                      | [management commands](../management/manage-table-security-roles.md)                                                                           |
| Table             | Ingestor            | Ingest data to the table without access to query the data.                                                                                                           | Database User or Database Ingestor | [management commands](../management/manage-table-security-roles.md)                                                                           |
| External Table    | Admin               | Full permission in the scope of a particular external table.                                                                                                         | Database User or Database Viewer   | [management commands](../management/manage-external-table-security-roles.md)                                                                  |
| Materialized view | Admin               | Full permission to alter the view, delete the view, and grant admin permissions to another principal.                                                                | Database User or Table Admin       | [management commands](../management/manage-materialized-view-security-roles.md)                                                               |
| Function          | Admin               | Full permission to alter the function, delete the function, and grant admin permissions to another principal.                                                        | Database User or Table Admin       | [management commands](../management/manage-function-security-roles.md)                                                                        |
::: moniker-end

::: moniker range="microsoft-fabric"
| Scope             | Role               | Permissions                                                                                                                                                          | How the role is obtained                                                                                                                                                                                                                                                                                                                           |
| ----------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Eventhouse        | AllDatabasesAdmin  | Full permission to all databases in the Eventhouse. May show and alter certain Eventhouse-level policies. Includes all permissions.                                  | - Inherited as workspace **admin**, workspace **member**, or workspace **contributor**. <br> <br> Can't be assigned with management commands.                                                                                                                                                                                                             |
| Database          | Admin              | Full permission in the scope of a particular database. Includes all lower level permissions.                                                                         | - Inherited as workspace **admin**, workspace **member**, or workspace **contributor** <br> - [Item shared](/fabric/get-started/share-items#item-permission-model) with editing permissions. <br> - Assigned with [management commands](../management/manage-database-security-roles.md)                            |
| Database          | User               | Read all data and metadata of the database. Create tables and functions, and become the admin for those tables and functions.                                        | - Assigned with [management commands](../management/manage-database-security-roles.md)                                                                                                                                                                                                                                                               |
| Database          | Viewer             | Read all data and metadata, except for tables with the [RestrictedViewAccess policy](../management/show-table-restricted-view-access-policy-command.md) turned on.   | - [Item shared](/fabric/get-started/share-items#item-permission-model) with viewing permissions. <br> - Assigned with [management commands](../management/manage-database-security-roles.md)                                                                                                                        |
| Database          | Unrestrictedviewer | Read all data and metadata, including in tables with the [RestrictedViewAccess policy](../management/show-table-restricted-view-access-policy-command.md) turned on. | - Assigned with [management commands](../management/manage-database-security-roles.md). Dependent on having **Database User** or **Database Viewer**.                                                                                                                                                                                                                             |
| Database          | Ingestor           | Ingest data to all tables in the database without access to query the data.                                                                                          | - Assigned with [management commands](../management/manage-database-security-roles.md)                                                                                                                                                                                                                                                               |
| Database          | Monitor            | Execute `.show` commands in the context of the database and its child entities.                                                                                      | - Assigned with [management commands](../management/manage-database-security-roles.md)                                                                                                                                                                                                                                                               |
| Table             | Admin              | Full permission in the scope of a particular table.                                                                                                                  |  - Inherited as workspace **admin**, workspace **member**, or workspace **contributor** <br> - Parent item (KQL Database) [shared](/fabric/get-started/share-items#item-permission-model) with editing permissions. <br> - Assigned with [management commands](../management/manage-database-security-roles.md). Dependent on having **Database User** on the parent database.    |
| Table             | Ingestor           | Ingest data to the table without access to query the data.                                                                                                           | - Assigned with [management commands](../management/manage-table-security-roles.md). Dependent on having **Database User** or **Database Ingestor** on the parent database.                                                                                                                                                                                                        |
| External Table    | Admin              | Full permission in the scope of a particular external table.                                                                                                         | - Assigned with [management commands](../management/manage-external-table-security-roles.md). Dependent on having **Database User** or **Database Viewer** on the parent database.                                                                                                                                                                                                                                                          |
| Materialized view | Admin              | Full permission to alter the view, delete the view, and grant admin permissions to another principal.                                                                | - Inherited as workspace **admin**, workspace **member**, or workspace **contributor** <br> - Parent item (KQL Database) [shared](/fabric/get-started/share-items#item-permission-model) with editing permissions. <br> - Assigned with [management commands](../management/manage-database-security-roles.md). Dependent on having **Database User** or **Table Admin** on the parent items. |
| Function          | Admin              | Full permission to alter the function, delete the function, and grant admin permissions to another principal.                                                        | - Inherited as workspace **admin**, workspace **member**, or workspace **contributor** <br> - Parent item (KQL Database) [shared](/fabric/get-started/share-items#item-permission-model) with editing permissions. <br> - Assigned with [management commands](../management/manage-database-security-roles.md). Dependent on having **Database User** or **Table Admin** on the parent items.      |
::: moniker-end

## Related content

* [Manage view access to tables within the same database](../management/manage-table-view-access.md)
* [Manage function roles](../management/manage-function-security-roles.md)
::: moniker range="azure-data-explorer"
* [Manage cluster permissions](/azure/data-explorer/manage-cluster-permissions)
* [Allow cross-tenant queries and commands](/azure/data-explorer/cross-tenant-query-and-commands)
::: moniker-end
