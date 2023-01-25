---
title: Set security roles - Azure Data Explorer
description: This article describes how to set command to assign principals security roles on a database, table, external table, materialized view, or function.
ms.topic: reference
ms.date: 01/25/2023
---

# Use the .set command to assign security roles

This section describes how to use the `.set` command to assign principals to a database, table, external table, materialized view, or function. To learn more about security roles, see the [security roles overview](security-roles.md).

>[!NOTE]
> To set security principals, you must be either a **Database Admin** or an **AllDatabasesAdmin**. To learn more, see [role-based access control](access-control/role-based-access-control.md).

## Syntax

`.set` *ObjectType* *ObjectName* *Role* `(` *Principal* [`,` *Principal*...] `)` [`skip-results`] [ *Description* ]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *ObjectType* | string | &check; | The type of object: `database`, `table`, `external table`, `materialized-view` or `function`.|
| *ObjectName* | string | &check; | The name of the object for which to set principals.|
| *Role* | string | &check; | A valid [security role](security-roles.md#security-roles) for the specified object type.|
| *Principal* | string | &check; | One or more principals. For how to specify these principals, see [principals and identity providers](./access-control/principals-and-identity-providers.md#examples-for-azure-ad-principals).|
| *Description* | string | | Text to describe the change that will be displayed when using the `.show` command.|
| `skip-results` | string | | If provided, the command won't return the updated list of database principals.|

> [!NOTE]
> The `.set` command with `none` instead of a list of principals will remove all principals of the specified role.
