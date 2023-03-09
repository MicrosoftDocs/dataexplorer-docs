---
title: ".show managed_identity policy command - Azure Data Explorer"
description: This article describes the .show managed_identity policy command in Azure Data Explorer.
ms.reviewer: slneimer
ms.topic: reference
ms.date: 03/09/2023
---
# .show managed_identity policy

This command returns the ManagedIdentity policy of the cluster or the specified database.

## Permissions

To see the managed identity policy on the cluster, you must have AllDatabasesMonitor permissions.

To see the managed identity policy on a database, you must have Database User, Database Viewer, or Database Monitor permissions.

For more information, see [role-based access control](access-control/role-based-access-control.md).

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*|string|&check;|The name of the database.|

## Syntax

* `.show` `cluster` `policy` `managed_identity`
* `.show` `database` *DatabaseName* `policy` `managed_identity`

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
