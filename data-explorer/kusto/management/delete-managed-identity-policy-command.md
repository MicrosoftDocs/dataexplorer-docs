---
title: ".delete managed_identity policy command - Azure Data Explorer"
description: This article describes the .delete managed_identity policy command in Azure Data Explorer.
services: data-explorer
author: orspod
ms.author: slneimer
ms.reviewer: rkarlin
ms.service: data-explorer
ms.topic: reference
ms.date: 10/24/2021
---
# .delete managed_identity policy

Deletes the Managed Identity policy of the cluster or the specified database.

## Syntax

* `.delete` `cluster` `policy` `managed_identity`
* `.delete` `database` *DatabaseName* `policy` `managed_identity`

## Returns

The command deletes the cluster's or database's Managed Identity policy, and then returns the output of the corresponding [.show managed identity policy](#show-managed-identity-policy) command.

## Example

```kusto
.delete database MyDatabase policy managed_identity
```
