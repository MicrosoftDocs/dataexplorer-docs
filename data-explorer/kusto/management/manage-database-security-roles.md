---
title: Manage database security roles
description: Learn how to use management commands to view, add, and remove security roles on a database level.
ms.topic: reference
ms.date: 05/28/2023
---

# Manage database security roles

Principals are granted access to resources through a role-based access control model, where their assigned security roles determine their resource access.

In this article, you'll learn how to use management commands to [view existing security roles](#show-existing-security-roles) as well as [add and remove security roles](#add-and-drop-security-roles) on the database level.

> [!NOTE]
> To delete a database, you need at least **Contributor** Azure Resource Manager (ARM) permissions on the cluster. To assign ARM permissions, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

## Permissions

You must have at least [Database Admin](access-control/role-based-access-control.md) permissions to run these commands.

## Database level security roles

The following table shows the possible security roles on the database level and describes the permissions granted for each role.

|Role|Permissions|
|--|--|
|`admins` | View and modify the database and database entities.|
|`users` | View the database and create new database entities.|
|`viewers` | View tables in the database where [RestrictedViewAccess](restricted-view-access-policy.md) isn't turned on.|
|`unrestrictedviewers`| View the tables in the database even where [RestrictedViewAccess](restricted-view-access-policy.md) is turned on. The principal must also have `admins`, `viewers` or `users` permissions. |
|`ingestors` | Ingest data to the database without access to query. |
|`monitors` | View database metadata such as schemas, operations, and permissions.|

> [!NOTE]
> It isn't possible to assign the `viewer` role for only some tables in the database. For different approaches on how to grant a principal view access to a subset of tables, see [manage table view access](manage-table-view-access.md).

## Show existing security roles

Before you add or remove principals, you can use the `.show` command to see a table with all of the principals and roles that are already set on the database.

### Syntax

To show all roles:

`.show` `database` *DatabaseName* `principals`

To show your roles:

`.show` `database` *DatabaseName* `principal` `roles`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *DatabaseName* | `string` |  :heavy_check_mark: | The name of the database for which to list principals.|

### Example

The following command lists all security principals that have access to the `Samples` database.

```kusto
.show database Samples principals
```

**Example output**

|Role |PrincipalType |PrincipalDisplayName |PrincipalObjectId |PrincipalFQN|
|---|---|---|---|---|
|Database Samples Admin |Microsoft Entra user |Abbi Atkins |cd709aed-a26c-e3953dec735e |aaduser=abbiatkins@fabrikam.com|

## Add and drop security roles

This section provides syntax, parameters, and examples for adding and removing principals.

### Syntax

*Action* `database` *DatabaseName* *Role* `(` *Principal* [`,` *Principal*...] `)` [`skip-results`] [ *Description* ]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *Action* | `string` |  :heavy_check_mark: | The command `.add`, `.drop`, or `.set`.<br/>`.add` adds the specified principals, `.drop` removes the specified principals, and `.set` adds the specified principals and removes all previous ones.|
| *DatabaseName* | `string` |  :heavy_check_mark: | The name of the database for which to add principals.|
| *Role* | `string` |  :heavy_check_mark: | The role to assign to the principal. For databases, this can be `admins`, `users`, `viewers`, `unrestrictedviewers`, `ingestors`, or `monitors`.|
| *Principal* | `string` |  :heavy_check_mark: | One or more principals. For guidance on how to specify these principals, see [Referencing security principals](./access-control/referencing-security-principals.md).|
| `skip-results` | `string` | | If provided, the command won't return the updated list of database principals.|
| *Description* | `string` | | Text to describe the change that will be displayed when using the `.show` command.|

> [!NOTE]
> The `.set` command with `none` instead of a list of principals will remove all principals of the specified role.

### Examples

In the following examples, you'll see how to [add security roles](#add-security-roles-with-add), [remove security roles](#remove-security-roles-with-drop), and [add and remove security roles in the same command](#add-new-security-roles-and-remove-the-old-with-set).

#### Add security roles with .add

The following example adds a principal to the `users` role on the `Samples` database.

```kusto
.add database Samples users ('aaduser=imikeoein@fabrikam.com')
```

The following example adds an application to the `viewers` role on the `Samples` database.

```kusto
.add database Samples viewers ('aadapp=4c7e82bd-6adb-46c3-b413-fdd44834c69b;fabrikam.com')
```

#### Remove security roles with .drop

The following example removes all principals in the group from the `admins` role on the `Samples` database.

```kusto
.drop database Samples admins ('aadGroup=SomeGroupEmail@fabrikam.com')
```

#### Add new security roles and remove the old with .set

The following example removes existing `viewers` and adds the provided principals as `viewers` on the `Samples` database.

```kusto
.set database Samples viewers ('aaduser=imikeoein@fabrikam.com', 'aaduser=abbiatkins@fabrikam.com')
```

#### Remove all security roles with .set

The following command removes all existing `viewers` on the `Samples` database.

```kusto
.set database Samples viewers none
```

## Related content

* [current_principal_details()](../query/current-principal-details-function.md)
