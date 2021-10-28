---
title: ".show managed_identity policy command - Azure Data Explorer"
description: This article describes the .show managed_identity policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: slneimer
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 10/24/2021
---
# .show managed_identity policy

This command returns the Managed Identity policy of the cluster or the specified database.

## Syntax

* `.show` `cluster` `policy` `managed_identity`
* `.show` `database` *DatabaseName* `policy` `managed_identity`

## Returns

This command returns a table that has a single record.

| Column     | Type     | Description       |
|------------|----------|----------------------------------------------------------------------------------------------------------|
| EntityName | `string` | The name of the entity the Managed Identity policy is defined on (or empty, if showing the cluster level policy) |
| Policies   | `string` | A JSON array indicating all Managed Identity policies defined for the entity, formatted as [Managed Identity policy object](managed-identity-policy.md#the-managed-identity-policy-object)|

## Example

```kusto
.show database MyDatabase policy managed_identity
```

| EntityName   | Policies |
|--------------|----------|
| [MyDatabase] | [{"ObjectId": "f687680c-5ba0-4025-ab04-0433fdbd0086", "ClientId": "7c8fee41-97d1-4ebd-9140-32a3b8316820", "TenantId": "4549d41b-a99d-4367-a887-7dd2c00e542c", "DisplayName": "myManagedIdentity", "IsSystem": false, "AllowedUsages": "NativeIngestion, ExternalTable"}] |
