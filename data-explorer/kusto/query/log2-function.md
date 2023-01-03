---
title: log2() - Azure Data Explorer
description: This article describes log2() in Azure Data Explorer.
ms.reviewer: alexans
ms.topic: reference
ms.date: 08/11/2019
---
# log2()

`log2()` returns the base-2 logarithm function.  

## Syntax

`log2(`*number*`)`

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
|*number*| real | &check; | The number for which to calculate the base-2 logarithm.|

## Returns

* The logarithm is the base-2 logarithm: the inverse of the exponential function (exp) with base 2.
* `null` if the argument is negative or null or can't be converted to a `real` value.

## Example

> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUShKLS7NKbHNyU830jDVBAAnF4/MFAAAAA==" target="_blank">Run the query</a>

```kusto
print result=log2(5)
```

**Output**

|result|
|--|
|2.3219280948873622|

## See also

* For natural (base-e) logarithms, see [log()](log-function.md).
* For common (base-10) logarithms, see [log10()](log10-function.md).