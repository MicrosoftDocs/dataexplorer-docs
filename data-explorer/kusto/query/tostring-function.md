---
title:  tostring()
description: Learn how to use the tostring() function to convert the input value to a string representation.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/23/2023
---
# tostring()

Converts the input to a string representation.

## Syntax

`tostring(`*value*`)`

[!INCLUDE [syntax-conventions-note](../../includes/syntax-conventions-note.md)]

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *value* | scalar |  :heavy_check_mark: | The value to convert to a string.|

## Returns

If *value* is non-null, the result is a string representation of *value*.
If *value* is null, the result is an empty string.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUSjJLy4BMtI1DI2MNQE7Y95rEwAAAA==" target="_blank">Run the query</a>

```kusto
print tostring(123)
```
