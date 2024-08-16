---
title:  atan()
description: Learn how to use the atan() function to return the inverse operation of tan().
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# atan()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns the angle whose tangent is the specified number. This is the inverse operation of [`tan()`](tan-function.md).

## Syntax

`atan(`*x*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *x* | `real` |  :heavy_check_mark: | The number used to calculate the arc tangent.|

## Returns

The value of the arc tangent of `x`.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKbFNLEnM0zDQM9UEACNi3wIWAAAA" target="_blank">Run the query</a>
::: moniker-end

```kusto
atan(0.5)
```

**Output**

|result|
|---|
|0.46364760900080609|
