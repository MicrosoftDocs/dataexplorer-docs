---
title:  pack_array()
description: Learn how to use the pack_array() function to pack all input values into a dynamic array.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# pack_array()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Packs all input values into a [dynamic](scalar-data-types/dynamic.md) array.

## Syntax

`pack_array(`*value1*`,` [ *value2*, ... ]`)`

`pack_array(*)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value1...valueN* | `string` |  :heavy_check_mark: | Input expressions to be packed into a dynamic array.|
| *The wildcard `*`*| `string` | | Providing the wildcard `*` packs all input columns into a dynamic array.|

## Returns

A dynamic array that includes the values of *value1*, *value2*, ... *valueN*.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0XKMQqAMAwF0N1T/FGlS3X2LBJqFBTbEjM0xcPrILg+nlDcGAWrpBMemjDiUs7wzQ0uynGBYXpHj+Gn+pJ9lCXtHBSZwjGTCFlbHMyhdg9FnMwrXgAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
range x from 1 to 3 step 1
| extend y = x * 2
| extend z = y * 2
| project pack_array(x, y, z)
```

**Output**

|Column1|
|---|
|[1,2,4]|
|[2,4,8]|
|[3,6,12]|

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAA0XJMQ6AIBAF0d5T/FKMDVp7FkNwNWoEsmyxGA8vhYnNFPPYhY2gWDlesJCIEVkowTYPSIXCgoKpQhbew9YqOgzmx7viN2tsrpI4HuQFyflzdsyutNqj9LjNC2/1GNRvAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
range x from 1 to 3 step 1
| extend y = tostring(x * 2)
| extend z = (x * 2) * 1s
| project pack_array(x, y, z)
```

**Output**

|Column1|
|---|
|[1,"2","00:00:02"]|
|[2,"4","00:00:04"]|
|[3,"6","00:00:06"]|
