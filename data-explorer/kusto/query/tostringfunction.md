---
title: tostring() - Azure Data Explorer
description: This article describes tostring() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/15/2023
---
# tostring()

Converts input to a string representation.

## Syntax

`tostring(`*value*`)`

## Parameters

|Name|Type|Required|Description|
|--|--|--|--|
| *value* | scalar | &check; | The value to convert to a string.|

## Returns

If the *value* value is non-null, the result will be a string representation of *value*.
If the *value* value is null, the result will be an empty string.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUSjJLy4BMtI1DI2MNRVsbRWUgAwlAFmZlSocAAAA" target="_blank">Run the query</a>

```kusto
tostring(123) == "123"
```
