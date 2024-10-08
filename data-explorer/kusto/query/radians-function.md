---
title:  radians()
description: Learn how to use the radians() function to convert angle values from degrees to radians.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# radians()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Converts angle value in degrees into value in radians, using formula `radians = (PI / 180 ) * angle_in_degrees`

## Syntax

`radians(`*degrees*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *degrees* | `real` |  :heavy_check_mark: | The angle in degrees.|

## Returns

The corresponding angle in radians for an angle specified in degrees.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKTMlMzCs2ULCFMTUsDTR1YBxDJHFDCyQJIyQJYzMDTQAGCoiHTgAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
print radians0 = radians(90), radians1 = radians(180), radians2 = radians(360) 
```

**Output**

|radians0|radians1|radians2|
|---|---|---|
|1.5707963267949|3.14159265358979|6.28318530717959|
