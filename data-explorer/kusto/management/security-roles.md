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
> * [Role-based authorization](../management/access-control/role-based-authorization.md)
> * [Principals and identity providers](./access-control/principals-and-identity-providers.md)

This article describes the control commands used to manage security roles. Security roles determine if and how principals—users, groups, and apps—can interact with resources in your cluster.

When a principal attempts to make an operation on a secured resource, the system checks that the principal is associated with at least one security role that grants permissions to perform the operation on the resource. This is called an authorization check. Failing an authorization check aborts the operation.

>[!NOTE]
> To change security principals, you must be either a **database admin** or an **alldatabases admin**.

## Security roles

|Role|Description|Databases|Tables|Materialized views|Functions|
|--|--|--|--|--|--|
|`admins` |Have control over the securable object, including the ability to view, modify it, and remove the object and all sub-objects.|&check;|&check;|&check;|&check;|
|`users` |Can view the securable object, and create new objects underneath it.|&check;||||
|`viewers` |Can view the securable object.|&check;||||
|`unrestrictedviewers`|At the database level only, gives view permission to `admins`, `viewers` or `users` for all tables in the database that have a restricted view policy enabled. Use this role in addition to the `admins`, `viewers` or `users` roles. |&check;||||
|`ingestors` |At the database level only, allows data ingestion into all tables.|&check;|&check;|||
|`monitors` |At the specified scope (Database or AllDatabases) allows metadata (schemas, operations, permissiosn) view operations.|&check;||||

## List all principals

The `.show` command lists the principals that are set on the securable object. A line is returned for each role assigned to the principal.

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

## Managing security roles

### Syntax

*Action* *ObjectType* *ObjectName* *Role* `(` *Principal* [`,` *Principal*...] `)` [`skip-results`] [*Description*]

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *Action* | string | &check; | The command `.add`, `.drop`, or `.set`. For more information, see [commands](#commands).|
| *ObjectType* | string | &check; | The type of object: `database`, `table`, `materialized-view` or `function`.|
| *ObjectName* | string | &check; | The name of the object for which to list principals.|
| *Role* | string | &check; | A valid [security roles](#security-roles) for the specified object type.|
| *Principal* | string | &check; | One or more principals. For how to specify these principals, see [principals and identity providers](./access-control/principals-and-identity-providers.md).|
| *Description* | string | | Text to describe the change that will be displayed when using the `.show` command.|
| `skip-results` | string | | If provided, the command will not return the updated list of database principals.|

### Commands

|Command|Description|
|--|--|
|`.add` |Adds one or more principals to the role.|
|`.drop`|Removes one or more principals from the role.|
|`.set` |Sets the role to the specific list of principals, removing all previous ones.|

### Examples

```kusto
// No need to specify AAD tenant for UPN, as Kusto performs the resolution by itself
.add database Test users ('aaduser=imikeoein@fabrikam.com') 'Test user (AAD)'

// AAD App on another tenant - by tenant guid
.add database Test viewers ('aadapp=4c7e82bd-6adb-46c3-b413-fdd44834c69b;9752a91d-8e15-44e2-aa72-e9f8e12c3ec5') 'Test app on another tenant (AAD)'

// AAD SG on 'fabrikam.com' tenant
.add table TestTable ingestors ('aadGroup=SGEmail@fabrikam.com')
```

## Remove all principals

The `.set` command with `none` instead of a list of principals will remove all principals of the specified role.

### Syntax

`.set` *ObjectType* *ObjectName* *Role* `none` [`skip-results`]

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *ObjectType* | string | &check; | The type of object: `database`, `table`, `materialized-view` or `function`.
| *ObjectName* | string | &check; | The name of the object for which to list principals.|
| *Role* | string | &check; | The role to clear of all principals. The value must be a valid [security role](#security-roles) for the type of object.|
| `skip-results` | string | | If provided, the command will not return the updated list of principals.|

### Example

The following control command removes all `viewers` on the `Samples` database:

```kusto
.set database Samples viewers none
```
