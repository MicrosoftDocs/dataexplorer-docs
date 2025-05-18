---
title:  degrees()
description: Learn how to use the degrees() function to convert angle values from radians to values in degrees.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# degrees()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Converts angle value in radians into value in degrees, using the formula `degrees = (180 / PI ) * angle_in_radians`.

## Syntax

`degrees(`*radians*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *radians* | `real` |  :heavy_check_mark: | The angle in radians to convert to degrees. |

## Returns

Returns the corresponding angle in degrees for an angle specified in radians.

## Examples

The following example shows how to convert radians to degrees.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUhJTS9KTS02ULCFMTUKMjU09U00dWAChmhyWoZ6pghZIyRZA00AiS3HB1UAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print degrees0 = degrees(pi()/4), degrees1 = degrees(pi()*1.5), degrees2 = degrees(0)
```

**Output**

|degrees0|degrees1|degrees2|
|---|---|---|
|45|270|0|
