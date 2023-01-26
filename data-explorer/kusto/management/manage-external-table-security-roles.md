---
title: Manage external external table roles - Azure Data Explorer
description: This article describes how to use management commands to view, add, and remove external table admins on the external table level in Azure Data Explorer.
ms.topic: reference
ms.date: 01/25/2023
---

# Manage external table roles

Azure Data Explorer uses a role-based access control model in which principals get access to resources according to the roles they're assigned. On external tables, the only security role is `admins`. External table `admins` have the ability to view, modify, and remove the external table and external table entities.

In this article, you'll learn how to use management commands to [view existing external table admins](#view-existing-external-table-admins) as well as [add and remove external table admins](#add-and-remove-external-table-admins) on the external table level.

> [!NOTE]
>
> * To alter external table admins, you must be an AllDatabasesAdmin, a Database Admin, or an External Table Admin.
> * For more information, see [role-based access control](access-control/role-based-access-control.md).

## View existing external table admins

Before you begin adding or removing principals, use the `.show` command to see which principals already have admin access on the external table.

### Syntax

`.show` `external table` *ExternalTableName* `principals`

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *ExternalTableName* | string | &check; | The name of the external table for which to list principals.|

### Returns

A table with a line for each principal with admin access on the external table.

### Example

The following command lists all security principals that have access to the `Samples` external table.

```kusto
.show external table Samples principals
```

**Example output**

|Role |PrincipalType |PrincipalDisplayName |PrincipalObjectId |PrincipalFQN|
|---|---|---|---|---|
|External Table Samples Admin |Azure AD User |Abbi Atkins |cd709aed-a26c-e3953dec735e |aaduser=abbiatkins@fabrikam.com|

## Add and remove external table admins

This section provides syntax, parameters, and examples for adding and removing principals.

### Syntax

*Action* `external table` *ObjectName* `admins` `(` *Principal* [`,` *Principal*...] `)` [`skip-results`] [ *Description* ]

### Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *Action* | string | &check; | The command `.add`, `.drop`, or `.set`.<br/>`.add` adds the specified principals, `.drop` removes the specified principals, and `.set` adds the specified principals and removes all previous ones.|
| *ObjectName* | string | &check; | The name of the object for which to add principals.|
| *Principal* | string | &check; | One or more principals. For how to specify these principals, see [principals and identity providers](./access-control/principals-and-identity-providers.md#examples-for-azure-ad-principals).|
| *Description* | string | | Text to describe the change that will be displayed when using the `.show` command.|
| `skip-results` | string | | If provided, the command won't return the updated list of external table principals.|

> [!NOTE]
> The `.set` command with `none` instead of a list of principals will remove all principals.

### Returns

A table with a line for each principal with admin access on the external table.

### Examples

In the following examples, you'll see how to [add external table admins](#add-external-table-admins-with-add), [remove external table admins](#remove-external-table-admins-with-drop), and [add and remove external table admins in the same command](#add-new-external-table-admins-and-remove-the-old-with-set).

#### Add external table admins with .add

The following example adds a principal to the `admins` role on the `Samples` external table.

```kusto
.add external table Samples admins ('aaduser=imikeoein@fabrikam.com')
```

#### Remove external table admins with .drop

The following example removes all principals in the group from the `admins` role on the `Samples` external table.

```kusto
.drop external table Samples admins ('aadGroup=SomeGroupEmail@fabrikam.com')
```

#### Add new external table admins and remove the old with .set

THe following example removes existing `admins` and adds the provided principals as `admins` on the `Samples` external table.

```kusto
.set external table Samples admins ('aaduser=imikeoein@fabrikam.com', 'aaduser=abbiatkins@fabrikam.com')
```

#### Remove all external table admins with .set

The following command removes all existing `admins` on the `Samples` external table.

```kusto
.set external table Samples admins none
```
