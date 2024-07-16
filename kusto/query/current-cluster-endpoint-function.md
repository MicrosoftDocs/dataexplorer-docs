---
title:  current_cluster_endpoint()
description: Learn how to use the current_cluster_endpoint() function to return the network endpoint of the cluster being queried as a string type value.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/23/2022
---
# current_cluster_endpoint()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

:::moniker range="azure-data-explorer"
Returns the network endpoint (DNS name) of the current cluster being queried.
::: moniker-end

:::moniker range="microsoft-fabric"
Returns the network endpoint (DNS name) of the current Eventhouse being queried.
::: moniker-end

## Syntax

`current_cluster_endpoint()`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Returns

:::moniker range="azure-data-explorer"
The network endpoint (DNS name) of the current cluster being queried, as a value of type `string`.
::: moniker-end

:::moniker range="microsoft-fabric"
The network endpoint (DNS name) of the current Eventhouse being queried, as a value of type `string`.
::: moniker-end

## Example

```kusto
print strcat("This query executed on: ", current_cluster_endpoint())
```
