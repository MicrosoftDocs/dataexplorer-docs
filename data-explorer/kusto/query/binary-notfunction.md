---
title: binary_not() - Azure Data Explorer
description: This article describes binary_not() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 02/13/2020
---
# binary_not()

Returns a bitwise negation of the input value.

## Syntax

`binary_not(`*value*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | long | &check; | Value to negate. |

## Returns

Returns logical NOT operation on a number: value.

## Example

[**Run the query**](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUjKzEssqozPyy/RMDQw0AQAChXSgRUAAAA=)

```kusto
binary_not(100)
```

|result|
|------|
|-101|
