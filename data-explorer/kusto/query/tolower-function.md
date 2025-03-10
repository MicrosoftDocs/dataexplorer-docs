---
title:  tolower()
description: Learn how to use the tolower() function to convert the input string to lower case.
ms.reviewer: alexans
ms.topic: reference
ms.date: 03/09/2025
---
# tolower()

> [!INCLUDE [applies](../includes/applies-to-version/applies.md)] [!INCLUDE [fabric](../includes/applies-to-version/fabric.md)] [!INCLUDE [azure-data-explorer](../includes/applies-to-version/azure-data-explorer.md)] [!INCLUDE [monitor](../includes/applies-to-version/monitor.md)] [!INCLUDE [sentinel](../includes/applies-to-version/sentinel.md)]

Converts the input string to lower case.

## Syntax

`tolower(`*value*`)`

[!INCLUDE [syntax-conventions-note](../includes/syntax-conventions-note.md)]

## Parameters

| Name | Type | Required | Description |
|--|--|--|--|
| *value* | `string` |  :heavy_check_mark: | The value to convert to a lowercase string.|

## Returns

If conversion is successful, result is a lowercase string.
If conversion isn't successful, result is `null`.

## Example

The following example checks whether the `tolower()` function converted the capitalized input string to lowercase.

:::moniker range="azure-data-explorer"
> [!div class="nextstepaction"]
> <a href="https://dataexplorer.azure.com/clusters/help/databases/Samples?query=H4sIAAAAAAAAAysoyswrUSjJz8kvTy3SUPJIzcnJV9JUsLVVUMoAswH4X1SGIQAAAA==" target="_blank">Run the query</a>
::: moniker-end

```kusto
tolower("Hello") == "hello"
```

## Related content

* [Scalar function types at a glance](scalar-functions.md)
* [tostring()](tostring-function.md)
* [toupper()](toupper-function.md)
