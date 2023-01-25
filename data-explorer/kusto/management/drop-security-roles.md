---
title: Drop security roles - Azure Data Explorer
description: This article describes how to command to use the drop command to remove principals from a database, table, external table, materialized view, or function in Azure Data Explorer.
ms.topic: reference
ms.date: 01/25/2023
---

# Use the .drop command to remove security roles

This section describes how to use the `.drop` command to remove principals from a database, table, external table, materialized view, or function. To learn more about security roles, see the [security roles overview](security-roles.md).

## Syntax

`.drop` *ObjectType* *ObjectName* *Role* `(` *Principal* [`,` *Principal*...] `)` [`skip-results`] [ *Description* ]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *ObjectType* | string | &check; | The type of object: `database`, `table`, `external table`, `materialized-view` or `function`.|
| *ObjectName* | string | &check; | The name of the object for which to drop principals.|
| *Role* | string | &check; | A valid [security role](security-roles.md#security-roles) for the specified object type.|
| *Principal* | string | &check; | One or more principals. For how to specify these principals, see [principals and identity providers](./access-control/principals-and-identity-providers.md#examples-for-azure-ad-principals).|
| *Description* | string | | Text to describe the change that will be displayed when using the `.show` command.|
| `skip-results` | string | | If provided, the command won't return the updated list of database principals.|
