---
title: Security roles management - Azure Data Explorer
description: This article describes security roles management in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 09/07/2022
---
# Security roles management

> [!IMPORTANT]
> Before altering authorization rules on your cluster(s), read the following:
>
> * [Azure Data Explorer role-based access control](../management/access-control/role-based-authorization.md)
> * [Principals and identity providers](./access-control/principals-and-identity-providers.md)

Azure Data Explorer uses a role-based access control (RBAC) model in which principals—users, groups, and apps—get access to resources according to the security roles they're assigned.

When a principal attempts an operation, the system performs an authorization check to make sure the principal is associated with at least one security role that grants permissions to perform the operation. Failing an authorization check aborts the operation.

This article describes how to use management commands to set, view, and manage security roles for databases, tables, functions, and materialized views.

>[!NOTE]
> To change security principals, you must be either a **database admin** or an **alldatabases admin**.

## Security roles

The following table describes the level of access granted for each role and shows a check if the role can be assigned within the given object type.

|Role|Permissions|Databases|Tables|Materialized views|Functions|
|--|--|--|--|--|--|
|`admins` | View, modify, and remove the object and subobjects.|&check;|&check;|&check;|&check;|
|`users` | View the object and create new subobjects.|&check;||||
|`viewers` | View the object if [RestrictedViewAccess](restrictedviewaccesspolicy.md) isn't enabled.|&check;||||
|`unrestrictedviewers`| View the object even with [RestrictedViewAccess](restrictedviewaccesspolicy.md). Use in addition to the `admins`, `viewers` or `users` roles. |&check;||||
|`ingestors` | Ingest data to the object without access to query. |&check;|&check;|||
|`monitors` | View metadata such as schemas, operations, and permissions.|&check;||||

For a full description of the security roles at each scope, see [Azure Data Explorer role-based access control](access-control/role-based-authorization.md).

> [!TIP]
> There are three cluster level security roles—AllDatabasesAdmin, AllDatabasesViewer, and AllDatabasesMonitor—that can only be configured in the Azure portal. To learn more, see [manage cluster permissions](../../manage-cluster-permissions.md).

## List all principals

The `.show` management command lists the principals that are set on the securable object. A line is returned for each security role assigned to the principal.

### Syntax

`.show` *ObjectType* *ObjectName* `principals`

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *ObjectType* | string | &check; | The type of object: `database`, `table`, `materialized-view` or `function`.
| *ObjectName* | string | &check; | The name of the object for which to list principals.|

### Example

The following control command lists all security principals that have some
access to the table `StormEvents` in the database:

```kusto
.show table StormEvents principals
```

Example result:

|Role |PrincipalType |PrincipalDisplayName |PrincipalObjectId |PrincipalFQN|
|---|---|---|---|---|
|Database Apsty Admin |Azure AD User |Mark Smith |cd709aed-a26c-e3953dec735e |aaduser=msmith@fabrikam.com|

## Commands overview

This section describes how to use the commands `.add`, `.drop`, and `.set` to control the principals and their security roles.

### Syntax

*Action* *ObjectType* *ObjectName* *Role* `(` *Principal* [`,` *Principal*...] `)` [`skip-results`] [*Description*]

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *Action* | string | &check; | The command `.add`, `.drop`, or `.set`. For more information, see [commands](#commands).|
| *ObjectType* | string | &check; | The type of object: `database`, `table`, `materialized-view` or `function`.|
| *ObjectName* | string | &check; | The name of the object for which to list principals.|
| *Role* | string | &check; | A valid [security roles](#security-roles) for the specified object type.|
| *Principal* | string | &check; | One or more principals. For how to specify these principals, see [principals and identity providers](./access-control/principals-and-identity-providers.md#examples-for-azure-ad-principals).|
| *Description* | string | | Text to describe the change that will be displayed when using the `.show` command.|
| `skip-results` | string | | If provided, the command won't return the updated list of database principals.|

### Commands

|Command|Description|
|--|--|
|`.add` |Adds one or more principals to the role.|
|`.drop`|Removes one or more principals from the role.|
|`.set` |Sets the role to the specific list of principals, removing all previous ones.|

> [!NOTE]
> The `.set` command with `none` instead of a list of principals will remove all principals of the specified role. See [an example](#set).

## Managing database security roles

This section contains examples for the commands used to control database permissions. To learn how to construct the commands, see the [commands overview](#commands-overview). Databases allow for all [security roles](#security-roles).

### .add

Assign a principal to the `users` role:

```kusto
.add database SampleDatabase users ('aaduser=imikeoein@fabrikam.com') 'Test user (AAD)'
```

Assign an app to the `viewers` role:

```kusto
.add database SampleDatabase viewers ('aadapp=4c7e82bd-6adb-46c3-b413-fdd44834c69b;fabrikam.com') 'Test app @fabrikam.com (AAD)'
```

### .drop

Remove a group from the `admins` role:

```kusto
.drop database SampleDatabase admins ('aadGroup=SGEmail@fabrikam.com')
```

### .set

Remove existing `viewers` and set the given principals as the new `viewers`:

```kusto
.set database SampleDatabase viewers ('aaduser=imikeoein@fabrikam.com', 'aaduser=abbiatkins@fabrikam.com')
```

Remove all existing `viewers` on the `SampleDatabase` database:

```kusto
.set database SampleDatabase viewers none
```

Drop security roles:

```kusto
.drop database Test admins ('aadGroup=SGEmail@fabrikam.com')
```

## Managing table security roles

This section contains examples for the commands used to control table permissions. To learn how to construct the commands, see [commands overview](#commands-overview).

Tables only allow for principals to receive the `admins` or `ingestors` roles.

If a principal receives an `admins` table role, they must also have a role on the database to query the data because queries require database access. Regardless, they'll be able to drop the table. The `ingestors` can only ingest data into the table.

### .add

Assign a principal to the `admins` role:

```kusto
.add table SampleTable admins ('aaduser=imikeoein@fabrikam.com') 'Test user (AAD)'
```

Assign an app to the `ingestors` role:

```kusto
.add table SampleTable ingestors ('aadapp=4c7e82bd-6adb-46c3-b413-fdd44834c69b;fabrikam.com') 'Test app @fabrikam.com (AAD)'
```

### .drop

Remove a group from the `ingestors` role:

```kusto
.drop table SampleTable ingestors ('aadGroup=SGEmail@fabrikam.com')
```

### .set

Remove existing `admins` and set the given principals as the new `admins`:

```kusto
.set table SampleTable admins ('aaduser=imikeoein@fabrikam.com', 'aaduser=abbiatkins@fabrikam.com')
```

Remove all existing `ingestors` on the `SampleTable` table:

```kusto
.set table SampleTable ingestors none
```

Drop security roles:

```kusto
.drop table TestTable admins ('aaduser=imikeoein@fabrikam.com')
```

## Managing materialized view security roles

This section contains examples for the commands used to control materialized view permissions. To learn how to construct the commands, see [commands overview](#commands-overview). Principals must be given the role of `admins`, which means they'll have full permission to alter or delete the view.

### .add

Assign a principal to the `admins` role:

```kusto
.add materialized-view SampleView admins ('aaduser=imikeoein@fabrikam.com') 'Test user (AAD)'
```

### .drop

Remove a principal from the `admins` role:

```kusto
.drop materialized-view SampleView admins ('aadGroup=SGEmail@fabrikam.com')
```

### .set

Remove existing `admins` and sets the given principals as the new `admins`:

```kusto
.set materialized-view SampleView admins ('aaduser=imikeoein@fabrikam.com', 'aaduser=abbiatkins@fabrikam.com')
```

Remove all existing `admins` on the `SampleView` materialized view:

```kusto
.set materialized-view SampleView admins none
```

## Managing function security roles

This section contains examples for the commands used to control function permissions. To learn how to construct the commands, see [commands overview](#commands-overview). Principals must be given the role of `admins`, which means they'll have full permission to alter or delete the function.

### .add

Assign a group to the `admins` role:

```kusto
.add function SampleFunction admins ('aadGroup=SGEmail@fabrikam.com') 'Test group @fabrikam.com (AAD)'
```

### .drop

Remove a principal from the `admins` role:

```kusto
.drop function SampleFunction admins ('aadGroup=SGEmail@fabrikam.com')
```

### .set

Remove existing `admins` and sets the given principals as the new `admins`:

```kusto
.set function SampleFunction admins ('aaduser=imikeoein@fabrikam.com', 'aaduser=abbiatkins@fabrikam.com')
```

Remove all existing `admins` on the `SampleFunction` function:

```kusto
.set function SampleFunction admins none
```
