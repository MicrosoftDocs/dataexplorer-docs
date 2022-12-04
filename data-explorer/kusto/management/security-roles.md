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

## Actions

|Command|Description|
|--|--|
|`.show`|Lists the principals to the role.|
|`.add` |Adds one or more principals to the role.|
|`.drop`|Removes one or more principals from the role.|
|`.set` |Sets the role to the specific list of principals, removing all previous ones.|

## Database roles management

### Syntax

* List all principals on the database:

    `.show` `database` *DatabaseName* `principals`

* Add new principals to the role without removing existing principals:

    `.add` `database` *DatabaseName* *Role* `(` *Principal* [`,` *Principal*...] `)` [`skip-results`] [*Description*]

* Remove the indicated principals from the roles and keep the others:

    `.drop` `database` *DatabaseName* *Role* `(` *Principal* [`,` *Principal*...] `)` [`skip-results`] [*Description*]

* Remove all principals from the role:

    `.set` `database` *DatabaseName* *Role* `none` [`skip-results`]

* Remove all principals from the role and add a new set of principals:

    `.set` `database` *DatabaseName* *Role* `(` *Principal* [`,` *Principal*...] `)` [`skip-results`] [*Description*]

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
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

## Table security roles management

### Syntax

* See all principals set on the table:

    `.show` `table` *TableName* `principals`

* Add new principals to the role without removing existing principals:

    `.add` `table` *TableName* *Role* `(` *Principal* [`,` *Principal*...] `)` [`skip-results`] [*Description*]

* Remove the indicated principals from the roles and keeps the others:

    `.drop` `table` *TableName* *Role* `(` *Principal* [`,` *Principal*...] `)` [`skip-results`] [*Description*]

* Remove all principals from the role:

    `.set` `table` *TableName* *Role* `none` [`skip-results`]

* Remove all principals from the role and set a new set of principals:

    `.set` `table` *TableName* *Role* `(` *Principal* [`,` *Principal*...] `)` [`skip-results`] [*Description*]

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *TableName* | string | &check; | The name of the table whose security role is being modified.|
| *Role* | string | &check; | For tables, role must be either `admins` or `ingestors`. For more information, see [security-roles](#security-roles).|
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

* Add new principals to the role without removing existing principals:

    `.add` `materialized-view` *MaterializedViewName* `admins` `(` *Principal* `,[` *Principal...* `])`

* Remove the indicated principals from the roles and keeps the others:

    `.drop` `materialized-view` *MaterializedViewName* `admins` `(` *Principal* `,[` *Principal...* `])`

* Remove all principals from the role and set a new set of principals:

    `.set` `materialized-view` *MaterializedViewName* `admins` `(` *Principal* `,[` *Principal...* `])`

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *MaterializedViewName* | string | &check; | The name of the materialized view whose security role is being modified.|
| *Principal* | string | | One or more principals. See [principals and identity providers](./access-control/principals-and-identity-providers.md) for how to specify these principals. |

## Function security role management

`.set` `function` *FunctionName* *Role* `none` [`skip-results`]

`.set` `function` *FunctionName* *Role* `(` *Principal* [`,` *Principal*...] `)` [`skip-results`] [*Description*]

`.add` `function` *FunctionName* *Role* `(` *Principal* [`,` *Principal*...] `)` [`skip-results`] [*Description*]

`.drop` `function` *FunctionName* *Role* `(` *Principal* [`,` *Principal*...] `)` [`skip-results`] [*Description*]

The first command removes all principals from the role. The second removes all
principals from the role, and sets a new set of principals. The third adds new
principals to the role without removing existing principals. The last removes
the indicated principals from the roles and keeps the others.

Where:

* *FunctionName* is the name of the function whose security role is being modified.

* *Role* is always `admin`.

* *Principal* is one or more principals. See [principals and identity providers](./access-control/principals-and-identity-providers.md)
  for how to specify these principals.

* `skip-results`, if provided, requests that the command will not return the updated
  list of function principals.

* *Description*, if provided, is text that will be associated with the change
  and retrieved by the corresponding `.show` command.

### Example

```kusto
.add function MyFunction admins ('aaduser=imike@fabrikam.com') 'This user should have access'
```
