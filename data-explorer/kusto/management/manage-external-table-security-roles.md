---
title: Manage external table roles
description: Learn how to use management commands to view, add, and remove external table admins on an external table level.
ms.topic: reference
ms.date: 07/17/2023
---

# Manage external table roles

Principals are granted access to resources through a role-based access control model, where their assigned security roles determine their resource access.

On external tables, the only security role is `admins`. External table `admins` have the ability to view, modify, and remove the external table.

In this article, you'll learn how to use management commands to [view existing admins](#show-existing-admins) as well as [add and remove admins](#add-and-drop-admins) on external tables.

## Permissions

You must have Database Admin permissions or be an External Table Admin on the specific external table to run these commands. For more information, see [role-based access control](access-control/role-based-access-control.md).

## Show existing admins

Before you add or remove principals, you can use the `.show` command to see a table with all of the principals that already have admin access on the external table.

### Syntax

To show all roles:

`.show` `external table` *ExternalTableName* `principals`

To show your roles:

`.show` `external table` *ExternalTableName* `principal` `roles`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *ExternalTableName* | string | &check; | The name of the external table for which to list principals.|

### Example

The following command lists all security principals that have access to the `Samples` external table.

```kusto
.show external table Samples principals
```

**Example output**

|Role |PrincipalType |PrincipalDisplayName |PrincipalObjectId |PrincipalFQN|
|---|---|---|---|---|
|External Table Samples Admin |Azure AD User |Abbi Atkins |cd709aed-a26c-e3953dec735e |aaduser=abbiatkins@fabrikam.com|

## Add and drop admins

This section provides syntax, parameters, and examples for adding and removing principals.

### Syntax

*Action* `external table` *ExternalTableName* `admins` `(` *Principal* [`,` *Principal*...] `)` [`skip-results`] [ *Description* ]

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *Action* | string | &check; | The command `.add`, `.drop`, or `.set`.<br/>`.add` adds the specified principals, `.drop` removes the specified principals, and `.set` adds the specified principals and removes all previous ones.|
| *ExternalTableName* | string | &check; | The name of the external table for which to add principals.|
| *Principal* | string | &check; | One or more principals. For guidance how to specify these principals, see [Referencing security principals](./access-control/referencing-security-principals.md).|
| `skip-results` | string | | If provided, the command won't return the updated list of external table principals.|
| *Description* | string | | Text to describe the change that will be displayed when using the `.show` command.|

> [!NOTE]
> The `.set` command with `none` instead of a list of principals will remove all principals.

### Examples

In the following examples, you'll see how to [add admins](#add-admins-with-add), [remove admins](#remove-admins-with-drop), and [add and remove admins in the same command](#add-new-admins-and-remove-the-old-with-set).

#### Add admins with .add

The following example adds a principal to the `admins` role on the `Samples` external table.

```kusto
.add external table Samples admins ('aaduser=imikeoein@fabrikam.com')
```

#### Remove admins with .drop

The following example removes all principals in the group from the `admins` role on the `Samples` external table.

```kusto
.drop external table Samples admins ('aadGroup=SomeGroupEmail@fabrikam.com')
```

#### Add new admins and remove the old with .set

The following example removes existing `admins` and adds the provided principals as `admins` on the `Samples` external table.

```kusto
.set external table Samples admins ('aaduser=imikeoein@fabrikam.com', 'aaduser=abbiatkins@fabrikam.com')
```

#### Remove all admins with .set

The following command removes all existing `admins` on the `Samples` external table.

```kusto
.set external table Samples admins none
```
