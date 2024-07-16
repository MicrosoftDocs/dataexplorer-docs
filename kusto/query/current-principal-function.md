---
title:  current_principal()
description: Learn how to use the current_principal() function to return the name of the principal running the query.
ms.reviewer: alexans
ms.topic: reference
ms.date: 04/16/2023
monikerRange: "microsoft-fabric || azure-data-explorer"
---
# current_principal()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns the current principal name that runs the query.

## Syntax

`current_principal()`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Returns

The current principal fully qualified name (FQN) as a `string`.  
The string format is:  
*PrinciplaType*`=`*PrincipalId*`;`*TenantId*

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUgrzLNNLi0qSs0riS8AiiRnFiTmaGgCAGK4N8YdAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
print fqn=current_principal()
```

**Example output**

|fqn|
|---|
|aaduser=346e950e-4a62-42bf-96f5-4cf4eac3f11e;72f988bf-86f1-41af-91ab-2d7cd011db47|
