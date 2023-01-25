---
title: Security roles management - Azure Data Explorer
description: This article describes security roles management in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/25/2023
---
# Security roles management

Azure Data Explorer uses a role-based access control (RBAC) model in which principals get access to resources according to the security roles they're assigned.

When a principal attempts an operation, the system performs an authorization check to make sure the principal is associated with at least one security role that grants permissions to perform the operation. Failing an authorization check aborts the operation.

> [!IMPORTANT]
> Before altering authorization rules on your cluster(s), read the following:
>
> * [Azure Data Explorer role-based access control](./access-control/role-based-access-control.md)
> * [Principals and identity providers](./access-control/principals-and-identity-providers.md)

## Security roles

The following table describes the level of access granted for each role and shows a check if the role can be assigned within the given object type.

|Role|Permissions|Databases|Tables|External tables|Materialized views|Functions|
|--|--|--|--|--|--|--|
|`admins` | View, modify, and remove the object and subobjects.|&check;|&check;|&check;|&check;|&check;|
|`users` | View the object and create new subobjects.|&check;|||||
|`viewers` | View the object where [RestrictedViewAccess](restrictedviewaccesspolicy.md) isn't turned on.|&check;|||||
|`unrestrictedviewers`| View the object even where [RestrictedViewAccess](restrictedviewaccesspolicy.md) is turned on. The principal must also have `admins`, `viewers` or `users` permissions. |&check;|||||
|`ingestors` | Ingest data to the object without access to query. |&check;|&check;||||
|`monitors` | View metadata such as schemas, operations, and permissions.|&check;|||||

For a full description of the security roles at each scope, see [Azure Data Explorer role-based access control](access-control/role-based-access-control.md).

> [!TIP]
> There are three cluster level security roles (AllDatabasesAdmin, AllDatabasesViewer, and AllDatabasesMonitor) that can only be configured in the Azure portal. To learn more, see [manage cluster permissions](../../manage-cluster-permissions.md).

## Management commands

The following table describes the management commands used for managing security roles.

|Command|Description|
|--|--|
|[`.show`](show-security-roles.md)|Lists principals with the given role.|
|[`.add`](add-security-roles.md)|Adds one or more principals to the role.|
|[`.drop`](drop-security-roles.md)|Removes one or more principals from the role.|
|[`.set`](set-security-roles.md)|Sets the role to the specific list of principals, removing all previous ones.|
