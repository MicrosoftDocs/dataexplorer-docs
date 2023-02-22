---
title: The .show cluster policy request classification command - Azure Data Explorer
description: This article describes the .show cluster policy request classification command in Azure Data Explorer.
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/21/2023
---
# .show cluster request classification policy

Shows the cluster's request classification policy. For more information, see [Request classification policy](request-classification-policy.md).

## Permissions

You must have at least [AllDatabasesMonitor](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.show` `cluster` `policy` `request_classification`

## Returns

Returns a JSON representation of the policy.

### Example

Display the cluster's request classification policy.

```kusto
.show cluster policy request_classification
```
