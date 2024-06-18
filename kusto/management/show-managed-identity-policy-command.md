---
title: .show policy managed_identity command
description: Learn how to use the `.show policy managed_identity` command to show the ManagedIdentity policy of the specified database or cluster.
ms.reviewer: slneimer
ms.topic: reference
ms.date: 05/24/2023
---
# .show policy managed_identity command

This command returns the ManagedIdentity policy of the cluster or the specified database.

## Permissions

To see the managed identity policy on the cluster, you must have AllDatabasesMonitor permissions.

To see the managed identity policy on a database, you must have Database User, Database Viewer, or Database Monitor permissions.

For more information, see [role-based access control](../access-control/role-based-access-control.md).

## Syntax

`.show` `cluster` `policy` `managed_identity`

`.show` `database` *DatabaseName* `policy` `managed_identity`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*| `string` | :heavy_check_mark:|The name of the database.|

## Returns

This command returns a table that has a single record.

| Column     | Type     | Description       |
|------------|----------|----------------------------------------------------------------------------------------------------------|
| EntityName | `string` | The name of the entity the ManagedIdentity policy is defined on (or empty, if showing the cluster level policy) |
| Policies   | `string` | A JSON array indicating all ManagedIdentity policies defined for the entity, formatted as [ManagedIdentity policy](managed-identity-policy.md#the-managedidentity-policy-object) objects|

## Example

```kusto
.show database MyDatabase policy managed_identity
```

| EntityName   | Policies |
|--------------|----------|
| [MyDatabase] | [{"ObjectId": "f687680c-5ba0-4025-ab04-0433fdbd0086", "ClientId": "7c8fee41-97d1-4ebd-9140-32a3b8316820", "TenantId": "4549d41b-a99d-4367-a887-7dd2c00e542c", "DisplayName": "myManagedIdentity", "IsSystem": false, "AllowedUsages": "NativeIngestion, ExternalTable"}] |
