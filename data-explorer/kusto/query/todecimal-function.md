---
title:  todecimal()
description: Learn how to use the todecimal() function to convert the input expression to a decimal number representation. 
ms.reviewer: alexans
ms.topic: reference
ms.date: 01/08/2024
---
# todecimal()

Converts the input to a decimal number representation.

> [!NOTE]
> When possible, use [decimal literals](./scalar-data-types/decimal.md#decimal-literals) instead.

## Syntax

`todecimal(`*value*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | scalar |  :heavy_check_mark: | The value to convert to a decimal.|

## Returns

If conversion is successful, result will be a decimal number.
If conversion isn't successful, result will be `null`.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUSjJT0lNzsxNzNFQMjQy1jMxNTO3UNJUsLVVgInDhTUBDVgx+TIAAAA=" target="_blank">Run the query</a>

```kusto
print todecimal("123.45678") == decimal(123.45678)
```

**Output**

|print_0|
|--|
|true|
