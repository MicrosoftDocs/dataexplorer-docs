---
title: ".alter-merge cluster policy request classification command- Azure Data Explorer"
description: "This article describes the cluster's .alter-merge request classification policy command in Azure Data Explorer."
ms.reviewer: yonil
ms.topic: reference
ms.date: 01/06/2022
---
# .alter-merge cluster request classification policy

Enables or disables a cluster's request classification policy. For more information, see [request classification policy](request-classification-policy.md).

## Permissions

This command requires [AllDatabasesAdmin](access-control/role-based-access-control.md) permissions.

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
