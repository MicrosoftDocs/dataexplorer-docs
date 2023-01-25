---
title: Add security roles - Azure Data Explorer
description: This article describes how to use the add command to assign principals to a database, table, external table, materialized view, or function. in Azure Data Explorer.
ms.topic: reference
ms.date: 01/25/2023
---

# Use the .add command to assign security roles

This section describes how to use the `.add` command to assign principals to a database, table, external table, materialized view, or function. To learn more about security roles, see the [security roles overview](security-roles.md).

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

On a database, you can assign the `admins`, `users`, `viewers`, `unrestrictedviewers`, `ingestors`, and `monitors` roles. When defined for a database, the role applies to all entities in the database. To see a description of each role, see [role-based-access-control](access-control/role-based-access-control.md).

The following example assigns an AAD user to the `users` role on the `SampleDatabase` database.

```kusto
.add database SampleDatabase users ('aaduser=imikeoein@fabrikam.com')
```

## Add table roles

On a table, you can assign the `admins` and `ingestors` roles.

`admins` have full access to the table. `ingestors` may ingest data to all tables in the database but do not have access to query the data.

A principal must be a Database User in order to be a Table Admin, and a Database User or Database Ingestor to be a Table Ingestor.

The following example assigns an AAD application to the `ingestors` role on the `SampleTable` table.

```kusto
.add table SampleTable ingestors ('aadapp=4c7e82bd-6adb-46c3-b413-fdd44834c69b;fabrikam.com')
```

## Add external table roles

On an external table, you can assign the `admins` role. External table `admins` can view, modify, and remove the external table and external table subobjects.

The following example assigns an AAD user to the `admins` role on the `SampleExternalTable` table.

```kusto
.add external table SampleTable admins ('aaduser=imikeoein@fabrikam.com')
```

## Add materialized view roles

On a materialized view, you can assign the `admins` role. Materialized view `admins` have permission to alter the view, delete the view, and grant admin permissions to another principal.

A principal must first be a Database User or Table Admin in order to be a Materialized View Admin.

The following example assigns an AAD user to the `admins` role on the `SampleView` materialized view.

```kusto
.add materialized-view SampleView admins ('aaduser=imikeoein@fabrikam.com')
```

## Add function roles

On a function, you can assign the `admins` role. Function `admins` have permission to alter the function, delete the function, and grant admin permissions to another principal.

A principal must first be a Database User or Table Admin in order to be a Function Admin.

The following example assigns an AAD user to the `admins` role on the `SampleFunction` function.

```kusto
.add function SampleFunction admins ('aaduser=imikeoein@fabrikam.com') 'Test user (AAD)'
```
