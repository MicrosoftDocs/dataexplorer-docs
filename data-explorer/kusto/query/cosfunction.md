---
title: cos() - Azure Data Explorer
description: Learn how to use the cos() function to return the cosine of the input value.
ms.reviewer: alexans
ms.topic: reference
ms.date: 11/27/2022
---
# cos()

Returns the cosine function.

## Syntax

`cos(`*x*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *x* | real | &check; | Value for which to calculate the cosine. |

## Returns

The cosine of *x*.

## Example

[**Run the query**](https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUUjOL9Yw1AQAT2Uc+QwAAAA=)

```kusto
print cos(1)
```

|result|
|0.54030230586813977|
