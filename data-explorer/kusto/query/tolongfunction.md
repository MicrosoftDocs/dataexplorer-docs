---
title: tolong() - Azure Data Explorer
description: This article describes tolong() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/15/2023
---
# tolong()

Converts input to long (signed 64-bit) number representation.

> [!NOTE]
> Prefer using [long()](./scalar-data-types/long.md) when possible.

## Syntax

`tolong(`*value*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | scalar | &check; | The value to convert to a [long](scalar-data-types/long.md).|

## Returns

If conversion is successful, result will be a long number.
If conversion is not successful, result will be `null`.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUSjJz8nPS9dQMjQyVtJUsLVVADIAlTTbCRoAAAA=" target="_blank">Run the query</a>

```kusto
tolong("123") == 123
```
