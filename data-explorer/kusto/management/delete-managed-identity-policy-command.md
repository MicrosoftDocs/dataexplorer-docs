---
title: ".delete managed_identity policy command - Azure Data Explorer"
description: This article describes the .delete managed_identity policy command in Azure Data Explorer.
ms.reviewer: slneimer
ms.topic: reference
ms.date: 03/09/2023
---
# .delete managed_identity policy

Deletes the ManagedIdentity policy of the cluster or the specified database.

> [!WARNING]
> Be careful when deleting the ManagedIdentity policy, as doing so will cause failures in all flows that rely on this policy. For example, if the policy allowed accessing Azure Storage via External Tables by authenticating via a managed identity, then deleting this policy will cause failures for queries that involve this external table, and also for operations that export to this external table.

## Permissions

You must have [AllDatabasesAdmin](access-control/role-based-access-control.md) permissions to run these commands.

## Syntax

`.delete` `cluster` `policy` `managed_identity`

`.delete` `database` *DatabaseName* `policy` `managed_identity`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
|*DatabaseName*|string|&check;|The name of the database.|

## Returns

The command deletes the cluster's or database's ManagedIdentity policy, and then returns the output of the corresponding [.show managed identity policy](show-managed-identity-policy-command.md) command.

## Example

```kusto
.delete database MyDatabase policy managed_identity
```
