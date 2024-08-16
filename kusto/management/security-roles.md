---
title: Security roles
description: Learn how to use security roles to provide principals access to resources.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# Security roles overview

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

Principals are granted access to resources through a role-based access control model, where their assigned security roles determine their resource access.

When a principal attempts an operation, the system performs an authorization check to make sure the principal is associated with at least one security role that grants permissions to perform the operation. Failing an authorization check aborts the operation.

The management commands listed in this article can be used to manage principals and their security roles on databases, tables, external tables, materialized views, and functions.

:::moniker range="microsoft-fabric"
> [!NOTE]
> The security roles of `AllDatabasesAdmin`, `AllDatabasesViewer` can't be configured with security role management commands. They are inherited respectively by the `Admin` and `Viewer` roles in the workspace.
::: moniker-end
::: moniker range="azure-data-explorer"
> [!NOTE]
> The three  cluster level security roles of `AllDatabasesAdmin`, `AllDatabasesViewer`, and `AllDatabasesMonitor` can't be configured with security role management commands.

To learn how to configure them in the Azure portal, see [Manage cluster permissions](/azure/data-explorer/manage-cluster-permissions).
::: moniker-end

## Management commands

The following table describes the commands used for managing security roles.

|Command|Description|
|--|--|
|`.show`|Lists principals with the given role.|
|`.add`|Adds one or more principals to the role.|
|`.drop`|Removes one or more principals from the role.|
|`.set`|Sets the role to the specific list of principals, removing all previous ones.|

## Security roles

The following table describes the level of access granted for each role and shows a check if the role can be assigned within the given object type.

|Role|Permissions|Databases|Tables|External tables|Materialized views|Functions|
|--|--|--|--|--|--|--|
|`admins` | View, modify, and remove the object and subobjects.| :heavy_check_mark:| :heavy_check_mark:| :heavy_check_mark:| :heavy_check_mark:| :heavy_check_mark:|
|`users` | View the object and create new subobjects.| :heavy_check_mark:|||||
|`viewers` | View the object where [RestrictedViewAccess](restricted-view-access-policy.md) isn't turned on.| :heavy_check_mark:|||||
|`unrestrictedviewers`| View the object even where [RestrictedViewAccess](restricted-view-access-policy.md) is turned on. The principal must also have `admins`, `viewers` or `users` permissions. | :heavy_check_mark:|||||
|`ingestors` | Ingest data to the object without access to query. | :heavy_check_mark:| :heavy_check_mark:||||
|`monitors` | View metadata such as schemas, operations, and permissions.| :heavy_check_mark:|||||

For a full description of the security roles at each scope, see [Kusto role-based access control](../access-control/role-based-access-control.md).

> [!NOTE]
> It isn't possible to assign the `viewer` role for only some tables in the database. For different approaches on how to grant a principal view access to a subset of tables, see [manage table view access](manage-table-view-access.md).

## Common scenarios

### Show your principal roles

::: moniker range="azure-data-explorer"
To see your own roles on the cluster, run the following command:
::: moniker-end

::: moniker range="microsoft-fabric"
To see your own roles on the eventhouse, run the following command:
::: moniker-end

```kusto
.show cluster principal roles
```

### Show your roles on a resource

To check the roles assigned to you on a specific resource, run the following command within the relevant database or the database that contains the resource:

```kusto
// For a database:
.show database DatabaseName principal roles

// For a table:
.show table TableName principal roles

// For an external table:
.show external table ExternalTableName principal roles

// For a function:
.show function FunctionName principal roles

// For a materialized view:
.show materialized-view MaterializedViewName principal roles
```

### Show the roles of all principals on a resource

To see the roles assigned to all principals for a particular resource, run the following command within the relevant database or the database that contains the resource:

```kusto
// For a database:
.show database DatabaseName principals

// For a table:
.show table TableName principals

// For an external table:
.show external table ExternalTableName principals

// For a function:
.show function FunctionName principals

// For a materialized view:
.show materialized-view MaterializedViewName principals
```

> [!TIP]
> Use the [where](../query/where-operator.md) operator to filter the results by a specific principal or role.

### Modify the role assignments

For details on how to modify your role assignments at the database and table levels, see [Manage database security roles](manage-database-security-roles.md) and [Manage table security roles](manage-table-security-roles.md).

## Related content

* [Kusto role-based access control](../access-control/role-based-access-control.md)
* [Referencing security principals](reference-security-principals.md)
