---
title:  sign()
description: Learn how to use the sign() function to return the sign of the numeric expression.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# sign()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Returns the sign of the numeric expression.

## Syntax

`sign(`*number*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *number* | `real` |  :heavy_check_mark: | The number for which to return the sign.|

## Returns

The positive (+1), zero (0), or negative (-1) sign of the specified expression.

## Examples

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUSg2VLBVKM5Mz9PQNTHS1FEoNoLxDUA8YxjP0FDPSBMA4mpHrTMAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print s1 = sign(-42), s2 = sign(0), s3 = sign(11.2)
```

**Output**

|s1|s2|s3|
|---|---|---|
|-1|0|1|
