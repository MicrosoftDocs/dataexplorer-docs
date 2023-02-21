---
title: todouble()/toreal() - Azure Data Explorer
description: This article describes todouble()/toreal() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/05/2023
---
# todouble(), toreal()

Converts the input to a value of type `real`. The functions `todouble()` and `toreal()` are synonymous.

> [!NOTE]
> Prefer using [double() or real()](./scalar-data-types/real.md) when possible.

## Syntax

`toreal(`*value*`)`

`todouble(`*value*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | scalar | &check; | The value to convert to [real](scalar-data-types/real.md).|

## Returns

If conversion is successful, the result is a value of type `real`.
If conversion is not successful, the result is the value `real(null)`.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUSjJL0pNzNFQMjQy1jNR0lSwtVUAMwHpsmSHHgAAAA==" target="_blank">Run the query</a>

```kusto
print toreal("123.4") == 123.4
```

**Output**

|print_0|
|--|
|true|
