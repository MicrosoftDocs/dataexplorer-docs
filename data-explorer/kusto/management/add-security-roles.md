---
title: Add security roles - Azure Data Explorer
description: This article describes how to use the add command to assign principals to a database, table, external table, materialized view, or function. in Azure Data Explorer.
ms.topic: reference
ms.date: 01/25/2023
---

# Use the .add command to assign security roles

This section describes how to use the `.add` command to assign principals to a database, table, external table, materialized view, or function. To learn more about security roles, see the [security roles overview](security-roles.md).

>[!NOTE]
> To add security principals, you must be either a **Database Admin** or an **AllDatabasesAdmin**. To learn more, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.add` *ObjectType* *ObjectName* *Role* `(` *Principal* [`,` *Principal*...] `)` [`skip-results`] [ *Description* ]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *ObjectType* | string | &check; | The type of object: `database`, `table`, `external table`, `materialized-view` or `function`.|
| *ObjectName* | string | &check; | The name of the object for which to add principals.|
| *Role* | string | &check; | A valid [security role](security-roles.md#security-roles) for the specified object type.|
| *Principal* | string | &check; | One or more principals. For how to specify these principals, see [principals and identity providers](./access-control/principals-and-identity-providers.md#examples-for-azure-ad-principals).|
| *Description* | string | | Text to describe the change that will be displayed when using the `.show` command.|
| `skip-results` | string | | If provided, the command won't return the updated list of database principals.|

## Add database roles

On a database, you can assign the `admins`, `users`, `viewers`, `unrestrictedviewers`, `ingestors`, and `monitors` roles.

### Examples

The following command assigns an AAD user to the `users` role on the `SampleDatabase` database.

```kusto
.add database SampleDatabase users ('aaduser=imikeoein@fabrikam.com') 'Test Database User - user'
```

The following command assigns an AAD application to the `viewers` role on the `SampleDatabase` database.

```kusto
.add database SampleDatabase viewers ('aadapp=4c7e82bd-6adb-46c3-b413-fdd44834c69b;fabrikam.com') 'Test Database Viewer - application'
```

## Add table roles

On a table, you can assign the `admins` and `ingestors` roles.

### Examples

The following command assigns an AAD user to the `admins` role on the `SampleTable` table.

```kusto
.add table SampleTable admins ('aaduser=imikeoein@fabrikam.com') 'Test Table Admin - user'
```

The following command assigns an AAD application to the `ingestors` role on the `SampleTable` table.

```kusto
.add table SampleTable ingestors ('aadapp=4c7e82bd-6adb-46c3-b413-fdd44834c69b;fabrikam.com') 'Test Table Ingestor - application'
```

## Add external table roles

On an external table, you can assign the `admins` role.

### Example

The following command assigns an AAD user to the `admins` role on the `SampleExternalTable` table.

```kusto
.add external table SampleTable admins ('aaduser=imikeoein@fabrikam.com') 'Test Table Admin - user'
```

## Add materialized view roles

On a materialized view, you can assign the `admins` role.

### Example

The following command assigns an AAD user to the `admins` role on the `SampleView` materialized view.

```kusto
.add materialized-view SampleView admins ('aaduser=imikeoein@fabrikam.com') 'Test user (AAD)'
```

## Add function roles

On a function, you can assign the `admins` role.

### Example

The following command assigns an AAD user to the `admins` role on the `SampleFunction` function.

```kusto
.add function SampleFunction admins ('aaduser=imikeoein@fabrikam.com') 'Test user (AAD)'
```
