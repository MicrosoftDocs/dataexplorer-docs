---
title: .show policy managed_identity command
description: Learn how to use the `.show policy managed_identity` command to show the ManagedIdentity policy of the specified database or cluster.
ms.reviewer: slneimer
ms.topic: reference
ms.date: 08/11/2024
monikerRange: "azure-data-explorer"
---
# .show policy managed_identity command

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)]

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
| [MyDatabase] | [{"ObjectId": "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb", "ClientId": "00001111-aaaa-2222-bbbb-3333cccc4444", "TenantId": "aaaabbbb-0000-cccc-1111-dddd2222eeee", "DisplayName": "myManagedIdentity", "IsSystem": false, "AllowedUsages": "NativeIngestion, ExternalTable"}] |
