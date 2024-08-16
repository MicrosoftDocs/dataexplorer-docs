---
title:  todecimal()
description: Learn how to use the todecimal() function to convert the input expression to a decimal number representation. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2024
---
# todecimal()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Converts the input to a decimal number representation.

> [!NOTE]
> When possible, use [decimal literals](scalar-data-types/decimal.md#decimal-literals) instead.

## Syntax

`todecimal(`*value*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | scalar |  :heavy_check_mark: | The value to convert to a decimal.|

## Returns

If conversion is successful, result will be a decimal number.
If conversion isn't successful, result will be `null`.

## Example

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUSjJT0lNzsxNzNFQMjQy1jMxNTO3UNJUsLVVgInDhTUBDVgx+TIAAAA=" target="_blank">Run the query</a>
::: moniker-end

```kusto
print todecimal("123.45678") == decimal(123.45678)
```

**Output**

|print_0|
|--|
|true|
