---
title: Manage table security roles
description: Learn how to use management commands to view, add, and remove security roles on a table level.
ms.topic: reference
ms.date: 07/17/2023
---

# Manage table security roles

Principals are granted access to resources through a role-based access control model, where their assigned security roles determine their resource access.

In this article, you'll learn how to use management commands to [view existing security roles](#show-existing-security-roles) as well as [add and remove security roles](#add-and-drop-security-roles) on the table level.

> [!NOTE]
> A principal must have access on the database level to be assigned table specific security roles.

## Permissions

You must have at least [Table Admin](access-control/role-based-access-control.md) permissions to run these commands.

## Table level security roles

The following table shows the possible security roles on the table level and describes the permissions granted for each role.

|Role|Permissions|
|--|--|
|`admins` | View, modify, and remove the table and table entities.|
|`ingestors` | Ingest data to the table without access to query. |

> [!NOTE]
> To learn how to grant a principal view access to a subset of tables within a database, see [manage table view access](manage-table-view-access.md).

## Show existing security roles

Before you add or remove principals, you can use the `.show` command to see a table with all of the principals and roles that are already set on the table.

### Syntax

To show all roles:

`.show` `table` *TableName* `principals`

To show your roles:

`.show` `table` *TableName* `principal` `roles`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *TableName* | `string` |  :heavy_check_mark: | The name of the table for which to list principals.|

### Example

The following command lists all security principals that have access to the `StormEvents` table.

```kusto
.show table StormEvents principals
```

**Example output**

|Role |PrincipalType |PrincipalDisplayName |PrincipalObjectId |PrincipalFQN|
|---|---|---|---|---|
|Table StormEvents Admin |Microsoft Entra user |Abbi Atkins |cd709aed-a26c-e3953dec735e |aaduser=abbiatkins@fabrikam.com|

## Add and drop security roles

This section provides syntax, parameters, and examples for adding and removing principals.

### Syntax

*Action* `table` *TableName* *Role* `(` *Principal* [`,` *Principal*...] `)` [`skip-results`] [ *Description* ]

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *Action* | `string` |  :heavy_check_mark: | The command `.add`, `.drop`, or `.set`.<br/>`.add` adds the specified principals, `.drop` removes the specified principals, and `.set` adds the specified principals and removes all previous ones.|
| *TableName* | `string` |  :heavy_check_mark: | The name of the table for which to add principals.|
| *Role* | `string` |  :heavy_check_mark: | The role to assign to the principal. For tables, this can be `admins` or `ingestors`.|
| *Principal* | `string` |  :heavy_check_mark: | One or more principals. For guidance on how to specify these principals, see [Referencing security principals](access-control/referencing-security-principals.md).|
| `skip-results` | `string` | | If provided, the command won't return the updated list of table principals.|
| *Description* | `string` | | Text to describe the change that will be displayed when using the `.show` command.|

> [!NOTE]
> The `.set` command with `none` instead of a list of principals will remove all principals of the specified role.

### Examples

In the following examples, you'll see how to [add security roles](#add-security-roles-with-add), [remove security roles](#remove-security-roles-with-drop), and [add and remove security roles in the same command](#add-new-security-roles-and-remove-the-old-with-set).

#### Add security roles with .add

The following example adds a principal to the `admins` role on the `StormEvents` table.

```kusto
.add table StormEvents admins ('aaduser=imikeoein@fabrikam.com')
```

The following example adds an application to the `ingestors` role on the `StormEvents` table.

```kusto
.add table StormEvents ingestors ('aadapp=4c7e82bd-6adb-46c3-b413-fdd44834c69b;fabrikam.com')
```

#### Remove security roles with .drop

The following example removes all principals in the group from the `admins` role on the `StormEvents` table.

```kusto
.drop table StormEvents admins ('aadGroup=SomeGroupEmail@fabrikam.com')
```

#### Add new security roles and remove the old with .set

The following example removes existing `ingestors` and adds the provided principals as `ingestors` on the `StormEvents` table.

```kusto
.set table StormEvents ingestors ('aaduser=imikeoein@fabrikam.com', 'aaduser=abbiatkins@fabrikam.com')
```

#### Remove all security roles with .set

The following command removes all existing `ingestors` on the `StormEvents` table.

```kusto
.set table StormEvents ingestors none
```

## Related content

* [current_principal_details()](../query/current-principal-details-function.md)
