---
title: todecimal() - Azure Data Explorer
description: This article describes todecimal() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/13/2020
---
# todecimal()

Converts input to decimal number representation.

> [!NOTE]
> Prefer using [real()](./scalar-data-types/real.md) when possible.

## Syntax

`todecimal(`*value*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | scalar | &check; | The value to convert to a decimal.|

## Returns

If conversion is successful, result will be a decimal number.
If conversion is not successful, result will be `null`.

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
