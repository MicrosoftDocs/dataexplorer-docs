---
title: Security roles management - Azure Data Explorer
description: This article describes security roles management in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 09/07/2022
---
# Security roles management

> [!IMPORTANT]
> Before altering authorization rules on your Kusto cluster(s), read the following:
>
> * [Kusto access control overview](../management/access-control/index.md)
> * [Role-based authorization](../management/access-control/role-based-authorization.md)

This article describes the control commands used to manage security roles. Security roles determine if and how principals—such as users, groups, and apps—can interact with resources in your cluster—such as databases and tables.

When a principal attempts to make an operation on a secured resource, the system checks that the principal is associated with at least one security role that grants permissions to perform the desired operation on the resource. This is called an authorization check. Failing the authorization check aborts the operation.

>[!NOTE]
> To change security principals, you must be either a database admin or an alldatabases admin.

## Security roles

|*Role*|Description|
|--|--|
|`admins` |Have control over the securable object, including the ability to view, modify it, and remove the object and all sub-objects.|
|`users` |Can view the securable object, and create new objects underneath it.|
|`viewers` |Can view the securable object.|
|`unrestrictedviewers`|At the database level only, gives view permission to `admins`, `viewers` or `users` for all tables in the database that have a restricted view policy enabled. Use this role in addition to the `admins`, `viewers` or `users` roles. |
|`ingestors` |At the database level only, allows data ingestion into all tables.|
|`monitors` |At the specified scope (Database or AllDatabases) allows metadata (schemas, operations, permissiosn) view operations.|

## Commands

|Command|Description|
|--|--|
|`.show`|Lists the principals to the resource.|
|`.add` |Adds one or more principals to the role.|
|`.drop`|Removes one or more principals from the role.|
|`.set` |Sets the role to the specific list of principals, removing all previous ones.|

## Database roles management

### Syntax

* List all principals:

  `.show` `database` *DatabaseName* `principals`

* Remove all principals of the role:

  `.set` `database` *DatabaseName* *Role* `none` [`skip-results`]

* Add, remove, or set principals of the role:

  *Action* `database` *DatabaseName* *Role* `(` *Principal* [`,` *Principal*...] `)` [`skip-results`] [*Description*]

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *Action* | string | &check; | The command `.add`, `.remove`, or `.set`. For more information, see [commands](#commands).
| *DatabaseName* | string | &check; | The name of the database whose security role is being modified.|
| *Role* | string | &check; | Any of the [security roles](#security-roles).|
| *Principal* | string | | One or more principals. See [principals and identity providers](./access-control/principals-and-identity-providers.md) for how to specify these principals. |
| *Description* | string | | Text that will be associated with the change and retrieved by the `.show` command.
| `skip-results` | | | If provided, the command will not return the updated list of database principals.|

### Example

```kusto
// No need to specify AAD tenant for UPN, as Kusto performs the resolution by itself
.add database Test users ('aaduser=imikeoein@fabrikam.com') 'Test user (AAD)'

// AAD SG on 'fabrikam.com' tenant
.add database Test admins ('aadGroup=SGEmail@fabrikam.com')

// OPTIONAL: AAD App on another tenant - by tenant guid
.add database Test viewers ('aadapp=4c7e82bd-6adb-46c3-b413-fdd44834c69b;9752a91d-8e15-44e2-aa72-e9f8e12c3ec5') 'Test app on another tenant (AAD)'
```

## Table roles management

### Syntax

* List all principals:

  `.show` `table` *TableName* `principals`

* Remove all principals of the role:

  `.set` `table` *TableName* *Role* `none` [`skip-results`]

* Add, remove, or set principals of the role:

  *Action* `table` *TableName* *Role* `(` *Principal* [`,` *Principal*...] `)` [`skip-results`] [*Description*]

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *Action* | string | &check; | The command `.add`, `.remove`, or `.set`. For more information, see [commands](#commands).
| *TableName* | string | &check; | The name of the table whose security role is being modified.|
| *Role* | string | &check; | For tables, role must be either `admins` or `ingestors`. For more information, see [security roles](#security-roles).|
| *Principal* | string | | One or more principals. See [principals and identity providers](./access-control/principals-and-identity-providers.md) for how to specify these principals. |
| *Description* | string | | Text that will be associated with the change and retrieved by the `.show` command.
| `skip-results` | | | If provided, the command will not return the updated list of database principals.|

### Example

```kusto
// No need to specify AAD tenant for UPN, as Kusto performs the resolution by itself
.add table TestTable admins ('aaduser=imikeoein@fabrikam.com') 'Test user (AAD)'

// AAD SG on 'fabrikam.com' tenant
.add table TestTable ingestors ('aadGroup=SGEmail@fabrikam.com')

// OPTIONAL: AAD App on another tenant - by tenant guid
.add table TestTable ingestors ('aadapp=4c7e82bd-6adb-46c3-b413-fdd44834c69b;9752a91d-8e15-44e2-aa72-e9f8e12c3ec5') 'Test app on another tenant (AAD)'
```

## Materialized view role management

### Syntax

* See all principals set on the table:

  `.show` `materialized-view` *MaterializedViewName* `principals`

* Add, remove, or set principals of the role:

  *Action* `materialized-view` *MaterializedViewName* `admins` `(` *Principal* `,[` *Principal...* `])`

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *Action* | string | &check; | The command `.add`, `.remove`, or `.set`. For more information, see [commands](#commands).
| *MaterializedViewName* | string | &check; | The name of the materialized view whose security role is being modified.|
| *Principal* | string | | One or more principals. See [principals and identity providers](./access-control/principals-and-identity-providers.md) for how to specify these principals. |

## Function role management

* List all principals:

  `.show` `function` *FunctionName* `principals`

* Remove all principals of the role:

  `.set` `function` *FunctionName* `admins` `none` [`skip-results`]

* Add, remove, or set principals of the role:

  *Action* `function` *FunctionName* `admins` `(` *Principal* [`,` *Principal*...] `)` [`skip-results`] [*Description*]

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *Action* | string | &check; | The command `.add`, `.remove`, or `.set`. For more information, see [commands](#commands).
| *FunctionName* | string | &check; | The name of the function whose security role is being modified.|
| *Principal* | string | | One or more principals. See [principals and identity providers](./access-control/principals-and-identity-providers.md) for how to specify these principals. |
| *Description* | string | | Text that will be associated with the change and retrieved by the `.show` command.
| `skip-results` | | | If provided, the command will not return the updated list of database principals.|

### Example

```kusto
.add function MyFunction admins ('aaduser=imike@fabrikam.com') 'This user should have access'
```
