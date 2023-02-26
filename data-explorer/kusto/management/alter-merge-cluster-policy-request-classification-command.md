---
title: ".alter-merge cluster policy request classification command- Azure Data Explorer"
description: "This article describes the cluster's .alter-merge request classification policy command in Azure Data Explorer."
ms.reviewer: yonil
ms.topic: reference
ms.date: 02/21/2023
---
# .alter-merge cluster request classification policy

Enables or disables a cluster's request classification policy. For more information, see [request classification policy](request-classification-policy.md).

## Permissions

You must have [AllDatabasesAdmin](access-control/role-based-access-control.md) permissions to run this command.

## Syntax

`.alter-merge` `cluster` `policy` `request_classification` `'{"IsEnabled":` [true|false] `}`

## Examples

### Enable the policy

```kusto
.alter-merge cluster policy request_classification '{"IsEnabled":true}'
```

### Disable the policy

```kusto
.alter-merge cluster policy request_classification '{"IsEnabled":false}'
```
