---
title: Show security roles - Azure Data Explorer
description: This article describes how to show security roles in Azure Data Explorer.
ms.topic: reference
ms.date: 01/25/2023
---

# Show security roles

This section describes how to use the `.show` command to list the principals and their roles for a database, table, external table, materialized view, or function. To learn more about security roles, see the [security roles overview](security-roles.md).

## Syntax

`.show` *ObjectType* *ObjectName* `principals`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *ObjectType* | string | &check; | The type of object. The valid values are `database`, `table`, `external table`, `materialized-view` or `function`.
| *ObjectName* | string | &check; | The name of the object for which to list principals.|

## Returns

A line is returned for each security role assigned to the principal.

## Example

The following control command lists all security principals that have
access to the `StormEvents` table:

```kusto
.show table StormEvents principals
```

Example result:

|Role |PrincipalType |PrincipalDisplayName |PrincipalObjectId |PrincipalFQN|
|---|---|---|---|---|
|Database Apsty Admin |Azure AD User |Mark Smith |cd709aed-a26c-e3953dec735e |aaduser=msmith@fabrikam.com|